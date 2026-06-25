create or replace function trip.create_trip_from_accepted_offer(p_offer_id uuid)
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
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = trip, dispatch, rider, audit, auth, pg_catalog
as $$
declare
  v_offer dispatch.trip_offers%rowtype;
  v_request rider.ride_requests%rowtype;
  v_trip trip.trips%rowtype;
begin
  select * into v_offer
  from dispatch.trip_offers offer
  where offer.id = p_offer_id
    and offer.offer_status = 'accepted'
  for update;

  if v_offer.id is null then
    raise exception 'accepted offer not found' using errcode = '22023';
  end if;

  select * into v_request
  from rider.ride_requests request
  where request.id = v_offer.request_id
  for update;

  if v_request.id is null then
    raise exception 'request not found' using errcode = '22023';
  end if;

  insert into trip.trips (
    request_id,
    accepted_offer_id,
    rider_user_id,
    driver_user_id,
    vehicle_id,
    trip_status,
    pickup_address_text,
    pickup_latitude,
    pickup_longitude,
    dropoff_address_text,
    dropoff_latitude,
    dropoff_longitude,
    service_type,
    estimate_minor,
    currency
  ) values (
    v_request.id,
    v_offer.id,
    v_request.user_id,
    v_offer.driver_user_id,
    v_offer.vehicle_id,
    'accepted',
    v_request.pickup_address_text,
    v_request.pickup_latitude,
    v_request.pickup_longitude,
    v_request.dropoff_address_text,
    v_request.dropoff_latitude,
    v_request.dropoff_longitude,
    v_request.service_type,
    v_request.estimate_minor,
    v_request.currency
  )
  returning * into v_trip;

  insert into trip.trip_events (trip_id, actor_user_id, event_type, trip_status, occurred_at, metadata)
  values (
    v_trip.id,
    null,
    'trip_created',
    v_trip.trip_status,
    v_trip.accepted_at,
    jsonb_build_object('request_id', v_trip.request_id, 'accepted_offer_id', v_trip.accepted_offer_id, 'payment_touched', false)
  );

  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    null,
    'trip.trips.create_from_accepted_offer',
    'trip.trips',
    v_trip.id::text,
    null,
    jsonb_build_object('request_id', v_trip.request_id, 'driver_user_id', v_trip.driver_user_id, 'vehicle_id', v_trip.vehicle_id, 'trip_status', v_trip.trip_status),
    jsonb_build_object('payment_touched', false, 'wallet_touched', false, 'payout_touched', false, 'timeline_event_written', true)
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
                      v_trip.created_at,
                      v_trip.updated_at;
end;
$$;

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
  v_previous_status text;
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

  v_previous_status := v_trip.trip_status;

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

  insert into trip.trip_events (trip_id, actor_user_id, event_type, trip_status, occurred_at, note, metadata)
  values (
    v_trip.id,
    v_actor_user_id,
    case when v_next_status = 'cancelled' then 'trip_cancelled' else 'status_changed' end,
    v_trip.trip_status,
    now(),
    case when v_next_status = 'cancelled' then nullif(btrim(p_cancellation_reason), '') else null end,
    jsonb_build_object('previous_status', v_previous_status, 'payment_touched', false, 'wallet_touched', false, 'payout_touched', false)
  );

  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    v_actor_user_id,
    'trip.trips.driver_transition',
    'trip.trips',
    v_trip.id::text,
    jsonb_build_object('trip_status', v_previous_status),
    jsonb_build_object('trip_status', v_trip.trip_status, 'driver_user_id', v_trip.driver_user_id, 'vehicle_id', v_trip.vehicle_id),
    jsonb_build_object('payment_touched', false, 'wallet_touched', false, 'payout_touched', false, 'timeline_event_written', true)
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
