create or replace function trip.get_my_rider_trips()
returns table (
  id uuid,
  request_id uuid,
  accepted_offer_id uuid,
  rider_user_id uuid,
  driver_user_id uuid,
  vehicle_id uuid,
  trip_status text,
  pickup_address_text text,
  dropoff_address_text text,
  service_type text,
  estimate_minor integer,
  currency text,
  accepted_at timestamptz,
  en_route_pickup_at timestamptz,
  arrived_pickup_at timestamptz,
  rider_onboarded_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = trip, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  return query
  select trips.id,
         trips.request_id,
         trips.accepted_offer_id,
         trips.rider_user_id,
         trips.driver_user_id,
         trips.vehicle_id,
         trips.trip_status,
         trips.pickup_address_text,
         trips.dropoff_address_text,
         trips.service_type,
         trips.estimate_minor,
         trips.currency,
         trips.accepted_at,
         trips.en_route_pickup_at,
         trips.arrived_pickup_at,
         trips.rider_onboarded_at,
         trips.completed_at,
         trips.cancelled_at,
         trips.created_at,
         trips.updated_at
  from trip.trips trips
  where trips.rider_user_id = v_actor_user_id
  order by trips.created_at desc
  limit 25;
end;
$$;

create or replace function trip.get_my_driver_trips()
returns table (
  id uuid,
  request_id uuid,
  accepted_offer_id uuid,
  rider_user_id uuid,
  driver_user_id uuid,
  vehicle_id uuid,
  trip_status text,
  pickup_address_text text,
  dropoff_address_text text,
  service_type text,
  estimate_minor integer,
  currency text,
  accepted_at timestamptz,
  en_route_pickup_at timestamptz,
  arrived_pickup_at timestamptz,
  rider_onboarded_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = trip, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  return query
  select trips.id,
         trips.request_id,
         trips.accepted_offer_id,
         trips.rider_user_id,
         trips.driver_user_id,
         trips.vehicle_id,
         trips.trip_status,
         trips.pickup_address_text,
         trips.dropoff_address_text,
         trips.service_type,
         trips.estimate_minor,
         trips.currency,
         trips.accepted_at,
         trips.en_route_pickup_at,
         trips.arrived_pickup_at,
         trips.rider_onboarded_at,
         trips.completed_at,
         trips.cancelled_at,
         trips.created_at,
         trips.updated_at
  from trip.trips trips
  where trips.driver_user_id = v_actor_user_id
  order by trips.created_at desc
  limit 25;
end;
$$;

revoke execute on function trip.get_my_rider_trips() from public, anon, authenticated;
revoke execute on function trip.get_my_driver_trips() from public, anon, authenticated;
grant usage on schema trip to authenticated;
grant execute on function trip.get_my_rider_trips() to authenticated;
grant execute on function trip.get_my_driver_trips() to authenticated;
