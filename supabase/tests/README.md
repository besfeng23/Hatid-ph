# Supabase SQL validation tests

This folder contains Supabase SQL/pgTAP tests for database migrations. The tests
are validation-only and do not wire product flows, RPCs, service-role keys, or
runtime application behavior.

## Current SQL test

- `audit_idempotency_outbox_foundation.test.sql` validates the foundation
  migration for `audit.audit_logs`, `audit.idempotency_keys`, and
  `integration.outbox_events`.

The test checks that:

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

## CI status and TODO

These SQL tests are not yet wired into CI in this repository. If Supabase CLI or
a local database is unavailable in CI, the SQL tests will not execute there.

TODO: add a focused CI job that installs/pins Supabase CLI, starts a disposable
Supabase/Postgres test database, applies migrations, and runs `supabase db test`
without using production secrets.
