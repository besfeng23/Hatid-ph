create or replace function dispatch.get_my_driver_trip_offers()
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
set search_path = dispatch, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  return query
  select offer.id,
         offer.request_id,
         offer.driver_user_id,
         offer.vehicle_id,
         offer.offer_status,
         offer.offered_at,
         offer.responded_at,
         offer.expires_at,
         offer.created_at,
         offer.updated_at
  from dispatch.trip_offers offer
  where offer.driver_user_id = v_actor_user_id
  order by offer.created_at desc
  limit 25;
end;
$$;

create or replace function dispatch.respond_to_my_trip_offer(
  p_offer_id uuid,
  p_response text
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
set search_path = dispatch, audit, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_offer dispatch.trip_offers%rowtype;
  v_response text := lower(btrim(p_response));
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  if v_response not in ('accepted', 'rejected') then
    raise exception 'invalid response' using errcode = '22023';
  end if;

  update dispatch.trip_offers offer
  set offer_status = v_response,
      responded_at = now(),
      updated_at = now()
  where offer.id = p_offer_id
    and offer.driver_user_id = v_actor_user_id
    and offer.offer_status = 'offered'
    and offer.expires_at > now()
  returning * into v_offer;

  if v_offer.id is null then
    raise exception 'offer not available' using errcode = '22023';
  end if;

  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    v_actor_user_id,
    'dispatch.trip_offers.driver_response',
    'dispatch.trip_offers',
    v_offer.id::text,
    jsonb_build_object('offer_status', 'offered'),
    jsonb_build_object('offer_status', v_offer.offer_status, 'request_id', v_offer.request_id, 'vehicle_id', v_offer.vehicle_id),
    jsonb_build_object('trip_created', false, 'payment_touched', false)
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

revoke execute on function dispatch.get_my_driver_trip_offers() from public, anon, authenticated;
revoke execute on function dispatch.respond_to_my_trip_offer(uuid, text) from public, anon, authenticated;
grant execute on function dispatch.get_my_driver_trip_offers() to authenticated;
grant execute on function dispatch.respond_to_my_trip_offer(uuid, text) to authenticated;
