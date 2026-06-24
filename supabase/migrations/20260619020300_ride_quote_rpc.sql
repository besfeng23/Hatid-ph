create or replace function rider.get_my_ride_quotes()
returns setof rider.ride_quotes
language sql
security definer
set search_path = rider, auth, pg_catalog
as $$
  select * from rider.ride_quotes where user_id = auth.uid() order by created_at desc limit 25;
$$;
