revoke all on schema ops from public, anon, authenticated;
revoke execute on function ops.get_ops_rider_requests(integer) from public, anon, authenticated;
revoke execute on function ops.get_ops_trip_offers(integer) from public, anon, authenticated;
revoke execute on function ops.get_ops_trips(integer) from public, anon, authenticated;
revoke execute on function ops.get_ops_driver_profiles(integer) from public, anon, authenticated;
revoke execute on function ops.get_ops_vehicles(integer) from public, anon, authenticated;
revoke execute on function ops.get_ops_driver_documents(integer) from public, anon, authenticated;

comment on function ops.get_ops_rider_requests(integer) is 'Read-only ops snapshot. Does not mutate rider requests or dispatch.';
comment on function ops.get_ops_trip_offers(integer) is 'Read-only ops snapshot. Does not mutate offers or trips.';
comment on function ops.get_ops_trips(integer) is 'Read-only ops snapshot. Does not mutate trip lifecycle, payments, wallets, or payouts.';
comment on function ops.get_ops_driver_profiles(integer) is 'Read-only ops snapshot. Does not approve, reject, suspend, or mutate drivers.';
comment on function ops.get_ops_vehicles(integer) is 'Read-only ops snapshot. Does not approve, reject, suspend, or mutate vehicles.';
comment on function ops.get_ops_driver_documents(integer) is 'Read-only ops snapshot. Does not approve, reject, or mutate documents.';
