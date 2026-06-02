'use client';

import Image from 'next/image';
import { Car, MapPin, Navigation } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import type { Driver } from './ride-request-panel';

const mapImage = PlaceHolderImages.find((place) => place.id === 'map_manila');

type MapMode = 'home' | 'search' | 'quote' | 'driver-state';

type MapViewProps = {
  mode?: MapMode;
  confirmedDriver?: Driver | null;
  showUserPin?: boolean;
  showPickupPin?: boolean;
  showDestinationPin?: boolean;
  showRoute?: boolean;
  className?: string;
};

export function MapView({
  mode = 'home',
  confirmedDriver,
  showUserPin = mode === 'home' || mode === 'search',
  showPickupPin = mode === 'quote',
  showDestinationPin = mode === 'search' || mode === 'quote',
  showRoute = mode === 'quote' || mode === 'driver-state',
  className,
}: MapViewProps) {
  const showDriverMarker = mode === 'driver-state' && confirmedDriver;

  return (
    <div className={cn('relative h-full min-h-72 w-full overflow-hidden bg-slate-200', className)}>
      {mapImage ? (
        <Image src={mapImage.imageUrl} alt="Prototype map shell for Manila" fill priority className="object-cover opacity-90" data-ai-hint={mapImage.imageHint} />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/20 to-white/70" />
      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-muted-foreground shadow-sm">Visual map prototype · not live routing</div>

      {showRoute ? <div className="absolute left-[28%] top-[38%] h-32 w-44 rotate-[-18deg] rounded-full border-4 border-dashed border-primary/70" /> : null}
      {showUserPin ? <Pin className="left-1/2 top-1/2" label="You" tone="blue" pulse /> : null}
      {showPickupPin ? <Pin className="left-[32%] top-[60%]" label="Pickup" tone="blue" /> : null}
      {showDestinationPin ? <Pin className="left-[66%] top-[34%]" label="Drop-off" tone="red" /> : null}
      {showDriverMarker ? <div className="absolute left-[38%] top-[45%] rounded-full bg-white p-2 text-primary shadow-lg"><Car className="h-6 w-6" /><span className="sr-only">Assigned demo driver marker</span></div> : null}
    </div>
  );
}

function Pin({ className, label, tone, pulse }: { className: string; label: string; tone: 'blue' | 'red'; pulse?: boolean }) {
  return <div className={cn('absolute -translate-x-1/2 -translate-y-1/2', className)}><div className="relative flex flex-col items-center gap-1">{pulse ? <div className="absolute top-1 h-12 w-12 rounded-full bg-primary/20 animate-ping" /> : null}<div className={cn('relative flex h-9 w-9 items-center justify-center rounded-full border-4 border-white shadow-lg', tone === 'blue' ? 'bg-primary text-primary-foreground' : 'bg-red-500 text-white')}>{tone === 'blue' ? <Navigation className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}</div><span className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold shadow-sm">{label}</span></div></div>;
}
