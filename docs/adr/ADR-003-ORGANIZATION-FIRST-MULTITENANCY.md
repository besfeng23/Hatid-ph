# ADR-003: Organization-First Multitenancy

Status: Approved

## Decision

`core.organizations` and `core.organization_members` are foundational. All tenant-owned business records require `organization_id`.

JWT custom claims include organization and membership context.

## Consequences

RLS and audit policies are organization-scoped.
