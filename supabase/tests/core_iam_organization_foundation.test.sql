-- pgTAP validation for the core IAM and organization foundation migration.
--
-- Run with Supabase CLI from the repository root:
--   supabase db test
--
-- This validation is database foundation only. It must not add product flows,
-- business RPCs, service-role app code, or broad client access policies.

create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(31);

select has_schema('core', 'schema core exists');

select has_table('core', 'organizations', 'table core.organizations exists');
select has_table('core', 'organization_members', 'table core.organization_members exists');
select has_table('core', 'app_users', 'table core.app_users exists');

select is((select relrowsecurity from pg_class where oid = 'core.organizations'::regclass), true, 'RLS is enabled on core.organizations');
select is((select relrowsecurity from pg_class where oid = 'core.organization_members'::regclass), true, 'RLS is enabled on core.organization_members');
select is((select relrowsecurity from pg_class where oid = 'core.app_users'::regclass), true, 'RLS is enabled on core.app_users');

select col_is_pk('core', 'organizations', 'id', 'core.organizations id is primary key');
select col_is_pk('core', 'organization_members', 'id', 'core.organization_members id is primary key');
select col_is_pk('core', 'app_users', 'user_id', 'core.app_users user_id is primary key');

select fk_ok('core', 'organization_members', 'organization_id', 'core', 'organizations', 'id', 'membership organization_id references organizations');
select fk_ok('core', 'organization_members', 'user_id', 'auth', 'users', 'id', 'membership user_id references auth.users');
select fk_ok('core', 'organization_members', 'invited_by_user_id', 'auth', 'users', 'id', 'membership invited_by_user_id references auth.users');
select fk_ok('core', 'app_users', 'user_id', 'auth', 'users', 'id', 'app_users user_id references auth.users');

select ok(exists (select 1 from pg_constraint where conrelid = 'core.organizations'::regclass and conname = 'organizations_name_not_blank' and contype = 'c'), 'organization name nonblank constraint exists');
select ok(exists (select 1 from pg_constraint where conrelid = 'core.organizations'::regclass and conname = 'organizations_slug_not_blank' and contype = 'c'), 'organization slug nonblank constraint exists');
select ok(exists (select 1 from pg_constraint where conrelid = 'core.organizations'::regclass and conname = 'organizations_status_check' and contype = 'c'), 'organization allowed status constraint exists');
select ok(exists (select 1 from pg_constraint where conrelid = 'core.organization_members'::regclass and conname = 'organization_members_role_check' and contype = 'c'), 'membership allowed role constraint exists');
select ok(exists (select 1 from pg_constraint where conrelid = 'core.organization_members'::regclass and conname = 'organization_members_status_check' and contype = 'c'), 'membership allowed status constraint exists');
select ok(exists (select 1 from pg_constraint where conrelid = 'core.app_users'::regclass and conname = 'app_users_status_check' and contype = 'c'), 'app user allowed status constraint exists');

select ok(exists (select 1 from pg_class c join pg_index i on i.indexrelid = c.oid where c.relname = 'organizations_slug_uidx' and c.relnamespace = 'core'::regnamespace and i.indrelid = 'core.organizations'::regclass and i.indisunique), 'unique organization slug index exists');
select ok(exists (select 1 from pg_class c join pg_index i on i.indexrelid = c.oid where c.relname = 'organization_members_active_user_org_uidx' and c.relnamespace = 'core'::regnamespace and i.indrelid = 'core.organization_members'::regclass and i.indisunique and pg_get_expr(i.indpred, i.indrelid) like '%status%active%'), 'unique active organization membership index exists');

select has_index('core', 'organizations', 'organizations_slug_idx', 'organization slug lookup index exists');
select has_index('core', 'organizations', 'organizations_status_idx', 'organization status index exists');
select has_index('core', 'organization_members', 'organization_members_organization_id_idx', 'membership organization_id index exists');
select has_index('core', 'organization_members', 'organization_members_user_id_idx', 'membership user_id index exists');
select has_index('core', 'organization_members', 'organization_members_role_idx', 'membership role index exists');
select has_index('core', 'organization_members', 'organization_members_status_idx', 'membership status index exists');

select is(
  (select bool_or(has_table_privilege(role_name, table_name, privilege_name))
   from unnest(array['anon', 'authenticated']) role_name
   cross join unnest(array['core.organizations', 'core.organization_members', 'core.app_users']) table_name
   cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE']) privilege_name),
  false,
  'anon/authenticated have no broad table privileges on core IAM tables'
);
select is(
  (select count(*)::integer
   from pg_policies
   where schemaname = 'core'
     and tablename in ('organizations', 'organization_members', 'app_users')
     and roles && array['anon'::name, 'authenticated'::name, 'public'::name]),
  0,
  'core IAM tables have no anon/authenticated/public RLS policies'
);
select is(
  (select count(*)::integer
   from pg_proc
   where pronamespace = 'core'::regnamespace
     and proname not in ('set_updated_at', 'upsert_my_app_user_profile')),
  0,
  'no core product/business RPCs beyond approved profile bootstrap were added'
);

select * from finish();

rollback;
