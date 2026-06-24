create or replace function dispatch.create_trip_offer_for_candidate(
  p_request_id uuid,
  p_driver_user_id uuid,
  p_vehicle_id uuid
)
returns table (
  id uuid,
  request_id uuid,
  driver_user_id uuid,
  vehicle_id uuid,
  offer_status text,
  offered_at timestamptz,
  responded_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = dispatch, rider, driver, audit, auth, pg_catalog
as $$
declare
  v_request rider.ride_requests%rowtype;
  v_candidate record;
  v_offer dispatch.trip_offers%rowtype;
begin
  select * into v_request
  from rider.ride_requests request
  where request.id = p_request_id
    and request.status = 'requested'
    and request.expires_at > now()
  for update;

  if v_request.id is null then
    raise exception 'request not available' using errcode = '22023';
  end if;

  select * into v_candidate
  from dispatch.find_ride_request_candidates(p_request_id, 25) candidate
  where candidate.driver_user_id = p_driver_user_id
    and candidate.vehicle_id = p_vehicle_id
  limit 1;

  if v_candidate.driver_user_id is null then
    raise exception 'candidate not eligible' using errcode = '22023';
  end if;

  insert into dispatch.trip_offers (
    request_id,
    driver_user_id,
    vehicle_id,
    offer_status,
    expires_at,
    metadata
  ) values (
    p_request_id,
    p_driver_user_id,
    p_vehicle_id,
    'offered',
    now() + interval '45 seconds',
    jsonb_build_object('dispatch_authority_granted', false)
  )
  returning * into v_offer;

  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    null,
    'dispatch.trip_offers.create_candidate_offer',
    'dispatch.trip_offers',
    v_offer.id::text,
    null,
    jsonb_build_object('request_id', v_offer.request_id, 'driver_user_id', v_offer.driver_user_id, 'vehicle_id', v_offer.vehicle_id, 'offer_status', v_offer.offer_status),
    jsonb_build_object('automatic_assignment', false, 'trip_created', false, 'payment_touched', false)
  );

  return query select v_offer.id,
                      v_offer.request_id,
                      v_offer.driver_user_id,
                      v_offer.vehicle_id,
                      v_offer.offer_status,
                      v_offer.offered_at,
                      v_offer.responded_at,
                      v_offer.expires_at,
                      v_offer.created_at,
                      v_offer.updated_at;
end;
$$;

comment on function dispatch.create_trip_offer_for_candidate(uuid, uuid, uuid) is
  'Server-side offer creation for an eligible candidate. It creates only an offer; it does not assign a trip, accept a ride, charge riders, pay drivers, or grant admin authority.';

revoke execute on function dispatch.create_trip_offer_for_candidate(uuid, uuid, uuid) from public, anon, authenticated;
