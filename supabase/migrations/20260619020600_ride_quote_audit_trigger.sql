create or replace function rider.audit_ride_quote_insert()
returns trigger
language plpgsql
security definer
set search_path = rider, audit, pg_catalog
as $$
begin
  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    new.user_id,
    'rider.ride_quotes.create_self_quote',
    'rider.ride_quotes',
    new.id::text,
    null,
    jsonb_build_object('service_type', new.service_type, 'estimate_minor', new.estimate_minor, 'currency', new.currency, 'status', new.status),
    jsonb_build_object('non_binding_estimate', true, 'client_supplied_estimate', false)
  );
  return new;
end;
$$;

create trigger ride_quotes_audit_insert
  after insert on rider.ride_quotes
  for each row
  execute function rider.audit_ride_quote_insert();
