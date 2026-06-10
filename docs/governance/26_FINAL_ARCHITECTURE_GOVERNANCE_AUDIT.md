# Hatid Final Architecture Governance Audit

Document ID: 26_FINAL_ARCHITECTURE_GOVERNANCE_AUDIT  
Status: Audit Report  
Scope: Cross-document governance audit only  
Rule: This report does not create new architecture. It identifies conflicts, gaps, duplicate responsibilities, and alignment issues across the existing architecture corpus.

## Executive Verdict

Hatid now has enough architecture to begin implementation only after the Single Source of Truth conflicts are resolved.

The largest risk is not missing architecture. The largest risk is that two document generations coexist:

1. Legacy hybrid architecture documents under root `docs/*.md`.
2. Frozen Supabase-first architecture documents under `docs/architecture`, `docs/governance`, `docs/frontend`, and `docs/adr`.

The frozen architecture corpus is internally stronger, but the legacy corpus is still present, still written as authoritative, and still contradicts the frozen baseline on platform, identity, eventing, deployment, workflow ownership, and data model naming.

## Audit Scope

Reviewed document families:

- `docs/00_PROJECT_SOURCE_INDEX.md`
- `docs/03_PRODUCTION_ARCHITECTURE.md`
- `docs/07_DATABASE_SCHEMA.md`
- `docs/08_TRIP_STATE_MACHINE.md`
- `docs/11_PAYMENT_LEDGER_AND_PAYOUTS.md`
- `docs/15_SECURITY_AND_RBAC.md`
- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md`
- `docs/architecture/16_EVENT_STREAMING_SPEC.md`
- `docs/architecture/17_OBSERVABILITY_TRACING_SPEC.md`
- `docs/architecture/18_COMPLIANCE_FRAUD_AML.md`
- `docs/architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md`
- `docs/architecture/25_REPOSITORY_TARGET_STRUCTURE.md`
- `docs/governance/19_ARCHITECTURE_COMPLIANCE_CHECKLIST.md`
- `docs/governance/20_REPOSITORY_GOVERNANCE.md`
- `docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md`
- `docs/governance/23_FIREBASE_ERADICATION_PLAN.md`
- `docs/frontend/21_UI_UX_BASELINE_V1.md`
- `docs/adr/ADR-001-REMOVE-FIREBASE.md`
- `docs/adr/ADR-002-SUPABASE-FIRST.md`
- `docs/adr/ADR-003-ORGANIZATION-FIRST-MULTITENANCY.md`
- `docs/adr/ADR-004-LEDGER-FIRST-FINANCE.md`
- `docs/adr/ADR-005-WORKFLOW-ENGINE-FIRST.md`
- `docs/adr/ADR-006-EVENT-STREAMING.md`
- `docs/adr/ADR-007-OBSERVABILITY-OPENTELEMETRY.md`
- `docs/adr/ADR-008-REPOSITORY-GOVERNANCE.md`
- `docs/adr/ADR-009-CANONICAL-UI-UX.md`

---

# 1. Cross-Document Issues

## Issue 1 — Platform Source-of-Truth Conflict: Firebase/Firestore Hybrid vs Supabase-First

Severity: P0 Critical  
Exact documents:

- `docs/00_PROJECT_SOURCE_INDEX.md` — Non-negotiable architecture rules
- `docs/03_PRODUCTION_ARCHITECTURE.md` — Decision, Target architecture, Source-of-truth boundaries
- `docs/07_DATABASE_SCHEMA.md` — Rule, Firestore projection rule
- `docs/15_SECURITY_AND_RBAC.md` — Identity, Authorization layers, Launch checklist
- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — Approved Platform Stack, Deprecated Technologies
- `docs/governance/23_FIREBASE_ERADICATION_PLAN.md` — Decision, Acceptance Criteria
- `docs/adr/ADR-001-REMOVE-FIREBASE.md`
- `docs/adr/ADR-002-SUPABASE-FIRST.md`

Root cause:

Legacy architecture documents still treat Firebase Auth and Firestore projections as acceptable production components. The frozen baseline and ADRs prohibit Firebase entirely and define Supabase Auth, PostgreSQL, Supabase Storage, Supabase Realtime, and Supabase Edge Functions as the approved platform.

Recommended correction:

Mark the legacy Firebase/hybrid documents as superseded or rewrite their headers to say: `SUPERSEDED BY 00_ARCHITECTURE_BASELINE_V1 AND ADR-001/ADR-002`. Do not leave them as active source-of-truth documents. Keep them only as historical audit references if needed.

---

## Issue 2 — Deployment Model Conflict: Cloud Run / Cloud Tasks / Pub/Sub / Cloud SQL vs Supabase Edge Functions / Redis Streams / Vercel

Severity: P0 Critical  
Exact documents:

- `docs/03_PRODUCTION_ARCHITECTURE.md` — Target architecture
- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — Approved Platform Stack, Deployment
- `docs/architecture/16_EVENT_STREAMING_SPEC.md` — Event Layers, Required Streams
- `docs/architecture/25_REPOSITORY_TARGET_STRUCTURE.md` — Target Layout

Root cause:

Legacy production architecture chooses Cloud Run, Cloud Tasks, Pub/Sub, Cloud Scheduler, Cloud SQL, and Cloud Storage. Frozen baseline chooses Supabase Edge Functions, Supabase PostgreSQL/PostGIS, Supabase Storage, Supabase Realtime, Redis Streams first, Kafka later, Vercel, and Cloudflare.

Recommended correction:

Designate Supabase/Vercel/Cloudflare/Redis as the current active deployment model. Move Cloud Run/Cloud Tasks/Pub/Sub/Cloud SQL language to an archived `legacy/` folder or add an explicit `SUPERSEDED` banner.

---

## Issue 3 — IAM and JWT Claim Inconsistency

Severity: P0 Critical  
Exact documents:

- `docs/15_SECURITY_AND_RBAC.md` — Identity, Roles, Authorization layers
- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — Organization-First Rule, IAM and Security Baseline
- `docs/adr/ADR-003-ORGANIZATION-FIRST-MULTITENANCY.md`

Root cause:

Legacy security doc says Firebase Auth verifies identity and custom claims may carry coarse role hints. Frozen baseline requires Supabase Auth and JWT custom claims containing `org_id`, `member_id`, `roles`, and `permissions`. ADR-003 requires organization and membership context in JWT claims.

Recommended correction:

Freeze the JWT model as Supabase Auth + IAM custom claims: `org_id`, `member_id`, `roles`, `permissions`, and any future `scoped_orgs` only if formally added by ADR. Remove Firebase ID token and App Check references from active docs.

---

## Issue 4 — Organization Tenancy Model Conflict

Severity: P0 Critical  
Exact documents:

- `docs/07_DATABASE_SCHEMA.md` — Authoritative PostgreSQL domains
- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — Organization-First Rule
- `docs/adr/ADR-003-ORGANIZATION-FIRST-MULTITENANCY.md`

Root cause:

Legacy schema lists flat tables such as `users`, `rider_profiles`, `driver_profiles`, `admin_users`, and `roles_permissions`. Frozen baseline requires `core.organizations`, `core.organization_members`, `core.users`, and `organization_id` on tenant-owned business records.

Recommended correction:

Legacy flat table names must be treated as conceptual only. Active schema work must start with `core.organizations`, `core.organization_members`, and `core.users`, then tenant-owned records must include `organization_id`.

---

## Issue 5 — RLS Inconsistency and Missing RLS Detail

Severity: P0 Critical  
Exact documents:

- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — RLS-First Rule
- `docs/governance/19_ARCHITECTURE_COMPLIANCE_CHECKLIST.md` — RLS Coverage
- `docs/07_DATABASE_SCHEMA.md` — Minimum table design pattern
- `docs/15_SECURITY_AND_RBAC.md` — Authorization layers

Root cause:

Frozen docs require every production table to enable RLS, use default deny posture, explicit policies, pgTAP tests, and organization isolation checks. Legacy schema docs do not include mandatory RLS policy shape or organization-scoped RLS assumptions. Legacy security doc relies on service-owned writes and Firestore rules for projections, not Supabase RLS-first governance.

Recommended correction:

Add a dedicated RLS policy matrix document or expand the baseline with canonical helper functions and policy templates. Legacy schema docs must be superseded or rewritten to include `organization_id` and RLS requirements.

---

## Issue 6 — Workflow Ownership Conflict: Trip State Machine vs Workflow Engine

Severity: P1 High  
Exact documents:

- `docs/08_TRIP_STATE_MACHINE.md` — Statuses, Allowed transition matrix, Transition ownership
- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — Workflow-First Rule
- `docs/adr/ADR-005-WORKFLOW-ENGINE-FIRST.md`
- `docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md` — Workflow Type Rule

Root cause:

Legacy trip state machine defines direct trip statuses and transition ownership by services. Frozen architecture says the workflow engine must exist before trip, driver onboarding, payout, refund, AML, and compliance workflows, and lifecycle state is governed by workflow definitions, transitions, guards, permissions, and logs.

Recommended correction:

Convert the legacy trip state machine into a workflow definition reference. Trip tables should not own lifecycle truth directly; they should reference `workflowInstanceId` and read state from workflow-owned projections/logs.

---

## Issue 7 — Event Architecture Dependency Conflict

Severity: P1 High  
Exact documents:

- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — Audit-First Rule, Event Architecture
- `docs/architecture/16_EVENT_STREAMING_SPEC.md` — Event Layers, Required Streams
- `docs/adr/ADR-006-EVENT-STREAMING.md`
- `docs/architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md` — Phase 4 and Phase 9

Root cause:

Frozen baseline and ADR-006 require outbox-first event publishing and Redis Streams initially for queueing and telemetry. The roadmap puts `integration.outbox_events` in Phase 4 but Redis Streams only in Phase 9, after finance, ops, and compliance. This creates ambiguity over whether high-risk flows before Phase 9 can rely only on outbox or require stream infrastructure.

Recommended correction:

Clarify that Phase 4 delivers the minimum durable outbox and event envelope, while Phase 9 delivers operational Redis Streams for dispatch/telemetry scale. If finance/compliance emit events before Phase 9, their delivery path must be explicitly defined.

---

## Issue 8 — Maker-Checker Dependency Ordering Conflict

Severity: P1 High  
Exact documents:

- `docs/architecture/18_COMPLIANCE_FRAUD_AML.md` — Maker-Checker
- `docs/architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md` — Phase 6 Finance Core, Phase 7 Operations + Maker-Checker, Phase 8 Compliance + AML
- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — Compliance Baseline

Root cause:

Compliance spec requires maker-checker for manual ledger adjustment, refund approval above threshold, payout override, chargeback resolution, AML case closure, DSAR/LER export, and compliance status override. Roadmap implements Finance Core in Phase 6 before Ops + Maker-Checker in Phase 7 and Compliance + AML in Phase 8.

Recommended correction:

Either split maker-checker into a minimal approval foundation before finance-sensitive operations, or explicitly prevent manual adjustments, refunds, payouts, chargebacks, DSAR/LER exports, and AML closure until Phase 7/8 are complete.

---

## Issue 9 — Ledger Account Naming Conflict

Severity: P1 High  
Exact documents:

- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — Ledger-First Finance Rule
- `docs/11_PAYMENT_LEDGER_AND_PAYOUTS.md` — Ledger accounts, Example journal patterns
- `docs/adr/ADR-004-LEDGER-FIRST-FINANCE.md`
- `docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md` — Finance Type Rule

Root cause:

All finance docs agree on double-entry and wallet projection. However, account/table names differ: frozen baseline uses `finance.accounts`, `finance.journal_entries`, `finance.ledger_lines`, while legacy finance doc uses `wallet_accounts`, `ledger_journals`, `ledger_entries`, and minimum account names like `rider_receivable`, `psp_clearing`, `driver_payable`.

Recommended correction:

Normalize physical table names to frozen baseline. Treat legacy account names as chart-of-accounts examples, not table names. Add a chart-of-accounts appendix under the finance architecture once approved.

---

## Issue 10 — Audit and Idempotency Location Conflict

Severity: P1 High  
Exact documents:

- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — Audit-First Rule
- `docs/architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md` — Phase 4
- `docs/07_DATABASE_SCHEMA.md` — Payment and ledger, Growth and analytics

Root cause:

Frozen baseline requires `audit.audit_logs`, `audit.idempotency_keys`, and `integration.outbox_events` before business logic. Legacy schema places `provider_webhook_events` under payment/ledger and `audit_logs` under growth and analytics, making audit appear as a later/secondary system rather than a foundational cross-context control.

Recommended correction:

Declare `audit.audit_logs`, `audit.idempotency_keys`, and `integration.outbox_events` as platform foundations. Payment-specific webhook inboxes may exist but must not replace the centralized idempotency/outbox/audit pattern.

---

## Issue 11 — Service Responsibility Duplication

Severity: P1 High  
Exact documents:

- `docs/03_PRODUCTION_ARCHITECTURE.md` — Backend/API services
- `docs/08_TRIP_STATE_MACHINE.md` — Transition ownership
- `docs/11_PAYMENT_LEDGER_AND_PAYOUTS.md` — Payment, Ledger, Payout service responsibilities
- `docs/architecture/25_REPOSITORY_TARGET_STRUCTURE.md` — Supabase functions target layout

Root cause:

Legacy docs define many Cloud Run services: auth-profile, trip, dispatch, pricing, maps-adapter, driver-onboarding, payment, ledger, payout, support, safety, admin, notification, analytics-export. Target structure defines Supabase functions: auth-service, workflow-service, ledger-service, wallet-service, payment-service, dispatch-service, trip-service, driver-service, compliance-service, ops-service, outbox-processor. Names and ownership boundaries overlap but are not mapped.

Recommended correction:

Create a service ownership matrix mapping legacy concepts to approved Supabase Edge Function/service boundaries. Do not implement duplicate services with overlapping authority.

---

## Issue 12 — Compliance Scope Conflict: BSP Readiness vs Product Launch Scope

Severity: P1 High  
Exact documents:

- `docs/architecture/18_COMPLIANCE_FRAUD_AML.md` — Compliance Domains
- `docs/11_PAYMENT_LEDGER_AND_PAYOUTS.md` — MVP stance, Providers to evaluate, SpeedCash rule
- `docs/architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md` — Phases 6–8

Root cause:

Compliance spec includes BSP reporting readiness and AML controls from foundation, while finance legacy doc says do not launch a consumer wallet in MVP. This is not a contradiction if wallet is deferred, but the documents do not clearly state which compliance controls are mandatory for cash trips, PSP trips, wallet-like balances, and future stored value/payout rails.

Recommended correction:

Add a compliance applicability matrix by product mode: cash-only alpha, PSP cashless beta, driver payout, wallet-like stored value, and future remittance/cashout rails.

---

## Issue 13 — Multi-Region Scope Is Too Thin

Severity: P1 High  
Exact documents:

- `docs/architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md` — Phase 18 Multi-Region DR
- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — Deployment, Observability Baseline
- `docs/governance/20_REPOSITORY_GOVERNANCE.md` — Rollback, Production Access Governance

Root cause:

Roadmap mentions standby region, PITR drill, failover runbook, recovery runbook, and quarterly DR test, but there is no multi-region data strategy for Supabase, Redis Streams, event replay, RPO/RTO, storage replication, DNS failover, legal evidence immutability, or finance reconciliation during failover.

Recommended correction:

Before nationwide launch, add a DR design document defining RPO/RTO, standby topology, stream replay strategy, database restore protocol, storage replication, failover authority, and reconciliation after recovery.

---

## Issue 14 — Deployment Governance Contradiction: Main Locked vs Direct Main Commits

Severity: P0 Critical  
Exact documents:

- `docs/governance/20_REPOSITORY_GOVERNANCE.md` — Branch Protection
- `docs/adr/ADR-008-REPOSITORY-GOVERNANCE.md`

Root cause:

Governance says direct pushes to `main` are disabled, PR required, two approvals required, code owner review required, and squash merge only. Current repository permissions allowed direct main commits during remediation. This is operational drift between documented governance and actual repository settings.

Recommended correction:

Configure GitHub branch protection immediately: require PR, require status checks, require CODEOWNERS, block force pushes, block direct pushes, require linear history, and require at least two approvals. This is required before closed beta.

---

## Issue 15 — UI Baseline References Missing Canonical Prototype File

Severity: P2 Medium  
Exact documents:

- `docs/frontend/21_UI_UX_BASELINE_V1.md` — Prototype Preservation

Root cause:

UI baseline says the original prototype must be stored in `docs/frontend/reference/HATID_CANONICAL_PROTOTYPE.tsx` and screenshots in `docs/frontend/reference/screenshots/`. The governance docs define the requirement, but the referenced artifact may not yet exist.

Recommended correction:

Commit the canonical prototype and baseline screenshots. Until then, the UI baseline is directionally frozen but not fully testable.

---

## Issue 16 — Event Naming Conflict: Legacy Dot Events vs Versioned Hatid Envelope

Severity: P2 Medium  
Exact documents:

- `docs/08_TRIP_STATE_MACHINE.md` — Required events
- `docs/architecture/16_EVENT_STREAMING_SPEC.md` — Event Naming, Required Event Envelope

Root cause:

Legacy trip events use names like `trip.requested` and `dispatch.offer_created`. Event streaming spec requires `hatid.{bounded_context}.{event_name}.v{version}` such as `hatid.dispatch.trip_requested.v1`.

Recommended correction:

Treat legacy event names as semantic aliases only. Canonical event names must follow the versioned envelope format.

---

## Issue 17 — Observability Required Everywhere, But Phase Gating Is Not Explicit

Severity: P2 Medium  
Exact documents:

- `docs/architecture/17_OBSERVABILITY_TRACING_SPEC.md` — Required Context Fields, Trace Propagation
- `docs/architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md` — Phase 4 and Phase 16

Root cause:

Observability spec requires every request, event, and background job to carry trace context. Roadmap puts initial OpenTelemetry wrapper in Phase 4 and SRE hardening in Phase 16. The boundary between minimum required instrumentation and later hardening is not explicit.

Recommended correction:

Clarify Phase 4 minimum observability acceptance and Phase 16 hardening acceptance. Do not allow new services before trace/correlation ID propagation exists.

---

## Issue 18 — Compliance Retention Classes Lack Exact Retention Durations

Severity: P2 Medium  
Exact documents:

- `docs/architecture/18_COMPLIANCE_FRAUD_AML.md` — Data Retention
- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md` — Compliance Baseline

