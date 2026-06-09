# ADR-001: Remove Firebase

Status: Approved

## Context

The repository previously used Firebase Auth, Firestore, Firebase Hosting/App Hosting, and Firebase-related code. The approved Hatid architecture is Supabase-first.

## Decision

Firebase is removed completely.

Supabase Auth, PostgreSQL, Supabase Storage, Supabase Realtime, Supabase Edge Functions, Vercel, and Cloudflare are the approved platform stack.

## Consequences

All Firebase dependencies, environment variables, config files, hosting files, auth hooks, storage adapters, and Firestore rules must be removed.

No new Firebase code may be introduced.
