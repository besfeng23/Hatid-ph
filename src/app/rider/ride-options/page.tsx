'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthGuard from '@/components/auth-guard';
import { MapView } from '@/components/map-view';
import { RideOptionCard, type RideOption } from '@/components/ride-option-card';
import { PrimaryCta } from '@/components/rider/primary-cta';
import { RiderScreenContainer } from '@/components/rider/rider-screen-container';
import { RiderTopBar } from '@/components/rider/rider-top-bar';
import { FareEstimateNotice } from '@/components/rider/booking/fare-estimate-notice';
import { PaymentPreferenceRow } from '@/components/rider/booking/payment-preference-row';
import { PromoRow } from '@/components/rider/booking/promo-row';
import { TripSummaryCard } from '@/components/rider/booking/trip-summary-card';
import { supportedRideOptions } from '@/lib/demo/rider-service-options';
import { resolvePrototypeRideSelection } from '@/lib/rider/prototype-ride-flow';

function RiderRideOptionsPage() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<RideOption>(supportedRideOptions[0]);
  const selection = useMemo(
    () =>
      resolvePrototypeRideSelection({
        pickup: searchParams.get('pickup'),
        destination: searchParams.get('destination'),
      }),
    [searchParams]
  );

  return (
    <RiderScreenContainer className="pb-6">
      <RiderTopBar showBack backHref="/rider/search" title="Fare estimates" subtitle="Prototype quote only" />
      <div className="space-y-4 px-4">
        <TripSummaryCard pickup={selection.pickup} destination={selection.destination} />
        <div className="h-48 overflow-hidden rounded-3xl">
          <MapView mode="quote" className="h-full" />
        </div>
        <FareEstimateNotice />
        <PaymentPreferenceRow />
        <div className="space-y-3">
          {supportedRideOptions
            .filter((option) => option.availability !== 'unavailable')
            .map((option) => (
              <RideOptionCard key={option.id} option={option} isSelected={selected.id === option.id} onSelect={setSelected} />
            ))}
        </div>
        <PromoRow />
        <PrimaryCta disabled>Prototype booking handoff not active</PrimaryCta>
        <p className="text-center text-xs text-muted-foreground">
          {selection.usedFallback
            ? 'Showing fallback prototype trip details because no search selection was passed through.'
            : 'Trip summary reflects the destination chosen in search. Booking handoff and live driver matching remain inactive in this phase.'}
        </p>
      </div>
    </RiderScreenContainer>
  );
}

export default function RiderRideOptionsPageWithAuth() {
  return (
    <AuthGuard>
      <RiderRideOptionsPage />
    </AuthGuard>
  );
}
