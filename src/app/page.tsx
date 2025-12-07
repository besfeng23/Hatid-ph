'use client';

import { useState } from 'react';
import { MapView } from '@/components/map-view';
import { RideRequestPanel, Driver } from '@/components/ride-request-panel';
import { SidebarInset } from '@/components/ui/sidebar';
import AuthGuard from '@/components/auth-guard';

export default function Home() {
  const [confirmedDriver, setConfirmedDriver] = useState<Driver | null>(null);

  return (
    <AuthGuard>
      <SidebarInset>
        <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 gap-8 lg:grid-cols-12 p-4 md:p-6 lg:p-8">
          <div className="h-[50vh] lg:col-span-7 lg:h-full xl:col-span-8">
            <MapView confirmedDriver={confirmedDriver} />
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <RideRequestPanel onRideConfirmed={setConfirmedDriver} />
          </div>
        </div>
      </SidebarInset>
    </AuthGuard>
  );
}
