# Codex Supabase Install Handoff

## Purpose

Use this prompt in Codex or a real local CLI environment to complete the Supabase dependency gate safely.

This step must be done outside ChatGPT because it requires a real package manager run that updates `package-lock.json`.

## Repo

```text
besfeng23/Hatid-ph
```

## Required issue

```text
#12 Sprint 0B: install Supabase dependencies and regenerate lockfile safely
```

## Prompt for Codex

```text
You are working in the Next.js 15 + React 19 + TypeScript + Tailwind repo besfeng23/Hatid-ph.

Goal: complete Sprint 0B issue #12 only.

Install Supabase dependencies using npm, regenerate package-lock.json, and verify the repo still builds.

Commands:

npm install @supabase/supabase-js @supabase/ssr
npm ci
npm run typecheck
npm test
npm run build

Rules:
- Commit package.json and package-lock.json together.
- Do not wire login/signup yet.
- Do not modify UI.
- Do not create migrations yet.
- Do not claim auth is live.
- Do not add wallet, payment, payout, dispatch, admin, KYC, or compliance authority.
- Do not expose SUPABASE_SERVICE_ROLE_KEY to client code.
- Preserve the existing Hatid app design.

Expected output:
- A branch and PR for issue #12.
- The PR summary must include the exact commands run and whether each passed.
- If a command fails, stop and report the exact error instead of continuing.
```

## Files expected to change

```text
package.json
package-lock.json
```

## Files not expected to change in this step

```text
src/app/login/page.tsx
src/app/signup/page.tsx
src/app/profile/page.tsx
src/components/rider/onboarding/rider-profile-form.tsx
supabase/migrations/*
```

## After this step

Do not continue directly into runtime auth. Return to the issue chain:

```text
#14 First auth/profile + RLS migration PR
#15 Server-side profile helpers
#16 Auth/profile UI wiring
#18 Env/secrets
#19 Manual QA/regression
```
