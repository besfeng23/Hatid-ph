# Hatid Sprint 0B Governance Priority

Document ID: 27_SPRINT_0B_GOVERNANCE_PRIORITY  
Status: Active Sprint 0B merge gate  
Scope: Repository governance before feature implementation

## Active architecture rule

Supabase/PostgreSQL is the production source of truth.

Firebase/Firestore must not be introduced for production-critical flows. Existing Firebase references in legacy documents are historical only unless they are explicitly marked as legacy. They do not override the approved Supabase-first baseline.

Hatid remains a prototype. Governance documents, scaffolds, tests, or passing builds alone do not prove production readiness.

## Sprint 0B priority order

Work must proceed in this order:

1. Remediate the tracked security audit baseline.
2. Enable branch protection and required verification checks on `main`.
3. Complete the remaining repository, Supabase/PostgreSQL, RLS, environment, test, and QA foundations.
4. Begin feature PRs only after the applicable foundations and merge gates are complete.

## Merge gates

- The security audit baseline must be remediated before auth, payment, wallet, payout, KYC, driver approval, or admin-authority work proceeds.
- Branch protection must be enabled before any high-risk PR is merged.
- Feature PRs for rider, driver, dispatch, wallet, payment, payout, KYC, or admin behavior must wait until their required foundations are complete.
- No PR may introduce Firebase/Firestore as an active production platform or production-critical source of truth.
- No prototype, mocked flow, documentation set, CI result, or UI state may be described as production-ready.

## Current issue order

- Issue #22: remediate the npm audit high-severity dependency baseline.
- Issues #17 and #21: consolidate the duplicate branch-protection work and enable required checks.
- Issue #19: complete manual route QA and regression checks.
- Issue #18: configure Supabase and Vercel environment variables without exposing secrets.
- Issue #16 and later feature work: wait until the applicable security, branch-protection, data, RLS, helper, environment, and QA gates are complete.

This note governs current Sprint 0B sequencing. More detailed architecture and implementation documents remain applicable when they do not conflict with this priority order.
