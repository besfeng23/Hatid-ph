export type EditableRiderProfileInput = {
  display_name: string;
  phone: string;
};

export type SafeRiderProfile = {
  display_name: string | null;
  phone: string | null;
  status: string | null;
};

export type SaveRiderProfileResult =
  | { ok: true; data: SafeRiderProfile }
  | { ok: false; error: { message: string } };

export type GetRiderProfileResult =
  | { ok: true; data: SafeRiderProfile | null }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type RiderProfileRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, string>) => Promise<RpcResponse<TRow>>;
};

type RpcRiderProfileRow = {
  display_name?: unknown;
  phone?: unknown;
  status?: unknown;
};

const SAFE_RIDER_PROFILE_LOAD_ERROR = 'We could not load your rider profile right now.';
const SAFE_RIDER_PROFILE_SAVE_ERROR = 'We could not save your rider profile right now. Please try again.';

function normalizeText(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '';
}

function toSafeRiderProfile(row: RpcRiderProfileRow | null | undefined): SafeRiderProfile {
  return {
    display_name: typeof row?.display_name === 'string' ? row.display_name.trim() : null,
    phone: typeof row?.phone === 'string' ? row.phone.trim() : null,
    status: typeof row?.status === 'string' ? row.status.trim() : null,
  };
}

export async function getMyRiderProfile(
  client: RiderProfileRpcClient,
): Promise<GetRiderProfileResult> {
  try {
    const { data, error } = await client.rpc<RpcRiderProfileRow>('get_my_rider_profile');

    if (error) {
      return { ok: false, error: { message: SAFE_RIDER_PROFILE_LOAD_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: row ? toSafeRiderProfile(row) : null };
  } catch {
    return { ok: false, error: { message: SAFE_RIDER_PROFILE_LOAD_ERROR } };
  }
}

export async function saveMyRiderProfile(
  client: RiderProfileRpcClient,
  input: EditableRiderProfileInput,
): Promise<SaveRiderProfileResult> {
  try {
    const { data, error } = await client.rpc<RpcRiderProfileRow>('upsert_my_rider_profile', {
      p_display_name: normalizeText(input.display_name),
      p_phone: normalizeText(input.phone),
    });

    if (error) {
      return { ok: false, error: { message: SAFE_RIDER_PROFILE_SAVE_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: toSafeRiderProfile(row) };
  } catch {
    return { ok: false, error: { message: SAFE_RIDER_PROFILE_SAVE_ERROR } };
  }
}
