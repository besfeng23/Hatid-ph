create or replace function driver.set_my_driver_online(p_vehicle_id uuid)
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
  v_vehicle driver.vehicles%rowtype;
  v_availability driver.driver_availability%rowtype;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  select * into v_vehicle
  from driver.vehicles vehicle
  where vehicle.id = p_vehicle_id and vehicle.user_id = v_actor_user_id;

  if v_vehicle.id is null then
    raise exception 'vehicle not found' using errcode = '22023';
  end if;

  insert into driver.driver_availability as availability (user_id, vehicle_id, availability_status, last_heartbeat_at, heartbeat_expires_at)
  values (v_actor_user_id, v_vehicle.id, 'online', now(), now() + interval '2 minutes')
  on conflict (user_id) do update
    set vehicle_id = excluded.vehicle_id,
        availability_status = 'online',
        last_heartbeat_at = now(),
        heartbeat_expires_at = now() + interval '2 minutes',
        updated_at = now()
  returning * into v_availability;

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
