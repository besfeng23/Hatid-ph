create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(10);

select has_table('dispatch', 'trip_offers', 'trip offers table exists');
select col_is_pk('dispatch', 'trip_offers', 'id', 'trip offer id is primary key');
select fk_ok('dispatch', 'trip_offers', 'request_id', 'rider', 'ride_requests', 'id', 'trip offer request_id references ride requests');
select fk_ok('dispatch', 'trip_offers', 'driver_user_id', 'auth', 'users', 'id', 'trip offer driver_user_id references auth.users');
select fk_ok('dispatch', 'trip_offers', 'vehicle_id', 'driver', 'vehicles', 'id', 'trip offer vehicle_id references vehicles');
select has_function('dispatch', 'create_trip_offer_for_candidate', array['uuid'::name, 'uuid'::name, 'uuid'::name], 'create offer RPC exists');
select has_function('dispatch', 'get_my_driver_trip_offers', array[]::name[], 'driver offer read RPC exists');
select has_function('dispatch', 'respond_to_my_trip_offer', array['uuid'::name, 'text'::name], 'driver offer response RPC exists');
select is(has_function_privilege('authenticated', 'dispatch.create_trip_offer_for_candidate(uuid, uuid, uuid)'::regprocedure, 'EXECUTE'), false, 'authenticated cannot create dispatch offers directly');
select is(has_function_privilege('authenticated', 'dispatch.respond_to_my_trip_offer(uuid, text)'::regprocedure, 'EXECUTE'), true, 'authenticated drivers can respond to own offers through RPC');

select * from finish();

rollback;
