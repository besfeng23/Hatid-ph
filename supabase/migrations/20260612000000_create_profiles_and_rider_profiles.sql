-- Sprint 0B profile schema foundation
--
-- Scope:
-- - public.profiles
-- - public.rider_profiles
-- - first-pass owner RLS
--
-- Out of scope:
-- - wallet balances
-- - payments
-- - payouts
-- - dispatch
-- - driver assignment
-- - admin operations
-- - live-money or ledger behavior
-- - runtime login/signup wiring

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  display_name text,
  photo_url text,
  primary_role text not null default 'rider',
  profile_status text not null default 'incomplete',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_primary_role_check
    check (primary_role in ('rider', 'admin', 'operator', 'support')),
  constraint profiles_profile_status_check
    check (profile_status in ('incomplete', 'complete', 'suspended', 'deleted'))
);

create table if not exists public.rider_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  first_name text,
  last_name text,
  birthdate date,
  preferred_language text default 'en-PH',
  default_payment_preference text default 'cash',
  emergency_contact_name text,
  emergency_contact_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rider_profiles_default_payment_preference_check
    check (default_payment_preference in ('cash', 'card_placeholder', 'wallet_placeholder'))
);

create index if not exists profiles_primary_role_idx
  on public.profiles (primary_role);

create index if not exists profiles_profile_status_idx
  on public.profiles (profile_status);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create trigger rider_profiles_set_updated_at
  before update on public.rider_profiles
  for each row
  execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.rider_profiles enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.rider_profiles from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (display_name, photo_url) on table public.profiles to authenticated;

grant select on table public.rider_profiles to authenticated;
grant insert (
  user_id,
  first_name,
  last_name,
  birthdate,
  preferred_language,
  default_payment_preference,
  emergency_contact_name,
  emergency_contact_phone
) on table public.rider_profiles to authenticated;
grant update (
  first_name,
  last_name,
  preferred_language,
  default_payment_preference,
  emergency_contact_name,
  emergency_contact_phone
) on table public.rider_profiles to authenticated;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own_editable_fields"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "rider_profiles_select_own"
  on public.rider_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "rider_profiles_insert_own_after_profile_exists"
  on public.rider_profiles
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.primary_role = 'rider'
        and profiles.profile_status <> 'deleted'
    )
  );

create policy "rider_profiles_update_own_editable_fields"
  on public.rider_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on table public.profiles is
  'Sprint 0B user profile foundation. No wallet, payment, payout, dispatch, or admin authority is implied.';

comment on table public.rider_profiles is
  'Sprint 0B rider profile extension. Payment preference placeholder values do not imply live payment capability.';
