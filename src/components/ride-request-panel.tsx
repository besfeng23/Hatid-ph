
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Bike,
  Users,
  Search,
  Wallet,
  Star,
  Loader2,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { SuggestedPlaces } from './suggested-places';
import { PersonalizedRecommendations } from './personalized-recommendations';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { RideOptionCard } from './ride-option-card';

type View = 'request' | 'options' | 'confirming' | 'confirmed';

export function RideRequestPanel() {
  const [destination, setDestination] = useState('Bonifacio High Street');
  const [pickup, setPickup] = useState('Market! Market!');
  const [view, setView] = useState<View>('request');
  const [selectedRide, setSelectedRide] = useState<any>(null);

  const rideOptions = [
    {
      id: 'sedan',
      name: 'HatidCar',
      description: 'Comfortable sedans',
      capacity: 4,
      price: 280.5,
      eta: '5 min',
      icon: <Car className="w-8 h-8 text-primary" />,
    },
    {
      id: 'motorcycle',
      name: 'HatidMoto',
      description: 'Quick & nimble bikes',
      capacity: 1,
      price: 150.0,
      eta: '3 min',
      icon: <Bike className="w-8 h-8 text-primary" />,
    },
    {
      id: 'van',
      name: 'HatidPlus',
      description: 'For bigger groups',
      capacity: 6,
      price: 420.75,
      eta: '8 min',
      icon: <Users className="w-8 h-8 text-primary" />,
    },
  ];

  const handleFindRide = () => {
    setView('options');
  };

  const handleSelectRide = (ride: any) => {
    setSelectedRide(ride);
  };

  const handleConfirmRide = () => {
    setView('confirming');
    setTimeout(() => {
      setView('confirmed');
    }, 2000);
  };

  const handleBack = () => {
    if (view === 'options') {
      setView('request');
    }
  };
  
  const reset = () => {
    setView('request');
    setSelectedRide(null);
    setDestination('Bonifacio High Street');
  }

  const renderContent = () => {
    switch (view) {
      case 'request':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-foreground">
                Hello! Where to?
              </CardTitle>
              <CardDescription>
                Your next destination in Manila is just a tap away.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="Enter pickup location"
                    className="h-12 rounded-lg bg-gray-100 pl-12 text-base"
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                  />
                </div>
                 <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="Enter your destination"
                    className="h-12 rounded-lg bg-gray-100 pl-12 text-base"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="w-full h-14 rounded-full text-lg font-bold"
                size="lg"
                disabled={!destination || !pickup}
                onClick={handleFindRide}
              >
                Find a Ride
                <ArrowRight className="ml-2" />
              </Button>
              <Separator className="my-6" />
              <SuggestedPlaces />
              <Separator className="my-6" />
              <PersonalizedRecommendations />
            </CardContent>
          </>
        );
      case 'options':
        return (
          <>
            <CardHeader>
                <div className='flex items-center gap-2 mb-2'>
                    <Button variant="ghost" size="icon" onClick={handleBack} className='shrink-0'>
                        <ArrowLeft />
                    </Button>
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Choose Your Ride
                    </CardTitle>
                </div>
              <CardDescription>Select a ride that suits your needs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-secondary space-y-1 text-sm">
                    <p><span className="font-semibold text-muted-foreground">From:</span> {pickup}</p>
                    <p><span className="font-semibold text-muted-foreground">To:</span> {destination}</p>
                </div>
              {rideOptions.map(option => (
                <RideOptionCard
                  key={option.id}
                  option={option}
                  isSelected={selectedRide?.id === option.id}
                  onSelect={handleSelectRide}
                />
              ))}
              <Button
                className="w-full h-14 rounded-full text-lg font-bold"
                size="lg"
                disabled={!selectedRide}
                onClick={handleConfirmRide}
              >
                Confirm {selectedRide?.name || 'Ride'}
              </Button>
            </CardContent>
          </>
        );
        case 'confirming':
            return (
                <CardContent className="flex flex-col items-center justify-center h-full gap-4">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <h2 className="text-2xl font-bold">Finding your driver...</h2>
                    <p className="text-muted-foreground">Please wait while we connect you.</p>
                </CardContent>
            );
        case 'confirmed':
            return (
                 <CardContent className="flex flex-col items-center justify-center h-full gap-2 text-center">
                    <Car className="h-16 w-16 text-primary" />
                    <h2 className="text-2xl font-bold">Driver Found!</h2>
                    <p className="text-muted-foreground max-w-xs">Your driver, John, is on his way in a Toyota Vios (ABC-1234).</p>
                    <div className="flex items-center gap-1 text-lg font-bold text-yellow-500">
                        <Star className='h-5 w-5 fill-current'/> 4.9
                    </div>
                    <Button onClick={reset} className="mt-4">Done</Button>
                </CardContent>
            );
    }
  };

  return (
    <Card className="flex h-full max-h-[calc(100vh-10rem)] w-full flex-col rounded-2xl shadow-lg">
      <ScrollArea className="flex-1">{renderContent()}</ScrollArea>
    </Card>
  );
}
