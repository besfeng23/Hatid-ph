export type EditableDriverVehicleInput = {
  id?: string | null;
  plate_number: string;
  vehicle_type: string;
  make?: string | null;
  model?: string | null;
  color?: string | null;
  year?: number | null;
  capacity?: number | null;
};

export type SafeDriverVehicle = {
  id: string;
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

export type DriverVehiclesResult =
  | { ok: true; data: SafeDriverVehicle[] }
  | { ok: false; error: { message: string } };

export type DriverVehicleResult =
  | { ok: true; data: SafeDriverVehicle }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type DriverVehicleRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

type RpcDriverVehicleRow = {
  id?: unknown;
  plate_number?: unknown;
  vehicle_type?: unknown;
  make?: unknown;
  model?: unknown;
  color?: unknown;
  year?: unknown;
  capacity?: unknown;
  status?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

const SAFE_DRIVER_VEHICLES_LOAD_ERROR = 'We could not load your vehicles right now.';
const SAFE_DRIVER_VEHICLE_SAVE_ERROR = 'We could not save this vehicle right now. Please try again.';

function normalizeRequiredText(value: string) {
  return value.trim();
}

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeOptionalNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function stringOrNull(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function numberOrNull(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function numberOrDefault(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function toSafeDriverVehicle(row: RpcDriverVehicleRow | null | undefined): SafeDriverVehicle {
  return {
    id: stringOrNull(row?.id) ?? '',
    plate_number: stringOrNull(row?.plate_number) ?? '',
    vehicle_type: stringOrNull(row?.vehicle_type) ?? 'other',
    make: stringOrNull(row?.make),
    model: stringOrNull(row?.model),
    color: stringOrNull(row?.color),
    year: numberOrNull(row?.year),
    capacity: numberOrDefault(row?.capacity, 4),
    status: stringOrNull(row?.status) ?? 'draft',
    created_at: stringOrNull(row?.created_at),
    updated_at: stringOrNull(row?.updated_at),
  };
}

export async function getMyVehicles(client: DriverVehicleRpcClient): Promise<DriverVehiclesResult> {
  try {
    const { data, error } = await client.rpc<RpcDriverVehicleRow>('get_my_vehicles');

    if (error) {
      return { ok: false, error: { message: SAFE_DRIVER_VEHICLES_LOAD_ERROR } };
    }

    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return { ok: true, data: rows.map(toSafeDriverVehicle) };
  } catch {
    return { ok: false, error: { message: SAFE_DRIVER_VEHICLES_LOAD_ERROR } };
  }
}

export async function saveMyVehicle(
  client: DriverVehicleRpcClient,
  input: EditableDriverVehicleInput,
): Promise<DriverVehicleResult> {
  try {
    const { data, error } = await client.rpc<RpcDriverVehicleRow>('upsert_my_vehicle', {
      p_vehicle_id: input.id ?? null,
      p_plate_number: normalizeRequiredText(input.plate_number),
      p_vehicle_type: normalizeRequiredText(input.vehicle_type),
      p_make: normalizeOptionalText(input.make),
      p_model: normalizeOptionalText(input.model),
      p_color: normalizeOptionalText(input.color),
      p_year: normalizeOptionalNumber(input.year),
      p_capacity: normalizeOptionalNumber(input.capacity),
    });

    if (error) {
      return { ok: false, error: { message: SAFE_DRIVER_VEHICLE_SAVE_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: toSafeDriverVehicle(row) };
  } catch {
    return { ok: false, error: { message: SAFE_DRIVER_VEHICLE_SAVE_ERROR } };
  }
}
