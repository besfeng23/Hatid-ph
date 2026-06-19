-- pgTAP validation for the audited rider profile foundation.
--
-- Run with Supabase CLI from the repository root:
--   supabase db test

create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(34);

select has_schema('rider', 'schema rider exists');
select has_table('rider', 'rider_profiles', 'table rider.rider_profiles exists');
select col_is_pk('rider', 'rider_profiles', 'user_id', 'rider profile user_id is primary key');
select fk_ok('rider', 'rider_profiles', 'user_id', 'auth', 'users', 'id', 'rider profile user_id references auth.users');

select ok(exists (select 1 from pg_constraint where conrelid = 'rider.rider_profiles'::regclass and conname = 'rider_profiles_metadata_is_object' and contype = 'c'), 'metadata object constraint exists');
select ok(exists (select 1 from pg_constraint where conrelid = 'rider.rider_profiles'::regclass and conname = 'rider_profiles_status_check' and contype = 'c'), 'safe status constraint exists');
select is((select relrowsecurity from pg_class where oid = 'rider.rider_profiles'::regclass), true, 'RLS is enabled on rider.rider_profiles');

select is(
  (select bool_or(has_table_privilege(role_name, 'rider.rider_profiles', privilege_name))
   from unnest(array['anon', 'authenticated']) role_name
   cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE']) privilege_name),
  false,
  'anon/authenticated have no broad table privileges on rider.rider_profiles'
);

select is(
  (select count(*)::integer
   from pg_policies
   where schemaname = 'rider'
     and tablename = 'rider_profiles'
     and roles && array['anon'::name, 'authenticated'::name, 'public'::name]),
  0,
  'rider.rider_profiles has no anon/authenticated/public RLS policies'
);

select has_function('rider', 'upsert_my_rider_profile', array['text'::name, 'text'::name], 'rider.upsert_my_rider_profile(text, text) exists');
select has_function('rider', 'get_my_rider_profile', array[]::name[], 'rider.get_my_rider_profile() exists');

select is(has_function_privilege('anon', 'rider.upsert_my_rider_profile(text,text)'::regprocedure, 'EXECUTE'), false, 'anon cannot execute rider profile upsert RPC');
select is(has_function_privilege('anon', 'rider.get_my_rider_profile()'::regprocedure, 'EXECUTE'), false, 'anon cannot execute rider profile read RPC');
select is(has_function_privilege('authenticated', 'rider.upsert_my_rider_profile(text,text)'::regprocedure, 'EXECUTE'), true, 'authenticated can execute narrow rider profile upsert RPC');
select is(has_function_privilege('authenticated', 'rider.get_my_rider_profile()'::regprocedure, 'EXECUTE'), true, 'authenticated can execute narrow rider profile read RPC');

select is(
  (select count(*)::integer
   from pg_proc
   where pronamespace = 'rider'::regnamespace
     and has_function_privilege('authenticated', oid, 'EXECUTE')),
  2,
  'authenticated has execute on only the approved narrow rider profile RPCs'
);

select is((select prosecdef from pg_proc where oid = 'rider.upsert_my_rider_profile(text,text)'::regprocedure), true, 'rider profile upsert uses SECURITY DEFINER for controlled table and audit writes');
select is((select 'search_path=rider, audit, auth, pg_catalog' = any(proconfig) from pg_proc where oid = 'rider.upsert_my_rider_profile(text,text)'::regprocedure), true, 'rider profile upsert has fixed search_path');
select ok(position('v_actor_user_id uuid := auth.uid()' in pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure)) > 0, 'rider profile upsert reads auth.uid() as actor');
select ok(position('where existing_profile.user_id = v_actor_user_id' in pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure)) > 0, 'rider profile upsert targets only auth.uid() row');
select ok(position('execute ' in lower(pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure))) = 0, 'rider profile upsert does not use dynamic SQL');
select ok(position('service_role' in lower(pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure))) = 0, 'rider profile upsert does not reference service-role secrets');
select ok(position('insert into audit.audit_logs' in pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure)) > 0, 'rider profile upsert writes audit logs');

