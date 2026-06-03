import type { DemoPlace } from '@/lib/demo/location-suggestions';
import { SavedPlaceCard } from './saved-place-card';

export function SavedPlacesSection({ title, places, editable, onSelect }: { title: string; places: DemoPlace[]; editable?: boolean; onSelect?: (place: DemoPlace) => void }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-400">{title}</h2>
        {editable ? <span className="text-sm font-bold text-primary">Edit</span> : null}
      </div>
      <div className="space-y-3">
        {places.map((place) => (
          <SavedPlaceCard key={place.id} place={place} editable={editable} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
