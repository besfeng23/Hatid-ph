create or replace function rider.get_my_ride_requests()
returns setof rider.ride_requests
language sql
security definer
set search_path = rider, auth, pg_catalog
as $$
  select * from rider.ride_requests where user_id = auth.uid() order by created_at desc limit 25;
$$;

create or replace function rider.create_my_ride_request(
  p_quote_id uuid,
  p_rider_notes text
)
returns setof rider.ride_requests
language plpgsql
security definer
set search_path = rider, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_quote rider.ride_quotes%rowtype;
  v_request rider.ride_requests%rowtype;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  select * into v_quote
  from rider.ride_quotes quote
  where quote.id = p_quote_id and quote.user_id = v_actor_user_id and quote.status = 'quoted'
  for update;

  if v_quote.id is null then
    raise exception 'quote not found' using errcode = '22023';
  end if;

  insert into rider.ride_requests (
    user_id,
    quote_id,
    pickup_address_text,
    pickup_latitude,
    pickup_longitude,
    dropoff_address_text,
    dropoff_latitude,
    dropoff_longitude,
    service_type,
    estimated_distance_km,
    estimated_duration_minutes,
    estimate_minor,
    currency,
    status,
    rider_notes,
    expires_at
  ) values (
    v_actor_user_id,
    v_quote.id,
    v_quote.pickup_address_text,
    v_quote.pickup_latitude,
    v_quote.pickup_longitude,
    v_quote.dropoff_address_text,
    v_quote.dropoff_latitude,
    v_quote.dropoff_longitude,
    v_quote.service_type,
    v_quote.estimated_distance_km,
    v_quote.estimated_duration_minutes,
    v_quote.estimate_minor,
    v_quote.currency,
    'requested',
    nullif(btrim(p_rider_notes), ''),
    now() + interval '10 minutes'
  ) returning * into v_request;

  return next v_request;
end;
$$;

create or replace function rider.cancel_my_ride_request(p_request_id uuid)
returns setof rider.ride_requests
language plpgsql
security definer
set search_path = rider, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_request rider.ride_requests%rowtype;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  update rider.ride_requests request
  set status = 'cancelled', cancelled_at = now(), updated_at = now()
  where request.id = p_request_id and request.user_id = v_actor_user_id and request.status = 'requested'
  returning * into v_request;

  if v_request.id is null then
    raise exception 'request not found' using errcode = '22023';
  end if;

  return next v_request;
end;
$$;
