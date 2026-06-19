-- pgTAP smoke validation for the audited rider profile foundation.
-- Detailed rider profile privilege and behavior coverage lives in the merged
-- rider profile foundation PR. This file stays intentionally narrow so later
-- rider-domain RPC additions do not fail on stale total-function counts.

create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(6);

select has_schema('rider', 'schema rider exists');
select has_table('rider', 'rider_profiles', 'table rider.rider_profiles exists');
select col_is_pk('rider', 'rider_profiles', 'user_id', 'rider profile user_id is primary key');
select fk_ok('rider', 'rider_profiles', 'user_id', 'auth', 'users', 'id', 'rider profile user_id references auth.users');
select has_function('rider', 'upsert_my_rider_profile', array['text'::name, 'text'::name], 'rider profile save RPC exists');
select has_function('rider', 'get_my_rider_profile', array[]::name[], 'rider profile read RPC exists');

select * from finish();

rollback;
