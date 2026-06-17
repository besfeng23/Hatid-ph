-- pgTAP validation for the audited app user profile bootstrap RPC.
--
-- Run with Supabase CLI from the repository root:
--   supabase db test
--
-- This validation covers only the narrow profile bootstrap database path. It
-- does not add UI, product flows, membership invitations, role assignment,
-- service-role app code, trips, dispatch, wallets, payments, driver onboarding,
-- or admin screens.

create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(19);

select has_function(
  'core',
  'upsert_my_app_user_profile',
  array['text', 'text'],
  'core.upsert_my_app_user_profile(text, text) exists'
);

select is(
  (select prosecdef from pg_proc where oid = 'core.upsert_my_app_user_profile(text,text)'::regprocedure),
  true,
  'profile bootstrap function is SECURITY DEFINER so it can perform controlled table and audit writes without broad grants'
);

select is(
  (select proconfig @> array['search_path=core, audit, auth, extensions, pg_catalog']
   from pg_proc
   where oid = 'core.upsert_my_app_user_profile(text,text)'::regprocedure),
  true,
  'profile bootstrap function has fixed search_path'
);

select is(
  has_function_privilege('anon', 'core.upsert_my_app_user_profile(text,text)', 'EXECUTE'),
  false,
  'anon cannot execute profile bootstrap function'
);

select is(
  has_function_privilege('authenticated', 'core.upsert_my_app_user_profile(text,text)', 'EXECUTE'),
  true,
  'authenticated can execute only the narrow profile bootstrap function'
);

select is(
  (select count(*)::integer
   from pg_proc
   where pronamespace = 'core'::regnamespace
     and has_function_privilege('authenticated', oid, 'EXECUTE')),
  1,
  'authenticated has execute on only one core function'
);

select is(
  (select relrowsecurity from pg_class where oid = 'core.app_users'::regclass),
  true,
  'RLS remains enabled on core.app_users'
);

select is(
  (select bool_or(has_table_privilege(role_name, 'core.app_users', privilege_name))
   from unnest(array['anon', 'authenticated']) role_name
   cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE']) privilege_name),
  false,
  'anon/authenticated have no broad table privileges on core.app_users'
);

select is(
  (select bool_or(has_table_privilege(role_name, 'core.organization_members', privilege_name))
   from unnest(array['anon', 'authenticated']) role_name
   cross join unnest(array['INSERT', 'UPDATE', 'DELETE']) privilege_name),
  false,
  'no anon/authenticated organization_members write path was added'
);

select is(
  (select count(*)::integer
   from pg_proc
   where pronamespace = 'core'::regnamespace
     and proname ~* '(role|member|membership|organization|admin|finance|support|operator|driver|rider)'),
  0,
  'no role, organization, or membership self-assignment function exists'
);

select is(
  (select count(*)::integer
   from pg_proc
   where pronamespace = 'core'::regnamespace
     and proname not in ('set_updated_at', 'upsert_my_app_user_profile')),
  0,
  'no product/business RPCs were added beyond the narrow profile bootstrap function'
);

select ok(
  position('v_actor_user_id uuid := auth.uid()' in pg_get_functiondef('core.upsert_my_app_user_profile(text,text)'::regprocedure)) > 0,
  'profile bootstrap function reads auth.uid() as actor'
);

select ok(
  position('where existing_profile.user_id = v_actor_user_id' in pg_get_functiondef('core.upsert_my_app_user_profile(text,text)'::regprocedure)) > 0,
  'profile bootstrap function targets only auth.uid() profile row'
);

select ok(
  position('execute ' in lower(pg_get_functiondef('core.upsert_my_app_user_profile(text,text)'::regprocedure))) = 0,
  'profile bootstrap function does not use dynamic SQL'
);

select ok(
  position('insert into audit.audit_logs' in pg_get_functiondef('core.upsert_my_app_user_profile(text,text)'::regprocedure)) > 0,
  'profile bootstrap function writes audit log records through the controlled path'
);

select ok(
  position('core.app_users.upsert_self_profile' in pg_get_functiondef('core.upsert_my_app_user_profile(text,text)'::regprocedure)) > 0,
  'audit action name identifies self profile upsert'
);

select ok(
  position('''core.app_users''' in pg_get_functiondef('core.upsert_my_app_user_profile(text,text)'::regprocedure)) > 0,
  'audit resource type identifies core.app_users'
);

select ok(
  position('organization_members' in lower(pg_get_functiondef('core.upsert_my_app_user_profile(text,text)'::regprocedure))) = 0,
  'profile bootstrap function does not write organization memberships'
);

select ok(
  position('service_role' in lower(pg_get_functiondef('core.upsert_my_app_user_profile(text,text)'::regprocedure))) = 0,
  'profile bootstrap function does not reference service-role secrets'
);

select * from finish();

rollback;
