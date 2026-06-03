import Link from 'next/link';
import { MapPin, Navigation } from 'lucide-react';
import { SectionCard } from '../section-card';

export function LocationEntryCard({ pickup = 'Use current pickup area', destination = 'Where are you going?' }: { pickup?: string; destination?: string }) {
  return (
    <SectionCard className="px-5 py-5">
      <Link href="/rider/search" className="block space-y-5">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Navigation className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">Pickup</p>
            <p className="mt-1 text-[1.1rem] font-semibold tracking-tight text-slate-950">{pickup}</p>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="flex gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">Drop-off</p>
            <p className="mt-1 text-[1.55rem] font-black leading-tight tracking-tight text-slate-950">{destination}</p>
          </div>
        </div>
      </Link>
    </SectionCard>
  );
}
