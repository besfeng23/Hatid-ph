# Hatid Architecture Compliance & Quality Gates

Document ID: 19_ARCHITECTURE_COMPLIANCE_CHECKLIST  
Status: Mandatory PR Governance  
Scope: Pull requests, CI/CD gates, architecture drift prevention

## Definition of Done

Every PR affecting production code must satisfy:

- [ ] Architecture Baseline Compliance: PR does not violate `ARCHITECTURE_BASELINE_V1`. If it does, an approved Drift ADR is linked.
- [ ] Bounded Context Alignment: PR clearly identifies affected bounded context.
- [ ] ADR Linkage: System design changes link to approved ADR.
- [ ] Organization/Tenant Isolation: New tables, services, and endpoints are organization-scoped.
- [ ] RLS Coverage: Database table changes include RLS policy and pgTAP tests.
- [ ] Workflow Compliance: Workflow-enabled domains update definitions, transitions, guards, permissions, and tests.
- [ ] Event Contract Validation: Event changes update event schema, versioning, and compatibility tests.
- [ ] Financial Integrity: Finance changes prove debit/credit balance and ledger immutability.
- [ ] Ledger Immutability: No update/delete against posted journals or ledger lines.
- [ ] Observability Coverage: New services include logs, traces, metrics, health checks, and alert thresholds.
- [ ] Dependency Hygiene: New packages reviewed for security, maintenance, license, and bundle impact.
- [ ] Secrets: No hardcoded credentials or API keys.
- [ ] Feature Flag: New high-risk logic is behind a feature flag.
- [ ] Migration Governance: All schema changes use versioned SQL migrations. No direct production DB edits.
- [ ] Test Coverage: Unit/integration/pgTAP/E2E tests updated where applicable.

## Mandatory CI/CD Gates

| Gate | Requirement | Enforcement |
|---|---|---|
| Type Safety | no `any`, no `ts-ignore` | TypeScript/ESLint failure |
| Bounded Context Imports | no illegal cross-context imports | ESLint boundaries |
| Formatting | strict Prettier | `prettier --check` |
| RLS Tests | pgTAP passes | `pg_prove` |
| Finance Tests | ledger balance invariants pass | unit + pgTAP |
| Dependency Security | no high/critical vulnerabilities | audit scan |
| Secrets | no leaked secrets | secret scanning |
| Bundle Budget | mobile bundle increase under threshold | CI budget check |
| Event Contracts | version compatibility | contract tests |
| Observability | required instrumentation | test/lint check where possible |

## Architecture Drift Protocol

A Drift ADR is required for deviation from baseline.

Drift ADR must include:

1. Original architecture rule.
2. Why original rule is inadequate.
3. Proposed deviation.
4. Security impact.
5. Financial impact.
6. Operational impact.
7. Rollback plan.
8. Approval.

## Regular Audits

Bi-weekly:

- ledger integrity
- RLS coverage
- pgTAP coverage
- dependency drift
- event contract drift
- architecture drift

Weekly:

- secret scanning
- dependency vulnerability scan
- PII log scan
- admin access anomaly review

## Ownership

Every service/package/bounded-context directory must have an OWNER file or CODEOWNERS mapping.

Domain owners must approve changes to their context.

Cross-context PRs require all affected owners.
