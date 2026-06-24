alter table rider.ride_requests
  add constraint ride_requests_service_type_check check (service_type in ('standard', 'premium', 'delivery')),
  add constraint ride_requests_status_check check (status in ('requested', 'cancelled', 'expired')),
  add constraint ride_requests_estimate_non_negative check (estimate_minor >= 0),
  add constraint ride_requests_currency_php_only check (currency = 'PHP'),
  add constraint ride_requests_metadata_is_object check (jsonb_typeof(metadata) = 'object'),
  add constraint ride_requests_expires_after_created check (expires_at > created_at);
