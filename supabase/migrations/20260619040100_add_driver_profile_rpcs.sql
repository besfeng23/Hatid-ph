create or replace function driver.upsert_my_driver_profile(
  p_display_name text,
  p_phone text,
  p_service_area_text text
)
returns table (
  user_id uuid,
  display_name text,
  phone text,
  service_area_text text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = driver, audit, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_existing driver.driver_profiles%rowtype;
  v_profile driver.driver_profiles%rowtype;
  v_action_kind text;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  select * into v_existing
  from driver.driver_profiles existing_profile
  where existing_profile.user_id = v_actor_user_id
  for update;

  insert into driver.driver_profiles as target_profile (
    user_id, display_name, phone, service_area_text
  ) values (
    v_actor_user_id,
    nullif(btrim(p_display_name), ''),
    nullif(btrim(p_phone), ''),
    nullif(btrim(p_service_area_text), '')
  )
  on conflict (user_id) do update
    set display_name = excluded.display_name,
        phone = excluded.phone,
        service_area_text = excluded.service_area_text,
        updated_at = now()
  returning * into v_profile;

  v_action_kind := case when v_existing.user_id is null then 'created' else 'updated' end;

  insert into audit.audit_logs (
    actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata
  ) values (
    v_actor_user_id,
    'driver.driver_profiles.upsert_self_profile',
    'driver.driver_profiles',
    v_profile.user_id::text,
    case when v_existing.user_id is null then null else jsonb_build_object('display_name', v_existing.display_name, 'phone', v_existing.phone, 'service_area_text', v_existing.service_area_text, 'status', v_existing.status) end,
    jsonb_build_object('display_name', v_profile.display_name, 'phone', v_profile.phone, 'service_area_text', v_profile.service_area_text, 'status', v_profile.status),
    jsonb_build_object('operation', v_action_kind, 'authority_granted', false)
  );

  return query select v_profile.user_id, v_profile.display_name, v_profile.phone, v_profile.service_area_text, v_profile.status, v_profile.created_at, v_profile.updated_at;
end;
$$;

create or replace function driver.get_my_driver_profile()
returns table (
  display_name text,
  phone text,
  service_area_text text,
  status text
)
language plpgsql
security definer
set search_path = driver, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  return query
  select driver_profile.display_name, driver_profile.phone, driver_profile.service_area_text, driver_profile.status
  from driver.driver_profiles driver_profile
  where driver_profile.user_id = v_actor_user_id;
end;
$$;

revoke all on function driver.upsert_my_driver_profile(text, text, text) from public, anon, authenticated;
revoke all on function driver.get_my_driver_profile() from public, anon, authenticated;
grant usage on schema driver to authenticated;
grant execute on function driver.upsert_my_driver_profile(text, text, text) to authenticated;
grant execute on function driver.get_my_driver_profile() to authenticated;
