-- Hatid audited rider profile foundation.
--
-- Scope:
-- - rider.rider_profiles table for non-KYC rider display/profile fields
-- - authenticated-only RPCs for callers to read/upsert only their own safe fields
-- - audit.audit_logs entry for each controlled rider profile upsert
--
-- This does not add booking, trip request, fare quote, dispatch, wallet,
-- payments, driver onboarding, admin, KYC approval, or live safety workflow.

create schema if not exists rider;

comment on schema rider is
  'Rider-domain foundation for safe non-KYC rider profile data. No booking, dispatch, wallet, payment, driver, admin, KYC, or live safety authority is implied.';

create or replace function rider.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists rider.rider_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rider_profiles_status_check
    check (status in ('draft', 'active', 'suspended', 'deleted')),
  constraint rider_profiles_metadata_is_object
    check (jsonb_typeof(metadata) = 'object')
);

comment on table rider.rider_profiles is
  'Non-KYC rider profile foundation linked to auth.users. Status and metadata are server-owned; this table does not grant role, admin, driver, dispatch, wallet, payment, or compliance authority.';
comment on column rider.rider_profiles.status is
  'Safe lifecycle label only. It does not approve KYC, driver onboarding, payments, dispatch, wallet, admin, support, finance, or operator authority.';
comment on column rider.rider_profiles.metadata is
  'Server-owned object metadata. Self-service rider RPCs do not allow clients to write or read this field.';

create trigger rider_profiles_set_updated_at
  before update on rider.rider_profiles
  for each row
  execute function rider.set_updated_at();

alter table rider.rider_profiles enable row level security;

revoke all on schema rider from public, anon, authenticated;
revoke all on table rider.rider_profiles from anon, authenticated;
revoke execute on function rider.set_updated_at() from public, anon, authenticated;

-- Default RLS posture is deny: no anon/authenticated table policies are created.
-- Access is intentionally limited to the narrow SECURITY DEFINER RPCs below.

create or replace function rider.upsert_my_rider_profile(
  p_display_name text,
  p_phone text
)
returns table (
  user_id uuid,
  display_name text,
  phone text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = rider, audit, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_existing rider.rider_profiles%rowtype;
  v_profile rider.rider_profiles%rowtype;
  v_action_kind text;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required'
      using errcode = '28000';
  end if;

  select *
  into v_existing
  from rider.rider_profiles existing_profile
  where existing_profile.user_id = v_actor_user_id
  for update;

  insert into rider.rider_profiles as target_profile (
    user_id,
    display_name,
    phone
  )
  values (
    v_actor_user_id,
    nullif(btrim(p_display_name), ''),
    nullif(btrim(p_phone), '')
  )
  on conflict (user_id) do update
    set display_name = excluded.display_name,
        phone = excluded.phone,
        updated_at = now()
  returning * into v_profile;

  v_action_kind := case when v_existing.user_id is null then 'created' else 'updated' end;

  insert into audit.audit_logs (
    actor_user_id,
    action_name,
    resource_type,
    resource_id,
    before_snapshot,
    after_snapshot,
    metadata
  )
  values (
    v_actor_user_id,
    'rider.rider_profiles.upsert_self_profile',
    'rider.rider_profiles',
    v_profile.user_id::text,
    case
      when v_existing.user_id is null then null
      else jsonb_build_object(
        'display_name', v_existing.display_name,
        'phone', v_existing.phone,
        'status', v_existing.status
      )
    end,
    jsonb_build_object(
      'display_name', v_profile.display_name,
      'phone', v_profile.phone,
      'status', v_profile.status
    ),
    jsonb_build_object(
      'operation', v_action_kind,
      'editable_fields', jsonb_build_array('display_name', 'phone'),
      'authority_granted', false
    )
  );

  return query
  select
    v_profile.user_id,
    v_profile.display_name,
    v_profile.phone,
    v_profile.status,
    v_profile.created_at,
    v_profile.updated_at;
end;
$$;

comment on function rider.upsert_my_rider_profile(text, text) is
  'Authenticated-only, audited self-service RPC for non-KYC rider profiles. It writes only display_name, phone, and updated_at for auth.uid(); it does not grant status, metadata, role, organization, driver, admin, finance, support, operator, dispatch, wallet, payment, safety, or KYC authority.';

create or replace function rider.get_my_rider_profile()
returns table (
  display_name text,
  phone text,
  status text
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
    rider_profile.display_name,
    rider_profile.phone,
    rider_profile.status
  from rider.rider_profiles rider_profile
  where rider_profile.user_id = v_actor_user_id;
end;
$$;

comment on function rider.get_my_rider_profile() is
  'Authenticated-only self-service read RPC for non-KYC rider profiles. Returns only display_name, phone, and safe status for auth.uid(); it does not expose metadata or authority fields.';

revoke all on function rider.upsert_my_rider_profile(text, text) from public, anon, authenticated;
revoke all on function rider.get_my_rider_profile() from public, anon, authenticated;
grant usage on schema rider to authenticated;
grant execute on function rider.upsert_my_rider_profile(text, text) to authenticated;
grant execute on function rider.get_my_rider_profile() to authenticated;
