# Hatid Architecture Baseline V1

Document ID: 00_ARCHITECTURE_BASELINE_V1  
Status: Frozen  
Authority: Highest-level implementation source of truth  
Stack: Supabase + PostgreSQL + PostGIS + Vercel + GitHub + Cloudflare  
Firebase: Deprecated and prohibited

## 1. Purpose

This document defines the frozen baseline for Hatid. All code, migrations, services, frontend screens, CI/CD workflows, and future AI-generated work must conform to this baseline unless a Drift ADR is approved.

## 2. Approved Platform Stack

### Frontend

- Next.js for web/admin.
- React Native / Expo or mobile-first React app for rider/driver when mobile implementation begins.
- Tailwind / NativeWind tokens derived from the canonical UI/UX baseline.
- Lucide icon style or approved equivalent.
- Mobile-first UI.

### Backend

- Supabase Auth.
- PostgreSQL 15+ through Supabase.
- PostGIS extension.
- Supabase Storage.
- Supabase Realtime for controlled realtime use.
- Supabase Edge Functions for API boundary.
- Redis Streams first for event streaming where needed.
- Kafka later only when scale requires it.

### Deployment

- Vercel for frontend.
- Supabase for database, auth, storage, edge functions.
- Cloudflare or equivalent WAF/API gateway in front of public APIs.
- GitHub Actions for CI/CD.

## 3. Deprecated Technologies

Firebase is not approved.

Prohibited:

- Firebase Auth
- Firestore
- Firebase Storage
- Firebase Hosting / App Hosting
- Firebase Cloud Functions
- Firebase Realtime Database
- Firebase client SDK dependency
- Firebase Admin dependency

The repository must reach `Firebase Dependency Count = 0`.

## 4. Bounded Contexts

Approved bounded contexts:

1. `core`
2. `iam`
3. `audit`
4. `integration`
5. `workflow`
6. `finance`
7. `fleet`
8. `dispatch`
9. `analytics`
10. `compliance`
11. `ops`

No new bounded context may be introduced without an approved ADR.

## 5. Organization-First Rule

`core.organizations` is the root aggregate.

Required foundation tables:

- `core.organizations`
- `core.organization_members`
- `core.users`

All business tables that store tenant-owned data must include `organization_id`.

JWT custom claims must include:

- `org_id`
- `member_id`
- `roles`
- `permissions`

Organization scoping is mandatory in:

- RLS policies
- audit logs
- workflow instances
- finance journals
- dispatch trips
- fleet records
- compliance records
- admin operations

## 6. IAM and Security Baseline

Supabase Auth is the identity provider.

The IAM bounded context owns:

- roles
- permissions
- role-permission bindings
- member-role bindings
- security helper functions

The system must not build a separate custom authentication provider. It may implement auth-service as an application-level wrapper around Supabase Auth and IAM, but token issuance remains Supabase Auth based.

## 7. RLS-First Rule

Every table must have:

- RLS enabled
- default deny posture
- explicit policies
- pgTAP tests validating access
- organization isolation checks where applicable

No production table may exist without RLS.

## 8. Audit-First Rule

Before business logic:

- `audit.audit_logs`
- `audit.idempotency_keys`
- `integration.outbox_events`

must exist.

Every critical mutation must be:

- auditable
- idempotent
- traceable
- recoverable

## 9. Workflow-First Rule

The workflow engine must exist before business processes are implemented.

Required workflow objects:

- `workflow.definitions`
- `workflow.states`
- `workflow.transitions`
- `workflow.guards`
- `workflow.actions`
- `workflow.instances`
- `workflow.transition_logs`

Business workflows include:

- trip lifecycle
- driver onboarding
- payout approval
- refund approval
- chargeback investigation
- AML investigation
- DSAR/LER extraction
- disaster recovery authorization

## 10. Ledger-First Finance Rule

Wallet balance is not source of truth.

Source of truth:

- `finance.accounts`
- `finance.journal_entries`
- `finance.ledger_lines`

Projection only:

- `finance.wallet_balance_projection`
- `finance.account_balance_snapshots`

Prohibited:

- direct wallet balance mutation
- single-entry accounting
- `wallet.balance += amount`
- update/delete of posted journal entries
- update/delete of posted ledger lines

Corrections require reversing journal entries.

## 11. Event Architecture

All external communication must use outbox-driven delivery.

Approved pattern:

Application transaction  
→ database state change  
→ `integration.outbox_events`  
→ outbox processor  
→ event stream / notification / external provider

Direct synchronous provider calls inside core DB transactions are prohibited.

High-frequency telemetry and dispatch events must use event streaming once scale requires it.

## 12. Dispatch Baseline

Dispatch must include:

- PostGIS
- H3 indexing
- targeted cascade matching
- offer TTL
- driver ACK
- driver anti-spoofing
- driver stalling detection
- offer expiry and requeue
- DLQ path for failed dispatch events
- backpressure and load shedding

Broadcast dispatch where many drivers race to tap first is prohibited.

## 13. Observability Baseline

All backend work must propagate:

- `trace_id`
- `span_id`
- `correlation_id`
- `organization_id`
- `actor_id`

Required:

- OpenTelemetry
- structured JSON logs
- metrics
- traces
- alerts
- dashboards
- SLOs
- error budgets

## 14. Compliance Baseline

Required compliance capabilities:

- Data Privacy Act readiness
- DSAR
- LER
- AML velocity rules
- AML alerts
- suspicious transaction reporting workflow
- maker-checker approvals
- chargeback investigation
- reconciliation
- financial auditability
- legal evidence retention

## 15. Architecture Drift

Any deviation from this baseline requires:

1. Drift ADR
2. impact analysis
3. approval from principal architect or architecture board
4. updated tests
5. updated governance documents

No silent drift.
