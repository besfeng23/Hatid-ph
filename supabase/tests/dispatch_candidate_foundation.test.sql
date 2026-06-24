create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(6);

select has_schema('dispatch', 'dispatch schema exists');
select has_function('dispatch', 'calculate_distance_km', array['numeric'::name, 'numeric'::name, 'numeric'::name, 'numeric'::name], 'distance helper exists');
select has_function('dispatch', 'find_ride_request_candidates', array['uuid'::name, 'integer'::name], 'candidate search RPC exists');
select is(has_function_privilege('authenticated', 'dispatch.find_ride_request_candidates(uuid, integer)'::regprocedure, 'EXECUTE'), false, 'authenticated cannot directly search dispatch candidates');
select isnt(dispatch.calculate_distance_km(14.4201, 121.0389, 14.5547, 121.0244), null, 'distance helper returns a value');
select ok(dispatch.calculate_distance_km(14.4201, 121.0389, 14.5547, 121.0244) > 0, 'distance helper returns positive distance');

select * from finish();

rollback;
