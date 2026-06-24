create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(8);

select has_table('driver', 'driver_availability', 'driver availability table exists');
select col_is_pk('driver', 'driver_availability', 'user_id', 'driver availability user_id is primary key');
select fk_ok('driver', 'driver_availability', 'user_id', 'auth', 'users', 'id', 'availability user_id references auth.users');
select fk_ok('driver', 'driver_availability', 'vehicle_id', 'driver', 'vehicles', 'id', 'availability vehicle_id references driver.vehicles');
select has_function('driver', 'get_my_driver_availability', array[]::name[], 'availability read RPC exists');
select has_function('driver', 'set_my_driver_online', array['uuid'::name], 'availability online RPC exists');
select has_function('driver', 'update_my_driver_location_ping', array['numeric'::name, 'numeric'::name, 'numeric'::name, 'numeric'::name], 'location ping RPC exists');
select has_function('driver', 'set_my_driver_off_duty', array[]::name[], 'off duty RPC exists');

select * from finish();

rollback;
