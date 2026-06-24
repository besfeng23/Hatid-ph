export type SafeTrip = {
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
  en_route_pickup_at: string | null;
  arrived_pickup_at: string | null;
  rider_onboarded_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TripsResult =
  | { ok: true; data: SafeTrip[] }
  | { ok: false; error: { message: string } };

export type TripResult =
  | { ok: true; data: SafeTrip }
  | { ok: false; error: { message: string } };

export type DriverTripTransition =
  | 'en_route_pickup'
  | 'arrived_pickup'
  | 'rider_onboarded'
  | 'completed'
  | 'cancelled';

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type TripRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

type RpcTripRow = {
  id?: unknown;
  request_id?: unknown;
  accepted_offer_id?: unknown;
  rider_user_id?: unknown;
  driver_user_id?: unknown;
  vehicle_id?: unknown;
  trip_status?: unknown;
  pickup_address_text?: unknown;
  dropoff_address_text?: unknown;
  service_type?: unknown;
  estimate_minor?: unknown;
  currency?: unknown;
  accepted_at?: unknown;
  en_route_pickup_at?: unknown;
  arrived_pickup_at?: unknown;
  rider_onboarded_at?: unknown;
  completed_at?: unknown;
  cancelled_at?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

const SAFE_TRIPS_LOAD_ERROR = 'We could not load trips right now.';
const SAFE_TRIP_TRANSITION_ERROR = 'We could not update this trip right now. Please try again.';

function stringOrNull(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function numberOrZero(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function toSafeTrip(row: RpcTripRow | null | undefined): SafeTrip {
  return {
    id: stringOrNull(row?.id) ?? '',
    request_id: stringOrNull(row?.request_id) ?? '',
    accepted_offer_id: stringOrNull(row?.accepted_offer_id) ?? '',
    rider_user_id: stringOrNull(row?.rider_user_id) ?? '',
    driver_user_id: stringOrNull(row?.driver_user_id) ?? '',
    vehicle_id: stringOrNull(row?.vehicle_id) ?? '',
    trip_status: stringOrNull(row?.trip_status) ?? 'accepted',
    pickup_address_text: stringOrNull(row?.pickup_address_text) ?? '',
    dropoff_address_text: stringOrNull(row?.dropoff_address_text) ?? '',
    service_type: stringOrNull(row?.service_type) ?? 'standard',
    estimate_minor: numberOrZero(row?.estimate_minor),
    currency: 'PHP',
    accepted_at: stringOrNull(row?.accepted_at),
    en_route_pickup_at: stringOrNull(row?.en_route_pickup_at),
    arrived_pickup_at: stringOrNull(row?.arrived_pickup_at),
    rider_onboarded_at: stringOrNull(row?.rider_onboarded_at),
    completed_at: stringOrNull(row?.completed_at),
    cancelled_at: stringOrNull(row?.cancelled_at),
    created_at: stringOrNull(row?.created_at),
    updated_at: stringOrNull(row?.updated_at),
  };
}

function firstRow<TRow>(data: TRow[] | TRow | null) {
  return Array.isArray(data) ? data[0] : data;
}

export async function getMyRiderTrips(client: TripRpcClient): Promise<TripsResult> {
  try {
    const { data, error } = await client.rpc<RpcTripRow>('get_my_rider_trips');

    if (error) {
      return { ok: false, error: { message: SAFE_TRIPS_LOAD_ERROR } };
    }

    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return { ok: true, data: rows.map(toSafeTrip) };
  } catch {
    return { ok: false, error: { message: SAFE_TRIPS_LOAD_ERROR } };
  }
}

export async function getMyDriverTrips(client: TripRpcClient): Promise<TripsResult> {
  try {
    const { data, error } = await client.rpc<RpcTripRow>('get_my_driver_trips');

    if (error) {
      return { ok: false, error: { message: SAFE_TRIPS_LOAD_ERROR } };
    }

    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return { ok: true, data: rows.map(toSafeTrip) };
  } catch {
    return { ok: false, error: { message: SAFE_TRIPS_LOAD_ERROR } };
  }
}

export async function advanceMyDriverTrip(
  client: TripRpcClient,
  input: { tripId: string; nextStatus: DriverTripTransition; cancellationReason?: string | null },
): Promise<TripResult> {
  try {
    const { data, error } = await client.rpc<RpcTripRow>('advance_my_driver_trip', {
      p_trip_id: input.tripId,
      p_next_status: input.nextStatus,
      p_cancellation_reason: input.cancellationReason?.trim() || null,
    });

    if (error) {
      return { ok: false, error: { message: SAFE_TRIP_TRANSITION_ERROR } };
    }

    return { ok: true, data: toSafeTrip(firstRow(data)) };
  } catch {
    return { ok: false, error: { message: SAFE_TRIP_TRANSITION_ERROR } };
  }
}
