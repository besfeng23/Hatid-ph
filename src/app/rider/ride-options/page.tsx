'use client';

import { Suspense, useEffect, useState } from 'react';
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
import type { FareEstimate } from '@/lib/trips/prices';

function RiderRideOptionsPage() {
  const searchParams = useSearchParams();
  const [estimates, setEstimates] = useState<FareEstimate[]>([]);
  const [selected, setSelected] = useState<RideOption | null>(null);

  useEffect(() => {
    const fetchEstimates = async () => {
      const pickup = searchParams.get('pickup');
      const destination = searchParams.get('destination');

      if (!pickup || !destination) {
        return;
      }

      const response = await fetch('/api/trips/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pickup, destination }),
      });

      const data = await response.json();
      setEstimates(data.estimates);
    };

    fetchEstimates();
  }, [searchParams]);

  const rideOptions: RideOption[] = estimates.map((estimate) => {
    const serviceOption = supportedRideOptions.find((option) => option.id === estimate.fare.serviceLevel);

    return {
      id: estimate.fare.serviceLevel,
      name: serviceOption?.name || 'Unknown',
      description: serviceOption?.description || 'Unknown',
      capacity: serviceOption?.capacity,
      price: estimate.total,
      eta: '5 mins',
      icon: serviceOption?.icon,
      availability: 'available',
    };
  });

  return (
    <RiderScreenContainer className="pb-6">
      <RiderTopBar showBack backHref="/rider/search" title="Fare estimates" subtitle="Prototype quote only" />
      <div className="space-y-4 px-4">
        <TripSummaryCard pickup={searchParams.get('pickup') || ''} destination={searchParams.get('destination') || ''} />
        <div className="h-48 overflow-hidden rounded-3xl">
          <MapView mode="quote" className="h-full" />
        </div>
        <FareEstimateNotice />
        <PaymentPreferenceRow />
        <div className="space-y-3">
          {rideOptions.map((option) => (
            <RideOptionCard key={option.id} option={option} isSelected={selected?.id === option.id} onSelect={setSelected} />
          ))}
        </div>
        <PromoRow />
        <PrimaryCta disabled>Prototype booking handoff not active</PrimaryCta>
      </div>
    </RiderScreenContainer>
  );
}

function RideOptionsFallback() {
  return (
    <RiderScreenContainer className="pb-6">
      <RiderTopBar showBack backHref="/rider/search" title="Fare estimates" subtitle="Prototype quote only" />
      <div className="px-4 text-sm text-slate-500">Loading prototype fare estimate...</div>
    </RiderScreenContainer>
  );
}

export default function RiderRideOptionsPageWithAuth() {
  return (
    <AuthGuard>
      <Suspense fallback={<RideOptionsFallback />}>
        <RiderRideOptionsPage />
      </Suspense>
    </AuthGuard>
  );
}
