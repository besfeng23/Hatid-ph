-- Hatid audited rider saved places foundation.
--
-- Scope:
-- - rider.saved_places table for personal rider locations
-- - authenticated-only RPCs for callers to list/upsert/delete only their own places
-- - audit.audit_logs entries for controlled create/update/delete
--
-- This does not add booking, trip request, fare quote, dispatch, wallet,
-- payments, driver onboarding, admin, KYC approval, or live safety workflow.

create schema if not exists rider;

create table if not exists rider.saved_places (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  place_type text not null default 'favorite',
  address_text text not null,
  latitude numeric(10,7),
  longitude numeric(10,7),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint saved_places_label_not_blank check (length(btrim(label)) > 0),
  constraint saved_places_address_text_not_blank check (length(btrim(address_text)) > 0),
  constraint saved_places_place_type_check check (place_type in ('home', 'work', 'favorite', 'other')),
  constraint saved_places_metadata_is_object check (jsonb_typeof(metadata) = 'object'),
  constraint saved_places_latitude_range check (latitude is null or (latitude >= -90 and latitude <= 90)),
  constraint saved_places_longitude_range check (longitude is null or (longitude >= -180 and longitude <= 180))
);

comment on table rider.saved_places is
  'Personal rider saved places accessed only through narrow RPCs. This table does not create booking, trip, fare, dispatch, wallet, payment, driver, admin, KYC, or safety authority.';
comment on column rider.saved_places.metadata is
  'Server-owned object metadata. Self-service saved-place RPCs do not allow clients to write or read this field.';

create unique index if not exists saved_places_one_home_per_user_uidx
  on rider.saved_places (user_id, place_type)
  where place_type = 'home';

create unique index if not exists saved_places_one_work_per_user_uidx
  on rider.saved_places (user_id, place_type)
  where place_type = 'work';

create index if not exists saved_places_user_created_at_idx
  on rider.saved_places (user_id, created_at desc);

create trigger saved_places_set_updated_at
  before update on rider.saved_places
  for each row
  execute function rider.set_updated_at();

alter table rider.saved_places enable row level security;

revoke all on table rider.saved_places from anon, authenticated;

-- Default RLS posture is deny: no anon/authenticated table policies are created.
-- Access is intentionally limited to the narrow SECURITY DEFINER RPCs below.

