'use client';

import { useState } from 'react';
import { MapView } from '@/components/map-view';
import { RideRequestPanel, Driver } from '@/components/ride-request-panel';
import AuthGuard from '@/components/auth-guard';

export default function Home() {
  const [confirmedDriver, setConfirmedDriver] = useState<Driver | null>(null);

  return (
    <AuthGuard>
      <div className="relative h-[calc(100vh-5rem)] w-full">
        <div className="h-1/2 w-full">
            <MapView confirmedDriver={confirmedDriver} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2/3">
            <RideRequestPanel onRideConfirmed={setConfirmedDriver} />
        </div>
      </div>
    </AuthGuard>
  );
}
