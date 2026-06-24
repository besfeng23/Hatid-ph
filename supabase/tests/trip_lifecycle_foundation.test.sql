create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(13);

select has_schema('trip', 'trip schema exists');
select has_table('trip', 'trips', 'trip table exists');
select col_is_pk('trip', 'trips', 'id', 'trip id is primary key');
select fk_ok('trip', 'trips', 'request_id', 'rider', 'ride_requests', 'id', 'trip request_id references ride requests');
select fk_ok('trip', 'trips', 'accepted_offer_id', 'dispatch', 'trip_offers', 'id', 'trip accepted_offer_id references trip offers');
select fk_ok('trip', 'trips', 'rider_user_id', 'auth', 'users', 'id', 'trip rider_user_id references auth.users');
select fk_ok('trip', 'trips', 'driver_user_id', 'auth', 'users', 'id', 'trip driver_user_id references auth.users');
select fk_ok('trip', 'trips', 'vehicle_id', 'driver', 'vehicles', 'id', 'trip vehicle_id references vehicles');
select has_function('trip', 'create_trip_from_accepted_offer', array['uuid'::name], 'create trip RPC exists');
select has_function('trip', 'get_my_rider_trips', array[]::name[], 'rider trip read RPC exists');
select has_function('trip', 'get_my_driver_trips', array[]::name[], 'driver trip read RPC exists');
select has_function('trip', 'advance_my_driver_trip', array['uuid'::name, 'text'::name, 'text'::name], 'driver trip transition RPC exists');
select is(has_function_privilege('authenticated', 'trip.advance_my_driver_trip(uuid, text, text)'::regprocedure, 'EXECUTE'), true, 'authenticated driver can advance own trip through RPC');

select * from finish();

rollback;