Root cause:

Compliance spec lists data classes requiring documented retention, but does not define exact retention durations, deletion/anonymization rules, legal hold override rules, or location fuzzing timelines.

Recommended correction:

Create a retention schedule matrix approved by legal/compliance before closed beta.

---

## Issue 19 — RLS Test Enforcement Exists, But Test Directory Ownership Is Incomplete

Severity: P2 Medium  
Exact documents:

- `docs/governance/19_ARCHITECTURE_COMPLIANCE_CHECKLIST.md` — Mandatory CI/CD Gates
- `docs/architecture/25_REPOSITORY_TARGET_STRUCTURE.md` — Target Layout
- `.github/CODEOWNERS`

Root cause:

Compliance requires pgTAP and RLS tests. Target structure includes `supabase/tests/pgtap`, but the governance docs do not specify exact required pgTAP files per bounded context or coverage threshold.

Recommended correction:

Add pgTAP coverage expectations by context: organization isolation, IAM permission checks, finance immutability, workflow transitions, audit append-only, compliance access.

---

## Issue 20 — Sprint 0B Acceptance Criteria Not Fully Reflected in Current Repo

Severity: P1 High  
Exact documents:

- `docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md` — Acceptance Criteria
- `docs/architecture/25_REPOSITORY_TARGET_STRUCTURE.md` — Target Layout

