alter table rider.ride_quotes
  add column if not exists pickup_latitude numeric(10,7),
  add column if not exists pickup_longitude numeric(10,7),
  add column if not exists dropoff_latitude numeric(10,7),
  add column if not exists dropoff_longitude numeric(10,7),
  add column if not exists estimated_distance_km numeric(10,2),
  add column if not exists estimated_duration_minutes integer;

create index if not exists ride_quotes_user_created_at_idx
  on rider.ride_quotes (user_id, created_at desc);

alter table rider.ride_quotes enable row level security;
revoke all on table rider.ride_quotes from anon, authenticated;
