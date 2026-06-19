export type SavedPlaceType = 'home' | 'work' | 'favorite' | 'other';

export type EditableSavedPlaceInput = {
  id?: string | null;
  label: string;
  place_type?: SavedPlaceType | string | null;
  address_text: string;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
};

export type SafeSavedPlace = {
  id: string;
  label: string;
  place_type: SavedPlaceType;
  address_text: string;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type SavedPlacesResult =
  | { ok: true; data: SafeSavedPlace[] }
  | { ok: false; error: { message: string } };

export type SaveSavedPlaceResult =
  | { ok: true; data: SafeSavedPlace }
  | { ok: false; error: { message: string } };

export type DeleteSavedPlaceResult =
  | { ok: true; data: { deleted: boolean } }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type SavedPlacesRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

type RpcSavedPlaceRow = {
  id?: unknown;
  label?: unknown;
  place_type?: unknown;
  address_text?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  notes?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

const SAFE_SAVED_PLACES_LOAD_ERROR = 'We could not load your saved places right now.';
const SAFE_SAVED_PLACE_SAVE_ERROR = 'We could not save this saved place right now. Please try again.';
const SAFE_SAVED_PLACE_DELETE_ERROR = 'We could not delete this saved place right now. Please try again.';
const PLACE_TYPES: SavedPlaceType[] = ['home', 'work', 'favorite', 'other'];

function normalizeRequiredText(value: string) {
  return value.trim();
}

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed.length > 0 ? trimmed : null;
}

function normalizePlaceType(value: string | null | undefined): SavedPlaceType {
  return PLACE_TYPES.includes(value as SavedPlaceType) ? (value as SavedPlaceType) : 'favorite';
}

function normalizeCoordinate(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function stringOrNull(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function numberOrNull(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toSafeSavedPlace(row: RpcSavedPlaceRow | null | undefined): SafeSavedPlace {
  return {
    id: stringOrNull(row?.id) ?? '',
    label: stringOrNull(row?.label) ?? '',
    place_type: normalizePlaceType(stringOrNull(row?.place_type)),
    address_text: stringOrNull(row?.address_text) ?? '',
    latitude: numberOrNull(row?.latitude),
    longitude: numberOrNull(row?.longitude),
    notes: stringOrNull(row?.notes),
    created_at: stringOrNull(row?.created_at),
    updated_at: stringOrNull(row?.updated_at),
  };
}

export async function getMySavedPlaces(client: SavedPlacesRpcClient): Promise<SavedPlacesResult> {
  try {
    const { data, error } = await client.rpc<RpcSavedPlaceRow>('get_my_saved_places');

    if (error) {
      return { ok: false, error: { message: SAFE_SAVED_PLACES_LOAD_ERROR } };
    }

    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return { ok: true, data: rows.map(toSafeSavedPlace) };
  } catch {
    return { ok: false, error: { message: SAFE_SAVED_PLACES_LOAD_ERROR } };
  }
}

export async function saveMySavedPlace(
  client: SavedPlacesRpcClient,
  input: EditableSavedPlaceInput,
): Promise<SaveSavedPlaceResult> {
  try {
    const { data, error } = await client.rpc<RpcSavedPlaceRow>('upsert_my_saved_place', {
      p_place_id: input.id ?? null,
      p_label: normalizeRequiredText(input.label),
      p_place_type: normalizePlaceType(input.place_type),
      p_address_text: normalizeRequiredText(input.address_text),
      p_latitude: normalizeCoordinate(input.latitude),
      p_longitude: normalizeCoordinate(input.longitude),
      p_notes: normalizeOptionalText(input.notes),
    });

    if (error) {
      return { ok: false, error: { message: SAFE_SAVED_PLACE_SAVE_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: toSafeSavedPlace(row) };
  } catch {
    return { ok: false, error: { message: SAFE_SAVED_PLACE_SAVE_ERROR } };
  }
}

export async function deleteMySavedPlace(
  client: SavedPlacesRpcClient,
  placeId: string,
): Promise<DeleteSavedPlaceResult> {
  try {
    const { data, error } = await client.rpc<boolean>('delete_my_saved_place', {
      p_place_id: placeId,
    });

    if (error) {
      return { ok: false, error: { message: SAFE_SAVED_PLACE_DELETE_ERROR } };
    }

    return { ok: true, data: { deleted: Boolean(data) } };
  } catch {
    return { ok: false, error: { message: SAFE_SAVED_PLACE_DELETE_ERROR } };
  }
}
