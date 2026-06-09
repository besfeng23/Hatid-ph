# ADR-002: Supabase-First Platform

Status: Approved

## Context

Hatid requires PostgreSQL, PostGIS, RLS, Supabase Auth, Storage, Realtime, and Edge Functions.

## Decision

Supabase is the primary backend platform.

## Consequences

Schema, security, realtime, storage, auth, and service boundaries are designed around Supabase and PostgreSQL.
