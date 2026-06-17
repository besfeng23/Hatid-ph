import Link from 'next/link';
import { ArrowLeft, LockKeyhole, ShieldCheck, TriangleAlert } from 'lucide-react';

import { HatidTrustPill, HatidWordmark } from '@/components/hatid-brand';

const blockedActions = [
  'RPC-backed rider onboarding',
  'Fare quote creation',
  'Ride request submission',
];

const readinessRequirements = [
  'Committed database migrations and reviewed Supabase RPC definitions',
  'RLS policies with pgTAP and workflow test coverage',
  'Audit logging, idempotency controls, and rollback paths',
  'Server-boundary review before any user-accessible exposure',
];

export default function LiveHatidPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="bg-[#0033CC] px-5 pb-8 pt-6 text-white sm:px-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-blue-100 hover:text-white">
            <ArrowLeft size={16} /> Back to passenger preview
          </Link>
          <HatidWordmark light tagline="Backend wiring paused" />
          <div className="mt-8 flex flex-wrap gap-2">
            <HatidTrustPill tone="blue">Safety gate active</HatidTrustPill>
            <HatidTrustPill tone="slate">RPC actions disabled</HatidTrustPill>
            <HatidTrustPill tone="green">Route preserved</HatidTrustPill>
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-5xl">Backend wiring paused.</h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-blue-50">
            Live backend actions are intentionally disabled while Hatid completes the database, security, testing, audit, and server-boundary work required before user-accessible RPC flows are exposed.
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-8">
          <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-1 shrink-0 text-amber-700" size={24} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">Safety gate, not a product regression</p>
                <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900">Unsupported live RPC actions are not available from this page.</h2>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                  The previous live action buttons have been removed so signed-in users cannot trigger rider onboarding, fare quote, or ride request RPCs directly from the browser.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-1 shrink-0 text-[#0033CC]" size={24} />
              <div className="flex-1">
                <h2 className="text-lg font-black tracking-tight text-slate-900">Disabled live backend actions</h2>
                <ul className="mt-4 grid gap-3 text-sm font-bold text-slate-600 sm:grid-cols-3">
                  {blockedActions.map((action) => (
                    <li key={action} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 shrink-0 text-emerald-700" size={24} />
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-900">Required before exposure</h2>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-600">
                  RPC-backed rider onboarding, fare quote, and ride request actions require the following controls before they can be exposed as user-accessible functionality:
                </p>
                <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-slate-600">
                  {readinessRequirements.map((requirement) => (
                    <li key={requirement} className="flex gap-2">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0033CC]" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
