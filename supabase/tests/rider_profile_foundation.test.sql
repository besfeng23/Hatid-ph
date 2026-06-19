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

select has_function('rider', 'upsert_my_rider_profile', array['text', 'text'], 'rider.upsert_my_rider_profile(text, text) exists');
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

select throws_ok(
  $$ select * from rider.upsert_my_rider_profile('No Auth', '+63000000000') $$,
  '28000',
  'authenticated user required',
  'rider profile upsert requires auth.uid()'
);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000101'::uuid, 'authenticated', 'authenticated', 'rider-one@example.test', 'x', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000202'::uuid, 'authenticated', 'authenticated', 'rider-two@example.test', 'x', now(), now(), now());

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000101';

select lives_ok(
  $$ select * from rider.upsert_my_rider_profile(' Rider One ', ' +639171111111 ') $$,
  'authenticated caller can upsert their own rider profile'
);

reset role;
set local search_path = public, extensions;

select is((select count(*)::integer from rider.rider_profiles), 1, 'upsert creates only one rider profile row');
select is((select user_id from rider.rider_profiles), '00000000-0000-0000-0000-000000000101'::uuid, 'upsert writes only auth.uid() row');
select is((select display_name from rider.rider_profiles where user_id = '00000000-0000-0000-0000-000000000101'::uuid), 'Rider One', 'upsert trims and writes safe display_name field');
select is((select phone from rider.rider_profiles where user_id = '00000000-0000-0000-0000-000000000101'::uuid), '+639171111111', 'upsert trims and writes safe phone field');
select is((select status from rider.rider_profiles where user_id = '00000000-0000-0000-0000-000000000101'::uuid), 'draft', 'upsert does not let caller set status');
select is((select metadata from rider.rider_profiles where user_id = '00000000-0000-0000-0000-000000000101'::uuid), '{}'::jsonb, 'upsert does not let caller set metadata');
select is((select count(*)::integer from audit.audit_logs where action_name = 'rider.rider_profiles.upsert_self_profile' and actor_user_id = '00000000-0000-0000-0000-000000000101'::uuid), 1, 'upsert writes audit.audit_logs');

select is(
  (select count(*)::integer
   from pg_proc
   where pronamespace = 'rider'::regnamespace
     and proname ~* '(booking|trip|dispatch|wallet|payment|payout|driver|admin|kyc|approval|fare|quote|safety)'),
  0,
  'no rider product/business RPCs for booking, dispatch, wallet, payments, driver onboarding, admin, KYC, fare quote, or safety were added'
);

select is(
  (select array_agg(column_name order by ordinal_position)
   from information_schema.columns
   where table_schema = 'rider'
     and table_name = 'rider_profiles'),
  array['user_id', 'display_name', 'phone', 'status', 'metadata', 'created_at', 'updated_at']::text[],
  'rider profile table has no role, organization, driver, wallet, payment, dispatch, admin, or KYC authority columns'
);

select * from finish();

rollback;
