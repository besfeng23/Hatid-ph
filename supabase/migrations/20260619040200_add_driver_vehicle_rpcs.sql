create or replace function driver.upsert_my_vehicle(
  p_vehicle_id uuid,
  p_plate_number text,
  p_vehicle_type text,
  p_make text,
  p_model text,
  p_color text,
  p_year integer,
  p_capacity integer
)
returns table (
  id uuid,
  plate_number text,
  vehicle_type text,
  make text,
  model text,
  color text,
  year integer,
  capacity integer,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = driver, audit, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_existing driver.vehicles%rowtype;
  v_vehicle driver.vehicles%rowtype;
  v_vehicle_type text := coalesce(nullif(btrim(p_vehicle_type), ''), 'other');
  v_capacity integer := coalesce(p_capacity, 4);
  v_action_kind text;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  if nullif(btrim(p_plate_number), '') is null then
    raise exception 'plate number required' using errcode = '22023';
  end if;

  if v_vehicle_type not in ('motorcycle', 'sedan', 'suv', 'van', 'delivery_bike', 'other') then
    v_vehicle_type := 'other';
  end if;

  if v_capacity < 1 or v_capacity > 12 then
    raise exception 'invalid capacity' using errcode = '22023';
  end if;

  if p_vehicle_id is not null then
    select * into v_existing
    from driver.vehicles existing_vehicle
    where existing_vehicle.id = p_vehicle_id and existing_vehicle.user_id = v_actor_user_id
    for update;
  end if;

  if p_vehicle_id is not null and v_existing.id is not null then
    update driver.vehicles
    set plate_number = btrim(p_plate_number),
        vehicle_type = v_vehicle_type,
        make = nullif(btrim(p_make), ''),
        model = nullif(btrim(p_model), ''),
        color = nullif(btrim(p_color), ''),
        year = p_year,
        capacity = v_capacity,
        updated_at = now()
    where id = v_existing.id
    returning * into v_vehicle;
    v_action_kind := 'updated';
  else
    insert into driver.vehicles (user_id, plate_number, vehicle_type, make, model, color, year, capacity)
    values (v_actor_user_id, btrim(p_plate_number), v_vehicle_type, nullif(btrim(p_make), ''), nullif(btrim(p_model), ''), nullif(btrim(p_color), ''), p_year, v_capacity)
    returning * into v_vehicle;
    v_action_kind := 'created';
  end if;

  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    v_actor_user_id,
    'driver.vehicles.upsert_self_vehicle',
    'driver.vehicles',
    v_vehicle.id::text,
    case when v_existing.id is null then null else jsonb_build_object('plate_number', v_existing.plate_number, 'vehicle_type', v_existing.vehicle_type, 'status', v_existing.status) end,
    jsonb_build_object('plate_number', v_vehicle.plate_number, 'vehicle_type', v_vehicle.vehicle_type, 'status', v_vehicle.status),
    jsonb_build_object('operation', v_action_kind, 'approval_granted', false)
  );

  return query select v_vehicle.id, v_vehicle.plate_number, v_vehicle.vehicle_type, v_vehicle.make, v_vehicle.model, v_vehicle.color, v_vehicle.year, v_vehicle.capacity, v_vehicle.status, v_vehicle.created_at, v_vehicle.updated_at;
end;
$$;

create or replace function driver.get_my_vehicles()
returns table (
  id uuid,
  plate_number text,
  vehicle_type text,
  make text,
  model text,
  color text,
  year integer,
  capacity integer,
  status text,
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
  select vehicle.id, vehicle.plate_number, vehicle.vehicle_type, vehicle.make, vehicle.model, vehicle.color, vehicle.year, vehicle.capacity, vehicle.status, vehicle.created_at, vehicle.updated_at
  from driver.vehicles vehicle
  where vehicle.user_id = v_actor_user_id
  order by vehicle.created_at desc;
end;
$$;

revoke all on function driver.upsert_my_vehicle(uuid, text, text, text, text, text, integer, integer) from public, anon, authenticated;
revoke all on function driver.get_my_vehicles() from public, anon, authenticated;
grant execute on function driver.upsert_my_vehicle(uuid, text, text, text, text, text, integer, integer) to authenticated;
grant execute on function driver.get_my_vehicles() to authenticated;
