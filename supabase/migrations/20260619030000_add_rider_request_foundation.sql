create schema if not exists rider;

create table if not exists rider.ride_requests (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quote_id uuid references rider.ride_quotes(id) on delete set null,
  pickup_address_text text not null,
  dropoff_address_text text not null,
  service_type text not null default 'standard',
  estimate_minor integer not null,
  currency text not null default 'PHP',
  status text not null default 'requested',
  rider_notes text,
  metadata jsonb not null default '{}'::jsonb,
  requested_at timestamptz not null default now(),
  cancelled_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ride_requests_user_created_at_idx
  on rider.ride_requests (user_id, created_at desc);

alter table rider.ride_requests enable row level security;
revoke all on table rider.ride_requests from anon, authenticated;
