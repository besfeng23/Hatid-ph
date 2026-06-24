create or replace function trip.get_my_rider_trip_events(p_trip_id uuid)
returns table (
  id uuid,
  trip_id uuid,
  actor_user_id uuid,
  event_type text,
  trip_status text,
  occurred_at timestamptz,
  note text,
  created_at timestamptz
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
  select event.id,
         event.trip_id,
         event.actor_user_id,
         event.event_type,
         event.trip_status,
         event.occurred_at,
         event.note,
         event.created_at
  from trip.trip_events event
  join trip.trips trips on trips.id = event.trip_id
  where event.trip_id = p_trip_id
    and trips.rider_user_id = v_actor_user_id
  order by event.occurred_at asc, event.created_at asc;
end;
$$;

create or replace function trip.get_my_driver_trip_events(p_trip_id uuid)
returns table (
  id uuid,
  trip_id uuid,
  actor_user_id uuid,
  event_type text,
  trip_status text,
  occurred_at timestamptz,
  note text,
  created_at timestamptz
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
  select event.id,
         event.trip_id,
         event.actor_user_id,
         event.event_type,
         event.trip_status,
         event.occurred_at,
         event.note,
         event.created_at
  from trip.trip_events event
  join trip.trips trips on trips.id = event.trip_id
  where event.trip_id = p_trip_id
    and trips.driver_user_id = v_actor_user_id
  order by event.occurred_at asc, event.created_at asc;
end;
$$;

revoke execute on function trip.get_my_rider_trip_events(uuid) from public, anon, authenticated;
revoke execute on function trip.get_my_driver_trip_events(uuid) from public, anon, authenticated;
grant execute on function trip.get_my_rider_trip_events(uuid) to authenticated;
grant execute on function trip.get_my_driver_trip_events(uuid) to authenticated;
