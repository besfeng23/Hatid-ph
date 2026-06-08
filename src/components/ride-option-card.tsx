
'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2, Users } from 'lucide-react';
import React from 'react';

// This type is now more generic and can be used with data from the API.
export type RideOption = {
  id: string;
  name: string;
  description: string;
  capacity?: number;
  price: number;
  eta: string;
  icon: React.ReactNode;
  availability?: 'available' | 'limited' | 'unavailable';
  estimateLabel?: string;
};

type RideOptionCardProps = {
  option: RideOption;
  isSelected: boolean;
  onSelect: (option: RideOption) => void;
};

export function RideOptionCard({ option, isSelected, onSelect }: RideOptionCardProps) {
  const unavailable = option.availability === 'unavailable';
  return (
    <button
      type="button"
      onClick={() => !unavailable && onSelect(option)}
      disabled={unavailable}
      className={cn(
        'flex w-full items-center gap-4 rounded-3xl border bg-white p-4 text-left shadow-sm transition-all',
        isSelected ? 'border-primary ring-4 ring-primary/10' : 'border-slate-200 hover:border-primary/40',
        unavailable && 'cursor-not-allowed opacity-50'
      )}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">{option.icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-lg font-extrabold leading-tight">{option.name}</h4>
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </div>
          {isSelected ? <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" /> : null}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {option.capacity ? <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" /> {option.capacity}</span> : null}
            <span>{option.eta} pickup estimate</span>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{option.estimateLabel || 'Estimate'}</p>
            <p className="text-xl font-black">₱{option.price.toFixed(0)}</p>
          </div>
        </div>
      </div>
    </button>
  );
}
