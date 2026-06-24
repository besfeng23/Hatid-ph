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

  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    null,
    'trip.trips.create_from_accepted_offer',
    'trip.trips',
    v_trip.id::text,
    null,
    jsonb_build_object('request_id', v_trip.request_id, 'driver_user_id', v_trip.driver_user_id, 'vehicle_id', v_trip.vehicle_id, 'trip_status', v_trip.trip_status),
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
                      v_trip.created_at,
                      v_trip.updated_at;
end;
$$;

comment on function trip.create_trip_from_accepted_offer(uuid) is
  'Server-side trip creation from an accepted dispatch offer. It does not charge riders, pay drivers, create wallet entries, or grant admin authority.';

revoke execute on function trip.create_trip_from_accepted_offer(uuid) from public, anon, authenticated;
