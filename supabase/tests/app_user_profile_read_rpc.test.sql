-- pgTAP validation for the safe self-profile read RPC.
--
-- Run with Supabase CLI from the repository root:
--   supabase db test

create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(13);

select has_function(
  'core',
  'get_my_app_user_profile',
  array[]::name[],
  'core.get_my_app_user_profile() exists'
);

select is(
  has_function_privilege('anon', 'core.get_my_app_user_profile()'::regprocedure, 'EXECUTE'),
  false,
  'anon cannot execute safe profile read function'
);

select is(
  has_function_privilege('authenticated', 'core.get_my_app_user_profile()'::regprocedure, 'EXECUTE'),
  true,
  'authenticated can execute safe profile read function'
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
  (select count(*)::integer
   from pg_proc
   where pronamespace = 'core'::regnamespace
     and proname ~* '(role|member|membership|organization|admin|finance|support|operator|driver|rider)'),
  0,
  'no role, membership, admin, driver, or rider functions were added'
);

select ok(
  position('execute ' in lower(pg_get_functiondef('core.get_my_app_user_profile()'::regprocedure))) = 0,
  'safe profile read function does not use dynamic SQL'
);

select is(
  (select prosecdef from pg_proc where oid = 'core.get_my_app_user_profile()'::regprocedure),
  true,
  'safe profile read function uses SECURITY DEFINER for controlled reads without table grants'
);

select is(
  (select 'search_path=core, auth, pg_catalog' = any(proconfig)
   from pg_proc
   where oid = 'core.get_my_app_user_profile()'::regprocedure),
  true,
  'safe profile read function has fixed search_path'
);

select ok(
  position('v_actor_user_id uuid := auth.uid()' in pg_get_functiondef('core.get_my_app_user_profile()'::regprocedure)) > 0,
  'safe profile read function requires auth.uid()'
);

select ok(
  position('where app_user.user_id = v_actor_user_id' in pg_get_functiondef('core.get_my_app_user_profile()'::regprocedure)) > 0,
  'safe profile read function returns only auth.uid() profile row'
);

select is(
  (select array_agg(column_name order by ordinal_position)
   from pg_proc profile_function
   cross join lateral unnest(
     profile_function.proargnames,
     profile_function.proargmodes
   ) with ordinality as returned_columns(column_name, arg_mode, ordinal_position)
   where profile_function.oid = 'core.get_my_app_user_profile()'::regprocedure
     and returned_columns.arg_mode = 't'),
  array['display_name', 'phone']::text[],
  'safe profile read function returns only display_name and phone'
);

select ok(
  position('metadata' in lower(pg_get_functiondef('core.get_my_app_user_profile()'::regprocedure))) = 0
  and position('organization_id' in lower(pg_get_functiondef('core.get_my_app_user_profile()'::regprocedure))) = 0
  and position(' role' in lower(pg_get_functiondef('core.get_my_app_user_profile()'::regprocedure))) = 0
  and position('status' in lower(pg_get_functiondef('core.get_my_app_user_profile()'::regprocedure))) = 0,
  'safe profile read function does not expose metadata, organization_id, role, or status fields'
);

select * from finish();

rollback;
