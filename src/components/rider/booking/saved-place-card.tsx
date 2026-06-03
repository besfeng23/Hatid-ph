import { Briefcase, Building2, Heart, Home, MoreHorizontal, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DemoPlace } from '@/lib/demo/location-suggestions';

function Icon({ tag, name }: { tag?: DemoPlace['tag']; name: string }) {
  if (tag === 'home') return <Home className="h-5 w-5" />;
  if (tag === 'work') return <Briefcase className="h-5 w-5" />;
  if (/terminal|airport/i.test(name)) return <Plane className="h-5 w-5" />;
  if (tag === 'favorite') return <Heart className="h-5 w-5" />;
  return <Building2 className="h-5 w-5" />;
}

export function SavedPlaceCard({ place, onSelect, editable = false }: { place: DemoPlace; onSelect?: (place: DemoPlace) => void; editable?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(place)}
      className="flex w-full items-center gap-4 rounded-[1.9rem] border border-slate-200 bg-white px-4 py-4 text-left shadow-sm"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon tag={place.tag} name={place.name} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[1.02rem] font-extrabold tracking-tight text-slate-950">{place.name}</p>
        <p className="text-sm text-slate-500">{place.address}</p>
        {place.note ? <p className="mt-1 text-xs text-slate-400">{place.note}</p> : null}
      </div>
      {editable ? (
        <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-400">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      ) : null}
    </button>
  );
}
