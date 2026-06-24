create schema if not exists driver;

create or replace function driver.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists driver.driver_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  service_area_text text,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint driver_profiles_status_check check (status in ('draft', 'pending_review', 'active', 'suspended', 'rejected')),
  constraint driver_profiles_metadata_is_object check (jsonb_typeof(metadata) = 'object')
);

create table if not exists driver.vehicles (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plate_number text not null,
  vehicle_type text not null,
  make text,
  model text,
  color text,
  year integer,
  capacity integer not null default 4,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicles_plate_number_not_blank check (length(btrim(plate_number)) > 0),
  constraint vehicles_vehicle_type_check check (vehicle_type in ('motorcycle', 'sedan', 'suv', 'van', 'delivery_bike', 'other')),
  constraint vehicles_capacity_check check (capacity between 1 and 12),
  constraint vehicles_status_check check (status in ('draft', 'pending_review', 'active', 'suspended', 'rejected')),
  constraint vehicles_metadata_is_object check (jsonb_typeof(metadata) = 'object')
);

create table if not exists driver.documents (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid references driver.vehicles(id) on delete set null,
  document_type text not null,
  storage_path text not null,
  file_name text,
  mime_type text,
  status text not null default 'submitted',
  rejection_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint driver_documents_type_check check (document_type in ('drivers_license', 'government_id', 'or_cr', 'vehicle_photo', 'selfie', 'other')),
  constraint driver_documents_storage_path_not_blank check (length(btrim(storage_path)) > 0),
  constraint driver_documents_status_check check (status in ('submitted', 'pending_review', 'approved', 'rejected', 'expired')),
  constraint driver_documents_metadata_is_object check (jsonb_typeof(metadata) = 'object')
);

create index if not exists vehicles_user_created_at_idx on driver.vehicles (user_id, created_at desc);
create index if not exists driver_documents_user_created_at_idx on driver.documents (user_id, created_at desc);
create index if not exists driver_documents_vehicle_created_at_idx on driver.documents (vehicle_id, created_at desc);

create trigger driver_profiles_set_updated_at
  before update on driver.driver_profiles
  for each row execute function driver.set_updated_at();

create trigger vehicles_set_updated_at
  before update on driver.vehicles
  for each row execute function driver.set_updated_at();

create trigger driver_documents_set_updated_at
  before update on driver.documents
  for each row execute function driver.set_updated_at();

alter table driver.driver_profiles enable row level security;
alter table driver.vehicles enable row level security;
alter table driver.documents enable row level security;

revoke all on schema driver from public, anon, authenticated;
revoke all on table driver.driver_profiles from anon, authenticated;
revoke all on table driver.vehicles from anon, authenticated;
revoke all on table driver.documents from anon, authenticated;
revoke execute on function driver.set_updated_at() from public, anon, authenticated;
