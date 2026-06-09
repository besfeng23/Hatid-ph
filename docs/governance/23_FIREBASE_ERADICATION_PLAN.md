# Hatid Firebase Eradication Plan

Document ID: 23_FIREBASE_ERADICATION_PLAN  
Status: Mandatory  
Target: Firebase Dependency Count = 0

## Decision

Firebase is deprecated and prohibited.

Approved replacements:

| Firebase | Replacement |
|---|---|
| Firebase Auth | Supabase Auth |
| Firestore | PostgreSQL via Supabase |
| Firebase Storage | Supabase Storage |
| Firebase Hosting | Vercel |
| Firebase Cloud Functions | Supabase Edge Functions |
| Firebase Realtime Database | Supabase Realtime / Event Streaming |

## Files to Remove

Remove if present:

- `apphosting.yaml`
- `firebase.json`
- `.firebaserc`
- `firestore.rules`
- Firebase config files
- Firebase provider files
- Firebase auth hooks
- Firebase storage adapters

## Dependencies to Remove

Remove:

- `firebase`
- `firebase-admin`
- `firebase-functions`
- all direct `@firebase/*` dependencies

## Environment Variables to Remove

Remove:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- any `FIREBASE_*`

Replace with:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` server-side only

## Acceptance Criteria

- `grep -ri "firebase" src apps packages supabase` returns no production-code references.
- `npm ls firebase` returns empty.
- app deploys to Vercel.
- login/signup uses Supabase Auth.
- protected routes use Supabase session.
- docs do not describe Firebase as current architecture.
- ADR-001 Firebase Removal exists.
