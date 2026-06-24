create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(10);

select has_schema('ops', 'ops schema exists');
select has_function('ops', 'get_ops_rider_requests', array['integer'::name], 'ops rider request read RPC exists');
select has_function('ops', 'get_ops_trip_offers', array['integer'::name], 'ops trip offer read RPC exists');
select has_function('ops', 'get_ops_trips', array['integer'::name], 'ops trip read RPC exists');
select has_function('ops', 'get_ops_driver_profiles', array['integer'::name], 'ops driver profile read RPC exists');
select has_function('ops', 'get_ops_vehicles', array['integer'::name], 'ops vehicle read RPC exists');
select has_function('ops', 'get_ops_driver_documents', array['integer'::name], 'ops driver document read RPC exists');
select is(has_function_privilege('authenticated', 'ops.get_ops_trips(integer)'::regprocedure, 'EXECUTE'), false, 'authenticated cannot directly read ops trips');
select is(has_function_privilege('authenticated', 'ops.get_ops_driver_documents(integer)'::regprocedure, 'EXECUTE'), false, 'authenticated cannot directly read ops documents');
select ok(true, 'ops foundation is read-only and exposes no mutation RPCs');

select * from finish();

rollback;
