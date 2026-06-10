# SUPERSEDED DOCUMENT

This document is preserved for historical reference only.

It is NOT an active architecture source of truth.

Active authority is:

* `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md`
* `docs/governance/26_FINAL_ARCHITECTURE_GOVERNANCE_AUDIT.md`
* `docs/adr/ADR-001-REMOVE-FIREBASE.md`
* `docs/adr/ADR-002-SUPABASE-FIRST.md`
* `docs/adr/ADR-003-ORGANIZATION-FIRST-MULTITENANCY.md`
* `docs/adr/ADR-004-LEDGER-FIRST-FINANCE.md`
* `docs/adr/ADR-005-WORKFLOW-ENGINE-FIRST.md`
* `docs/adr/ADR-006-EVENT-STREAMING.md`
* `docs/adr/ADR-007-OBSERVABILITY-OPENTELEMETRY.md`
* `docs/adr/ADR-008-REPOSITORY-GOVERNANCE.md`
* `docs/adr/ADR-009-CANONICAL-UI-UX.md`

If this document conflicts with the active architecture baseline, the active baseline wins.

---

# Current Repo Audit

## Verdict

Hatid is a prototype, not an MVP, beta, or production-ready transport platform.

The current repo has a polished-looking Next.js/Firebase shell, but the actual transport, dispatch, payment, payout, fare, safety, and admin authority are not production systems yet. The app can demo a concept. It cannot safely operate live rides, driver payouts, wallets, or regulated transport workflows.

## Observed stack

- Next.js 15 app router
- React 19
- Firebase client SDK
- Firebase Auth
- Firestore client SDK
- Genkit/Google GenAI files
- Tailwind/Radix UI components
- Firebase App Hosting config

## Immediate repo signals

- `package.json` still uses the starter name `nextn`.
- `README.md` is still Firebase Studio starter copy unless updated after this audit.
- `next.config.ts` ignores TypeScript and ESLint build failures. That must be removed before production claims.
- Firebase client config is committed in `src/firebase/config.ts`. Public Firebase config is not automatically a secret, but key restriction, App Check, and environment discipline are still required.

## What is real

- Next.js app shell.
- Firebase Auth integration foundation.
- Auth guard pattern.
- User profile page foundation.
- Driver dashboard UI foundation.
- Payment/wallet page UI foundation.
- Firestore rules file with serious intent.
- Genkit/AI flow files.
- Some Firestore read/write helpers.

## What is mock/demo/fake

- Ride request defaults are hardcoded.
- Ride options/prices/ETAs are hardcoded.
- Driver matching is simulated with random acceptance.
- Confirmed driver is fake/static.
- Map is placeholder imagery plus SVG animation, not real map/routing/location.
- Payment success is simulated.
- Wallet/cash-out behavior is simulated.
- Driver online/offline state is local only.
- Weekly earnings are randomly generated.
- Trip history is hardcoded.
- AI recommendation components use mock data rather than live user/trip context.

## Dangerous if left ambiguous

- Any UI copy implying real driver matching.
- Any UI copy implying real card charging/payment success.
- Any wallet balance/cash-out flow that looks operational.
- Any driver earning or payout screen not clearly marked demo/mock.
- Any client-side trip completion or payment completion action being treated as production behavior.
- Any build config that suppresses lint or TypeScript failures.

## Missing production systems

- No authoritative backend trip service.
- No production trip state machine.
- No real dispatch service.
- No real driver availability/location ingest service.
- No real driver onboarding/verification backend.
- No real payment provider integration.
- No double-entry ledger.
- No payout/reconciliation service.
- No production admin console backend.
- No safety/SOS incident backend.
- No real maps/geocoding/routing/fare engine.
- No audit-log authority.
- No staging/prod separation documentation.
- No secrets/key management plan.
- No Firestore rules tests observed.
- No production data-retention/privacy plan implemented.

## Production-readiness score

| Area | Score | Reason |
|---|---:|---|
| UI shell | 65/100 | Looks usable as demo UI. |
| Auth foundation | 40/100 | Firebase Auth exists, but flow correctness and role model need work. |
| Trip authority | 5/100 | Mostly client/demo state. |
| Dispatch | 0/100 | No real dispatch engine. |
| Payments/wallet | 5/100 | UI only; no provider, ledger, webhooks, or reconciliation. |
| Driver operations | 10/100 | Dashboard only; no real onboarding/availability. |
| Safety | 5/100 | Buttons/UI only; no real incident system. |
| Admin/ops | 5/100 | No real operations console. |
| Compliance/privacy | 15/100 | Some Firestore-rule intent, but no governance implementation. |
| Production infrastructure | 20/100 | Basic hosting config, but no backend/service boundary. |

## Phase 0 cleanup targets

1. Rename package from `nextn` to `hatid` or `hatid-core`.
2. Rewrite README away from Firebase Studio starter copy.
3. Remove TypeScript/ESLint build suppression.
4. Rename/move mock data into `/src/lib/demo`.
5. Replace fake payment wording with demo-only copy.
6. Add docs/source package before further implementation.
7. Add explicit production boundary types for trips, payments, ledger, dispatch, and driver verification.

## Rule

No future code should make the current demo flows look production-real until backend authority, ledger, dispatch, and compliance systems exist.
