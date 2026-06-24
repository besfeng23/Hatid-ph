create or replace function driver.update_my_driver_location_ping(
  p_latitude numeric,
  p_longitude numeric,
  p_heading_degrees numeric,
  p_accuracy_meters numeric
)
returns table (
  user_id uuid,
  vehicle_id uuid,
  availability_status text,
  latitude numeric,
  longitude numeric,
  heading_degrees numeric,
  accuracy_meters numeric,
  last_heartbeat_at timestamptz,
  heartbeat_expires_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = driver, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_availability driver.driver_availability%rowtype;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  if p_latitude < -90 or p_latitude > 90 or p_longitude < -180 or p_longitude > 180 then
    raise exception 'invalid coordinates' using errcode = '22023';
  end if;

  update driver.driver_availability availability
  set latitude = p_latitude,
      longitude = p_longitude,
      heading_degrees = p_heading_degrees,
      accuracy_meters = p_accuracy_meters,
      availability_status = 'online',
      last_heartbeat_at = now(),
      heartbeat_expires_at = now() + interval '2 minutes',
      updated_at = now()
  where availability.user_id = v_actor_user_id
    and availability.availability_status = 'online'
  returning * into v_availability;

  if v_availability.user_id is null then
    raise exception 'availability row not ready' using errcode = '22023';
  end if;

  return query select v_availability.user_id,
                      v_availability.vehicle_id,
                      v_availability.availability_status,
                      v_availability.latitude,
                      v_availability.longitude,
                      v_availability.heading_degrees,
                      v_availability.accuracy_meters,
                      v_availability.last_heartbeat_at,
                      v_availability.heartbeat_expires_at,
                      v_availability.created_at,
                      v_availability.updated_at;
end;
$$;
