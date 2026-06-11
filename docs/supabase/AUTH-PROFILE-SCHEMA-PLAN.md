# Supabase Auth and Profile Schema Plan

## Status

Planning only. No migrations are introduced by this document.

## Purpose

Define the first safe Supabase auth/profile data model for Hatid before wiring login, signup, profile persistence, or onboarding persistence.

This plan follows:

- ADR-0001: Firebase removal and Supabase migration direction
- ADR-0003: Client/server authority boundaries
- Sprint 0B architecture checklist

## Scope

This plan covers:

- `auth.users` integration
- `public.profiles`
- user roles
- profile completion state
- rider onboarding fields
- basic account metadata

This plan does not cover:

- wallet balances
- payments
- payouts
- dispatch
- driver assignment
- admin operations
- KYC production workflow
- live-money or ledger behavior

## Proposed tables

### `public.profiles`

One profile row per Supabase auth user.

Proposed columns:

```sql
id uuid primary key references auth.users(id) on delete cascade,
email text,
phone text,
display_name text,
photo_url text,
primary_role text not null default 'rider',
profile_status text not null default 'incomplete',
onboarding_completed_at timestamptz,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

Allowed `primary_role` values for first pass:

```text
rider
admin
operator
support
```

Allowed `profile_status` values for first pass:

```text
incomplete
complete
suspended
deleted
```

### `public.rider_profiles`

Rider-specific profile extension. One row per rider user.

Proposed columns:

```sql
user_id uuid primary key references public.profiles(id) on delete cascade,
first_name text,
last_name text,
birthdate date,
preferred_language text default 'en-PH',
default_payment_preference text default 'cash',
emergency_contact_name text,
emergency_contact_phone text,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

Allowed `default_payment_preference` values for first pass:

```text
cash
card_placeholder
wallet_placeholder
```

`card_placeholder` and `wallet_placeholder` are UI/planning values only. They must not imply live payment capability.

## Client-editable fields

Client may request updates to:

```text
display_name
photo_url
first_name
last_name
preferred_language
default_payment_preference
emergency_contact_name
emergency_contact_phone
```

These updates must still pass server or RLS validation.

## Server-owned fields

The server must own:

```text
id
email
phone
primary_role
profile_status
onboarding_completed_at
created_at
updated_at
```

The client must not directly assign admin/operator/support roles.

## Prototype-only fields

These fields may exist for UI planning but must not imply production authority:

```text
default_payment_preference = card_placeholder
default_payment_preference = wallet_placeholder
profile_status used as UI completion only before policies are implemented
```

## RLS policy outline

RLS must be enabled on all public tables.

### `public.profiles`

Policy outline:

```text
Users can select their own profile.
Users can update limited editable fields on their own profile.
Admins/support can select profiles only through approved server-side policies or service functions.
Only server-side trusted flows can assign elevated roles.
```

### `public.rider_profiles`

Policy outline:

```text
Users can select their own rider profile.
Users can insert their own rider profile after auth signup.
Users can update client-editable rider fields on their own rider profile.
Admins/support access must be separately defined and audited.
```

## Migration sequence

Proposed order:

1. Install Supabase dependencies and regenerate lockfile.
2. Add real Supabase client/server scaffolds.
3. Add initial migration for `profiles`.
4. Add initial migration for `rider_profiles`.
5. Add RLS policies.
6. Add generated Supabase types.
7. Add server-side profile read helper.
8. Add server-side profile update helper.
9. Wire login/signup only after schema, policies, and helpers pass verification.

## Rollback notes

Rollback should be possible by:

- reverting migrations before production data exists,
- keeping login/signup disconnected until validation passes,
- preserving the current prototype provider until Supabase auth is proven,
- avoiding UI changes in the schema PR.

## Validation required before runtime wiring

Before login/signup are connected to Supabase:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Also confirm:

- no service-role key is used in client code,
- RLS is enabled on every table,
- generated database types are committed,
- profile reads and writes are covered by tests or documented manual checks,
- UI still clearly avoids production-ready auth claims.

## Done criteria for this planning phase

- Schema plan exists.
- Client-editable fields are separated from server-owned fields.
- RLS assumptions are documented.
- Migration sequence is defined.
- No runtime behavior is changed.
