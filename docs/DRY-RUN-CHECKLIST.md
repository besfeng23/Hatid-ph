# Hatid Dry Run Checklist

## Purpose

Use this checklist after backend helper foundations are merged and before any user-facing persistence work starts.

## Rules

- Use a test environment only.
- Do not commit secrets.
- Do not use production data.
- Do not connect user-facing forms during this checklist.
- Keep issue #22 open until the audit baseline is fixed.

## Step 1: Repository checks

Run from a clean `main` checkout:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Stop if any command fails.

## Step 2: Database foundation check

Use a test database project.

Apply the current migrations and confirm the profile tables, owner policies, and table protections exist.

Do not use live user data.

## Step 3: Type generation check

Generate database types from the test project into:

```text
src/lib/supabase/database.types.ts
```

Then run:

```bash
npm run typecheck
npm test
npm run build
```

## Step 4: Helper check

Verify the profile service and storage adapter against the test database using server-only test code.

Confirm:

- missing rows return safe empty results
- allowed reads work
- allowed edits work
- protected fields remain protected
- storage failures surface as failures

Do not commit temporary scripts that include local values.

## Step 5: Preview check

Configure preview-only environment values.

Deploy a preview build and inspect logs after a smoke visit.

Expected result:

- preview build is ready
- no error or fatal logs after smoke testing

## Step 6: User-flow gate

Only begin user-facing form persistence after:

- repository checks pass
- test database check passes
- generated types are committed
- helper checks pass
- preview logs are clean

## Done

The dry run is complete when all steps above pass in a test environment.
