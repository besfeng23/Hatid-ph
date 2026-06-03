import AuthGuard from '@/components/auth-guard';
import { MapView } from '@/components/map-view';
import { InlineTrustBanner } from '@/components/rider/inline-trust-banner';
import { RiderBottomNav } from '@/components/rider/rider-bottom-nav';
import { RiderScreenContainer } from '@/components/rider/rider-screen-container';
import { RiderTopBar } from '@/components/rider/rider-top-bar';
import { LocationEntryCard } from '@/components/rider/booking/location-entry-card';
import { SavedShortcutsRow } from '@/components/rider/booking/saved-shortcuts-row';
import { ServiceModeRow } from '@/components/rider/booking/service-mode-row';

function Home() {
  return (
    <RiderScreenContainer>
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-white">
        <RiderTopBar title="Hatid" subtitle="Book a prototype ride quote" className="pb-3" />
        <div className="px-5">
          <ServiceModeRow />
        </div>

        <div className="relative mt-4 flex-1 overflow-hidden px-4 pb-28">
          <MapView mode="home" className="h-[44vh] rounded-[2.4rem]" />

          <div className="absolute inset-x-4 bottom-28 z-10 space-y-4">
            <LocationEntryCard />
            <SavedShortcutsRow />
            <InlineTrustBanner title="Hatid is committed to your safety">
              Map and booking UI are visual prototype shells. No live wallet balance, live dispatch, or payment processing is shown.
            </InlineTrustBanner>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20">
          <RiderBottomNav active="Home" />
        </div>
      </div>
    </RiderScreenContainer>
  );
}

export default function HomeWithAuth() {
  return (
    <AuthGuard>
      <Home />
    </AuthGuard>
  );
}
