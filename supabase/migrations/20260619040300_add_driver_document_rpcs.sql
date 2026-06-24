create or replace function driver.submit_my_driver_document(
  p_vehicle_id uuid,
  p_document_type text,
  p_storage_path text,
  p_file_name text,
  p_mime_type text
)
returns table (
  id uuid,
  vehicle_id uuid,
  document_type text,
  storage_path text,
  file_name text,
  mime_type text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = driver, audit, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_document_type text := coalesce(nullif(btrim(p_document_type), ''), 'other');
  v_vehicle driver.vehicles%rowtype;
  v_document driver.documents%rowtype;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  if nullif(btrim(p_storage_path), '') is null then
    raise exception 'storage path required' using errcode = '22023';
  end if;

  if v_document_type not in ('drivers_license', 'government_id', 'or_cr', 'vehicle_photo', 'selfie', 'other') then
    v_document_type := 'other';
  end if;

  if p_vehicle_id is not null then
    select * into v_vehicle
    from driver.vehicles vehicle
    where vehicle.id = p_vehicle_id and vehicle.user_id = v_actor_user_id;

    if v_vehicle.id is null then
      raise exception 'vehicle not found' using errcode = '22023';
    end if;
  end if;

  insert into driver.documents (user_id, vehicle_id, document_type, storage_path, file_name, mime_type, status)
  values (v_actor_user_id, p_vehicle_id, v_document_type, btrim(p_storage_path), nullif(btrim(p_file_name), ''), nullif(btrim(p_mime_type), ''), 'submitted')
  returning * into v_document;

  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    v_actor_user_id,
    'driver.documents.submit_self_document',
    'driver.documents',
    v_document.id::text,
    null,
    jsonb_build_object('vehicle_id', v_document.vehicle_id, 'document_type', v_document.document_type, 'status', v_document.status),
    jsonb_build_object('approval_granted', false)
  );

  return query select v_document.id, v_document.vehicle_id, v_document.document_type, v_document.storage_path, v_document.file_name, v_document.mime_type, v_document.status, v_document.created_at, v_document.updated_at;
end;
$$;

create or replace function driver.get_my_driver_documents()
returns table (
  id uuid,
  vehicle_id uuid,
  document_type text,
  storage_path text,
  file_name text,
  mime_type text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = driver, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  return query
  select driver_document.id, driver_document.vehicle_id, driver_document.document_type, driver_document.storage_path, driver_document.file_name, driver_document.mime_type, driver_document.status, driver_document.created_at, driver_document.updated_at
  from driver.documents driver_document
  where driver_document.user_id = v_actor_user_id
  order by driver_document.created_at desc;
end;
$$;

revoke all on function driver.submit_my_driver_document(uuid, text, text, text, text) from public, anon, authenticated;
revoke all on function driver.get_my_driver_documents() from public, anon, authenticated;
grant execute on function driver.submit_my_driver_document(uuid, text, text, text, text) to authenticated;
grant execute on function driver.get_my_driver_documents() to authenticated;
