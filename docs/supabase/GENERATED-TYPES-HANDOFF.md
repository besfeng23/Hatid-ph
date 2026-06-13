# Generated Types Handoff

## Status

The Hatid Supabase project has real generated database types committed for the profile foundation.

## Current scope

Generated profile foundation types cover:

- `public.profiles`
- `public.rider_profiles`
- PostGIS metadata tables/views already present in the project

## Current guardrail

The profile storage adapter now imports profile table row and insert types from `database.types.ts`.

The UI remains disconnected from runtime profile persistence.

## Next gate

Before wiring user-facing forms, add a server-only Supabase client boundary and environment checks.

Do not expose service-role keys to browser code.
