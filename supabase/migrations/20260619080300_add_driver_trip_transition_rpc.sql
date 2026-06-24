create or replace function trip.advance_my_driver_trip(
  p_trip_id uuid,
  p_next_status text,
  p_cancellation_reason text default null
)
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
set search_path = trip, audit, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_trip trip.trips%rowtype;
  v_next_status text := lower(btrim(p_next_status));
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  select * into v_trip
  from trip.trips trips
  where trips.id = p_trip_id
    and trips.driver_user_id = v_actor_user_id
  for update;

  if v_trip.id is null then
    raise exception 'trip not found' using errcode = '22023';
  end if;

  if v_trip.trip_status in ('completed', 'cancelled') then
    raise exception 'trip is already final' using errcode = '22023';
  end if;

  if not (
    (v_trip.trip_status = 'accepted' and v_next_status in ('en_route_pickup', 'cancelled')) or
    (v_trip.trip_status = 'en_route_pickup' and v_next_status in ('arrived_pickup', 'cancelled')) or
    (v_trip.trip_status = 'arrived_pickup' and v_next_status in ('rider_onboarded', 'cancelled')) or
    (v_trip.trip_status = 'rider_onboarded' and v_next_status in ('completed', 'cancelled'))
  ) then
    raise exception 'invalid trip transition' using errcode = '22023';
  end if;

  update trip.trips trips
  set trip_status = v_next_status,
      en_route_pickup_at = case when v_next_status = 'en_route_pickup' and trips.en_route_pickup_at is null then now() else trips.en_route_pickup_at end,
      arrived_pickup_at = case when v_next_status = 'arrived_pickup' and trips.arrived_pickup_at is null then now() else trips.arrived_pickup_at end,
      rider_onboarded_at = case when v_next_status = 'rider_onboarded' and trips.rider_onboarded_at is null then now() else trips.rider_onboarded_at end,
      completed_at = case when v_next_status = 'completed' and trips.completed_at is null then now() else trips.completed_at end,
      cancelled_at = case when v_next_status = 'cancelled' and trips.cancelled_at is null then now() else trips.cancelled_at end,
      cancellation_reason = case when v_next_status = 'cancelled' then nullif(btrim(p_cancellation_reason), '') else trips.cancellation_reason end,
      updated_at = now()
  where trips.id = v_trip.id
  returning * into v_trip;

  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    v_actor_user_id,
    'trip.trips.driver_transition',
    'trip.trips',
    v_trip.id::text,
    null,
    jsonb_build_object('trip_status', v_trip.trip_status, 'driver_user_id', v_trip.driver_user_id, 'vehicle_id', v_trip.vehicle_id),
    jsonb_build_object('payment_touched', false, 'wallet_touched', false, 'payout_touched', false)
  );

  return query select v_trip.id,
                      v_trip.request_id,
                      v_trip.accepted_offer_id,
                      v_trip.rider_user_id,
                      v_trip.driver_user_id,
                      v_trip.vehicle_id,
                      v_trip.trip_status,
                      v_trip.pickup_address_text,
                      v_trip.dropoff_address_text,
                      v_trip.service_type,
                      v_trip.estimate_minor,
                      v_trip.currency,
                      v_trip.accepted_at,
                      v_trip.en_route_pickup_at,
                      v_trip.arrived_pickup_at,
                      v_trip.rider_onboarded_at,
                      v_trip.completed_at,
                      v_trip.cancelled_at,
                      v_trip.created_at,
                      v_trip.updated_at;
end;
$$;

comment on function trip.advance_my_driver_trip(uuid, text, text) is
  'Driver-owned trip state transition RPC. It does not charge riders, pay drivers, create wallet entries, or grant admin authority.';

revoke execute on function trip.advance_my_driver_trip(uuid, text, text) from public, anon, authenticated;
grant execute on function trip.advance_my_driver_trip(uuid, text, text) to authenticated;
