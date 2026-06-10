# Hatid Documentation Authority

This index defines the active documentation hierarchy for Hatid. Hatid is Supabase-first, and Firebase is prohibited. Documents not identified as active authority here must not override the frozen architecture baseline or approved ADRs.

## Current Architecture Authority

The following documents are the active architecture source of truth:

- [`architecture/00_ARCHITECTURE_BASELINE_V1.md`](architecture/00_ARCHITECTURE_BASELINE_V1.md)
- [`architecture/16_EVENT_STREAMING_SPEC.md`](architecture/16_EVENT_STREAMING_SPEC.md)
- [`architecture/17_OBSERVABILITY_TRACING_SPEC.md`](architecture/17_OBSERVABILITY_TRACING_SPEC.md)
- [`architecture/18_COMPLIANCE_FRAUD_AML.md`](architecture/18_COMPLIANCE_FRAUD_AML.md)
- [`architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md`](architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md)
- [`architecture/25_REPOSITORY_TARGET_STRUCTURE.md`](architecture/25_REPOSITORY_TARGET_STRUCTURE.md)

## Frozen ADRs

The following approved ADRs are frozen implementation constraints:

- [`adr/ADR-001-REMOVE-FIREBASE.md`](adr/ADR-001-REMOVE-FIREBASE.md)
- [`adr/ADR-002-SUPABASE-FIRST.md`](adr/ADR-002-SUPABASE-FIRST.md)
- [`adr/ADR-003-ORGANIZATION-FIRST-MULTITENANCY.md`](adr/ADR-003-ORGANIZATION-FIRST-MULTITENANCY.md)
- [`adr/ADR-004-LEDGER-FIRST-FINANCE.md`](adr/ADR-004-LEDGER-FIRST-FINANCE.md)
- [`adr/ADR-005-WORKFLOW-ENGINE-FIRST.md`](adr/ADR-005-WORKFLOW-ENGINE-FIRST.md)
- [`adr/ADR-006-EVENT-STREAMING.md`](adr/ADR-006-EVENT-STREAMING.md)
- [`adr/ADR-007-OBSERVABILITY-OPENTELEMETRY.md`](adr/ADR-007-OBSERVABILITY-OPENTELEMETRY.md)
- [`adr/ADR-008-REPOSITORY-GOVERNANCE.md`](adr/ADR-008-REPOSITORY-GOVERNANCE.md)
- [`adr/ADR-009-CANONICAL-UI-UX.md`](adr/ADR-009-CANONICAL-UI-UX.md)

Architecture changes require a new or superseding approved ADR. Implementation work must not silently change these decisions.

## Governance Documents

The active governance documents are:

- [`governance/19_ARCHITECTURE_COMPLIANCE_CHECKLIST.md`](governance/19_ARCHITECTURE_COMPLIANCE_CHECKLIST.md)
- [`governance/20_REPOSITORY_GOVERNANCE.md`](governance/20_REPOSITORY_GOVERNANCE.md)
- [`governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md`](governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md)
- [`governance/23_FIREBASE_ERADICATION_PLAN.md`](governance/23_FIREBASE_ERADICATION_PLAN.md)
- [`governance/26_FINAL_ARCHITECTURE_GOVERNANCE_AUDIT.md`](governance/26_FINAL_ARCHITECTURE_GOVERNANCE_AUDIT.md)
- [`governance/27_ARCHITECTURE_FREEZE_NOTICE.md`](governance/27_ARCHITECTURE_FREEZE_NOTICE.md)
- [`governance/28_CODEX_IMPLEMENTATION_INSTRUCTIONS.md`](governance/28_CODEX_IMPLEMENTATION_INSTRUCTIONS.md)

## Frontend/UI Authority

The canonical frontend and UI/UX authority is:

- [`frontend/21_UI_UX_BASELINE_V1.md`](frontend/21_UI_UX_BASELINE_V1.md)

Frontend implementation must conform to that baseline unless an approved ADR changes it.

## Legacy Documents

Documents under [`legacy/`](legacy/) are superseded and preserved only for historical reference. They are not an active architecture source of truth.

No implementation, migration, service, user interface, pull request, or AI-generated change may cite a legacy document as authority. A legacy document may be consulted only to understand repository history.

## Conflict Resolution Rule

If any document, code comment, issue, task, or implementation plan conflicts with active authority, resolve the conflict in this order:

1. `architecture/00_ARCHITECTURE_BASELINE_V1.md` (Architecture Baseline V1)
2. Approved ADRs in `adr/`
3. `governance/26_FINAL_ARCHITECTURE_GOVERNANCE_AUDIT.md` (Final Governance Audit)

The active authority wins over every superseded or legacy document. Do not blend conflicting architectures.

## Implementation Start Rule

Implementation must begin with Sprint 0B as defined in [`governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md`](governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md).

Sprint 0B is the only approved next implementation phase. Its completion must be demonstrated by the required repository structure, tooling, governance, and checks; this documentation cleanup does not mark Sprint 0B complete.
