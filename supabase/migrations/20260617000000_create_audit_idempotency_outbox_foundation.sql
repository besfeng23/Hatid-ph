-- Hatid audit, idempotency, and integration outbox foundation.
--
-- Scope:
-- - audit.audit_logs
-- - audit.idempotency_keys
-- - integration.outbox_events
--
-- These are foundation tables only. No product flows are wired by this migration.
-- Critical mutations that are added later must be auditable, idempotent,
-- traceable, and recoverable through server-owned code paths.
-- Service-role-only access is expected for writes until narrowly-scoped server
-- policies/RPCs are designed. Do not expose these tables directly to clients.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists audit;
create schema if not exists integration;

comment on schema audit is
  'Foundation schema for append-only audit logs and idempotency records. No product flows are wired yet.';

comment on schema integration is
  'Foundation schema for async integration outbox events. Outbox events are for deferred delivery, not direct provider calls.';

create or replace function audit.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function audit.prevent_audit_log_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit.audit_logs is append-only; update/delete is not allowed';
end;
$$;

create table if not exists audit.audit_logs (
  id uuid primary key default extensions.gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  organization_id uuid,
  action_name text not null,
  resource_type text not null,
  resource_id text,
  request_id text,
  correlation_id text,
  ip_address inet,
  user_agent text,
  before_snapshot jsonb,
  after_snapshot jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint audit_logs_action_name_not_blank check (length(btrim(action_name)) > 0),
  constraint audit_logs_resource_type_not_blank check (length(btrim(resource_type)) > 0),
  constraint audit_logs_metadata_is_object check (jsonb_typeof(metadata) = 'object')
);

create table if not exists audit.idempotency_keys (
  id uuid primary key default extensions.gen_random_uuid(),
  idempotency_key text not null,
  route text not null,
  scope text not null,
  action_name text not null,
  actor_user_id uuid references auth.users(id) on delete set null,
  organization_id uuid,
  request_hash text not null,
  response_status integer,
  response_body jsonb,
  status text not null default 'locked',
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint idempotency_keys_key_not_blank check (length(btrim(idempotency_key)) > 0),
  constraint idempotency_keys_route_not_blank check (length(btrim(route)) > 0),
  constraint idempotency_keys_scope_not_blank check (length(btrim(scope)) > 0),
  constraint idempotency_keys_action_name_not_blank check (length(btrim(action_name)) > 0),
  constraint idempotency_keys_request_hash_not_blank check (length(btrim(request_hash)) > 0),
  constraint idempotency_keys_response_status_check check (
    response_status is null or (response_status >= 100 and response_status <= 599)
  ),
  constraint idempotency_keys_status_check check (
    status in ('locked', 'processing', 'completed', 'failed')
  )
);

create table if not exists integration.outbox_events (
  id uuid primary key default extensions.gen_random_uuid(),
  event_type text not null,
  aggregate_type text not null,
  aggregate_id text not null,
  organization_id uuid,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  last_error text,
  idempotency_key_id uuid references audit.idempotency_keys(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  delivered_at timestamptz,
  constraint outbox_events_event_type_not_blank check (length(btrim(event_type)) > 0),
  constraint outbox_events_aggregate_type_not_blank check (length(btrim(aggregate_type)) > 0),
  constraint outbox_events_aggregate_id_not_blank check (length(btrim(aggregate_id)) > 0),
  constraint outbox_events_payload_is_object check (jsonb_typeof(payload) = 'object'),
  constraint outbox_events_status_check check (
    status in ('pending', 'processing', 'delivered', 'failed', 'dead_letter')
  ),
  constraint outbox_events_attempts_non_negative check (attempts >= 0),
  constraint outbox_events_delivered_at_status_check check (
    delivered_at is null or status = 'delivered'
  )
);

create unique index if not exists idempotency_keys_actor_scope_key_uidx
  on audit.idempotency_keys (coalesce(actor_user_id, '00000000-0000-0000-0000-000000000000'::uuid), scope, idempotency_key);

create index if not exists audit_logs_created_at_idx on audit.audit_logs (created_at);
create index if not exists audit_logs_actor_user_id_idx on audit.audit_logs (actor_user_id);
create index if not exists audit_logs_organization_id_idx on audit.audit_logs (organization_id);
create index if not exists audit_logs_request_id_idx on audit.audit_logs (request_id);
create index if not exists audit_logs_correlation_id_idx on audit.audit_logs (correlation_id);

create index if not exists idempotency_keys_created_at_idx on audit.idempotency_keys (created_at);
create index if not exists idempotency_keys_actor_user_id_idx on audit.idempotency_keys (actor_user_id);
create index if not exists idempotency_keys_organization_id_idx on audit.idempotency_keys (organization_id);
create index if not exists idempotency_keys_status_expires_at_idx on audit.idempotency_keys (status, expires_at);

create index if not exists outbox_events_created_at_idx on integration.outbox_events (created_at);
create index if not exists outbox_events_organization_id_idx on integration.outbox_events (organization_id);
create index if not exists outbox_events_status_next_attempt_at_idx on integration.outbox_events (status, next_attempt_at);
create index if not exists outbox_events_aggregate_idx on integration.outbox_events (aggregate_type, aggregate_id);
create index if not exists outbox_events_idempotency_key_id_idx on integration.outbox_events (idempotency_key_id);

create trigger audit_logs_prevent_update
  before update on audit.audit_logs
  for each row execute function audit.prevent_audit_log_mutation();

create trigger audit_logs_prevent_delete
  before delete on audit.audit_logs
  for each row execute function audit.prevent_audit_log_mutation();

create trigger idempotency_keys_set_updated_at
  before update on audit.idempotency_keys
  for each row execute function audit.set_updated_at();

create trigger outbox_events_set_updated_at
  before update on integration.outbox_events
  for each row execute function audit.set_updated_at();

alter table audit.audit_logs enable row level security;
alter table audit.idempotency_keys enable row level security;
alter table integration.outbox_events enable row level security;

revoke all on schema audit from public, anon, authenticated;
revoke all on schema integration from public, anon, authenticated;
revoke all on all tables in schema audit from anon, authenticated;
revoke all on all tables in schema integration from anon, authenticated;
revoke execute on function audit.set_updated_at() from public, anon, authenticated;
revoke execute on function audit.prevent_audit_log_mutation() from public, anon, authenticated;

-- Default RLS posture is deny: no anon/authenticated policies are created.
-- Service-role/server-owned code may be granted and audited in a later focused PR.

comment on table audit.audit_logs is
  'Foundation append-only audit entries for future server-owned critical mutations. No product flows are wired yet; update/delete is blocked for normal authenticated users and by append-only triggers.';
comment on table audit.idempotency_keys is
  'Foundation idempotency records that prevent duplicate processing for the same actor, scope, and key. No product flows are wired yet.';
comment on table integration.outbox_events is
  'Foundation async outbox for deferred integration delivery and recovery. This is not direct provider-call wiring and no product flows are wired yet.';
