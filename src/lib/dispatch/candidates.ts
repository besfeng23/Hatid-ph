export type DispatchCandidate = {
  driver_user_id: string;
  vehicle_id: string;
  vehicle_type: string;
  vehicle_status: string;
  availability_status: string;
  distance_km: number;
  last_heartbeat_at: string | null;
  heartbeat_expires_at: string | null;
};

export type DispatchCandidatesResult =
  | { ok: true; data: DispatchCandidate[] }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type DispatchCandidateRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

type RpcDispatchCandidateRow = {
  driver_user_id?: unknown;
  vehicle_id?: unknown;
  vehicle_type?: unknown;
  vehicle_status?: unknown;
  availability_status?: unknown;
  distance_km?: unknown;
  last_heartbeat_at?: unknown;
  heartbeat_expires_at?: unknown;
};

const SAFE_CANDIDATE_LOAD_ERROR = 'We could not load dispatch candidates right now.';

function stringOrNull(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function numberOrZero(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function toDispatchCandidate(row: RpcDispatchCandidateRow): DispatchCandidate {
  return {
    driver_user_id: stringOrNull(row.driver_user_id) ?? '',
    vehicle_id: stringOrNull(row.vehicle_id) ?? '',
    vehicle_type: stringOrNull(row.vehicle_type) ?? 'other',
    vehicle_status: stringOrNull(row.vehicle_status) ?? 'unknown',
    availability_status: stringOrNull(row.availability_status) ?? 'offline',
    distance_km: numberOrZero(row.distance_km),
    last_heartbeat_at: stringOrNull(row.last_heartbeat_at),
    heartbeat_expires_at: stringOrNull(row.heartbeat_expires_at),
  };
}

export async function findRideRequestCandidates(
  client: DispatchCandidateRpcClient,
  input: { requestId: string; limit?: number },
): Promise<DispatchCandidatesResult> {
  try {
    const limit = typeof input.limit === 'number' && Number.isFinite(input.limit) ? input.limit : 10;
    const { data, error } = await client.rpc<RpcDispatchCandidateRow>('find_ride_request_candidates', {
      p_request_id: input.requestId,
      p_limit: Math.min(Math.max(Math.trunc(limit), 1), 25),
    });

    if (error) {
      return { ok: false, error: { message: SAFE_CANDIDATE_LOAD_ERROR } };
    }

    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return { ok: true, data: rows.map(toDispatchCandidate) };
  } catch {
    return { ok: false, error: { message: SAFE_CANDIDATE_LOAD_ERROR } };
  }
}