Root cause:

Sprint 0B requires repo structure, Turborepo v2, enterprise ESLint boundaries, strict TypeScript base config, shared type packages, design tokens, and no Firebase dependency. The current repo has partial cleanup and docs, but the full target monorepo foundation is not yet implemented.

Recommended correction:

Do not mark Sprint 0B complete until the repository structure and governance tooling exist in code, not only documents.

---

# 2. Master Dependency Graph

```text
Repository Governance
  -> Branch Protection
  -> CODEOWNERS
  -> PR Template
  -> CI Quality Gates
  -> ADR Workflow

Architecture Baseline
  -> ADR-001 Firebase Removal
  -> ADR-002 Supabase First
  -> ADR-003 Organization First
  -> ADR-004 Ledger First
  -> ADR-005 Workflow First
  -> ADR-006 Event Streaming
  -> ADR-007 Observability
  -> ADR-008 Repository Governance
  -> ADR-009 UI/UX Baseline

Sprint 0B Foundation
  -> Repository Structure
  -> TypeScript Strict Config
  -> ESLint Boundaries
  -> Design Tokens
  -> Shared Types
  -> Quality Gates

Firebase Eradication
  -> Supabase Auth Shell
  -> Supabase Environment Variables
  -> Vercel Deployment Shell

Organization Foundation
  -> core.organizations
  -> core.users
  -> core.organization_members

IAM Foundation
  -> iam.roles
  -> iam.permissions
  -> iam.role_permissions
  -> iam.member_roles
  -> JWT Custom Claims
  -> RLS Helper Functions

Security Foundation
  -> RLS Policies
  -> pgTAP Tests
  -> MFA/Admin Controls
  -> Secret Governance
  -> Rate Limiting

Audit / Idempotency / Outbox Foundation
  -> audit.audit_logs
  -> audit.idempotency_keys
  -> integration.outbox_events
  -> Correlation IDs
  -> Trace IDs

Workflow Foundation
  -> workflow.definitions
  -> workflow.states
  -> workflow.transitions
  -> workflow.guards
  -> workflow.actions
  -> workflow.instances
  -> workflow.transition_logs

Finance Foundation
  -> finance.accounts
  -> finance.journal_entries
  -> finance.ledger_lines
  -> finance.wallet_balance_projection
  -> finance.account_balance_snapshots
  -> Reconciliation Tables

Ops Approval Foundation
  -> ops.approval_queue
  -> Maker-Checker Workflows

Compliance Foundation
  -> KYC
  -> AML Rules
  -> AML Alerts
  -> STR Reports
  -> DSAR/LER
  -> Evidence Holds

Event Streaming
  -> Redis Streams
  -> DLQ
  -> Replay
  -> Backpressure
  -> Kafka Later

Fleet Foundation
  -> Driver Profiles
  -> Vehicles
  -> Documents
  -> Eligibility Workflow

Dispatch Foundation
  -> PostGIS
  -> H3
  -> Driver Location
  -> Dispatch Requests
  -> Dispatch Offers
  -> Anti-Spoofing

Trip Lifecycle
  -> Workflow Instance
  -> Dispatch Assignment
  -> Finance Ledger Hooks
  -> Audit Logs
  -> Events

Apps
  -> Rider App
  -> Driver App
  -> Admin Portal

Operations / SRE
  -> Dashboards
  -> Alerts
  -> Runbooks
  -> Error Budgets
  -> Load Tests
  -> DR Tests
```

