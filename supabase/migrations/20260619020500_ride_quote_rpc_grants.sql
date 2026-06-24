revoke all on function rider.create_my_ride_quote(text, numeric, numeric, text, numeric, numeric, text) from public, anon, authenticated;
revoke all on function rider.get_my_ride_quotes() from public, anon, authenticated;

grant execute on function rider.create_my_ride_quote(text, numeric, numeric, text, numeric, numeric, text) to authenticated;
grant execute on function rider.get_my_ride_quotes() to authenticated;
