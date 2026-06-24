create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(4);

select has_table('rider', 'ride_quotes', 'table rider.ride_quotes exists');
select col_is_pk('rider', 'ride_quotes', 'id', 'ride quote id is primary key');
select has_function('rider', 'create_my_ride_quote', array['text'::name, 'numeric'::name, 'numeric'::name, 'text'::name, 'numeric'::name, 'numeric'::name, 'text'::name], 'create ride quote RPC exists');
select has_function('rider', 'get_my_ride_quotes', array[]::name[], 'read ride quotes RPC exists');

select * from finish();

rollback;