# 3. Master Service Graph

```text
Frontend Apps
  -> API Gateway / Cloudflare
  -> Supabase Edge Function Boundary

Supabase Edge Functions
  auth-service
    -> Supabase Auth
    -> IAM Context
    -> Audit

  workflow-service
    -> workflow schema
    -> IAM guards
    -> Audit
    -> Outbox

  ledger-service
    -> finance.accounts
    -> finance.journal_entries
    -> finance.ledger_lines
    -> Audit
    -> Outbox

  payment-service
    -> provider webhook inbox
    -> ledger-service
    -> reconciliation
    -> Audit
    -> Outbox

  dispatch-service
    -> PostGIS
    -> H3
    -> Redis Streams
    -> trip-service
    -> Audit
    -> Outbox

  trip-service
    -> workflow-service
    -> dispatch-service
    -> ledger-service
    -> Audit
    -> Outbox

  driver-service
    -> fleet records
    -> compliance KYC
    -> workflow-service
    -> Audit

  compliance-service
    -> KYC
    -> AML
    -> DSAR/LER
    -> ops approval queue
    -> Audit

  ops-service
    -> approval queue
    -> maker-checker
    -> audit logs

  outbox-processor
    -> integration.outbox_events
    -> Redis Streams
    -> external providers
    -> DLQ
```

