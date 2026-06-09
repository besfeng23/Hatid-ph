# Hatid Latest Consolidated Documentation Pack

Status: Latest consolidated baseline  
Stack: GitHub + Supabase + Vercel  
Firebase: Removed / deprecated  
Architecture status: Frozen unless changed by approved ADR  
Implementation status: Start with Sprint 0B governance foundation, then Firebase eradication, then organization/IAM/audit/workflow/finance foundations.

## What this pack contains

This pack consolidates the latest decisions from the architecture, governance, frontend baseline, repository governance, and implementation readiness discussions.

Primary documents:

1. `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md`
2. `docs/architecture/16_EVENT_STREAMING_SPEC.md`
3. `docs/architecture/17_OBSERVABILITY_TRACING_SPEC.md`
4. `docs/architecture/18_COMPLIANCE_FRAUD_AML.md`
5. `docs/governance/19_ARCHITECTURE_COMPLIANCE_CHECKLIST.md`
6. `docs/governance/20_REPOSITORY_GOVERNANCE.md`
7. `docs/frontend/21_UI_UX_BASELINE_V1.md`
8. `docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md`
9. `docs/governance/23_FIREBASE_ERADICATION_PLAN.md`
10. `docs/architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md`
11. `docs/architecture/25_REPOSITORY_TARGET_STRUCTURE.md`

Governance artifacts:

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/CODEOWNERS`
- `.github/workflows/quality-gates.yml`

ADR examples:

- `docs/adr/ADR-001-REMOVE-FIREBASE.md`
- `docs/adr/ADR-002-SUPABASE-FIRST.md`
- `docs/adr/ADR-003-ORGANIZATION-FIRST-MULTITENANCY.md`
- `docs/adr/ADR-004-LEDGER-FIRST-FINANCE.md`
- `docs/adr/ADR-005-WORKFLOW-ENGINE-FIRST.md`
- `docs/adr/ADR-006-EVENT-STREAMING.md`
- `docs/adr/ADR-007-OBSERVABILITY-OPENTELEMETRY.md`
- `docs/adr/ADR-008-REPOSITORY-GOVERNANCE.md`
- `docs/adr/ADR-009-CANONICAL-UI-UX.md`

## Non-negotiable implementation order

1. Sprint 0B repository governance foundation.
2. Firebase eradication.
3. Organization foundation.
4. IAM, JWT claims, RBAC, RLS, pgTAP.
5. Audit, idempotency, outbox.
6. Workflow engine.
7. Finance ledger core.
8. Event streaming foundation.
9. Dispatch foundation.
10. Trip lifecycle.
11. Rider app.
12. Driver app.
13. Admin portal.
14. Observability/SRE hardening.
15. Scale and disaster recovery hardening.

## Critical warning

Do not build dispatch, wallet UI, rider app screens, or driver app screens before organization, IAM, audit, workflow, and ledger foundations exist.

The repository must enforce architecture before implementation begins.
