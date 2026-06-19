-- Grant only the approved saved-place RPCs to authenticated callers.
-- The saved places table remains default-deny and RPC-only.

revoke all on function rider.get_my_saved_places() from public, anon, authenticated;
revoke all on function rider.upsert_my_saved_place(uuid, text, text, text, numeric, numeric, text) from public, anon, authenticated;
revoke all on function rider.delete_my_saved_place(uuid) from public, anon, authenticated;

grant execute on function rider.get_my_saved_places() to authenticated;
grant execute on function rider.upsert_my_saved_place(uuid, text, text, text, numeric, numeric, text) to authenticated;
grant execute on function rider.delete_my_saved_place(uuid) to authenticated;
