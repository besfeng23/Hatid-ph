import { Clock, MapPin } from 'lucide-react';
import type { DemoPlace } from '@/lib/demo/location-suggestions';

export function RecentSearchList({ title = 'Recent searches', places, onSelect }: { title?: string; places: DemoPlace[]; onSelect?: (place: DemoPlace) => void }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-400">{title}</h2>
      </div>
      <div className="overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white shadow-sm">
        {places.map((place) => (
          <button key={place.id} type="button" onClick={() => onSelect?.(place)} className="flex w-full items-center gap-4 border-b border-slate-100 px-4 py-4 text-left last:border-b-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
              {place.tag === 'recent' ? <Clock className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-950">{place.name}</p>
              <p className="text-sm text-slate-500">{place.address}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
