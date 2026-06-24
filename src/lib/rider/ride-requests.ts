export type SafeRideRequest = {
  id: string;
  quote_id: string | null;
  pickup_address_text: string;
  dropoff_address_text: string;
  service_type: string;
  estimate_minor: number;
  currency: 'PHP';
  status: string;
  rider_notes: string | null;
  requested_at: string | null;
  cancelled_at: string | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type RideRequestsResult =
  | { ok: true; data: SafeRideRequest[] }
  | { ok: false; error: { message: string } };

export type RideRequestResult =
  | { ok: true; data: SafeRideRequest }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type RideRequestRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

type RpcRideRequestRow = {
  id?: unknown;
  quote_id?: unknown;
  pickup_address_text?: unknown;
  dropoff_address_text?: unknown;
  service_type?: unknown;
  estimate_minor?: unknown;
  currency?: unknown;
  status?: unknown;
  rider_notes?: unknown;
  requested_at?: unknown;
  cancelled_at?: unknown;
  expires_at?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

const SAFE_RIDE_REQUEST_LOAD_ERROR = 'We could not load your ride requests right now.';
const SAFE_RIDE_REQUEST_CREATE_ERROR = 'We could not create this ride request right now. Please try again.';
const SAFE_RIDE_REQUEST_CANCEL_ERROR = 'We could not cancel this ride request right now. Please try again.';

function stringOrNull(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function numberOrZero(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function toSafeRideRequest(row: RpcRideRequestRow | null | undefined): SafeRideRequest {
  return {
    id: stringOrNull(row?.id) ?? '',
    quote_id: stringOrNull(row?.quote_id),
    pickup_address_text: stringOrNull(row?.pickup_address_text) ?? '',
    dropoff_address_text: stringOrNull(row?.dropoff_address_text) ?? '',
    service_type: stringOrNull(row?.service_type) ?? 'standard',
    estimate_minor: numberOrZero(row?.estimate_minor),
    currency: 'PHP',
    status: stringOrNull(row?.status) ?? 'requested',
    rider_notes: stringOrNull(row?.rider_notes),
    requested_at: stringOrNull(row?.requested_at),
    cancelled_at: stringOrNull(row?.cancelled_at),
    expires_at: stringOrNull(row?.expires_at),
    created_at: stringOrNull(row?.created_at),
    updated_at: stringOrNull(row?.updated_at),
  };
}

export async function getMyRideRequests(client: RideRequestRpcClient): Promise<RideRequestsResult> {
  try {
    const { data, error } = await client.rpc<RpcRideRequestRow>('get_my_ride_requests');

    if (error) {
      return { ok: false, error: { message: SAFE_RIDE_REQUEST_LOAD_ERROR } };
    }

    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return { ok: true, data: rows.map(toSafeRideRequest) };
  } catch {
    return { ok: false, error: { message: SAFE_RIDE_REQUEST_LOAD_ERROR } };
  }
}

export async function createMyRideRequest(
  client: RideRequestRpcClient,
  input: { quoteId: string; riderNotes?: string | null },
): Promise<RideRequestResult> {
  try {
    const { data, error } = await client.rpc<RpcRideRequestRow>('create_my_ride_request', {
      p_quote_id: input.quoteId,
      p_rider_notes: input.riderNotes?.trim() || null,
    });

    if (error) {
      return { ok: false, error: { message: SAFE_RIDE_REQUEST_CREATE_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: toSafeRideRequest(row) };
  } catch {
    return { ok: false, error: { message: SAFE_RIDE_REQUEST_CREATE_ERROR } };
  }
}

export async function cancelMyRideRequest(
  client: RideRequestRpcClient,
  requestId: string,
): Promise<RideRequestResult> {
  try {
    const { data, error } = await client.rpc<RpcRideRequestRow>('cancel_my_ride_request', {
      p_request_id: requestId,
    });

    if (error) {
      return { ok: false, error: { message: SAFE_RIDE_REQUEST_CANCEL_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: toSafeRideRequest(row) };
  } catch {
    return { ok: false, error: { message: SAFE_RIDE_REQUEST_CANCEL_ERROR } };
  }
}
