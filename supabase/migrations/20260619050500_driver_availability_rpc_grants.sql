grant execute on function driver.get_my_driver_availability() to authenticated;
grant execute on function driver.set_my_driver_online(uuid) to authenticated;
grant execute on function driver.update_my_driver_location_ping(numeric, numeric, numeric, numeric) to authenticated;
grant execute on function driver.set_my_driver_off_duty() to authenticated;
