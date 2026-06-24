create or replace function driver.get_my_driver_availability()
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
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  return query
  select availability.user_id,
         availability.vehicle_id,
         availability.availability_status,
         availability.latitude,
         availability.longitude,
         availability.heading_degrees,
         availability.accuracy_meters,
         availability.last_heartbeat_at,
         availability.heartbeat_expires_at,
         availability.created_at,
         availability.updated_at
  from driver.driver_availability availability
  where availability.user_id = v_actor_user_id;
end;
$$;
