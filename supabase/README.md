# Hatid Supabase Foundation

This folder contains the Supabase foundation for Hatid Sprint 0B.

## Rules

- Do not commit real secrets.
- Do not expose service-role keys to the browser.
- Assume row-level security is required for every table.
- Keep auth, profiles, trips, dispatch, payments, ledger, admin, and compliance separated.
- Do not treat any wallet, payout, or payment table as live until ADR-0002 controls are satisfied.

## Current status

- The first profile schema migration has been introduced for review.
- Runtime login/signup remains disconnected.
- Profile UI persistence remains disconnected.
- No wallet, payment, payout, dispatch, driver assignment, admin, or live-money behavior is implied.

## Migration inventory

| Migration | Purpose | Runtime wiring |
| --- | --- | --- |
| `20260612000000_create_profiles_and_rider_profiles.sql` | Creates `public.profiles`, `public.rider_profiles`, first-pass owner RLS, and restricted grants. | Not wired |

## Verification before runtime wiring

Before login, signup, profile persistence, or onboarding persistence are connected to Supabase, verify:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Also verify the migration in a Supabase environment and regenerate committed database types before runtime helpers depend on the new tables.
