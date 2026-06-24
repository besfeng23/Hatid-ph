export type RideQuoteServiceType = 'standard' | 'premium' | 'delivery';

export type CreateRideQuoteInput = {
  pickup_address_text: string;
  pickup_latitude?: number | null;
  pickup_longitude?: number | null;
  dropoff_address_text: string;
  dropoff_latitude?: number | null;
  dropoff_longitude?: number | null;
  service_type?: RideQuoteServiceType | string | null;
};

export type SafeRideQuote = {
  id: string;
  pickup_address_text: string;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  dropoff_address_text: string;
  dropoff_latitude: number | null;
  dropoff_longitude: number | null;
  service_type: RideQuoteServiceType;
  estimated_distance_km: number | null;
  estimated_duration_minutes: number | null;
  estimate_minor: number;
  currency: 'PHP';
  status: string;
  expires_at: string | null;
  created_at: string | null;
};

export type RideQuotesResult =
  | { ok: true; data: SafeRideQuote[] }
  | { ok: false; error: { message: string } };

export type CreateRideQuoteResult =
  | { ok: true; data: SafeRideQuote }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type RideQuoteRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

type RpcRideQuoteRow = {
  id?: unknown;
  pickup_address_text?: unknown;
  pickup_latitude?: unknown;
  pickup_longitude?: unknown;
  dropoff_address_text?: unknown;
  dropoff_latitude?: unknown;
  dropoff_longitude?: unknown;
  service_type?: unknown;
  estimated_distance_km?: unknown;
  estimated_duration_minutes?: unknown;
  estimate_minor?: unknown;
  currency?: unknown;
  status?: unknown;
  expires_at?: unknown;
  created_at?: unknown;
};

const SAFE_RIDE_QUOTES_LOAD_ERROR = 'We could not load your ride quotes right now.';
const SAFE_RIDE_QUOTE_CREATE_ERROR = 'We could not create this estimate right now. Please try again.';
const SERVICE_TYPES: RideQuoteServiceType[] = ['standard', 'premium', 'delivery'];

function normalizeRequiredText(value: string) {
  return value.trim();
}

function normalizeServiceType(value: string | null | undefined): RideQuoteServiceType {
  return SERVICE_TYPES.includes(value as RideQuoteServiceType) ? (value as RideQuoteServiceType) : 'standard';
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

function numberOrZero(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function toSafeRideQuote(row: RpcRideQuoteRow | null | undefined): SafeRideQuote {
  return {
    id: stringOrNull(row?.id) ?? '',
    pickup_address_text: stringOrNull(row?.pickup_address_text) ?? '',
    pickup_latitude: numberOrNull(row?.pickup_latitude),
    pickup_longitude: numberOrNull(row?.pickup_longitude),
    dropoff_address_text: stringOrNull(row?.dropoff_address_text) ?? '',
    dropoff_latitude: numberOrNull(row?.dropoff_latitude),
    dropoff_longitude: numberOrNull(row?.dropoff_longitude),
    service_type: normalizeServiceType(stringOrNull(row?.service_type)),
    estimated_distance_km: numberOrNull(row?.estimated_distance_km),
    estimated_duration_minutes: numberOrNull(row?.estimated_duration_minutes),
    estimate_minor: numberOrZero(row?.estimate_minor),
    currency: 'PHP',
    status: stringOrNull(row?.status) ?? 'quoted',
    expires_at: stringOrNull(row?.expires_at),
    created_at: stringOrNull(row?.created_at),
  };
}

export async function getMyRideQuotes(client: RideQuoteRpcClient): Promise<RideQuotesResult> {
  try {
    const { data, error } = await client.rpc<RpcRideQuoteRow>('get_my_ride_quotes');

    if (error) {
      return { ok: false, error: { message: SAFE_RIDE_QUOTES_LOAD_ERROR } };
    }

    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return { ok: true, data: rows.map(toSafeRideQuote) };
  } catch {
    return { ok: false, error: { message: SAFE_RIDE_QUOTES_LOAD_ERROR } };
  }
}

export async function createMyRideQuote(
  client: RideQuoteRpcClient,
  input: CreateRideQuoteInput,
): Promise<CreateRideQuoteResult> {
  try {
    const { data, error } = await client.rpc<RpcRideQuoteRow>('create_my_ride_quote', {
      p_pickup_address_text: normalizeRequiredText(input.pickup_address_text),
      p_pickup_latitude: normalizeCoordinate(input.pickup_latitude),
      p_pickup_longitude: normalizeCoordinate(input.pickup_longitude),
      p_dropoff_address_text: normalizeRequiredText(input.dropoff_address_text),
      p_dropoff_latitude: normalizeCoordinate(input.dropoff_latitude),
      p_dropoff_longitude: normalizeCoordinate(input.dropoff_longitude),
      p_service_type: normalizeServiceType(input.service_type),
    });

    if (error) {
      return { ok: false, error: { message: SAFE_RIDE_QUOTE_CREATE_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: toSafeRideQuote(row) };
  } catch {
    return { ok: false, error: { message: SAFE_RIDE_QUOTE_CREATE_ERROR } };
  }
}
