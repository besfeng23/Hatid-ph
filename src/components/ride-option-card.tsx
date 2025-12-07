
'use client';

import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';
import React from 'react';

export type RideOption = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  eta: string;
  icon: React.ReactNode;
};

type RideOptionCardProps = {
  option: RideOption;
  isSelected: boolean;
  onSelect: (option: RideOption) => void;
};

export function RideOptionCard({ option, isSelected, onSelect }: RideOptionCardProps) {
  return (
    <div
      onClick={() => onSelect(option)}
      className={cn(
        'flex items-center gap-4 rounded-lg border-2 p-4 transition-all cursor-pointer bg-secondary/50 hover:bg-primary/10',
        isSelected ? 'border-primary bg-primary/20' : 'border-transparent'
      )}
    >
      <div className="flex-shrink-0 text-primary">{option.icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline">
            <h4 className="font-bold">{option.name}</h4>
            <p className="font-bold text-foreground">₱{option.price.toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-baseline text-sm text-muted-foreground">
            <div className='flex items-center gap-2'>
                <Users size={14}/>
                <span>{option.capacity}</span>
                <span className='ml-2'>{option.eta} away</span>
            </div>
        </div>
      </div>
    </div>
  );
}
