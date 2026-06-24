create or replace function rider.create_my_ride_quote(
  p_pickup_address_text text,
  p_pickup_latitude numeric,
  p_pickup_longitude numeric,
  p_dropoff_address_text text,
  p_dropoff_latitude numeric,
  p_dropoff_longitude numeric,
  p_service_type text
)
returns setof rider.ride_quotes
language plpgsql
security definer
set search_path = rider, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_quote rider.ride_quotes%rowtype;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  insert into rider.ride_quotes (
    user_id,
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
    expires_at
  )
  values (
    v_actor_user_id,
    btrim(p_pickup_address_text),
    p_pickup_latitude,
    p_pickup_longitude,
    btrim(p_dropoff_address_text),
    p_dropoff_latitude,
    p_dropoff_longitude,
    coalesce(nullif(btrim(p_service_type), ''), 'standard'),
    5.00,
    23,
    17000,
    'PHP',
    'quoted',
    now() + interval '15 minutes'
  )
  returning * into v_quote;

  return next v_quote;
end;
$$;
