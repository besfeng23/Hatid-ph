create schema if not exists ops;

comment on schema ops is
  'Read-only operations command center. It exposes safe operational snapshots only and does not mutate trips, drivers, riders, documents, payments, wallets, or payouts.';

create or replace function ops.get_ops_rider_requests(p_limit integer default 50)
returns table (
  id uuid,
  user_id uuid,
  quote_id uuid,
  pickup_address_text text,
  dropoff_address_text text,
  service_type text,
  estimate_minor integer,
  currency text,
  status text,
  requested_at timestamptz,
  cancelled_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = ops, rider, pg_catalog
as $$
begin
  if p_limit is null or p_limit < 1 or p_limit > 100 then
    raise exception 'invalid limit' using errcode = '22023';
  end if;

  return query
  select request.id,
         request.user_id,
         request.quote_id,
         request.pickup_address_text,
         request.dropoff_address_text,
         request.service_type,
         request.estimate_minor,
         request.currency,
         request.status,
         request.requested_at,
         request.cancelled_at,
         request.expires_at,
         request.created_at,
         request.updated_at
  from rider.ride_requests request
  order by request.created_at desc
  limit p_limit;
end;
$$;

create or replace function ops.get_ops_trip_offers(p_limit integer default 50)
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
set search_path = ops, dispatch, pg_catalog
as $$
begin
  if p_limit is null or p_limit < 1 or p_limit > 100 then
    raise exception 'invalid limit' using errcode = '22023';
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
  order by offer.created_at desc
  limit p_limit;
end;
$$;
