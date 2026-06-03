'use client';

import { Car, MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Driver } from './ride-request-panel';

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

const labels = [
  { text: 'BONIFACIO GLOBAL CITY', className: 'left-[45%] top-[17%]' },
  { text: 'Makati', className: 'left-[18%] top-[27%]' },
  { text: 'Ortigas Center', className: 'left-[58%] top-[27%]' },
  { text: 'Pateros', className: 'left-[82%] top-[35%]' },
  { text: 'Taguig', className: 'left-[48%] top-[57%]' },
  { text: 'SM Aura Premier', className: 'left-[12%] top-[45%]' },
  { text: 'Estancia Mall', className: 'left-[77%] top-[49%]' },
];

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
    <div className={cn('relative h-full min-h-[19rem] w-full overflow-hidden rounded-[2.2rem] bg-[#ebf3fd]', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(235,243,253,0.93)_45%,_rgba(224,236,250,0.96)_100%)]" />
      <div className="absolute -right-4 top-0 h-full w-24 rounded-full bg-[#d8e7fb] opacity-95" />
      <div className="absolute left-[76%] top-0 h-full w-[3px] rotate-[11deg] rounded-full bg-[#d7e5fb]" />
      <div className="absolute left-[28%] top-0 h-full w-[3px] rotate-[-11deg] rounded-full bg-white/70" />
      <div className="absolute left-[52%] top-[22%] h-[34%] w-[16%] rounded-full bg-[#d8efdb] blur-sm" />
      <div className="absolute left-[17%] top-[48%] h-[18%] w-[13%] rounded-full bg-[#d8efdb] blur-sm" />
      <div className="absolute left-[12%] top-[40%] h-[4px] w-[32%] rotate-[18deg] rounded-full bg-[#f7d375] opacity-95" />
      <div className="absolute left-[49%] top-[44%] h-[4px] w-[28%] rotate-[-15deg] rounded-full bg-[#f7d375] opacity-95" />
      <div className="absolute left-[18%] top-[63%] h-[3px] w-[49%] rotate-[-8deg] rounded-full bg-[#cad8ec] opacity-95" />
      <div className="absolute left-[64%] top-[57%] h-[3px] w-[24%] rotate-[26deg] rounded-full bg-[#cad8ec] opacity-95" />

      <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-slate-500 shadow-sm">
        Visual map prototype · not live routing
      </div>

      {showRoute ? (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" fill="none">
          <path d="M115 278 C150 242, 205 260, 242 224 S323 172, 340 118" stroke="#4f7ef4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}

      {labels.map((label) => (
        <span key={label.text} className={cn('absolute text-[11px] font-bold tracking-wide text-slate-500', label.className)}>
          {label.text}
        </span>
      ))}

      {showUserPin ? <MapMarker className="left-[52%] top-[47%]" label="You are here" tone="blue" pulse /> : null}
      {showPickupPin ? <MapMarker className="left-[20%] top-[56%]" label="Pickup" tone="blue" /> : null}
      {showDestinationPin ? <MapMarker className="left-[71%] top-[34%]" label={mode === 'search' ? 'Use this location' : 'Drop-off'} tone="red" /> : null}
      {showDriverMarker ? (
        <div className="absolute left-[38%] top-[53%] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-lg">
          <Car className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  );
}

function MapMarker({ className, label, tone, pulse }: { className: string; label: string; tone: 'blue' | 'red'; pulse?: boolean }) {
  return (
    <div className={cn('absolute -translate-x-1/2 -translate-y-1/2', className)}>
      <div className="relative flex flex-col items-center gap-2">
        {pulse ? <div className="absolute top-1 h-12 w-12 rounded-full bg-primary/20" style={{ animation: 'pulse-glow 2s infinite' }} /> : null}
        <div className={cn('relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-lg', tone === 'blue' ? 'bg-primary text-white' : 'bg-red-500 text-white')}>
          {tone === 'blue' ? <Navigation className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
        </div>
        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm">{label}</span>
      </div>
    </div>
  );
}
