'use client';

import { useMemo, useState } from 'react';
import AuthGuard from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { InlineTrustBanner } from '@/components/rider/inline-trust-banner';
import { RiderBottomNav } from '@/components/rider/rider-bottom-nav';
import { RiderScreenContainer } from '@/components/rider/rider-screen-container';
import { RiderTopBar } from '@/components/rider/rider-top-bar';
import { LocationSearchField } from '@/components/rider/booking/location-search-field';
import { SavedPlacesSection } from '@/components/rider/booking/saved-places-section';
import { useSavedLocationPlaces } from '@/components/set-location-view';
import { demoSavedPlaces } from '@/lib/demo/location-suggestions';

function RiderSavedPlacesPage() {
  const [search, setSearch] = useState('');
  const { places } = useSavedLocationPlaces();
  const allPlaces = places.length ? places : demoSavedPlaces;
  const filtered = useMemo(() => allPlaces.filter((place) => `${place.name} ${place.address}`.toLowerCase().includes(search.toLowerCase())), [allPlaces, search]);
  const favorites = filtered.filter((place) => place.tag === 'home' || place.tag === 'work' || place.tag === 'favorite');
  const others = filtered.filter((place) => !favorites.includes(place));
  return <RiderScreenContainer className="pb-24"><RiderTopBar showBack title="Saved places" subtitle="Home, work, and favorites" /><div className="space-y-4 px-4"><LocationSearchField value={search} onChange={setSearch} placeholder="Search saved places" /><SavedPlacesSection title="Favorites" places={favorites} editable /><SavedPlacesSection title="Other saved places" places={others} editable /><Button className="h-14 w-full rounded-full text-base font-bold" disabled>Add new saved place (not active yet)</Button><InlineTrustBanner>Editing affordances are shown for the rider shell. New saved-place writes remain limited to existing data paths until backend rules are finalized.</InlineTrustBanner></div><div className="fixed bottom-0 left-0 right-0"><RiderBottomNav active="Saved" /></div></RiderScreenContainer>;
}
export default function RiderSavedPlacesPageWithAuth() { return <AuthGuard><RiderSavedPlacesPage /></AuthGuard>; }
