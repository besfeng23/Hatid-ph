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
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50" />

      {/* User's location pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex flex-col items-center">
          <div className="absolute h-12 w-12 rounded-full bg-primary/50" style={{ animation: 'pulse-glow 2s infinite' }} />
          <div className="relative h-4 w-4 rounded-full bg-primary border-2 border-white shadow-md" />
        </div>
      </div>

      {/* SVG for animated paths */}
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <defs>
          <Path id="path1" d="M 50,200 Q 150,50 300,150 T 500,250" />
          <Path id="path2" d="M 600,50 C 500,150 400,50 300,200 S 100,400 50,300" />
          <Path id="path3" d="M 20,20 C 200,100 100,300 400,350 S 600,200 550,100" />
          <Path id="path4" d="M 580,380 Q 400,300 300,200 T 100,150" />
          <path id="driverPath" d="M 50,50 C 150,150 250,150 250,250 S 350,350 450,250" fill="none" stroke="transparent"/>
        </defs>

        {isClient && !confirmedDriver && nearDrivers.map((driver, index) => (
          <g key={index}>
            <foreignObject
              className="overflow-visible"
              width="32"
              height="32"
            >
              <Sun
                className="h-7 w-7 text-sun drop-shadow-lg"
                style={{
                  offsetPath: `path('${(document.getElementById(driver.pathId) as SVGPathElement)?.getAttribute('d')}')`,
                  offsetDistance: '0%',
                  animation: `move ${driver.duration} linear ${driver.delay} infinite`,
                }}
              />
            </foreignObject>
          </g>
        ))}

        {isClient && confirmedDriver && (
             <g>
                <foreignObject
                className="overflow-visible"
                width="32"
                height="32"
                >
                <div className="p-1 bg-background rounded-full shadow-lg">
                    <Car
                        className="h-6 w-6 text-primary drop-shadow-lg"
                        style={{
                        offsetPath: `path('${(document.getElementById(confirmedDriverPath.pathId) as SVGPathElement)?.getAttribute('d')}')`,
                        offsetDistance: '0%',
                        animation: `move ${confirmedDriverPath.duration} linear ${confirmedDriverPath.delay} 1`,
                        animationFillMode: 'forwards'
                        }}
                    />
                </div>
                </foreignObject>
            </g>
        )}
      </svg>
      <style jsx>{`
        @keyframes move {
          from {
            offset-distance: 0%;
          }
          to {
            offset-distance: 100%;
          }
        }
      `}</style>
    </div>
  );
}
