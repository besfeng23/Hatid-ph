
'use client';

import { useState } from 'react';
import { MapView } from '@/components/map-view';
import { RideRequestPanel, Driver } from '@/components/ride-request-panel';
import AuthGuard from '@/components/auth-guard';

export default function Home() {
  const [confirmedDriver, setConfirmedDriver] = useState<Driver | null>(null);

  return (
    <AuthGuard>
      <div className="relative h-screen w-full">
        <MapView confirmedDriver={confirmedDriver} />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <RideRequestPanel onRideConfirmed={setConfirmedDriver} />
        </div>
      </div>
    </AuthGuard>
  );
}
