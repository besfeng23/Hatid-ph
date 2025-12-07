'use client';

import { useState, useEffect } from 'react';
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
  Phone,
  MessageSquare,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { SuggestedPlaces } from './suggested-places';
import { PersonalizedRecommendations } from './personalized-recommendations';
import { ScrollArea } from './ui/scroll-area';
import { RideOptionCard, RideOption } from './ride-option-card';
import { TripDetailsCard } from './trip-details-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FoodSuggestionCard } from './food-suggestion-card';

type View = 'request' | 'options' | 'confirming' | 'confirmed';

export type Driver = {
    name: string;
    rating: number;
    vehicle: string;
    plate: string;
    avatarUrl: string;
    avatarHint: string;
};

// Add a new prop to pass the driver to the MapView
export function RideRequestPanel({ onRideConfirmed }: { onRideConfirmed: (driver: Driver | null) => void }) {
  const [destination, setDestination] = useState('Bonifacio High Street');
  const [pickup, setPickup] = useState('Market! Market!');
  const [view, setView] = useState<View>('request');
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [confirmedDriver, setConfirmedDriver] = useState<Driver | null>(null);
  const [eta, setEta] = useState(5);

  const rideOptions: RideOption[] = [
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

  const handleSelectRide = (ride: RideOption) => {
    setSelectedRide(ride);
  };

  const handleConfirmRide = () => {
    setView('confirming');
    setTimeout(() => {
      const driver: Driver = {
          name: 'John',
          rating: 4.9,
          vehicle: 'Toyota Vios',
          plate: 'ABC-1234',
          avatarUrl: 'https://images.unsplash.com/photo-1624395213043-fa2e123b2656?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjQ5NzY5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          avatarHint: 'man portrait',
      };
      setConfirmedDriver(driver);
      onRideConfirmed(driver); // Pass driver data to parent
      setEta(5);
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
    setConfirmedDriver(null);
    onRideConfirmed(null); // Clear driver data
    setDestination('Bonifacio High Street');
  }

  useEffect(() => {
      if (view === 'confirmed' && eta > 0) {
          const timer = setTimeout(() => setEta(eta - 1), 60 * 1000); // Decrease ETA every minute
          return () => clearTimeout(timer);
      }
  }, [view, eta]);

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
                    className="h-12 rounded-lg bg-secondary pl-12 text-base"
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
                    className="h-12 rounded-lg bg-secondary pl-12 text-base"
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
              <Tabs defaultValue="places">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="places">Places</TabsTrigger>
                  <TabsTrigger value="food">Dining</TabsTrigger>
                  <TabsTrigger value="picks">For You</TabsTrigger>
                </TabsList>
                <TabsContent value="places" className="mt-4">
                  <SuggestedPlaces />
                </TabsContent>
                <TabsContent value="food" className="mt-4">
                  <FoodSuggestionCard />
                </TabsContent>
                <TabsContent value="picks" className="mt-4">
                  <PersonalizedRecommendations />
                </TabsContent>
              </Tabs>
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
            return confirmedDriver ? (
                 <CardContent className="flex flex-col h-full gap-4 p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Your driver is on the way!</h2>
                        <p className="text-primary font-bold text-lg">{eta} min away</p>
                    </div>
                    <TripDetailsCard driver={confirmedDriver}/>
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <Button variant="outline" size="lg" className="h-12"><Phone className="mr-2"/> Call</Button>
                        <Button variant="outline" size="lg" className="h-12"><MessageSquare className="mr-2"/> Message</Button>
                    </div>
                    <Button onClick={reset} variant="destructive" className="mt-2">Cancel Ride</Button>
                </CardContent>
            ) : null;
    }
  };

  return (
    <Card className="flex h-full max-h-[calc(100vh-4rem)] w-full flex-col rounded-2xl shadow-lg">
      <ScrollArea className="flex-1">{renderContent()}</ScrollArea>
    </Card>
  );
}
