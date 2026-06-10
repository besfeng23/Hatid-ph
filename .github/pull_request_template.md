## Summary

Describe the change in plain English.

## ClickUp task

CU-____

Task URL:

## Risk level

Low / Medium / High / Production Critical

## Scope

Check all that apply:

- [ ] UI / UX
- [ ] Rider app
- [ ] Driver app
- [ ] Admin app
- [ ] Auth / identity
- [ ] Supabase / database
- [ ] Payments / wallet / ledger
- [ ] Dispatch / trips
- [ ] Safety / compliance
- [ ] CI / tooling
- [ ] Docs / architecture

## Guardrails

- [ ] I did not redesign the canonical Hatid UI without approval.
- [ ] I did not add fake live money movement, wallet balances, payouts, or payment success states.
- [ ] I did not add client-authoritative trip, dispatch, driver availability, wallet, payout, KYC, or compliance logic.
- [ ] I did not reintroduce Firebase app dependencies.
- [ ] I did not expose server-only secrets to client code.
- [ ] I confirm this PR does not rely on mock data as production truth.

## Validation

Paste the commands run and results:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

## Architecture impact

- Does this change require an ADR? Yes / No
- Does this change touch Sprint 0B foundation? Yes / No
- Does this change affect production-readiness claims? Yes / No

Explain any yes answers here.

## Screenshots / logs

Add screenshots for UI changes and logs for build or migration changes.

## Deployment impact

Explain deployment impact, environment variables, migrations, and rollback plan.

## Remaining risks

List known risks and unresolved questions.