select ok(
  position('if v_actor_user_id is null then' in lower(pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure))) > 0,
  'rider profile upsert rejects missing auth.uid() in function body'
);

select ok(
  regexp_replace(lower(pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure)), '[[:space:]]+', ' ', 'g')
    like '%insert into rider.rider_profiles as target_profile ( user_id, display_name, phone )%',
  'rider profile upsert insert path exposes only user_id, display_name, and phone columns'
);

select ok(
  position('v_actor_user_id' in lower(pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure))) > 0
  and position('nullif(btrim(p_display_name)' in lower(pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure))) > 0
  and position('nullif(btrim(p_phone)' in lower(pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure))) > 0,
  'rider profile upsert inserts auth.uid() and trimmed safe fields only'
);

select ok(
  regexp_replace(lower(pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure)), '[[:space:]]+', ' ', 'g')
    like '%on conflict (user_id) do update set display_name = excluded.display_name, phone = excluded.phone, updated_at = now()%'
    and position('metadata =' in lower(pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure))) = 0
    and position('status =' in lower(pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure))) = 0,
  'rider profile upsert update path writes only display_name, phone, and updated_at'
);

select is(
  (select array_agg(column_name order by ordinal_position)
   from pg_proc profile_function
   cross join lateral unnest(
     profile_function.proargnames,
     profile_function.proargmodes
   ) with ordinality as returned_columns(column_name, arg_mode, ordinal_position)
   where profile_function.oid = 'rider.upsert_my_rider_profile(text,text)'::regprocedure
     and returned_columns.arg_mode = 't'),
  array['user_id', 'display_name', 'phone', 'status', 'created_at', 'updated_at']::text[],
  'rider profile upsert returns only safe rider profile fields and no metadata or authority columns'
);

select is(
  (select array_agg(column_name order by ordinal_position)
   from pg_proc profile_function
   cross join lateral unnest(
     profile_function.proargnames,
     profile_function.proargmodes
   ) with ordinality as returned_columns(column_name, arg_mode, ordinal_position)
   where profile_function.oid = 'rider.get_my_rider_profile()'::regprocedure
     and returned_columns.arg_mode = 't'),
  array['display_name', 'phone', 'status']::text[],
  'rider profile read returns only display_name, phone, and safe status'
);

select ok(
  position('metadata' in lower(pg_get_functiondef('rider.get_my_rider_profile()'::regprocedure))) = 0
  and position('organization_id' in lower(pg_get_functiondef('rider.get_my_rider_profile()'::regprocedure))) = 0
  and position('role' in lower(pg_get_functiondef('rider.get_my_rider_profile()'::regprocedure))) = 0,
  'rider profile read does not expose metadata, organization, or role fields'
);

select ok(
  position('rider.rider_profiles.upsert_self_profile' in pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure)) > 0
  and position('''rider.rider_profiles''' in pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure)) > 0,
  'rider profile upsert audit action and resource identify self rider profile upsert'
);

select ok(
  position('authority_granted' in pg_get_functiondef('rider.upsert_my_rider_profile(text,text)'::regprocedure)) > 0,
  'rider profile upsert audit metadata records that no authority is granted'
);

select is(
  (select count(*)::integer
   from pg_proc
   where pronamespace = 'rider'::regnamespace
     and proname ~* '(booking|trip|dispatch|wallet|payment|payout|driver|admin|kyc|approval|fare|quote|safety)'),
  0,
  'no rider product/business RPCs for booking, dispatch, wallet, payments, driver onboarding, admin, KYC, fare quote, or safety were added'
);

select is(
  (select array_agg(attname order by attnum)
   from pg_attribute
   where attrelid = 'rider.rider_profiles'::regclass
     and attnum > 0
     and not attisdropped),
  array['user_id', 'display_name', 'phone', 'status', 'metadata', 'created_at', 'updated_at']::name[],
  'rider profile table has no role, organization, driver, wallet, payment, dispatch, admin, or KYC authority columns'
);

select * from finish();

rollback;