# 4. Master Event Graph

```text
Business Command
  -> Application Service
  -> DB Transaction
      -> State Change
      -> Audit Log
      -> Idempotency Record
      -> Outbox Event
  -> Commit
  -> Outbox Processor
  -> Event Envelope
      event_id
      event_name
      event_version
      organization_id
      actor_id
      correlation_id
      trace_id
      occurred_at
      payload
  -> Redis Stream / Delivery Channel
  -> Consumer
  -> External Provider / Projection / Notification / Analytics
  -> DLQ on failure
  -> Replay with operator approval
```

Canonical naming:

```text
hatid.{bounded_context}.{event_name}.v{version}
```

Legacy names such as `trip.requested` must be treated as aliases only.

# 5. Master Workflow Graph

```text
Workflow Definition
  -> States
  -> Transitions
  -> Guards
  -> Permissions
  -> Actions
  -> Instance
  -> Transition Log
  -> Audit Log
  -> Outbox Event

Workflow-owned domains:
  Trip Lifecycle
  Driver Onboarding
  Payout Approval
  Refund Approval
  Chargeback Investigation
  AML Investigation
  DSAR/LER Extraction
  Disaster Recovery Authorization
```

Rule:

Domain entities may reference workflow instances but must not become the source of truth for lifecycle state when workflow governance applies.

