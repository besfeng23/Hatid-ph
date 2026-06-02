'use client';

import { useMemo, useState } from 'react';
import { collection, query } from 'firebase/firestore';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { demoLocationSuggestions, demoRecentSearches, demoSavedPlaces, type DemoPlace } from '@/lib/demo/location-suggestions';
import { LocationSearchField } from './rider/booking/location-search-field';
import { RecentSearchList } from './rider/booking/recent-search-list';
import { SavedPlacesSection } from './rider/booking/saved-places-section';

interface SetLocationViewProps { pickup: string; destination: string; onConfirm: (pickup: string, destination: string) => void; onBack: () => void; }

type SavedLocationDoc = { id: string; name?: string; address?: string; type?: string };

export function useSavedLocationPlaces() {
  const { user } = useUser();
  const firestore = useFirestore();
  const savedLocationsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'savedLocations'));
  }, [user, firestore]);
  const { data, isLoading } = useCollection(savedLocationsQuery);
  const places = useMemo<DemoPlace[]>(() => {
    const saved = (data || []) as SavedLocationDoc[];
    if (saved.length === 0) return demoSavedPlaces;
    return saved.map((location) => ({ id: location.id, name: location.name || 'Saved place', address: location.address || 'Address unavailable', tag: location.name === 'Home' ? 'home' : location.name === 'Work' ? 'work' : 'favorite' }));
  }, [data]);
  return { places, isLoading };
}

export function SetLocationView({ pickup: initialPickup, destination: initialDestination, onConfirm, onBack }: SetLocationViewProps) {
  const [pickup] = useState(initialPickup);
  const [destination, setDestination] = useState(initialDestination);
  const { places, isLoading } = useSavedLocationPlaces();
  const filteredSuggestions = useMemo(() => destination.trim().length > 1 ? demoLocationSuggestions.filter((place) => `${place.name} ${place.address}`.toLowerCase().includes(destination.toLowerCase())) : demoLocationSuggestions, [destination]);
  const selectPlace = (place: DemoPlace) => setDestination(`${place.name}, ${place.address}`);

  return <><CardHeader><div className="mb-2 flex items-center gap-2"><Button variant="ghost" size="icon" onClick={onBack} className="shrink-0"><ArrowLeft /></Button><CardTitle className="text-2xl font-bold text-foreground">Set drop-off</CardTitle></div><p className="text-sm text-muted-foreground">Suggestions are demo-only and are not live geocoding results.</p></CardHeader><CardContent className="space-y-4"><LocationSearchField value={destination} onChange={setDestination} /><SavedPlacesSection title={isLoading ? 'Loading saved places' : 'Saved places'} places={places.slice(0, 3)} onSelect={selectPlace} /><RecentSearchList title="Demo suggestions" places={filteredSuggestions} onSelect={selectPlace} /><RecentSearchList places={demoRecentSearches} onSelect={selectPlace} /><Button onClick={() => onConfirm(pickup, destination)} size="lg" className="h-14 w-full rounded-full text-lg font-bold">Continue to estimates</Button></CardContent></>;
}
