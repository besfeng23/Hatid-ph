# Audit, idempotency, and outbox migration validation

This repository does not currently include a Supabase SQL test harness or pgTAP tests.
When a database test harness is added, validate the foundation migration by checking:

- `audit.audit_logs`, `audit.idempotency_keys`, and `integration.outbox_events` exist.
- Row level security is enabled on all three tables.
- No broad `anon` or `authenticated` policies allow direct client access.
- `audit.audit_logs` remains append-only and cannot be updated or deleted by normal authenticated users.
- `audit.idempotency_keys` has a uniqueness constraint/index that prevents duplicate processing for the same actor, scope, and key.
- Created-at, actor, organization, and outbox status/next-attempt indexes exist.
- Outbox events are used only for async delivery/recovery and are not direct provider-call wiring.
