create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(12);

select has_table('driver', 'driver_profiles', 'driver profiles table exists');
select has_table('driver', 'vehicles', 'vehicles table exists');
select has_table('driver', 'documents', 'documents table exists');
select col_is_pk('driver', 'driver_profiles', 'user_id', 'driver profile user_id is primary key');
select col_is_pk('driver', 'vehicles', 'id', 'vehicle id is primary key');
select col_is_pk('driver', 'documents', 'id', 'document id is primary key');
select has_function('driver', 'get_my_driver_profile', array[]::name[], 'driver profile read RPC exists');
select has_function('driver', 'upsert_my_driver_profile', array['text'::name, 'text'::name, 'text'::name], 'driver profile save RPC exists');
select has_function('driver', 'get_my_vehicles', array[]::name[], 'vehicle read RPC exists');
select has_function('driver', 'upsert_my_vehicle', array['uuid'::name, 'text'::name, 'text'::name, 'text'::name, 'text'::name, 'text'::name, 'integer'::name, 'integer'::name], 'vehicle save RPC exists');
select has_function('driver', 'get_my_driver_documents', array[]::name[], 'document read RPC exists');
select has_function('driver', 'submit_my_driver_document', array['uuid'::name, 'text'::name, 'text'::name, 'text'::name, 'text'::name], 'document submit RPC exists');

select * from finish();

rollback;
