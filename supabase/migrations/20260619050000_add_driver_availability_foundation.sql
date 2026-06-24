create table if not exists driver.driver_availability (
  user_id uuid primary key references auth.users(id) on delete cascade,
  vehicle_id uuid references driver.vehicles(id) on delete set null,
  availability_status text not null default 'offline',
  latitude numeric(10,7),
  longitude numeric(10,7),
  heading_degrees numeric(6,2),
  accuracy_meters numeric(10,2),
  last_heartbeat_at timestamptz,
  heartbeat_expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint driver_availability_status_check check (availability_status in ('offline', 'online', 'stale')),
  constraint driver_availability_latitude_check check (latitude is null or (latitude >= -90 and latitude <= 90)),
  constraint driver_availability_longitude_check check (longitude is null or (longitude >= -180 and longitude <= 180)),
  constraint driver_availability_heading_check check (heading_degrees is null or (heading_degrees >= 0 and heading_degrees < 360)),
  constraint driver_availability_accuracy_check check (accuracy_meters is null or accuracy_meters >= 0),
  constraint driver_availability_metadata_is_object check (jsonb_typeof(metadata) = 'object')
);

create index if not exists driver_availability_status_heartbeat_idx
  on driver.driver_availability (availability_status, heartbeat_expires_at desc);

create index if not exists driver_availability_vehicle_idx
  on driver.driver_availability (vehicle_id);

create trigger driver_availability_set_updated_at
  before update on driver.driver_availability
  for each row execute function driver.set_updated_at();

alter table driver.driver_availability enable row level security;
revoke all on table driver.driver_availability from anon, authenticated;
