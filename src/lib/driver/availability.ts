export type SafeDriverAvailability = {
  user_id?: string;
  vehicle_id: string | null;
  availability_status: string;
  latitude: number | null;
  longitude: number | null;
  heading_degrees: number | null;
  accuracy_meters: number | null;
  last_heartbeat_at: string | null;
  heartbeat_expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type DriverAvailabilityResult =
  | { ok: true; data: SafeDriverAvailability | null }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type DriverAvailabilityRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

type RpcDriverAvailabilityRow = {
  user_id?: unknown;
  vehicle_id?: unknown;
  availability_status?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  heading_degrees?: unknown;
  accuracy_meters?: unknown;
  last_heartbeat_at?: unknown;
  heartbeat_expires_at?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

const SAFE_DRIVER_AVAILABILITY_LOAD_ERROR = 'We could not load your driver availability right now.';
const SAFE_DRIVER_AVAILABILITY_ONLINE_ERROR = 'We could not set driver availability right now. Please try again.';
const SAFE_DRIVER_LOCATION_ERROR = 'We could not update driver location right now. Please try again.';
const SAFE_DRIVER_OFF_DUTY_ERROR = 'We could not turn driver availability off right now. Please try again.';

function stringOrNull(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function numberOrNull(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizeFiniteNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toSafeDriverAvailability(row: RpcDriverAvailabilityRow | null | undefined): SafeDriverAvailability {
  return {
    user_id: stringOrNull(row?.user_id) ?? undefined,
    vehicle_id: stringOrNull(row?.vehicle_id),
    availability_status: stringOrNull(row?.availability_status) ?? 'offline',
    latitude: numberOrNull(row?.latitude),
    longitude: numberOrNull(row?.longitude),
    heading_degrees: numberOrNull(row?.heading_degrees),
    accuracy_meters: numberOrNull(row?.accuracy_meters),
    last_heartbeat_at: stringOrNull(row?.last_heartbeat_at),
    heartbeat_expires_at: stringOrNull(row?.heartbeat_expires_at),
    created_at: stringOrNull(row?.created_at),
    updated_at: stringOrNull(row?.updated_at),
  };
}

function firstRow<TRow>(data: TRow[] | TRow | null) {
  return Array.isArray(data) ? data[0] : data;
}

export async function getMyDriverAvailability(
  client: DriverAvailabilityRpcClient,
): Promise<DriverAvailabilityResult> {
  try {
    const { data, error } = await client.rpc<RpcDriverAvailabilityRow>('get_my_driver_availability');

    if (error) {
      return { ok: false, error: { message: SAFE_DRIVER_AVAILABILITY_LOAD_ERROR } };
    }

    const row = firstRow(data);
    return { ok: true, data: row ? toSafeDriverAvailability(row) : null };
  } catch {
    return { ok: false, error: { message: SAFE_DRIVER_AVAILABILITY_LOAD_ERROR } };
  }
}

export async function setMyDriverOnline(
  client: DriverAvailabilityRpcClient,
  vehicleId: string,
): Promise<DriverAvailabilityResult> {
  try {
    const { data, error } = await client.rpc<RpcDriverAvailabilityRow>('set_my_driver_online', {
      p_vehicle_id: vehicleId,
    });

    if (error) {
      return { ok: false, error: { message: SAFE_DRIVER_AVAILABILITY_ONLINE_ERROR } };
    }

    return { ok: true, data: toSafeDriverAvailability(firstRow(data)) };
  } catch {
    return { ok: false, error: { message: SAFE_DRIVER_AVAILABILITY_ONLINE_ERROR } };
  }
}

export async function updateMyDriverLocationPing(
  client: DriverAvailabilityRpcClient,
  input: {
    latitude: number;
    longitude: number;
    heading_degrees?: number | null;
    accuracy_meters?: number | null;
  },
): Promise<DriverAvailabilityResult> {
  try {
    const { data, error } = await client.rpc<RpcDriverAvailabilityRow>('update_my_driver_location_ping', {
      p_latitude: normalizeFiniteNumber(input.latitude),
      p_longitude: normalizeFiniteNumber(input.longitude),
      p_heading_degrees: normalizeFiniteNumber(input.heading_degrees),
      p_accuracy_meters: normalizeFiniteNumber(input.accuracy_meters),
    });

    if (error) {
      return { ok: false, error: { message: SAFE_DRIVER_LOCATION_ERROR } };
    }

    return { ok: true, data: toSafeDriverAvailability(firstRow(data)) };
  } catch {
    return { ok: false, error: { message: SAFE_DRIVER_LOCATION_ERROR } };
  }
}

export async function setMyDriverOffDuty(
  client: DriverAvailabilityRpcClient,
): Promise<DriverAvailabilityResult> {
  try {
    const { data, error } = await client.rpc<RpcDriverAvailabilityRow>('set_my_driver_off_duty');

    if (error) {
      return { ok: false, error: { message: SAFE_DRIVER_OFF_DUTY_ERROR } };
    }

    return { ok: true, data: toSafeDriverAvailability(firstRow(data)) };
  } catch {
    return { ok: false, error: { message: SAFE_DRIVER_OFF_DUTY_ERROR } };
  }
}
