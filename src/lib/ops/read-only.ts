type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type OpsRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

export type OpsReadResult<TRow> =
  | { ok: true; data: TRow[] }
  | { ok: false; error: { message: string } };

export type OpsRiderRequest = {
  id: string;
  user_id: string;
  quote_id: string | null;
  pickup_address_text: string;
  dropoff_address_text: string;
  service_type: string;
  estimate_minor: number;
  currency: 'PHP';
  status: string;
  requested_at: string | null;
  cancelled_at: string | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type OpsTripOffer = {
  id: string;
  request_id: string;
  driver_user_id: string;
  vehicle_id: string;
  offer_status: string;
  offered_at: string | null;
  responded_at: string | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type OpsTrip = {
  id: string;
  request_id: string;
  accepted_offer_id: string;
  rider_user_id: string;
  driver_user_id: string;
  vehicle_id: string;
  trip_status: string;
  pickup_address_text: string;
  dropoff_address_text: string;
  service_type: string;
  estimate_minor: number;
  currency: 'PHP';
  accepted_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type OpsDriverProfile = {
  user_id: string;
  display_name: string | null;
  phone: string | null;
  service_area_text: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

export type OpsVehicle = {
  id: string;
  user_id: string;
  plate_number: string;
  vehicle_type: string;
  make: string | null;
  model: string | null;
  color: string | null;
  year: number | null;
  capacity: number;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

export type OpsDriverDocument = {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  document_type: string;
  storage_path: string;
  file_name: string | null;
  mime_type: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type GenericOpsRow = Record<string, unknown>;

const SAFE_OPS_READ_ERROR = 'We could not load the ops snapshot right now.';

function stringOrNull(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function numberOrNull(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function numberOrZero(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function numberOrDefault(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeLimit(limit?: number) {
  if (typeof limit !== 'number' || !Number.isFinite(limit)) return 50;
  return Math.min(Math.max(Math.trunc(limit), 1), 100);
}

async function readOpsRows<TRow>(
  client: OpsRpcClient,
  rpcName: string,
  mapper: (row: GenericOpsRow) => TRow,
  limit?: number,
): Promise<OpsReadResult<TRow>> {
  try {
    const { data, error } = await client.rpc<GenericOpsRow>(rpcName, { p_limit: normalizeLimit(limit) });

    if (error) return { ok: false, error: { message: SAFE_OPS_READ_ERROR } };

    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return { ok: true, data: rows.map(mapper) };
  } catch {
    return { ok: false, error: { message: SAFE_OPS_READ_ERROR } };
  }
}

export function toOpsRiderRequest(row: GenericOpsRow): OpsRiderRequest {
  return {
    id: stringOrNull(row.id) ?? '',
    user_id: stringOrNull(row.user_id) ?? '',
    quote_id: stringOrNull(row.quote_id),
    pickup_address_text: stringOrNull(row.pickup_address_text) ?? '',
    dropoff_address_text: stringOrNull(row.dropoff_address_text) ?? '',
    service_type: stringOrNull(row.service_type) ?? 'standard',
    estimate_minor: numberOrZero(row.estimate_minor),
    currency: 'PHP',
    status: stringOrNull(row.status) ?? 'requested',
    requested_at: stringOrNull(row.requested_at),
    cancelled_at: stringOrNull(row.cancelled_at),
    expires_at: stringOrNull(row.expires_at),
    created_at: stringOrNull(row.created_at),
    updated_at: stringOrNull(row.updated_at),
  };
}

export function toOpsTripOffer(row: GenericOpsRow): OpsTripOffer {
  return {
    id: stringOrNull(row.id) ?? '',
    request_id: stringOrNull(row.request_id) ?? '',
    driver_user_id: stringOrNull(row.driver_user_id) ?? '',
    vehicle_id: stringOrNull(row.vehicle_id) ?? '',
    offer_status: stringOrNull(row.offer_status) ?? 'offered',
    offered_at: stringOrNull(row.offered_at),
    responded_at: stringOrNull(row.responded_at),
    expires_at: stringOrNull(row.expires_at),
    created_at: stringOrNull(row.created_at),
    updated_at: stringOrNull(row.updated_at),
  };
}

export function toOpsTrip(row: GenericOpsRow): OpsTrip {
  return {
    id: stringOrNull(row.id) ?? '',
    request_id: stringOrNull(row.request_id) ?? '',
    accepted_offer_id: stringOrNull(row.accepted_offer_id) ?? '',
    rider_user_id: stringOrNull(row.rider_user_id) ?? '',
    driver_user_id: stringOrNull(row.driver_user_id) ?? '',
    vehicle_id: stringOrNull(row.vehicle_id) ?? '',
    trip_status: stringOrNull(row.trip_status) ?? 'accepted',
    pickup_address_text: stringOrNull(row.pickup_address_text) ?? '',
    dropoff_address_text: stringOrNull(row.dropoff_address_text) ?? '',
    service_type: stringOrNull(row.service_type) ?? 'standard',
    estimate_minor: numberOrZero(row.estimate_minor),
    currency: 'PHP',
    accepted_at: stringOrNull(row.accepted_at),
    completed_at: stringOrNull(row.completed_at),
    cancelled_at: stringOrNull(row.cancelled_at),
    created_at: stringOrNull(row.created_at),
    updated_at: stringOrNull(row.updated_at),
  };
}

export function toOpsDriverProfile(row: GenericOpsRow): OpsDriverProfile {
  return {
    user_id: stringOrNull(row.user_id) ?? '',
    display_name: stringOrNull(row.display_name),
    phone: stringOrNull(row.phone),
    service_area_text: stringOrNull(row.service_area_text),
    status: stringOrNull(row.status) ?? 'draft',
    created_at: stringOrNull(row.created_at),
    updated_at: stringOrNull(row.updated_at),
  };
}

export function toOpsVehicle(row: GenericOpsRow): OpsVehicle {
  return {
    id: stringOrNull(row.id) ?? '',
    user_id: stringOrNull(row.user_id) ?? '',
    plate_number: stringOrNull(row.plate_number) ?? '',
    vehicle_type: stringOrNull(row.vehicle_type) ?? 'other',
    make: stringOrNull(row.make),
    model: stringOrNull(row.model),
    color: stringOrNull(row.color),
    year: numberOrNull(row.year),
    capacity: numberOrDefault(row.capacity, 4),
    status: stringOrNull(row.status) ?? 'draft',
    created_at: stringOrNull(row.created_at),
    updated_at: stringOrNull(row.updated_at),
  };
}

export function toOpsDriverDocument(row: GenericOpsRow): OpsDriverDocument {
  return {
    id: stringOrNull(row.id) ?? '',
    user_id: stringOrNull(row.user_id) ?? '',
    vehicle_id: stringOrNull(row.vehicle_id),
    document_type: stringOrNull(row.document_type) ?? 'other',
    storage_path: stringOrNull(row.storage_path) ?? '',
    file_name: stringOrNull(row.file_name),
    mime_type: stringOrNull(row.mime_type),
    status: stringOrNull(row.status) ?? 'submitted',
    rejection_reason: stringOrNull(row.rejection_reason),
    created_at: stringOrNull(row.created_at),
    updated_at: stringOrNull(row.updated_at),
  };
}

export const getOpsRiderRequests = (client: OpsRpcClient, limit?: number) =>
  readOpsRows(client, 'get_ops_rider_requests', toOpsRiderRequest, limit);

export const getOpsTripOffers = (client: OpsRpcClient, limit?: number) =>
  readOpsRows(client, 'get_ops_trip_offers', toOpsTripOffer, limit);

export const getOpsTrips = (client: OpsRpcClient, limit?: number) =>
  readOpsRows(client, 'get_ops_trips', toOpsTrip, limit);

export const getOpsDriverProfiles = (client: OpsRpcClient, limit?: number) =>
  readOpsRows(client, 'get_ops_driver_profiles', toOpsDriverProfile, limit);

export const getOpsVehicles = (client: OpsRpcClient, limit?: number) =>
  readOpsRows(client, 'get_ops_vehicles', toOpsVehicle, limit);

export const getOpsDriverDocuments = (client: OpsRpcClient, limit?: number) =>
  readOpsRows(client, 'get_ops_driver_documents', toOpsDriverDocument, limit);
