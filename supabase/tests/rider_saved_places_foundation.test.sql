create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(6);

select has_table('rider', 'saved_places', 'table rider.saved_places exists');
select col_is_pk('rider', 'saved_places', 'id', 'saved place id is primary key');
select fk_ok('rider', 'saved_places', 'user_id', 'auth', 'users', 'id', 'saved place user_id references auth.users');
select has_function('rider', 'get_my_saved_places', array[]::name[], 'read saved places RPC exists');
select has_function('rider', 'upsert_my_saved_place', array['uuid'::name, 'text'::name, 'text'::name, 'text'::name, 'numeric'::name, 'numeric'::name, 'text'::name], 'save saved place RPC exists');
select has_function('rider', 'delete_my_saved_place', array['uuid'::name], 'delete saved place RPC exists');

select * from finish();

rollback;