# 6. Master Security Model

```text
Supabase Auth
  -> User Identity
  -> Custom Claims
      org_id
      member_id
      roles
      permissions
  -> IAM Context
      roles
      permissions
      role_permissions
      member_roles
  -> RLS Helper Functions
  -> RLS Policies
  -> Application Service Authorization
  -> Audit Logs
  -> Security Events
```

Security invariants:

- No UI-only authorization.
- No table without RLS.
- No production table without pgTAP coverage.
- No direct production DB credentials.
- No shared admin accounts.
- All high-risk admin actions require audit.
- Financial and compliance high-risk actions require maker-checker.

# 7. Master Finance Model

```text
Payment Intent / Payout / Refund Command
  -> Idempotency Key
  -> Provider Verification
  -> Journal Entry
  -> Ledger Lines
  -> Balance Projection
  -> Reconciliation
  -> Audit Log
  -> Outbox Event
```

Source of truth:

- `finance.accounts`
- `finance.journal_entries`
- `finance.ledger_lines`

Projection only:

- `finance.wallet_balance_projection`
- `finance.account_balance_snapshots`

Forbidden:

- mutable wallet balance as source of truth
- single-entry accounting
- update/delete of posted journal entries
- update/delete of posted ledger lines
- admin direct balance edit

# 8. Master Deployment Model

