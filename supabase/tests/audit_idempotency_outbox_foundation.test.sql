-- pgTAP validation for the audit/idempotency/outbox foundation migration.
--
-- Run with Supabase CLI from the repository root:
--   supabase db test
--
-- Supabase's local test database provides pgTAP. The CREATE EXTENSION line is
-- test-only setup so this file can also be run against disposable PostgreSQL
-- databases that have pgTAP available; it does not add production runtime code.

create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(23);

select has_schema('audit', 'schema audit exists');
select has_schema('integration', 'schema integration exists');

select has_table('audit', 'audit_logs', 'table audit.audit_logs exists');
select has_table('audit', 'idempotency_keys', 'table audit.idempotency_keys exists');
select has_table('integration', 'outbox_events', 'table integration.outbox_events exists');

select is(
  (select relrowsecurity from pg_class where oid = 'audit.audit_logs'::regclass),
  true,
  'RLS is enabled on audit.audit_logs'
);
select is(
  (select relrowsecurity from pg_class where oid = 'audit.idempotency_keys'::regclass),
  true,
  'RLS is enabled on audit.idempotency_keys'
);
select is(
  (select relrowsecurity from pg_class where oid = 'integration.outbox_events'::regclass),
  true,
  'RLS is enabled on integration.outbox_events'
);

select ok(
  exists (
    select 1
    from pg_trigger trigger
    join pg_proc proc on proc.oid = trigger.tgfoid
    where trigger.tgrelid = 'audit.audit_logs'::regclass
      and trigger.tgname = 'audit_logs_prevent_update'
      and not trigger.tgisinternal
      and (trigger.tgtype & 16) = 16 -- update trigger
      and proc.pronamespace = 'audit'::regnamespace
      and proc.proname = 'prevent_audit_log_mutation'
  ),
  'audit.audit_logs has append-only update blocking trigger'
);
select ok(
  exists (
    select 1
    from pg_trigger trigger
    join pg_proc proc on proc.oid = trigger.tgfoid
    where trigger.tgrelid = 'audit.audit_logs'::regclass
      and trigger.tgname = 'audit_logs_prevent_delete'
      and not trigger.tgisinternal
      and (trigger.tgtype & 8) = 8 -- delete trigger
      and proc.pronamespace = 'audit'::regnamespace
      and proc.proname = 'prevent_audit_log_mutation'
  ),
  'audit.audit_logs has append-only delete blocking trigger'
);

select ok(
  exists (
    select 1
    from pg_class index_class
    join pg_index index_def on index_def.indexrelid = index_class.oid
    where index_class.relname = 'idempotency_keys_actor_scope_key_uidx'
      and index_class.relnamespace = 'audit'::regnamespace
      and index_def.indrelid = 'audit.idempotency_keys'::regclass
      and index_def.indisunique
  ),
  'unique index idempotency_keys_actor_scope_key_uidx exists'
);

select ok(
  exists (
    select 1
    from pg_class index_class
    join pg_index index_def on index_def.indexrelid = index_class.oid
    where index_class.relname = 'audit_logs_created_at_idx'
      and index_class.relnamespace = 'audit'::regnamespace
      and index_def.indrelid = 'audit.audit_logs'::regclass
  ),
  'audit.audit_logs created_at index exists'
);
select ok(
  exists (
    select 1
    from pg_class index_class
    join pg_index index_def on index_def.indexrelid = index_class.oid
    where index_class.relname = 'audit_logs_actor_user_id_idx'
      and index_class.relnamespace = 'audit'::regnamespace
      and index_def.indrelid = 'audit.audit_logs'::regclass
  ),
  'audit.audit_logs actor_user_id index exists'
);
select ok(
  exists (
    select 1
    from pg_class index_class
    join pg_index index_def on index_def.indexrelid = index_class.oid
    where index_class.relname = 'audit_logs_organization_id_idx'
      and index_class.relnamespace = 'audit'::regnamespace
      and index_def.indrelid = 'audit.audit_logs'::regclass
  ),
  'audit.audit_logs organization_id index exists'
);
select ok(
  exists (
    select 1
    from pg_class index_class
    join pg_index index_def on index_def.indexrelid = index_class.oid
    where index_class.relname = 'idempotency_keys_created_at_idx'
      and index_class.relnamespace = 'audit'::regnamespace
      and index_def.indrelid = 'audit.idempotency_keys'::regclass
  ),
  'audit.idempotency_keys created_at index exists'
);
select ok(
  exists (
    select 1
    from pg_class index_class
    join pg_index index_def on index_def.indexrelid = index_class.oid
    where index_class.relname = 'idempotency_keys_actor_user_id_idx'
      and index_class.relnamespace = 'audit'::regnamespace
      and index_def.indrelid = 'audit.idempotency_keys'::regclass
  ),
  'audit.idempotency_keys actor_user_id index exists'
);
select ok(
  exists (
    select 1
    from pg_class index_class
    join pg_index index_def on index_def.indexrelid = index_class.oid
    where index_class.relname = 'idempotency_keys_organization_id_idx'
      and index_class.relnamespace = 'audit'::regnamespace
      and index_def.indrelid = 'audit.idempotency_keys'::regclass
  ),
  'audit.idempotency_keys organization_id index exists'
);
select ok(
  exists (
    select 1
    from pg_class index_class
    join pg_index index_def on index_def.indexrelid = index_class.oid
    where index_class.relname = 'outbox_events_created_at_idx'
      and index_class.relnamespace = 'integration'::regnamespace
      and index_def.indrelid = 'integration.outbox_events'::regclass
  ),
  'integration.outbox_events created_at index exists'
);
select ok(
  exists (
    select 1
    from pg_class index_class
    join pg_index index_def on index_def.indexrelid = index_class.oid
    where index_class.relname = 'outbox_events_organization_id_idx'
      and index_class.relnamespace = 'integration'::regnamespace
      and index_def.indrelid = 'integration.outbox_events'::regclass
  ),
  'integration.outbox_events organization_id index exists'
);
select ok(
  exists (
    select 1
    from pg_class index_class
    join pg_index index_def on index_def.indexrelid = index_class.oid
    where index_class.relname = 'outbox_events_status_next_attempt_at_idx'
      and index_class.relnamespace = 'integration'::regnamespace
      and index_def.indrelid = 'integration.outbox_events'::regclass
  ),
  'integration.outbox_events status/next_attempt index exists'
);

select is(
  (select bool_or(has_table_privilege(role_name, table_oid, privilege_name))
   from unnest(array['anon'::name, 'authenticated'::name]) role_name
   cross join unnest(array[
     'audit.audit_logs'::regclass,
     'audit.idempotency_keys'::regclass,
     'integration.outbox_events'::regclass
   ]) table_oid
   cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE']) privilege_name),
  false,
  'anon/authenticated have no broad table privileges on foundation tables'
);
select is(
  (select count(*)::integer
   from pg_policies
   where schemaname = 'audit'
     and tablename in ('audit_logs', 'idempotency_keys')
     and roles::text[] && array['anon', 'authenticated', 'public']),
  0,
  'audit foundation tables have no anon/authenticated/public policies'
);
select is(
  (select count(*)::integer
   from pg_policies
   where schemaname = 'integration'
     and tablename = 'outbox_events'
     and roles::text[] && array['anon', 'authenticated', 'public']),
  0,
  'integration outbox table has no anon/authenticated/public policies'
);

select * from finish();

rollback;
