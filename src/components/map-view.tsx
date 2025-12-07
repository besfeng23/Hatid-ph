'use client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Car, MapPin } from 'lucide-react';

const mapImage = PlaceHolderImages.find(p => p.id === 'map_manila');

const drivers = [
  { top: '20%', left: '30%', delay: '0s' },
  { top: '50%', left: '60%', delay: '0.5s' },
  { top: '35%', left: '75%', delay: '0.2s' },
  { top: '70%', left: '25%', delay: '0.8s' },
];

export function MapView() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg">
      {mapImage && (
        <Image
          src={mapImage.imageUrl}
          alt={mapImage.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={mapImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/10" />

      {/* User's location pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex flex-col items-center">
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-blue-500/50" />
          <MapPin className="relative h-10 w-10 text-blue-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          <span className="relative mt-2 rounded-full bg-blue-500/80 px-2 py-1 text-xs font-bold text-white">
            YOU ARE HERE
          </span>
        </div>
      </div>

      {/* Animated driver icons */}
      {drivers.map((driver, index) => (
        <div
          key={index}
          className="absolute"
          style={{ top: driver.top, left: driver.left }}
        >
          <div
            className="relative animate-bounce"
            style={{ animationDelay: driver.delay }}
          >
            <div className="absolute -inset-1 animate-ping rounded-full bg-primary/50" />
            <Car className="relative h-7 w-7 text-primary drop-shadow-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
