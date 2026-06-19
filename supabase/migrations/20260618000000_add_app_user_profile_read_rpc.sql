-- Hatid safe self-profile read RPC.
--
-- Scope:
-- - authenticated users can read only their own core.app_users display fields
-- - no table grants, metadata, organization, role, membership, status, or authority exposure

create or replace function core.get_my_app_user_profile()
returns table (
  display_name text,
  phone text
)
language plpgsql
security definer
set search_path = core, auth, pg_catalog
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
    app_user.display_name,
    app_user.phone
  from core.app_users app_user
  where app_user.user_id = v_actor_user_id;
end;
$$;

comment on function core.get_my_app_user_profile() is
  'Authenticated-only self-profile read RPC for core.app_users. Returns only display_name and phone for auth.uid(); it does not expose metadata, organization membership, roles, status, or product authority.';

revoke all on function core.get_my_app_user_profile() from public, anon, authenticated;
grant usage on schema core to authenticated;
grant execute on function core.get_my_app_user_profile() to authenticated;
