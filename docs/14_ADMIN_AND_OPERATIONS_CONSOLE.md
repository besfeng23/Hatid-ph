# Admin and Operations Console

## Rule

The admin console is not optional. Ride-hailing is an operations business. Admin actions must be role-limited, reason-coded, and audit-logged.

## MVP admin modules

- dashboard
- live trips list
- manual dispatch fallback
- driver verification queue
- driver management
- rider management
- vehicle management
- support tickets
- disputes
- safety/SOS queue
- payment view
- refund review
- audit log viewer
- role management baseline

## Later modules

- fleet management
- merchant/delivery operations
- payout batching
- reconciliation dashboard
- fraud review console
- promo configuration
- pricing/service-area configuration
- system health dashboard
- analytics/BI dashboards

## Admin roles

- `support_agent`
- `dispatcher`
- `driver_reviewer`
- `safety_agent`
- `finance_agent`
- `fraud_reviewer`
- `ops_manager`
- `admin`
- `security_admin`

## Permission boundaries

| Role | Can do | Must not do |
|---|---|---|
| support_agent | view own queue, respond to tickets | approve payouts, edit ledger, view all KYC |
| dispatcher | view live trips, manual dispatch | edit payments, approve drivers |
| driver_reviewer | review driver docs/vehicles | edit ledger, refund, dispatch override |
| safety_agent | handle SOS/incidents | change pricing, edit payout bank details |
| finance_agent | review payments/refunds/payouts | direct balance edit, safety closure |
| security_admin | manage roles/access logs | alter trip/payment facts without process |

## Required audit fields

- actor ID
- role
- action
- resource type/id
- before/after snapshot or reference
- reason code
- request IP/device/session
- timestamp
- approval chain if required

## Manual dispatch rule

Manual dispatch must validate driver eligibility and create an audit event. It must not bypass driver document, vehicle, suspension, or active-trip checks.

## Finance controls

Finance can initiate reviewed workflows. Finance cannot directly mutate balances. Refunds, payout retries, ledger adjustments, and reconciliation resolutions must post controlled ledger entries.

## Launch blocker

If operations cannot see live trips, support cases, driver verification state, payment state, refund state, and audit logs, Hatid is not production ready.
