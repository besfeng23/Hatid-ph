'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Car, CheckCircle2, Loader2, MapPin, Server, UserRound, XCircle } from 'lucide-react';

import { HatidTrustPill, HatidWordmark } from '@/components/hatid-brand';
import { completeRiderOnboarding, createFareQuote, requestLiveRide, type LiveFareQuote, type LiveTrip } from '@/lib/hatid/live-ops';

type ActionState = {
  tone: 'idle' | 'ok' | 'error';
  title: string;
  detail: string;
};

const initialState: ActionState = {
  tone: 'idle',
  title: 'Ready for live backend test',
  detail: 'Use this page after signing in with the real Supabase auth flow. The local phone OTP prototype is not a real session.',
};

function formatPeso(value: number | null | undefined) {
  if (typeof value !== 'number') return 'Pending';
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
}

function StatusCard({ state }: { state: ActionState }) {
  const Icon = state.tone === 'ok' ? CheckCircle2 : state.tone === 'error' ? XCircle : Server;
  const color = state.tone === 'ok' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : state.tone === 'error' ? 'border-red-100 bg-red-50 text-red-700' : 'border-blue-100 bg-blue-50 text-[#0033CC]';

  return (
    <div className={`rounded-[1.5rem] border p-4 ${color}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 shrink-0" size={20} />
        <div>
          <h2 className="text-sm font-black text-slate-900">{state.title}</h2>
          <p className="mt-1 text-xs font-bold leading-5">{state.detail}</p>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

export default function LiveHatidPage() {
  const [fullName, setFullName] = useState('Maria Santos');
  const [state, setState] = useState<ActionState>(initialState);
  const [loading, setLoading] = useState<string | null>(null);
  const [quote, setQuote] = useState<LiveFareQuote | null>(null);
  const [trip, setTrip] = useState<LiveTrip | null>(null);

  async function runAction<TData>(label: string, action: () => Promise<{ data: TData | null; error: string | null; needsAuth: boolean; envReady: boolean }>, onSuccess?: (data: TData) => void) {
    setLoading(label);
    setState({ tone: 'idle', title: 'Contacting Supabase', detail: `${label} is running against Hatid backend RPCs.` });

    try {
      const result = await action();

      if (result.error || !result.data) {
        setState({
          tone: 'error',
          title: result.needsAuth ? 'Sign in required' : result.envReady ? 'Backend action failed' : 'Missing Supabase env',
          detail: result.error ?? 'No data returned.',
        });
        return;
      }

      onSuccess?.(result.data);
      setState({ tone: 'ok', title: `${label} succeeded`, detail: 'Supabase accepted the request and returned live backend data.' });
    } catch (error) {
      setState({ tone: 'error', title: `${label} crashed`, detail: error instanceof Error ? error.message : 'Unexpected client error.' });
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="bg-[#0033CC] px-5 pb-8 pt-6 text-white sm:px-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-blue-100 hover:text-white">
            <ArrowLeft size={16} /> Back to passenger preview
          </Link>
          <HatidWordmark light tagline="Live backend wiring" />
          <div className="mt-8 flex flex-wrap gap-2">
            <HatidTrustPill tone="blue">Supabase RPC</HatidTrustPill>
            <HatidTrustPill tone="green">Server-owned trip flow</HatidTrustPill>
            <HatidTrustPill tone="slate">No real charging</HatidTrustPill>
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-5xl">Hatid is now talking to the backend.</h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-blue-50">This page is the bridge between the polished UI shell and the Supabase foundation: rider onboarding, fare quote, and ride request RPCs.</p>
        </div>

        <div className="space-y-5 p-5 sm:p-8">
          <StatusCard state={state} />

          <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <UserRound className="mt-1 text-[#0033CC]" size={22} />
              <div className="flex-1">
                <h2 className="text-lg font-black tracking-tight text-slate-900">1. Complete rider onboarding</h2>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">Calls <code>complete_rider_onboarding</code> for the signed-in Supabase user.</p>
                <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#0033CC] focus:ring-2 focus:ring-blue-100" />
                <button disabled={loading !== null} onClick={() => runAction('Rider onboarding', () => completeRiderOnboarding(fullName), () => undefined)} className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0033CC] px-5 py-3 text-sm font-black text-white disabled:bg-slate-300">
                  {loading === 'Rider onboarding' && <Loader2 size={16} className="animate-spin" />} Save rider profile
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 text-[#0033CC]" size={22} />
              <div className="flex-1">
                <h2 className="text-lg font-black tracking-tight text-slate-900">2. Create fare quote</h2>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">Uses Quiapo to BGC demo coordinates and the live <code>hatid_car</code> service type.</p>
                <button disabled={loading !== null} onClick={() => runAction('Fare quote', createFareQuote, setQuote)} className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:bg-slate-300">
                  {loading === 'Fare quote' && <Loader2 size={16} className="animate-spin" />} Get live quote
                </button>
              </div>
            </div>
          </section>

          {quote && (
            <div className="grid grid-cols-3 gap-3">
              <Metric label="Fare" value={formatPeso(quote.estimated_fare)} />
              <Metric label="Distance" value={`${quote.estimated_distance_km} km`} />
              <Metric label="Duration" value={`${quote.estimated_duration_min} min`} />
            </div>
          )}

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Car className="mt-1 text-[#0033CC]" size={22} />
              <div className="flex-1">
                <h2 className="text-lg font-black tracking-tight text-slate-900">3. Request live ride</h2>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">Creates a <code>ride_requests</code> row and a <code>trips</code> row through <code>request_ride</code>.</p>
                <button disabled={loading !== null} onClick={() => runAction('Ride request', requestLiveRide, setTrip)} className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0033CC] px-5 py-3 text-sm font-black text-white disabled:bg-slate-300">
                  {loading === 'Ride request' && <Loader2 size={16} className="animate-spin" />} Create live trip
                </button>
              </div>
            </div>
          </section>

          {trip && (
            <section className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">Live trip created</p>
              <h2 className="mt-1 break-all text-lg font-black text-slate-900">{trip.id}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Metric label="Status" value={trip.status} />
                <Metric label="Fare" value={formatPeso(trip.estimated_fare)} />
                <Metric label="Pickup" value={trip.pickup_address} />
                <Metric label="Dropoff" value={trip.dropoff_address} />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
