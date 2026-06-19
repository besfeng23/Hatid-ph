-- pgTAP validation for the audited rider saved places foundation.

create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(31);

select has_table('rider', 'saved_places', 'table rider.saved_places exists');
select col_is_pk('rider', 'saved_places', 'id', 'saved place id is primary key');
select fk_ok('rider', 'saved_places', 'user_id', 'auth', 'users', 'id', 'saved place user_id references auth.users');
select ok(exists (select 1 from pg_constraint where conrelid = 'rider.saved_places'::regclass and conname = 'saved_places_place_type_check'), 'place_type constraint exists');
select ok(exists (select 1 from pg_constraint where conrelid = 'rider.saved_places'::regclass and conname = 'saved_places_metadata_is_object'), 'metadata object constraint exists');
select ok(exists (select 1 from pg_constraint where conrelid = 'rider.saved_places'::regclass and conname = 'saved_places_latitude_range'), 'latitude range constraint exists');
select ok(exists (select 1 from pg_constraint where conrelid = 'rider.saved_places'::regclass and conname = 'saved_places_longitude_range'), 'longitude range constraint exists');
select ok(exists (select 1 from pg_indexes where schemaname = 'rider' and tablename = 'saved_places' and indexname = 'saved_places_one_home_per_user_uidx'), 'one home per user unique index exists');
select ok(exists (select 1 from pg_indexes where schemaname = 'rider' and tablename = 'saved_places' and indexname = 'saved_places_one_work_per_user_uidx'), 'one work per user unique index exists');
select is((select relrowsecurity from pg_class where oid = 'rider.saved_places'::regclass), true, 'RLS is enabled on rider.saved_places');

select is((select bool_or(has_table_privilege(role_name, 'rider.saved_places', privilege_name)) from unnest(array['anon', 'authenticated']) role_name cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE']) privilege_name), false, 'anon/authenticated have no broad table privileges on rider.saved_places');
select is((select count(*)::integer from pg_policies where schemaname = 'rider' and tablename = 'saved_places' and roles && array['anon'::name, 'authenticated'::name, 'public'::name]), 0, 'rider.saved_places has no anon/authenticated/public RLS policies');

select has_function('rider', 'get_my_saved_places', array[]::name[], 'rider.get_my_saved_places() exists');
select has_function('rider', 'upsert_my_saved_place', array['uuid'::name, 'text'::name, 'text'::name, 'text'::name, 'numeric'::name, 'numeric'::name, 'text'::name], 'rider.upsert_my_saved_place(...) exists');
select has_function('rider', 'delete_my_saved_place', array['uuid'::name], 'rider.delete_my_saved_place(uuid) exists');
select is(has_function_privilege('anon', 'rider.get_my_saved_places()'::regprocedure, 'EXECUTE'), false, 'anon cannot execute saved places read RPC');
select is(has_function_privilege('anon', 'rider.upsert_my_saved_place(uuid,text,text,text,numeric,numeric,text)'::regprocedure, 'EXECUTE'), false, 'anon cannot execute saved place upsert RPC');
select is(has_function_privilege('anon', 'rider.delete_my_saved_place(uuid)'::regprocedure, 'EXECUTE'), false, 'anon cannot execute saved place delete RPC');
select is(has_function_privilege('authenticated', 'rider.get_my_saved_places()'::regprocedure, 'EXECUTE'), true, 'authenticated can execute saved places read RPC');
select is(has_function_privilege('authenticated', 'rider.upsert_my_saved_place(uuid,text,text,text,numeric,numeric,text)'::regprocedure, 'EXECUTE'), true, 'authenticated can execute saved place upsert RPC');
select is(has_function_privilege('authenticated', 'rider.delete_my_saved_place(uuid)'::regprocedure, 'EXECUTE'), true, 'authenticated can execute saved place delete RPC');

select is((select prosecdef from pg_proc where oid = 'rider.upsert_my_saved_place(uuid,text,text,text,numeric,numeric,text)'::regprocedure), true, 'saved place upsert uses SECURITY DEFINER');
select is((select 'search_path=rider, audit, auth, pg_catalog' = any(proconfig) from pg_proc where oid = 'rider.upsert_my_saved_place(uuid,text,text,text,numeric,numeric,text)'::regprocedure), true, 'saved place upsert has fixed search_path');
select ok(position('v_actor_user_id uuid := auth.uid()' in pg_get_functiondef('rider.upsert_my_saved_place(uuid,text,text,text,numeric,numeric,text)'::regprocedure)) > 0, 'saved place upsert reads auth.uid()');
select ok(position('existing_place.user_id = v_actor_user_id' in pg_get_functiondef('rider.upsert_my_saved_place(uuid,text,text,text,numeric,numeric,text)'::regprocedure)) > 0 and position('target_place.user_id = v_actor_user_id' in pg_get_functiondef('rider.upsert_my_saved_place(uuid,text,text,text,numeric,numeric,text)'::regprocedure)) > 0, 'saved place upsert targets only auth.uid() rows');
select ok(position('saved_place.user_id = v_actor_user_id' in pg_get_functiondef('rider.delete_my_saved_place(uuid)'::regprocedure)) > 0, 'saved place delete targets only auth.uid() rows');
select ok(position('execute ' in lower(pg_get_functiondef('rider.upsert_my_saved_place(uuid,text,text,text,numeric,numeric,text)'::regprocedure))) = 0 and position('execute ' in lower(pg_get_functiondef('rider.delete_my_saved_place(uuid)'::regprocedure))) = 0, 'saved place RPCs do not use dynamic SQL');
select ok(position('insert into audit.audit_logs' in pg_get_functiondef('rider.upsert_my_saved_place(uuid,text,text,text,numeric,numeric,text)'::regprocedure)) > 0 and position('insert into audit.audit_logs' in pg_get_functiondef('rider.delete_my_saved_place(uuid)'::regprocedure)) > 0, 'saved place writes create audit logs');
select ok(position('metadata' in lower(pg_get_functiondef('rider.get_my_saved_places()'::regprocedure))) = 0, 'saved places read does not expose metadata');
select ok(position('side_effects' in pg_get_functiondef('rider.upsert_my_saved_place(uuid,text,text,text,numeric,numeric,text)'::regprocedure)) > 0, 'saved place audit records no side effects');
select is((select count(*)::integer from pg_proc where pronamespace = 'rider'::regnamespace and proname ~* '(booking|trip|dispatch|wallet|payment|payout|driver|admin|kyc|approval|fare|quote|safety)'), 0, 'no rider product/business RPCs for booking/trip/fare/dispatch/wallet/payment/driver/admin/KYC/safety were added');

select * from finish();

rollback;
