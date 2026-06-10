# Hatid Codex Implementation Instructions

Document ID: 28_CODEX_IMPLEMENTATION_INSTRUCTIONS  
Status: Mandatory  
Applies to: Codex, AI agents, automation, and AI-assisted contributors

## Required Reading

Before planning or changing the repository:

1. Read `docs/README.md` and its active architecture list.
2. Read `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md`.
3. Read all approved ADRs relevant to the task.
4. Read `docs/governance/26_FINAL_ARCHITECTURE_GOVERNANCE_AUDIT.md` and use it as the checklist for remaining conflicts.
5. Read `docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md` before implementation work.

## Mandatory Instructions

1. Do not invent architecture.
2. Do not reintroduce Firebase, including Firebase Auth, Firestore, Firebase hosting, functions, storage, realtime database, client SDK, or Admin SDK.
3. Do not use documents under `docs/legacy/` as authority.
4. Do not start product features before the Sprint 0B foundation is complete and evidenced.
5. Do not create or treat a wallet balance as financial source of truth. Wallet and account balances are projections of the double-entry ledger.
6. Do not create trip status as independent lifecycle truth outside the workflow engine.
7. Do not create a tenant-owned table without `organization_id`.
8. Do not create a production table without default-deny RLS and required pgTAP coverage.
9. Do not create finance mutation paths outside the ledger service.
10. Do not bypass audit, outbox, or idempotency controls.
11. Do not bypass CODEOWNERS, pull-request review, required checks, or branch governance.
12. If implementation reveals a real architecture conflict, stop the conflicting implementation and update the governing documentation through the ADR process.
13. Use the Final Architecture Governance Audit as the checklist for unresolved architecture and governance conflicts.

## Sequencing Guard

Sprint 0B is the only approved next implementation phase. Do not mark it complete based on documentation alone, and do not proceed to later phases until its acceptance evidence exists.

## Conflict Handling

Do not resolve conflicts by blending old and new architecture. Architecture Baseline V1, approved ADRs, and the Final Architecture Governance Audit take precedence over superseded documents, stale code, and historical configuration.
