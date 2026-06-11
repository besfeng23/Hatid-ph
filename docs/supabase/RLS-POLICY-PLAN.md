# Supabase RLS Policy Plan

## Status

Planning only. No migrations are introduced by this document.

## Purpose

Define the first Row Level Security policy direction for Hatid before runtime auth, profile writes, or onboarding persistence are connected.

This plan supports:

- `docs/supabase/AUTH-PROFILE-SCHEMA-PLAN.md`
- ADR-0001 Firebase removal and Supabase direction
- ADR-0003 client/server authority boundaries

## Global rules

- RLS must be enabled on every public table.
- Client policies must grant the smallest practical permission set.
- Server-owned fields must not be client-editable.
- Elevated role assignment must not be client-authoritative.
- Service-role usage must stay server-only.
- Money, wallet, payout, dispatch, admin, and compliance authority are out of scope for this first phase.

## First-pass tables

```text
public.profiles
public.rider_profiles
```

## Ownership model

A user owns rows where:

```sql
auth.uid() = id
```

for `public.profiles`, and:

```sql
auth.uid() = user_id
```

for `public.rider_profiles`.

## `public.profiles` policy outline

### Select own profile

Users may read their own profile row.

```text
USING auth.uid() = id
```

### Insert own profile

Profile creation should normally happen through a server-side signup/profile bootstrap helper. Direct client insert should be avoided unless a later migration explicitly allows a restricted insert path.

### Update own editable fields

Users may request updates to limited profile fields only:

```text
display_name
photo_url
```

Server-owned fields remain protected:

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

### Elevated roles

Admin, operator, and support role assignment must be handled through server-owned flows only.

## `public.rider_profiles` policy outline

### Select own rider profile

Users may read their own rider profile row.

```text
USING auth.uid() = user_id
```

### Insert own rider profile

Users may create their own rider profile only after the base profile exists.

### Update own editable rider fields

Users may request updates to:

```text
first_name
last_name
preferred_language
default_payment_preference
emergency_contact_name
emergency_contact_phone
```

The following are prototype/planning values only and must not imply live payment capability:

```text
card_placeholder
wallet_placeholder
```

## Admin and support access

Admin/support access is not part of first-pass RLS. It requires a separate plan covering:

- role storage,
- audit logs,
- server-side policy checks,
- least-privilege access,
- break-glass behavior,
- and abuse monitoring.

## Migration order

1. Create tables.
2. Enable RLS.
3. Add owner select policies.
4. Add restricted insert/update policies only after validation.
5. Generate database types.
6. Add tests or documented manual checks.
7. Wire runtime helpers.
8. Connect UI only after helpers are proven.

## Done criteria

This plan is done when it is reviewed together with the auth/profile schema plan and converted into a migration PR that keeps login/signup disconnected until verification passes.
