import { createBrowserSupabaseClient } from '@/lib/supabase/client';

type RpcError = { message?: string } | null;

type RpcClient = {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string; email?: string | null; phone?: string | null } | null }; error: RpcError }>;
  };
  rpc: <TData = unknown>(name: string, args?: Record<string, unknown>) => Promise<{ data: TData | null; error: RpcError }>;
};

export type LiveResult<TData> = {
  data: TData | null;
  error: string | null;
  needsAuth: boolean;
  envReady: boolean;
};

export type LiveFareQuote = {
  id: string;
  service_type_id: string;
  estimated_distance_km: number;
  estimated_duration_min: number;
  estimated_fare: number;
  currency: string;
  expires_at: string;
};

export type LiveTrip = {
  id: string;
  service_type_id: string;
  status: string;
  pickup_address: string;
  dropoff_address: string;
  estimated_distance_km: number | null;
  estimated_duration_min: number | null;
  estimated_fare: number | null;
  final_fare: number | null;
  currency: string;
  created_at: string;
};

const demoRoute = {
  pickupAddress: 'Quiapo, Manila',
  pickupLat: 14.5995,
  pickupLng: 120.9842,
  dropoffAddress: 'BGC, Taguig',
  dropoffLat: 14.5503,
  dropoffLng: 121.0482,
};

function messageFrom(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return 'Supabase request failed.';
}

function ok<TData>(data: TData): LiveResult<TData> {
  return { data, error: null, needsAuth: false, envReady: true };
}

function fail<TData>(error: string, options?: Partial<Pick<LiveResult<TData>, 'needsAuth' | 'envReady'>>): LiveResult<TData> {
  return { data: null, error, needsAuth: options?.needsAuth ?? false, envReady: options?.envReady ?? true };
}

async function getClient(): Promise<LiveResult<RpcClient>> {
  let client: RpcClient;

  try {
    client = createBrowserSupabaseClient() as unknown as RpcClient;
  } catch (error) {
    return fail(messageFrom(error), { envReady: false });
  }

  const { data, error } = await client.auth.getUser();

  if (error) return fail(messageFrom(error), { needsAuth: true });
  if (!data.user) return fail('No Supabase session. Sign in through the real auth flow before using live Hatid actions.', { needsAuth: true });

  return ok(client);
}

export async function completeRiderOnboarding(fullName: string): Promise<LiveResult<void>> {
  const client = await getClient();
  if (!client.data) return fail(client.error ?? 'Supabase client unavailable.', client);

  const [firstName, ...rest] = fullName.trim().split(/\s+/).filter(Boolean);
  const lastName = rest.join(' ') || 'Rider';

  const { error } = await client.data.rpc('complete_rider_onboarding', {
    _first_name: firstName || 'Hatid',
    _last_name: lastName,
    _birthdate: null,
    _preferred_language: 'en-PH',
    _default_payment_preference: 'cash',
    _emergency_contact_name: null,
    _emergency_contact_phone: null,
  });

  if (error) return fail(messageFrom(error));
  return ok(undefined);
}

export async function createFareQuote(): Promise<LiveResult<LiveFareQuote>> {
  const client = await getClient();
  if (!client.data) return fail(client.error ?? 'Supabase client unavailable.', client);

  const { data, error } = await client.data.rpc<LiveFareQuote>('create_fare_quote', {
    _service_type_id: 'hatid_car',
    _pickup_address: demoRoute.pickupAddress,
    _pickup_lat: demoRoute.pickupLat,
    _pickup_lng: demoRoute.pickupLng,
    _dropoff_address: demoRoute.dropoffAddress,
    _dropoff_lat: demoRoute.dropoffLat,
    _dropoff_lng: demoRoute.dropoffLng,
    _estimated_duration_min: null,
  });

  if (error) return fail(messageFrom(error));
  if (!data) return fail('No fare quote returned from Supabase.');
  return ok(data);
}

export async function requestLiveRide(): Promise<LiveResult<LiveTrip>> {
  const client = await getClient();
  if (!client.data) return fail(client.error ?? 'Supabase client unavailable.', client);

  const { data, error } = await client.data.rpc<LiveTrip>('request_ride', {
    _service_type_id: 'hatid_car',
    _pickup_address: demoRoute.pickupAddress,
    _pickup_lat: demoRoute.pickupLat,
    _pickup_lng: demoRoute.pickupLng,
    _dropoff_address: demoRoute.dropoffAddress,
    _dropoff_lat: demoRoute.dropoffLat,
    _dropoff_lng: demoRoute.dropoffLng,
    _pickup_note: 'Created from Hatid live UI.',
    _rider_note: 'Backend-integrated prototype request.',
    _passenger_count: 1,
    _payment_method: 'cash',
  });

  if (error) return fail(messageFrom(error));
  if (!data) return fail('No trip returned from Supabase.');
  return ok(data);
}