create or replace function rider.get_my_saved_places()
returns table (
  id uuid,
  label text,
  place_type text,
  address_text text,
  latitude numeric,
  longitude numeric,
  notes text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = rider, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required'
      using errcode = '28000';
  end if;

  return query
  select
    saved_place.id,
    saved_place.label,
    saved_place.place_type,
    saved_place.address_text,
    saved_place.latitude,
    saved_place.longitude,
    saved_place.notes,
    saved_place.created_at,
    saved_place.updated_at
  from rider.saved_places saved_place
  where saved_place.user_id = v_actor_user_id
  order by saved_place.created_at desc;
end;
$$;

create or replace function rider.upsert_my_saved_place(
  p_place_id uuid,
  p_label text,
  p_place_type text,
  p_address_text text,
  p_latitude numeric,
  p_longitude numeric,
  p_notes text
)
returns table (
  id uuid,
  label text,
  place_type text,
  address_text text,
  latitude numeric,
  longitude numeric,
  notes text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = rider, audit, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_existing rider.saved_places%rowtype;
  v_saved_place rider.saved_places%rowtype;
  v_place_type text := coalesce(nullif(btrim(p_place_type), ''), 'favorite');
  v_place_id uuid := p_place_id;
  v_action_kind text;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required'
      using errcode = '28000';
  end if;

  if v_place_type not in ('home', 'work', 'favorite', 'other') then
    raise exception 'invalid saved place type'
      using errcode = '22023';
  end if;

  if nullif(btrim(p_label), '') is null or nullif(btrim(p_address_text), '') is null then
    raise exception 'saved place label and address are required'
      using errcode = '22023';
  end if;

  if p_place_id is not null then
    select *
    into v_existing
    from rider.saved_places existing_place
    where existing_place.id = v_place_id
      and existing_place.user_id = v_actor_user_id
    for update;

    if v_existing.id is null then
      raise exception 'saved place not found'
        using errcode = '02000';
    end if;
  elsif v_place_type in ('home', 'work') then
    select *
    into v_existing
    from rider.saved_places existing_place
    where existing_place.user_id = v_actor_user_id
      and existing_place.place_type = v_place_type
    for update;

    v_place_id := coalesce(v_existing.id, extensions.gen_random_uuid());
  else
    v_place_id := extensions.gen_random_uuid();
  end if;

  insert into rider.saved_places as target_place (
    id,
    user_id,
    label,
    place_type,
    address_text,
    latitude,
    longitude,
    notes
  )
  values (
    v_place_id,
    v_actor_user_id,
    btrim(p_label),
    v_place_type,
    btrim(p_address_text),
    p_latitude,
    p_longitude,
    nullif(btrim(p_notes), '')
  )
  on conflict (id) do update
    set label = excluded.label,
        place_type = excluded.place_type,
        address_text = excluded.address_text,
        latitude = excluded.latitude,
        longitude = excluded.longitude,
        notes = excluded.notes,
        updated_at = now()
    where target_place.user_id = v_actor_user_id
  returning * into v_saved_place;

  v_action_kind := case when v_existing.id is null then 'created' else 'updated' end;

  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    v_actor_user_id,
    'rider.saved_places.upsert_self_place',
    'rider.saved_places',
    v_saved_place.id::text,
    case when v_existing.id is null then null else jsonb_build_object('label', v_existing.label, 'place_type', v_existing.place_type, 'address_text', v_existing.address_text, 'latitude', v_existing.latitude, 'longitude', v_existing.longitude, 'notes', v_existing.notes) end,
    jsonb_build_object('label', v_saved_place.label, 'place_type', v_saved_place.place_type, 'address_text', v_saved_place.address_text, 'latitude', v_saved_place.latitude, 'longitude', v_saved_place.longitude, 'notes', v_saved_place.notes),
    jsonb_build_object('operation', v_action_kind, 'editable_fields', jsonb_build_array('label', 'place_type', 'address_text', 'latitude', 'longitude', 'notes'), 'authority_granted', false, 'side_effects', jsonb_build_array())
  );

  return query select v_saved_place.id, v_saved_place.label, v_saved_place.place_type, v_saved_place.address_text, v_saved_place.latitude, v_saved_place.longitude, v_saved_place.notes, v_saved_place.created_at, v_saved_place.updated_at;
end;
$$;

create or replace function rider.delete_my_saved_place(p_place_id uuid)
returns boolean
language plpgsql
security definer
set search_path = rider, audit, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_deleted rider.saved_places%rowtype;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required'
      using errcode = '28000';
  end if;

  delete from rider.saved_places saved_place
  where saved_place.id = p_place_id
    and saved_place.user_id = v_actor_user_id
  returning * into v_deleted;

  if v_deleted.id is null then
    return false;
  end if;

  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    v_actor_user_id,
    'rider.saved_places.delete_self_place',
    'rider.saved_places',
    v_deleted.id::text,
    jsonb_build_object('label', v_deleted.label, 'place_type', v_deleted.place_type, 'address_text', v_deleted.address_text, 'latitude', v_deleted.latitude, 'longitude', v_deleted.longitude, 'notes', v_deleted.notes),
    null,
    jsonb_build_object('operation', 'deleted', 'authority_granted', false, 'side_effects', jsonb_build_array())
  );

  return true;
end;
$$;

revoke all on function rider.get_my_saved_places() from public, anon, authenticated;
revoke all on function rider.upsert_my_saved_place(uuid, text, text, text, numeric, numeric, text) from public, anon, authenticated;
revoke all on function rider.delete_my_saved_place(uuid) from public, anon, authenticated;
grant usage on schema rider to authenticated;
grant execute on function rider.get_my_saved_places() to authenticated;
grant execute on function rider.upsert_my_saved_place(uuid, text, text, text, numeric, numeric, text) to authenticated;
grant execute on function rider.delete_my_saved_place(uuid) to authenticated;
