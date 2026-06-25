export type SafeTripEvent = {
  id: string;
  trip_id: string;
  actor_user_id: string | null;
  event_type: string;
  trip_status: string;
  occurred_at: string | null;
  note: string | null;
  created_at: string | null;
};

export type TripEventsResult =
  | { ok: true; data: SafeTripEvent[] }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type TripEventRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

type RpcTripEventRow = {
  id?: unknown;
  trip_id?: unknown;
  actor_user_id?: unknown;
  event_type?: unknown;
  trip_status?: unknown;
  occurred_at?: unknown;
  note?: unknown;
  created_at?: unknown;
};

const SAFE_TIMELINE_LOAD_ERROR = 'We could not load this trip timeline right now.';

function stringOrNull(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function toSafeTripEvent(row: RpcTripEventRow | null | undefined): SafeTripEvent {
  return {
    id: stringOrNull(row?.id) ?? '',
    trip_id: stringOrNull(row?.trip_id) ?? '',
    actor_user_id: stringOrNull(row?.actor_user_id),
    event_type: stringOrNull(row?.event_type) ?? 'status_changed',
    trip_status: stringOrNull(row?.trip_status) ?? 'accepted',
    occurred_at: stringOrNull(row?.occurred_at),
    note: stringOrNull(row?.note),
    created_at: stringOrNull(row?.created_at),
  };
}

function rowsFrom<TRow>(data: TRow[] | TRow | null) {
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function getMyRiderTripEvents(
  client: TripEventRpcClient,
  input: { tripId: string },
): Promise<TripEventsResult> {
  try {
    const { data, error } = await client.rpc<RpcTripEventRow>('get_my_rider_trip_events', {
      p_trip_id: input.tripId,
    });

    if (error) return { ok: false, error: { message: SAFE_TIMELINE_LOAD_ERROR } };
    return { ok: true, data: rowsFrom(data).map(toSafeTripEvent) };
  } catch {
    return { ok: false, error: { message: SAFE_TIMELINE_LOAD_ERROR } };
  }
}

export async function getMyDriverTripEvents(
  client: TripEventRpcClient,
  input: { tripId: string },
): Promise<TripEventsResult> {
  try {
    const { data, error } = await client.rpc<RpcTripEventRow>('get_my_driver_trip_events', {
      p_trip_id: input.tripId,
    });

    if (error) return { ok: false, error: { message: SAFE_TIMELINE_LOAD_ERROR } };
    return { ok: true, data: rowsFrom(data).map(toSafeTripEvent) };
  } catch {
    return { ok: false, error: { message: SAFE_TIMELINE_LOAD_ERROR } };
  }
}
