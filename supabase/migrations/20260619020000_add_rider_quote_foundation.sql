create schema if not exists rider;

create table if not exists rider.ride_quotes (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pickup_address_text text not null,
  dropoff_address_text text not null,
  service_type text not null default 'standard',
  estimate_minor integer not null,
  currency text not null default 'PHP',
  status text not null default 'quoted',
  expires_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
