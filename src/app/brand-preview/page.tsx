import { Bell, Car, MapPin, Shield, Wallet } from 'lucide-react';

import { HatidIconTile, HatidTrustPill, HatidWordmark } from '../../components/hatid-brand';

const BLUE = '#0033CC';

export default function BrandPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-900">
      <section className="mx-auto flex min-h-[820px] w-full max-w-[390px] flex-col overflow-hidden rounded-[2.5rem] border-[8px] border-slate-900 bg-white shadow-2xl">
        <div className="bg-[#0033CC] px-6 pb-8 pt-14 text-white">
          <div className="flex items-start justify-between gap-4">
            <HatidWordmark light large tagline="Biyahe natin. Bansa natin." />
            <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
              <Bell size={20} />
            </button>
          </div>
          <div className="mt-8 rounded-[1.75rem] bg-white/10 p-4 ring-1 ring-white/15">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Philippine mobility preview</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">Premium, light, and trustworthy.</h1>
            <p className="mt-3 text-sm leading-6 text-blue-50">A cleaner Hatid identity for passenger flows, wallet-safe language, and safety-first city travel.</p>
          </div>
        </div>

        <div className="flex-1 space-y-5 bg-slate-50 px-5 py-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Pickup</p>
                <h2 className="text-lg font-black tracking-tight">BGC High Street</h2>
              </div>
              <HatidTrustPill>Demo route</HatidTrustPill>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <HatidIconTile active>
                  <MapPin size={20} />
                </HatidIconTile>
                <div>
                  <p className="text-sm font-bold">Going to Makati CBD</p>
                  <p className="text-xs text-slate-500">Traffic-aware estimate shown as prototype</p>
                </div>
              </div>
              <button className="w-full rounded-2xl bg-[#0033CC] py-4 text-sm font-black text-white shadow-sm active:scale-[0.99]">
                Choose a ride
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <HatidIconTile active>
                <Car size={20} />
              </HatidIconTile>
              <p className="mt-3 text-sm font-black">Hatid Car</p>
              <p className="text-xs text-slate-500">City ride</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <HatidIconTile>
                <Wallet size={20} />
              </HatidIconTile>
              <p className="mt-3 text-sm font-black">Wallet</p>
              <p className="text-xs text-slate-500">Ledger-safe</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <HatidIconTile>
                <Shield size={20} />
              </HatidIconTile>
              <p className="mt-3 text-sm font-black">Safety</p>
              <p className="text-xs text-slate-500">Clear flows</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black tracking-tight">Brand rules applied</h3>
                <p className="mt-1 text-sm text-slate-500">Complete wordmark, no split logo, no emoji icon system.</p>
              </div>
              <div className="h-12 w-12 rounded-2xl" style={{ background: BLUE }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <HatidTrustPill tone="blue">Complete Hatid</HatidTrustPill>
              <HatidTrustPill tone="green">Light UI</HatidTrustPill>
              <HatidTrustPill tone="slate">Prototype-safe</HatidTrustPill>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
