'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth-guard';
import { MapView } from '@/components/map-view';
import { InlineTrustBanner } from '@/components/rider/inline-trust-banner';
import { PrimaryCta } from '@/components/rider/primary-cta';
import { RiderScreenContainer } from '@/components/rider/rider-screen-container';
import { RiderTopBar } from '@/components/rider/rider-top-bar';
import { LocationSearchField } from '@/components/rider/booking/location-search-field';
import { RecentSearchList } from '@/components/rider/booking/recent-search-list';
import { SavedPlacesSection } from '@/components/rider/booking/saved-places-section';
import { useSavedLocationPlaces } from '@/components/set-location-view';
import { demoLocationSuggestions, demoPickup, demoRecentSearches, type DemoPlace } from '@/lib/demo/location-suggestions';

// Inlined implementations from the deleted prototype file
const formatDemoPlaceLabel = (place: DemoPlace) => `${place.name}, ${place.address}`;

const buildRideOptionsHref = (params: { pickup: string; destination: string }) => {
  const searchParams = new URLSearchParams(params);
  return `/rider/ride-options?${searchParams.toString()}`;
};

function RiderSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DemoPlace | null>(null);
  const { places } = useSavedLocationPlaces();

  const suggestions = useMemo(
    () =>
      query.trim().length > 1
        ? demoLocationSuggestions.filter((place) => `${place.name} ${place.address}`.toLowerCase().includes(query.toLowerCase()))
        : demoLocationSuggestions,
    [query]
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelected(null);
  };

  const selectPlace = (place: DemoPlace) => {
    setSelected(place);
    setQuery(formatDemoPlaceLabel(place));
  };

  const continueDisabled = !selected && query.trim().length < 2;
  const destinationLabel = selected ? formatDemoPlaceLabel(selected) : query.trim();

  return (
    <RiderScreenContainer className="pb-6">
      <RiderTopBar showBack title="Drop-off" subtitle="Demo suggestions only" />
      <div className="space-y-4 px-4">
        <LocationSearchField value={query} onChange={handleQueryChange} placeholder="Search destination" />
        <div className="h-44 overflow-hidden rounded-3xl">
          <MapView mode="search" className="h-full" />
        </div>
        <InlineTrustBanner>
          Search suggestions are mock/demo entries plus any saved places available from Firestore. They are not live geocoding results.
        </InlineTrustBanner>
        <SavedPlacesSection title="Saved places" places={places.slice(0, 3)} onSelect={selectPlace} />
        <RecentSearchList title="Suggested destinations" places={suggestions} onSelect={selectPlace} />
        <RecentSearchList places={demoRecentSearches} onSelect={selectPlace} />
        <PrimaryCta
          disabled={continueDisabled}
          onClick={() => router.push(buildRideOptionsHref({ pickup: formatDemoPlaceLabel(demoPickup), destination: destinationLabel }))}
        >
          Continue to fare estimates
        </PrimaryCta>
      </div>
    </RiderScreenContainer>
  );
}

export default function RiderSearchPageWithAuth() {
  return (
    <AuthGuard>
      <RiderSearchPage />
    </AuthGuard>
  );
}
