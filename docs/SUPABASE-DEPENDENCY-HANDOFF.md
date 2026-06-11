# Supabase Dependency Handoff

This document defines the safe handoff point for installing Supabase dependencies.

## Why this handoff exists

The repository currently has a committed `package-lock.json`. Adding dependencies by editing `package.json` alone will break `npm ci` and may break Vercel deploys.

Supabase dependencies must be installed from a real development environment so the lockfile is regenerated correctly.

## Required packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Required verification

After installation, run:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Commit both files together:

```text
package.json
package-lock.json
```

## Rules

- Do not wire login/signup yet.
- Do not change UI.
- Do not add live auth claims.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to client code.
- Keep the current Vercel deployment stable.

## Next files after dependency install

After the install and lockfile update pass verification, replace the placeholder Supabase boundary with real clients:

```text
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/middleware.ts
```

## Codex prompt

```text
Install @supabase/supabase-js and @supabase/ssr, regenerate package-lock.json, verify npm ci still succeeds, then create src/lib/supabase/client.ts, src/lib/supabase/server.ts, and src/lib/supabase/middleware.ts as non-authenticated scaffolds only. Do not connect login/signup yet. Do not modify UI. Run typecheck, test, build, and report results.
```
