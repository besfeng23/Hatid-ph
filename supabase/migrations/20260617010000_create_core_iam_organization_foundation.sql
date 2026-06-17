-- Hatid core IAM and organization foundation.
--
-- Scope:
-- - core.organizations
-- - core.organization_members
-- - core.app_users
--
-- These are foundational IAM tables only. No product flows, business RPCs,
-- service-role app code, trips, dispatch, wallets, payments, driver onboarding,
-- or admin screens are wired by this migration.
--
-- Client apps must not directly self-assign roles. Admin, finance, support,
-- operator, driver, rider, and viewer capabilities must be granted only through
-- trusted server-side paths designed in later focused PRs.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists core;

comment on schema core is
  'Foundation schema for Hatid identity, organization, membership, and role records. Client apps must not self-assign roles; trusted server-side paths must grant capabilities later.';

create or replace function core.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists core.organizations (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text not null,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_name_not_blank check (length(btrim(name)) > 0),
  constraint organizations_slug_not_blank check (length(btrim(slug)) > 0),
  constraint organizations_metadata_is_object check (jsonb_typeof(metadata) = 'object'),
  constraint organizations_status_check check (
    status in ('active', 'inactive', 'suspended', 'archived')
  )
);

create table if not exists core.app_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_users_metadata_is_object check (jsonb_typeof(metadata) = 'object'),
  constraint app_users_status_check check (
    status in ('active', 'inactive', 'suspended', 'deleted')
  )
);

create table if not exists core.organization_members (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null references core.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  status text not null default 'active',
  invited_by_user_id uuid references auth.users(id) on delete set null,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_members_role_check check (
    role in ('owner', 'admin', 'operator', 'finance', 'support', 'driver', 'rider', 'viewer')
  ),
  constraint organization_members_status_check check (
    status in ('invited', 'active', 'inactive', 'suspended', 'removed')
  )
);

create unique index if not exists organizations_slug_uidx
  on core.organizations (slug);

create unique index if not exists organization_members_active_user_org_uidx
  on core.organization_members (organization_id, user_id)
  where status = 'active';

create index if not exists organizations_slug_idx on core.organizations (slug);
create index if not exists organizations_status_idx on core.organizations (status);
create index if not exists organizations_created_at_idx on core.organizations (created_at);

create index if not exists app_users_status_idx on core.app_users (status);
create index if not exists app_users_created_at_idx on core.app_users (created_at);

create index if not exists organization_members_organization_id_idx on core.organization_members (organization_id);
create index if not exists organization_members_user_id_idx on core.organization_members (user_id);
create index if not exists organization_members_role_idx on core.organization_members (role);
create index if not exists organization_members_status_idx on core.organization_members (status);
create index if not exists organization_members_created_at_idx on core.organization_members (created_at);

create trigger organizations_set_updated_at
  before update on core.organizations
  for each row execute function core.set_updated_at();

create trigger app_users_set_updated_at
  before update on core.app_users
  for each row execute function core.set_updated_at();

create trigger organization_members_set_updated_at
  before update on core.organization_members
  for each row execute function core.set_updated_at();

alter table core.organizations enable row level security;
alter table core.app_users enable row level security;
alter table core.organization_members enable row level security;

revoke all on schema core from public, anon, authenticated;
revoke all on all tables in schema core from anon, authenticated;
revoke execute on function core.set_updated_at() from public, anon, authenticated;

-- Default RLS posture is deny: no anon/authenticated/public policies are created.
-- Later PRs must add narrowly-scoped, server-owned access patterns with audit
-- coverage before any real rider, driver, admin, finance, or support flow uses
-- these IAM tables.

comment on table core.organizations is
  'Foundational IAM organization records. No product flows are wired. Client apps must not directly create authoritative organizations for role assignment.';
comment on table core.organization_members is
  'Foundational IAM organization membership and role records. Client apps must not directly self-assign roles; admin/finance/support/operator capabilities must be granted only through trusted server-side paths later.';
comment on table core.app_users is
  'Foundational IAM app user profile records linked to auth.users. No rider, driver, admin, wallet, payment, dispatch, or onboarding authority is implied.';
