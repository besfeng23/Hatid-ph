alter table rider.ride_requests
  add column if not exists pickup_latitude numeric(10,7),
  add column if not exists pickup_longitude numeric(10,7),
  add column if not exists dropoff_latitude numeric(10,7),
  add column if not exists dropoff_longitude numeric(10,7),
  add column if not exists estimated_distance_km numeric(10,2),
  add column if not exists estimated_duration_minutes integer;
