create table if not exists dispatch.trip_offers (
  id uuid primary key default extensions.gen_random_uuid(),
  request_id uuid not null references rider.ride_requests(id) on delete cascade,
  driver_user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references driver.vehicles(id) on delete restrict,
  offer_status text not null default 'offered',
  offered_at timestamptz not null default now(),
  responded_at timestamptz,
  expires_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trip_offers_status_check check (offer_status in ('offered', 'accepted', 'rejected', 'expired', 'cancelled')),
  constraint trip_offers_metadata_is_object check (jsonb_typeof(metadata) = 'object'),
  constraint trip_offers_expires_after_created check (expires_at > created_at)
);

create unique index if not exists trip_offers_one_accepted_per_request_idx
  on dispatch.trip_offers (request_id)
  where offer_status = 'accepted';

create unique index if not exists trip_offers_one_open_per_driver_request_idx
  on dispatch.trip_offers (request_id, driver_user_id)
  where offer_status = 'offered';

create index if not exists trip_offers_driver_status_created_at_idx
  on dispatch.trip_offers (driver_user_id, offer_status, created_at desc);

create index if not exists trip_offers_request_created_at_idx
  on dispatch.trip_offers (request_id, created_at desc);

create trigger trip_offers_set_updated_at
  before update on dispatch.trip_offers
  for each row execute function driver.set_updated_at();

alter table dispatch.trip_offers enable row level security;
revoke all on table dispatch.trip_offers from anon, authenticated;
