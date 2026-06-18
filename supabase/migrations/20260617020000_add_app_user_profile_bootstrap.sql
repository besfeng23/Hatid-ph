-- Hatid audited app user profile bootstrap path.
--
-- Scope:
-- - narrow RPC for authenticated users to create/update only their own
--   core.app_users display profile fields
-- - audit.audit_logs entry for each controlled create/update
--
-- This does not add UI wiring, product flows, organization membership writes,
-- role assignment, service-role app code, trips, dispatch, wallet, payments,
-- driver onboarding, or admin screens.

create or replace function core.upsert_my_app_user_profile(
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
set search_path = core, audit, auth, extensions, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_existing core.app_users%rowtype;
  v_profile core.app_users%rowtype;
  v_action_kind text;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required'
      using errcode = '28000';
  end if;

  select *
  into v_existing
  from core.app_users existing_profile
  where existing_profile.user_id = v_actor_user_id
  for update;

  insert into core.app_users as target_profile (
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
    'core.app_users.upsert_self_profile',
    'core.app_users',
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
      'editable_fields', jsonb_build_array('display_name', 'phone')
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

comment on function core.upsert_my_app_user_profile(text, text) is
  'Authenticated-only, audited self-service bootstrap RPC for core.app_users. It writes only display_name, phone, and updated_at for auth.uid(); it does not grant organization membership, roles, status, metadata, or any product authority.';

revoke all on function core.upsert_my_app_user_profile(text, text) from public, anon, authenticated;
grant usage on schema core to authenticated;
grant execute on function core.upsert_my_app_user_profile(text, text) to authenticated;
