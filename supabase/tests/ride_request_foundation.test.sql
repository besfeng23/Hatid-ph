create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(7);

select has_table('rider', 'ride_requests', 'table rider.ride_requests exists');
select col_is_pk('rider', 'ride_requests', 'id', 'ride request id is primary key');
select fk_ok('rider', 'ride_requests', 'user_id', 'auth', 'users', 'id', 'ride request user_id references auth.users');
select has_function('rider', 'get_my_ride_requests', array[]::name[], 'read ride requests RPC exists');
select has_function('rider', 'create_my_ride_request', array['uuid'::name, 'text'::name], 'create ride request RPC exists');
select has_function('rider', 'cancel_my_ride_request', array['uuid'::name], 'cancel ride request RPC exists');
select is(has_function_privilege('authenticated', 'rider.get_my_ride_requests()'::regprocedure, 'EXECUTE'), true, 'authenticated can read own ride requests');

select * from finish();

rollback;