Approved active model:

```text
Vercel
  -> Next.js frontend/admin shell

Cloudflare / WAF / API Gateway
  -> Rate limiting
  -> API protection

Supabase
  -> Auth
  -> PostgreSQL/PostGIS
  -> Storage
  -> Realtime
  -> Edge Functions

Redis Streams
  -> Dispatch queues
  -> Telemetry ingress
  -> DLQ/replay

Kafka
  -> Future scale option only

GitHub Actions
  -> CI/CD
  -> Quality gates
```

Legacy model to supersede:

```text
Firebase Auth
Firestore projections
Firebase App Hosting
Cloud Run
Cloud Tasks
Pub/Sub
Cloud Scheduler
Cloud SQL
Cloud Storage
```

# 9. Master Operations Model

```text
Repository Governance
  -> PR Review
  -> CODEOWNERS
  -> Required Checks
  -> ADR Enforcement

Runtime Operations
  -> Observability
  -> SLOs
  -> Error Budgets
  -> Dashboards
  -> Alerts
  -> Runbooks

Finance Operations
  -> Reconciliation
  -> Exceptions
  -> Maker-Checker
  -> Ledger Audit

Compliance Operations
  -> KYC Review
  -> AML Cases
  -> STR Reports
  -> DSAR/LER
  -> Evidence Holds

Incident Operations
  -> SEV Classification
  -> On-call
  -> Postmortem
  -> Roll-forward Fix
  -> DR Drill
```

