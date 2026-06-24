export type SafeDriverProfile = {
  user_id?: string;
  display_name: string | null;
  phone: string | null;
  service_area_text: string | null;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type DriverProfileResult =
  | { ok: true; data: SafeDriverProfile | null }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type DriverProfileRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

type RpcDriverProfileRow = {
  user_id?: unknown;
  display_name?: unknown;
  phone?: unknown;
  service_area_text?: unknown;
  status?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

const SAFE_DRIVER_PROFILE_LOAD_ERROR = 'We could not load your driver profile right now.';
const SAFE_DRIVER_PROFILE_SAVE_ERROR = 'We could not save your driver profile right now. Please try again.';

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed.length > 0 ? trimmed : null;
}

function stringOrNull(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function toSafeDriverProfile(row: RpcDriverProfileRow | null | undefined): SafeDriverProfile {
  return {
    user_id: stringOrNull(row?.user_id) ?? undefined,
    display_name: stringOrNull(row?.display_name),
    phone: stringOrNull(row?.phone),
    service_area_text: stringOrNull(row?.service_area_text),
    status: stringOrNull(row?.status) ?? 'draft',
    created_at: stringOrNull(row?.created_at),
    updated_at: stringOrNull(row?.updated_at),
  };
}

export async function getMyDriverProfile(client: DriverProfileRpcClient): Promise<DriverProfileResult> {
  try {
    const { data, error } = await client.rpc<RpcDriverProfileRow>('get_my_driver_profile');

    if (error) {
      return { ok: false, error: { message: SAFE_DRIVER_PROFILE_LOAD_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: row ? toSafeDriverProfile(row) : null };
  } catch {
    return { ok: false, error: { message: SAFE_DRIVER_PROFILE_LOAD_ERROR } };
  }
}

export async function saveMyDriverProfile(
  client: DriverProfileRpcClient,
  input: { display_name?: string | null; phone?: string | null; service_area_text?: string | null },
): Promise<DriverProfileResult> {
  try {
    const { data, error } = await client.rpc<RpcDriverProfileRow>('upsert_my_driver_profile', {
      p_display_name: normalizeOptionalText(input.display_name),
      p_phone: normalizeOptionalText(input.phone),
      p_service_area_text: normalizeOptionalText(input.service_area_text),
    });

    if (error) {
      return { ok: false, error: { message: SAFE_DRIVER_PROFILE_SAVE_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: row ? toSafeDriverProfile(row) : null };
  } catch {
    return { ok: false, error: { message: SAFE_DRIVER_PROFILE_SAVE_ERROR } };
  }
}
