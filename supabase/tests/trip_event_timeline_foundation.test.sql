create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(11);

select has_table('trip', 'trip_events', 'trip events table exists');
select col_is_pk('trip', 'trip_events', 'id', 'trip event id is primary key');
select fk_ok('trip', 'trip_events', 'trip_id', 'trip', 'trips', 'id', 'trip event trip_id references trips');
select fk_ok('trip', 'trip_events', 'actor_user_id', 'auth', 'users', 'id', 'trip event actor_user_id references auth.users');
select has_function('trip', 'prevent_trip_event_mutation', array[]::name[], 'immutable event mutation trigger function exists');
select has_trigger('trip', 'trip_events', 'trip_events_prevent_update', 'update prevention trigger exists');
select has_trigger('trip', 'trip_events', 'trip_events_prevent_delete', 'delete prevention trigger exists');
select has_function('trip', 'get_my_rider_trip_events', array['uuid'::name], 'rider timeline read RPC exists');
select has_function('trip', 'get_my_driver_trip_events', array['uuid'::name], 'driver timeline read RPC exists');
select is(has_table_privilege('authenticated', 'trip.trip_events', 'SELECT'), false, 'authenticated cannot select trip events table directly');
select is(has_function_privilege('authenticated', 'trip.get_my_driver_trip_events(uuid)'::regprocedure, 'EXECUTE'), true, 'authenticated can read own driver trip timeline through RPC');

select * from finish();

rollback;