---

# 10. Scores

| Area | Score | Reason |
|---|---:|---|
| Architecture Score | 82/100 | Frozen corpus is strong, but legacy docs still contradict it. |
| Implementation Readiness Score | 54/100 | Governance docs exist, but repo structure, Supabase migrations, RLS, workflow, ledger, and CI enforcement are incomplete. |
| Security Score | 63/100 | Security direction is strong, but legacy Firebase/App Check model conflicts with Supabase RLS/JWT model. Branch protection is not enforced. |
| Finance Score | 78/100 | Ledger-first principle is consistent, but naming, maker-checker timing, reconciliation scope, and PSP compliance need freezing. |
| Scalability Score | 70/100 | Event streaming, backpressure, DLQ, H3, PostGIS, and Kafka path exist, but roadmap timing and DR strategy are underdefined. |
| Operational Score | 58/100 | SLOs and governance exist, but actual runbooks, ownership files, branch protections, dashboards, and incident procedures are not implemented. |
| Compliance Score | 66/100 | Compliance scope is mature, but retention schedules, BSP applicability, DSAR/LER implementation details, and maker-checker ordering remain gaps. |

---

# 11. Launch Gate Gap Analysis

## Internal Alpha Blockers

- Supersede or archive legacy Firebase/hybrid docs.
- Enforce branch protection and CODEOWNERS.
- Regenerate dependency lockfile after platform cleanup.
- Implement Sprint 0B repository structure.
- Add TypeScript strict base config and ESLint boundary rules.
- Add Supabase environment template.
- Add minimum organization schema.
- Add no-Firebase CI check.
- Add canonical prototype file referenced by UI baseline.

## Closed Beta Blockers

- Supabase Auth integration.
- Organization-first tenancy implemented.
- IAM roles/permissions implemented.
- JWT claims frozen and tested.
- RLS enabled and pgTAP-tested on all production tables.
- Audit, idempotency, and outbox foundation implemented.
- Workflow engine implemented.
- Ledger core implemented and tested.
- Maker-checker minimum implementation.
- Basic observability and structured logging.
- Privacy retention matrix.

## Metro Manila Launch Blockers

- Dispatch core with PostGIS/H3.
- Driver eligibility and onboarding workflow.
- PSP webhook verification.
- Reconciliation jobs.
- Refund/reversal path.
- Payout failure path.
- Safety/SOS workflow.
- Admin operations console.
- Compliance/KYC review queue.
- Incident runbooks.
- Load test for Metro Manila concurrency.

## Nationwide Launch Blockers

- Regional service area governance.
- Operational staffing model.
- Compliance escalation process.
- Data retention automation.
- Monitoring dashboards and SLO enforcement.
- DR drill completed.
- Multi-region or warm standby plan approved.
- Cost model per trip and per active driver.
- Event streaming backpressure tested.

## 100k Drivers Blockers

- Scalable driver location ingestion.
- Driver status partitioning strategy.
- H3 sharding strategy.
- Redis Streams consumer scaling.
- Anti-spoofing at telemetry scale.
- KYC document review scaling.
- Driver support queue scaling.
- Driver payout batch scalability.
- Compliance and fraud monitoring at driver population scale.

## 1M Daily Trips Blockers

- Queue depth and backpressure tested beyond launch thresholds.
- PostgreSQL partitioning for trips, location, audit, ledger, events.
- Read replica strategy.
- Reconciliation scale tests.
- Kafka migration trigger criteria.
- Event replay and DLQ operational tooling.
- SLO and error budget automation.
- Multi-region DR and failover drills.
- Cost-per-trip FinOps model.
- Incident command model for nationwide outages.

---

# 12. Final Recommendation

Do not start feature implementation yet.

Next correct sequence:

1. Declare frozen architecture documents as the only active source of truth.
2. Mark legacy docs as superseded or move them to `docs/legacy/`.
3. Resolve the roadmap ordering issues around event streaming, maker-checker, workflow, and compliance.
4. Enforce repository governance in GitHub settings.
5. Complete Sprint 0B foundation.
6. Freeze documents.
7. Start implementation.
