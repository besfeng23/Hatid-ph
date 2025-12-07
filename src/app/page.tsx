import { MapView } from '@/components/map-view';
import { RideRequestPanel } from '@/components/ride-request-panel';

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="relative grid min-h-[calc(100vh-12rem)] grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="h-[50vh] lg:col-span-8 lg:h-full xl:col-span-9">
          <MapView />
        </div>
        <div className="lg:col-span-4 xl:col-span-3">
          <RideRequestPanel />
        </div>
      </div>
    </div>
  );
}
