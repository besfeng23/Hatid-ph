create schema if not exists dispatch;

comment on schema dispatch is
  'Dispatch-domain foundation. Candidate search is read-only and does not assign trips, create offers, move money, or approve drivers.';

create or replace function dispatch.calculate_distance_km(
  p_latitude_a numeric,
  p_longitude_a numeric,
  p_latitude_b numeric,
  p_longitude_b numeric
)
returns numeric
language sql
immutable
set search_path = pg_catalog
as $$
  select round(
    (
      6371 * acos(
        least(
          1,
          greatest(
            -1,
            cos(radians(p_latitude_a::double precision))
            * cos(radians(p_latitude_b::double precision))
            * cos(radians((p_longitude_b - p_longitude_a)::double precision))
            + sin(radians(p_latitude_a::double precision))
            * sin(radians(p_latitude_b::double precision))
          )
        )
      )
    )::numeric,
    2
  );
$$;

create or replace function dispatch.find_ride_request_candidates(
  p_request_id uuid,
  p_limit integer default 10
)
returns table (
  driver_user_id uuid,
  vehicle_id uuid,
  vehicle_type text,
  vehicle_status text,
  availability_status text,
  distance_km numeric,
  last_heartbeat_at timestamptz,
  heartbeat_expires_at timestamptz
)
language plpgsql
security definer
set search_path = dispatch, rider, driver, pg_catalog
as $$
begin
  if p_limit is null or p_limit < 1 or p_limit > 25 then
    raise exception 'invalid limit' using errcode = '22023';
  end if;

  return query
  with target_request as (
    select request.id,
           request.pickup_latitude,
           request.pickup_longitude,
           request.service_type
    from rider.ride_requests request
    where request.id = p_request_id
      and request.status = 'requested'
      and request.pickup_latitude is not null
      and request.pickup_longitude is not null
  )
  select availability.user_id as driver_user_id,
         availability.vehicle_id,
         vehicle.vehicle_type,
         vehicle.status as vehicle_status,
         availability.availability_status,
         dispatch.calculate_distance_km(
           target_request.pickup_latitude,
           target_request.pickup_longitude,
           availability.latitude,
           availability.longitude
         ) as distance_km,
         availability.last_heartbeat_at,
         availability.heartbeat_expires_at
  from target_request
  join driver.driver_availability availability
    on availability.availability_status = 'online'
   and availability.latitude is not null
   and availability.longitude is not null
   and availability.heartbeat_expires_at > now()
  join driver.vehicles vehicle
    on vehicle.id = availability.vehicle_id
   and vehicle.user_id = availability.user_id
   and vehicle.status = 'active'
  join driver.driver_profiles profile
    on profile.user_id = availability.user_id
   and profile.status = 'active'
  order by distance_km asc, availability.last_heartbeat_at desc
  limit p_limit;
end;
$$;

comment on function dispatch.find_ride_request_candidates(uuid, integer) is
  'Server-side read-only candidate search for a requested ride. It only returns eligible online drivers; it does not assign trips, create offers, accept rides, charge riders, pay drivers, or grant admin authority.';

revoke all on schema dispatch from public, anon, authenticated;
revoke execute on function dispatch.calculate_distance_km(numeric, numeric, numeric, numeric) from public, anon, authenticated;
revoke execute on function dispatch.find_ride_request_candidates(uuid, integer) from public, anon, authenticated;
