
import React from 'react';
import { Bike, Car } from 'lucide-react';

// This file is now only for the service options, not the ride options themselves.
export const supportedRideOptions = [
  {
    id: 'car',
    name: 'HatidCar',
    description: 'Everyday car rides for up to 4 riders.',
    capacity: 4,
    icon: React.createElement(Car, { className: 'h-9 w-9' }),
    availability: 'available',
  },
  {
    id: 'moto',
    name: 'HatidMoto',
    description: 'Point-to-point motorcycle ride for 1 rider.',
    capacity: 1,
    icon: React.createElement(Bike, { className: 'h-9 w-9' }),
    availability: 'available',
  },
];

export const serviceModes = [
  { id: 'ride', label: 'Ride', description: 'Book a demo ride quote' },
  { id: 'saved', label: 'Saved', description: 'Use trusted places' },
] as const;
