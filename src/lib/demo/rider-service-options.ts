import React from 'react';
import { Bike, Car } from 'lucide-react';
import type { RideOption } from '@/components/ride-option-card';

export const supportedRideOptions: RideOption[] = [
  {
    id: 'car',
    name: 'HatidCar',
    description: 'Everyday car rides for up to 4 riders.',
    capacity: 4,
    price: 245,
    eta: '6 min',
    icon: React.createElement(Car, { className: 'h-9 w-9' }),
    availability: 'available',
    estimateLabel: 'Estimated fare',
  },
  {
    id: 'moto',
    name: 'HatidMoto',
    description: 'Point-to-point motorcycle ride for 1 rider.',
    capacity: 1,
    price: 118,
    eta: '4 min',
    icon: React.createElement(Bike, { className: 'h-9 w-9' }),
    availability: 'available',
    estimateLabel: 'Estimated fare',
  },
];

export const serviceModes = [
  { id: 'ride', label: 'Ride', description: 'Book a demo ride quote' },
  { id: 'saved', label: 'Saved', description: 'Use trusted places' },
] as const;
