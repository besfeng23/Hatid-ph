export type EditableAppUserProfileInput = {
  display_name: string;
  phone: string;
};

export type SafeAppUserProfile = {
  display_name: string | null;
  phone: string | null;
};

export type SaveAppUserProfileResult =
  | { ok: true; data: SafeAppUserProfile }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type AppUserProfileRpcClient = {
  rpc: <TRow = unknown>(name: string, args: Record<string, string>) => Promise<RpcResponse<TRow>>;
};

type RpcProfileRow = {
  display_name?: unknown;
  phone?: unknown;
};

const SAFE_PROFILE_SAVE_ERROR = 'We could not save your profile right now. Please try again.';

function normalizeText(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '';
}

function toSafeProfile(row: RpcProfileRow | null | undefined): SafeAppUserProfile {
  return {
    display_name: typeof row?.display_name === 'string' ? row.display_name : null,
    phone: typeof row?.phone === 'string' ? row.phone : null,
  };
}

export async function saveMyAppUserProfile(
  client: AppUserProfileRpcClient,
  input: EditableAppUserProfileInput,
): Promise<SaveAppUserProfileResult> {
  try {
    const { data, error } = await client.rpc<RpcProfileRow>('upsert_my_app_user_profile', {
      p_display_name: normalizeText(input.display_name),
      p_phone: normalizeText(input.phone),
    });

    if (error) {
      return { ok: false, error: { message: SAFE_PROFILE_SAVE_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: toSafeProfile(row) };
  } catch {
    return { ok: false, error: { message: SAFE_PROFILE_SAVE_ERROR } };
  }
}
