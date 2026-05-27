# Environment Variables and Secrets

## Rule

No secrets, private keys, service account JSON, `.env` files, payment keys, webhook secrets, or database passwords may be committed.

## Required environment files

- `.env.example` may be committed.
- `.env.local` must not be committed.
- staging and production secrets must live in platform secret stores.

## Public client variables

Only variables safe for the browser may use public prefixes.

Examples:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_MAPS_PUBLIC_KEY=
```

Even public Firebase config still requires key restrictions, App Check, and Firestore rules.

## Server-only variables

These must never be exposed to browser bundles:

```text
DATABASE_URL=
GOOGLE_CLOUD_PROJECT=
PAYMENT_PROVIDER_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=
PAYOUT_PROVIDER_SECRET_KEY=
SPEEDCASH_CLIENT_ID=
SPEEDCASH_CLIENT_SECRET=
SPEEDCASH_WEBHOOK_SECRET=
MAPS_SERVER_KEY=
GENKIT_API_KEY=
```

## Secret storage

Use:

- Secret Manager for Cloud Run/backend secrets
- provider dashboards for provider-side keys
- CI/CD secret store for deployment-only values
- separate secret sets for staging and production

## Rotation requirements

Secrets must be rotatable without code changes:

- PSP secret keys
- webhook secrets
- SpeedCash credentials if later approved
- database passwords
- service account credentials if any are used
- maps server keys

## Key restrictions

- restrict Firebase API keys where applicable
- restrict maps keys by HTTP referrer or server IP/service identity
- separate client and server map keys
- never reuse staging keys in production

## Launch checklist

- [ ] `.env.example` exists
- [ ] `.env*` ignored
- [ ] no service account key committed
- [ ] no provider secrets committed
- [ ] Secret Manager configured for backend
- [ ] staging/prod secrets separated
- [ ] webhook secrets rotated before production
