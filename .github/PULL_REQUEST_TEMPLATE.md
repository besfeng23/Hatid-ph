# Hatid Pull Request

## Summary

Describe the change.

## Bounded Context

Select affected context:

- [ ] core
- [ ] iam
- [ ] audit
- [ ] integration
- [ ] workflow
- [ ] finance
- [ ] fleet
- [ ] dispatch
- [ ] analytics
- [ ] compliance
- [ ] ops
- [ ] frontend
- [ ] infrastructure
- [ ] docs/governance

## Architecture Compliance

- [ ] I checked this PR against `ARCHITECTURE_BASELINE_V1`.
- [ ] This PR does not violate the frozen architecture.
- [ ] If it changes architecture, an approved ADR is linked.

ADR link:

## Required Checks

- [ ] RLS updated if table changed.
- [ ] pgTAP tests added if table/RLS changed.
- [ ] Event contracts updated if event changed.
- [ ] Workflow definitions/tests updated if workflow changed.
- [ ] Ledger invariants tested if finance changed.
- [ ] Observability added for new services.
- [ ] No secrets or API keys added.
- [ ] Feature flag used for risky logic.
- [ ] UI follows `21_UI_UX_BASELINE_V1`.

## AI Disclosure

AI Assisted: Yes / No

If yes:

- Tool:
- Scope generated:
- Validation performed:

## Test Evidence

Paste test output or CI link.

## Rollback / Roll-forward Plan

Describe rollback or roll-forward strategy.
