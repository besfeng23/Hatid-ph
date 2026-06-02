import AuthGuard from '@/components/auth-guard';
import { MapView } from '@/components/map-view';
import { InlineTrustBanner } from '@/components/rider/inline-trust-banner';
import { RiderBottomNav } from '@/components/rider/rider-bottom-nav';
import { RiderScreenContainer } from '@/components/rider/rider-screen-container';
import { RiderTopBar } from '@/components/rider/rider-top-bar';
import { LocationEntryCard } from '@/components/rider/booking/location-entry-card';
import { SavedShortcutsRow } from '@/components/rider/booking/saved-shortcuts-row';
import { ServiceModeRow } from '@/components/rider/booking/service-mode-row';

function Home() { return <RiderScreenContainer className="relative flex h-screen flex-col overflow-hidden"><RiderTopBar subtitle="Book a prototype ride quote" /><div className="px-4"><ServiceModeRow /></div><div className="relative mt-3 flex-1 overflow-hidden rounded-t-[2rem]"><MapView mode="home" className="h-full" /></div><div className="absolute bottom-0 left-0 right-0 space-y-3 px-4 pb-20"><LocationEntryCard /><SavedShortcutsRow /><InlineTrustBanner className="shadow-sm">Map and booking UI are visual prototype shells. No live wallet balance, live dispatch, or payment processing is shown.</InlineTrustBanner></div><div className="absolute bottom-0 left-0 right-0"><RiderBottomNav active="Home" /></div></RiderScreenContainer>; }
export default function HomeWithAuth() { return <AuthGuard><Home /></AuthGuard>; }
