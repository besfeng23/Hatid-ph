# Hatid Final Implementation Roadmap

Document ID: 24_FINAL_IMPLEMENTATION_ROADMAP  
Status: Approved  
Scope: Dependency-correct implementation order

## Phase 0 — Sprint 0B Governance Foundation

Deliver:

- Turborepo v2 setup
- repo structure
- CODEOWNERS
- PR template
- quality gates
- ESLint boundaries
- TypeScript strict config
- architecture baseline docs
- UI baseline docs

## Phase 1 — Firebase Eradication

Deliver:

- remove Firebase files
- remove Firebase dependencies
- remove Firebase environment variables
- replace auth shell with Supabase Auth
- deploy clean shell to Vercel

## Phase 2 — Organization Foundation

Deliver migrations:

- extensions
- schemas
- `core.organizations`
- `core.users`
- `core.organization_members`

Acceptance:

- organization creation works
- member records exist
- organization-scoped model established

## Phase 3 — IAM + JWT + RLS

Deliver:

- `iam.roles`
- `iam.permissions`
- `iam.role_permissions`
- `iam.member_roles`
- helper functions
- custom JWT claims
- default-deny RLS
- pgTAP for IAM and organization isolation

## Phase 4 — Audit + Outbox + Idempotency + Observability Foundation

Deliver:

- `audit.audit_logs`
- `audit.idempotency_keys`
- `integration.outbox_events`
- minimum durable outbox event envelope, including event identity, type, version, organization context, aggregate reference, payload, occurrence time, trace context, and delivery state
- trace/correlation ID standard
- structured JSON logging
- initial OpenTelemetry wrapper
- audit triggers

## Phase 5 — Workflow Engine

Deliver:

- `workflow.definitions`
- `workflow.states`
- `workflow.transitions`
- `workflow.guards`
- `workflow.actions`
- `workflow.instances`
- `workflow.transition_logs`
- `workflow-service`

## Phase 6 — Finance Core

Deliver:

- `finance.ledgers`
- `finance.accounts`
- `finance.journal_entries`
- `finance.ledger_lines`
- `finance.wallet_balance_projection`
- `finance.account_balance_snapshots`
- `ledger-service`
- pgTAP ledger invariant tests

Restriction:

- Phase 6 establishes ledger-safe system mutation paths only. Manual ledger adjustment, refund approval, payout override, and chargeback resolution must not be enabled until the Phase 7 maker-checker foundation exists.

## Phase 7 — Operations + Maker-Checker

Phase 7 is the approval foundation for finance and compliance high-risk actions.

Deliver:

- `ops.approval_queue`
- approval workflows
- financial override approval
- refund approval
- payout approval

## Phase 8 — Compliance + AML

Deliver:

- KYC tables
- AML velocity rules
- AML alerts
- STR workflow
- DSAR/LER foundations

Dependency:

- AML case closure and DSAR/LER export require the Phase 7 maker-checker approval foundation.

## Phase 9 — Event Streaming Foundation

Deliver:

- operational Redis Streams for dispatch and telemetry scale
- outbox processor that publishes the Phase 4 durable event envelope
- dispatch stream contracts
- DLQ
- replay mechanism
- backpressure thresholds

## Phase 10 — Fleet Foundation

Deliver:

- driver profiles
- vehicles
- vehicle-driver assignments
- document metadata
- driver status workflow

## Phase 11 — Dispatch Foundation

Deliver:

- PostGIS
- H3
- driver realtime location
- targeted cascade
- offers
- TTL
- driver ACK
- anti-spoofing
- stalling detection

## Phase 12 — Trip Lifecycle

Deliver:

- trip request
- quote
- accept
- arrive
- start
- complete
- cancel
- workflow integration
- ledger integration

## Phase 13 — Rider App

Deliver:

- canonical UI baseline implementation
- Supabase auth integration
- booking flow
- live trip flow
- wallet projection display
- safety center

## Phase 14 — Driver App

Deliver:

- driver onboarding
- online/offline
- incoming offer
- active navigation
- earnings projection
- cashout request workflow

## Phase 15 — Admin Portal

Deliver:

- driver approval
- dispatch operations
- finance operations
- maker-checker approvals
- compliance cases
- DSAR/LER cases
- audit review

## Phase 16 — SRE Hardening

Deliver:

- SLO dashboards
- alerting
- error budgets
- runbooks
- chaos testing
- load testing

## Phase 17 — Scale Hardening

Deliver:

- queue scaling
- database partitioning
- read replicas
- autovacuum tuning
- cost controls
- regional rollout controls

## Phase 18 — Multi-Region DR

Deliver:

- standby region
- PITR drill
- failover runbook
- recovery runbook
- quarterly DR test
