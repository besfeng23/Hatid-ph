# Supabase SQL validation tests

This folder contains Supabase SQL/pgTAP tests for database migrations. The tests
are validation-only and do not wire product flows, RPCs, service-role keys, or
runtime application behavior.

## Current SQL tests

- `audit_idempotency_outbox_foundation.test.sql` validates the foundation
  migration for `audit.audit_logs`, `audit.idempotency_keys`, and
  `integration.outbox_events`.
- `core_iam_organization_foundation.test.sql` validates the foundation
  migration for `core.organizations`, `core.organization_members`, and
  `core.app_users`.
- `app_user_profile_bootstrap.test.sql` validates the narrow, audited
  authenticated RPC for self-service `core.app_users` profile bootstrap.

The audit/idempotency/outbox test checks that:

- schemas `audit` and `integration` exist;
- foundation tables `audit.audit_logs`, `audit.idempotency_keys`, and
  `integration.outbox_events` exist;
- row level security is enabled on all three tables;
- `audit.audit_logs` has append-only update and delete blocking triggers;
- unique index `idempotency_keys_actor_scope_key_uidx` exists;
- key created-at, actor, organization, and outbox status/next-attempt indexes
  exist;
- `anon` and `authenticated` do not have broad table privileges; and
- no broad `anon`, `authenticated`, or `public` RLS policies are created for the
  foundation tables.

The core IAM/organization test checks that:

- schema `core` exists;
- foundation tables `core.organizations`, `core.organization_members`, and
  `core.app_users` exist;
- row level security is enabled on all three tables;
- primary keys and foreign keys to `auth.users` and `core.organizations` exist;
- nonblank organization name/slug constraints, allowed status constraints, and
  allowed membership role constraints exist;
- unique organization slug and unique active user/organization membership indexes
  exist;
- key lookup indexes for organization slug/status and membership
  organization/user/role/status exist;
- `anon` and `authenticated` do not have broad table privileges;
- no broad `anon`, `authenticated`, or `public` RLS policies are created for the
  core IAM tables; and
- no core product/business RPCs beyond the approved profile bootstrap are added.


The app user profile bootstrap test checks that:

- `core.upsert_my_app_user_profile(text, text)` exists;
- `anon` cannot execute the function and `authenticated` can execute only this
  narrow profile bootstrap function;
- the function uses `SECURITY DEFINER` with a fixed `search_path` for controlled
  table and audit writes without broad table grants;
- `core.app_users` remains RLS-enabled;
- `anon` and `authenticated` do not receive broad `core.app_users` table
  privileges;
- no `core.organization_members` write path, role self-assignment function, or
  extra product/business RPC is added;
- the function targets `auth.uid()` only and does not use dynamic SQL, using
  catalog-backed body checks that avoid formatting-sensitive
  `pg_get_functiondef(...)` assertions; and
- the controlled path inserts `audit.audit_logs` records identifying
  `core.app_users.upsert_self_profile` on `core.app_users`.

## Prerequisites

Install and configure the Supabase CLI with a local Supabase database available.
The CLI-provided database test runner supplies pgTAP for SQL tests. The test file
also includes test-only `create extension if not exists pgtap with schema extensions;`
setup for disposable databases where pgTAP is available.

## Run locally

From the repository root, run:

```bash
npm run db:test
```

The npm script runs the Supabase CLI command:

```bash
supabase db test
```

If you do not use npm scripts, running `supabase db test` directly is equivalent.

## CI status

The main CI workflow includes a focused Supabase SQL validation job that installs
Supabase CLI `2.39.2`, starts a disposable local Docker-backed Supabase stack,
applies migrations with `supabase db reset --local`, and runs `npm run db:test`.
The job must not use a linked hosted Supabase project, production database,
production secrets, or deployed service-role key.
