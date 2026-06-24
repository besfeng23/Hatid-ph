create schema if not exists trip;

comment on schema trip is
  'Trip lifecycle foundation. It records trip state transitions only; it does not move money, create payouts, provide live navigation, or grant admin override authority.';

create or replace function trip.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists trip.trips (
  id uuid primary key default extensions.gen_random_uuid(),
  request_id uuid not null references rider.ride_requests(id) on delete restrict,
  accepted_offer_id uuid not null references dispatch.trip_offers(id) on delete restrict,
  rider_user_id uuid not null references auth.users(id) on delete restrict,
  driver_user_id uuid not null references auth.users(id) on delete restrict,
  vehicle_id uuid not null references driver.vehicles(id) on delete restrict,
  trip_status text not null default 'accepted',
  pickup_address_text text not null,
  pickup_latitude numeric(10,7),
  pickup_longitude numeric(10,7),
  dropoff_address_text text not null,
  dropoff_latitude numeric(10,7),
  dropoff_longitude numeric(10,7),
  service_type text not null,
  estimate_minor integer not null,
  currency text not null default 'PHP',
  accepted_at timestamptz not null default now(),
  en_route_pickup_at timestamptz,
  arrived_pickup_at timestamptz,
  rider_onboarded_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_status_check check (trip_status in ('accepted', 'en_route_pickup', 'arrived_pickup', 'rider_onboarded', 'completed', 'cancelled')),
  constraint trips_currency_php_only check (currency = 'PHP'),
  constraint trips_estimate_non_negative check (estimate_minor >= 0),
  constraint trips_metadata_is_object check (jsonb_typeof(metadata) = 'object')
);

create unique index if not exists trips_request_id_unique_idx on trip.trips (request_id);
create unique index if not exists trips_accepted_offer_id_unique_idx on trip.trips (accepted_offer_id);
create index if not exists trips_rider_created_at_idx on trip.trips (rider_user_id, created_at desc);
create index if not exists trips_driver_created_at_idx on trip.trips (driver_user_id, created_at desc);
create index if not exists trips_status_created_at_idx on trip.trips (trip_status, created_at desc);

create trigger trips_set_updated_at
  before update on trip.trips
  for each row execute function trip.set_updated_at();

alter table trip.trips enable row level security;
revoke all on schema trip from public, anon, authenticated;
revoke all on table trip.trips from anon, authenticated;
revoke execute on function trip.set_updated_at() from public, anon, authenticated;
