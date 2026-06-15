import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { HatidIconTile, HatidTrustPill, HatidWordmark } from './hatid-brand';

type RouteShellPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  notes: string[];
};

export function RouteShellPage({ title, eyebrow, description, icon: Icon, notes }: RouteShellPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 font-sans text-slate-900">
      <section className="w-full max-w-[390px] rounded-[2rem] border border-slate-800 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <HatidWordmark />
          <HatidTrustPill>Route shell</HatidTrustPill>
        </div>

        <div className="mt-8 flex items-start gap-4">
          <HatidIconTile>
            <Icon size={22} />
          </HatidIconTile>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0033CC]">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {notes.map((note) => (
            <div key={note} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {note}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-[#0033CC] px-4 py-3 text-center text-sm font-black text-white shadow-lg shadow-blue-900/20"
          >
            Open passenger preview
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700"
          >
            Go to login
          </Link>
        </div>

        <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">
          Prototype route only. Operational data must later come from Supabase, server-owned workflows, and audited records.
        </p>
      </section>
    </main>
  );
}
