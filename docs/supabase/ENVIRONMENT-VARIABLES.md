# Environment Variable Checklist

This document tracks the safe environment variable boundary for Hatid.

## Public client variables

These can be used by browser-safe Supabase or map clients:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_MAPS_PUBLIC_KEY=
```

## Server-only variables

These must never be exposed through `NEXT_PUBLIC_*` names or browser bundles:

```text
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
MAPS_SERVER_KEY=
GENKIT_API_KEY=
```

## Payment placeholders

These are reserved for later phases only. Do not enable live money movement from this repository yet.

```text
PAYMENT_PROVIDER=
PAYMENT_PROVIDER_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=
PAYOUT_PROVIDER_SECRET_KEY=
```

## Guardrails

- Do not commit `.env.local`.
- Do not commit real secrets.
- Do not expose service-role keys to client code.
- Do not wire live login/signup/profile UI until the route QA pass is complete.
- Do not enable wallet, payment, payout, dispatch, support, or emergency authority from placeholder variables.
