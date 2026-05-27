# Analytics and AI Plan

## Rule

AI is later. Analytics comes after the operational event stream is clean. Do not use AI to hide weak dispatch, weak payments, missing support workflows, or missing compliance.

## Analytics foundations

Hatid needs separate event streams for:

- product analytics
- trip operations
- dispatch performance
- payment/ledger events
- payout/reconciliation events
- support/dispute events
- safety/SOS events
- driver onboarding/compliance events
- admin/audit events

Do not dump everything into one ungoverned event stream.

## MVP analytics

- signup/login funnel
- quote request funnel
- quote acceptance rate
- search-to-match time
- dispatch offer acceptance/expiry rate
- cancellation rate by state
- completed trip count
- support ticket volume
- payment attempt success/failure
- driver online time
- driver document expiry alerts

## BigQuery usage

BigQuery is for analytics and reporting, not production command authority. Data should flow through Pub/Sub/export jobs after authoritative events are written.

## AI feature staging

| Feature | Stage | Human review |
|---|---|---|
| destination suggestions | later | optional/opt-in |
| support ticket summarization | later | required before sending to user |
| demand forecasting | later | ops review |
| promo targeting | later | growth/finance review |
| fraud/risk scoring | much later | mandatory for adverse action |
| safety incident summarization | much later | mandatory |
| driver approval/rejection automation | do not automate | human decision required |
| refund liability decision | do not automate | human/finance decision required |
| payout approval | do not automate silently | finance control required |

## AI governance rules

- AI may summarize, classify, suggest, and assist.
- AI must not silently decide suspensions, driver approvals, refund liability, payout approval, safety closure, legal outcomes, or fraud punishment.
- Sensitive AI use needs logged inputs/outputs, model version, confidence, and human override.
- Do not include raw restricted data in prompts unless a documented and approved safety/compliance use case exists.

## Required AI record fields

- feature name
- model version
- input summary reference
- output
- confidence or score
- human reviewer if applicable
- decision/outcome link
- user consent/eligibility where applicable
- retention class

## What not to build yet

- AI dispatch optimizer
- automated fraud bans
- AI driver approval
- AI safety closure
- AI refund decisions
- AI-generated pricing/surge without review
