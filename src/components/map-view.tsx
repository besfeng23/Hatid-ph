'use client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Car, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Driver } from './ride-request-panel';

const mapImage = PlaceHolderImages.find(p => p.id === 'map_manila');

const nearDrivers = [
  { pathId: 'path1', duration: '10s', delay: '0s' },
  { pathId: 'path2', duration: '12s', delay: '1s' },
  { pathId: 'path3', duration: '8s', delay: '2s' },
  { pathId: 'path4', duration: '15s', delay: '3s' },
];

const confirmedDriverPath = { pathId: 'driverPath', duration: '30s', delay: '0s' };


const Path = ({ d, id }: { d: string; id: string }) => (
  <path
    d={d}
    id={id}
    fill="none"
    stroke="hsl(var(--sun) / 0.5)"
    strokeWidth="3"
    strokeDasharray="100"
    strokeDashoffset="100"
    className="[animation:draw-line_5s_ease-in-out_forwards]"
  />
);

export function MapView({ confirmedDriver }: { confirmedDriver: Driver | null }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
       <div className='absolute inset-0'>
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
       </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50" />

      {/* User's location pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex flex-col items-center">
          <div className="absolute h-12 w-12 rounded-full bg-primary/50" style={{ animation: 'pulse-glow 2s infinite' }} />
          <div className="relative h-4 w-4 rounded-full bg-primary border-2 border-white shadow-md" />
        </div>
      </div>
      <div className='absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg'>
          <p className='font-semibold text-sm'>Map of Metro Manila</p>
      </div>
    </div>
  );
}
