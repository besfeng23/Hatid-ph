
'use client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Car } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Driver } from './ride-request-panel';

const mapImage = PlaceHolderImages.find(p => p.id === 'map_manila');

const nearDrivers = [
  { pathId: 'path1', duration: '10s', delay: '0s', d: 'M 200 200 C 150 150, 100 250, 50 300' },
  { pathId: 'path2', duration: '12s', delay: '1s', d: 'M 200 200 C 250 150, 300 250, 350 300' },
  { pathId: 'path3', duration: '8s', delay: '2s', d: 'M 200 200 C 150 250, 250 250, 200 350' },
  { pathId: 'path4', duration: '15s', delay: '3s', d: 'M 200 200 C 250 250, 150 350, 100 400' },
];

const confirmedDriverPath = { pathId: 'driverPath', duration: '10s', delay: '0s', d: "M 100 350 C 150 300, 180 250, 200 200" };

const CarIcon = ({ pathId, duration, delay }: { pathId: string; duration: string; delay: string; }) => (
    <foreignObject className="w-full h-full">
        <div className="w-full h-full" style={{ offsetPath: `path(getComputedStyle(document.getElementById('${pathId}')).getPropertyValue('d'))`, animation: `move-car ${duration} ${delay} linear infinite`}}>
            <Car className="text-primary w-6 h-6" />
        </div>
    </foreignObject>
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

       {isClient && !confirmedDriver && (
         <svg key="nearby-drivers" className='absolute inset-0 w-full h-full' viewBox="0 0 400 400">
            <defs>
                {nearDrivers.map(driver => (
                    <path key={driver.pathId} id={driver.pathId} d={driver.d} />
                ))}
            </defs>
            {nearDrivers.map(driver => (
                <g key={driver.pathId}>
                    <path d={driver.d} fill="none" stroke="hsl(var(--sun) / 0.3)" strokeWidth="2" strokeDasharray="5 5" />
                    <CarIcon pathId={driver.pathId} duration={driver.duration} delay={driver.delay} />
                </g>
            ))}
        </svg>
       )}

      {isClient && confirmedDriver && (
        <svg key="confirmed-driver" className='absolute inset-0 w-full h-full' viewBox="0 0 400 400">
          <defs>
              <path id={confirmedDriverPath.pathId} d={confirmedDriverPath.d} />
          </defs>
           <g>
                <path d={confirmedDriverPath.d} fill="none" stroke="hsl(var(--sun))" strokeWidth="4" strokeDasharray="250" strokeDashoffset="250" style={{ animation: `draw-line ${confirmedDriverPath.duration} ease-in-out forwards` }}/>
                 <foreignObject className="w-full h-full">
                     <div className="w-full h-full" style={{ offsetPath: `path('${confirmedDriverPath.d}')`, animation: `move-car ${confirmedDriverPath.duration} linear forwards` }}>
                        <Car className="text-primary w-8 h-8 -rotate-45" />
                    </div>
                </foreignObject>
            </g>
        </svg>
      )}

      <style jsx>{`
        @keyframes move-car {
            0% {
                offset-distance: 0%;
            }
            100% {
                offset-distance: 100%;
            }
        }
      `}</style>
    </div>
  );
}
