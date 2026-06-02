import type { DemoPlace } from '@/lib/demo/location-suggestions';
import { SavedPlaceCard } from './saved-place-card';
export function SavedPlacesSection({ title, places, editable, onSelect }: { title: string; places: DemoPlace[]; editable?: boolean; onSelect?: (place: DemoPlace) => void }) { return <section className="space-y-2"><h2 className="px-1 text-sm font-extrabold uppercase tracking-wide text-muted-foreground">{title}</h2>{places.map((place) => <SavedPlaceCard key={place.id} place={place} editable={editable} onSelect={onSelect} />)}</section>; }
