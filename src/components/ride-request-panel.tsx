
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
  Package,
  MapPin,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { SuggestedPlaces } from './suggested-places';
import { PersonalizedRecommendations } from './personalized-recommendations';
import { ScrollArea } from './ui/scroll-area';
import { RideOptionCard, RideOption } from './ride-option-card';
import { TripDetailsCard } from './trip-details-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FoodSuggestionCard } from './food-suggestion-card';
import { DeliveryRequestForm } from './delivery-request-form';
import { cn } from '@/lib/utils';
import { SetLocationView } from './set-location-view';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';

type View = 'request' | 'options' | 'confirming' | 'confirmed' | 'discovery' | 'setLocation' | 'completed';

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
  const [currentTab, setCurrentTab] = useState('ride');
  const [discoveryTab, setDiscoveryTab] = useState('places');
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const rideOptions: RideOption[] = [
    {
      id: 'sedan',
      name: 'HatidCar',
      description: 'Comfortable sedans',
      capacity: 4,
      price: 280.5,
      eta: '5 min',
      icon: <Car className="w-10 h-10 text-primary" />,
    },
    {
      id: 'motorcycle',
      name: 'HatidMoto',
      description: 'Quick & nimble bikes',
      capacity: 1,
      price: 150.0,
      eta: '3 min',
      icon: <Bike className="w-10 h-10 text-primary" />,
    },
    {
      id: 'van',
      name: 'HatidPlus',
      description: 'For bigger groups',
      capacity: 6,
      price: 420.75,
      eta: '8 min',
      icon: <Users className="w-10 h-10 text-primary" />,
    },
     {
      id: 'padala',
      name: 'HatidPadala',
      description: 'On-demand delivery',
      capacity: 0, 
      price: 120.0,
      eta: '4 min',
      icon: <Package className="w-10 h-10 text-primary" />,
    },
  ];

  const handleFindRide = () => {
    setView('options');
  };
  
  const handleLocationSelect = (pickup: string, destination: string) => {
    setPickup(pickup);
    setDestination(destination);
    setView('options');
  };

  const handleSelectRide = (ride: RideOption) => {
    setSelectedRide(ride);
  };

  const handleConfirmRide = () => {
    setView('confirming');

    // Simulate multi-step driver search
    const simulateSearch = (attempts: number) => {
        if (attempts > 3) { // Fail after 3 attempts
            toast({
                variant: 'destructive',
                title: 'No Drivers Available',
                description: 'We couldn\'t find a driver for you right now. Please try again in a few moments.',
            });
            setView('options');
            return;
        }

        setTimeout(() => {
            // Simulate a 50% chance of a driver accepting
            if (Math.random() > 0.5) {
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
            } else {
                simulateSearch(attempts + 1);
            }
        }, 2000 + Math.random() * 2000); // Wait 2-4 seconds per attempt
    };

    simulateSearch(1);
};


  const handleBack = () => {
    if (view === 'options') {
      setView('request');
    } else if (view === 'setLocation') {
      setView('request');
    }
  };
  
  const reset = () => {
    setIsSubmitting(true);
    // Simulate API call for payment
    setTimeout(() => {
        toast({
            title: 'Payment Successful',
            description: `₱${((selectedRide?.price || 0) + tip).toFixed(2)} has been charged to your card.`,
        });

        // Reset state after toast
        setTimeout(() => {
            setIsSubmitting(false);
            setView('request');
            setSelectedRide(null);
            setConfirmedDriver(null);
            onRideConfirmed(null); // Clear driver data
            setDestination('');
            setPickup('');
            setRating(0);
            setTip(0);
        }, 1500);
    }, 1000);
  }

  const handleCompleteTrip = () => {
    setView('completed');
  }

  useEffect(() => {
      if (view === 'confirmed' && eta > 0) {
          const timer = setTimeout(() => setEta(eta - 1), 60 * 1000); // Decrease ETA every minute
          return () => clearTimeout(timer);
      }
  }, [view, eta]);

  const renderContent = () => {
    switch (view) {
      case 'setLocation':
        return (
          <SetLocationView
            pickup={pickup}
            destination={destination}
            onConfirm={handleLocationSelect}
            onBack={handleBack}
          />
        );
      case 'request':
        return (
          <>
            <CardHeader className='pb-4'>
              <CardTitle className="text-3xl font-bold text-foreground">
                Hello! Where to?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Tabs defaultValue="ride" className="w-full" onValueChange={setCurrentTab}>
                    <TabsList className="grid w-full grid-cols-2 h-12">
                        <TabsTrigger value="ride" className="text-base">Ride</TabsTrigger>
                        <TabsTrigger value="padala" className="text-base">Padala</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ride" className="space-y-4 pt-4">
                         <div className="space-y-2">
                            <div className="relative">
                            <MapPin
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                size={20}
                            />
                            <Input
                                placeholder="Enter your destination"
                                className="h-14 rounded-2xl bg-secondary pl-12 text-base"
                                value={destination}
                                onFocus={() => setView('setLocation')}
                                onChange={e => setDestination(e.target.value)}
                            />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="padala">
                        <div onClick={() => setView('setLocation')}>
                            <DeliveryRequestForm />
                        </div>
                    </TabsContent>
                </Tabs>

              <Button
                className="w-full h-14 rounded-full text-lg font-bold"
                size="lg"
                disabled={currentTab === 'ride' && !destination}
                onClick={handleFindRide}
              >
                {currentTab === 'ride' ? 'Find a Ride' : 'Find a Courier'}
                <ArrowRight className="ml-2" />
              </Button>
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
                 <div className="p-4 rounded-2xl bg-secondary space-y-2 text-sm shadow-inner">
                    <p><span className="font-semibold text-muted-foreground">From:</span> {pickup}</p>
                     <Separator/>
                    <p><span className="font-semibold text-muted-foreground">To:</span> {destination}</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {rideOptions.filter(o => currentTab === 'padala' ? o.id === 'padala' : o.id !== 'padala' ).map(option => (
                <RideOptionCard
                  key={option.id}
                  option={option}
                  isSelected={selectedRide?.id === option.id}
                  onSelect={handleSelectRide}
                />
              ))}
               <div className='text-xs text-muted-foreground text-center p-2'>
                <p>Estimated Time of Arrival (ETA) to Pickup: {selectedRide?.eta || '[X]'} minutes.</p>
                <p>Total trip time will be displayed upon driver confirmation.</p>
              </div>
              <Button
                className="w-full h-14 rounded-full text-lg font-bold"
                size="lg"
                disabled={!selectedRide}
                onClick={handleConfirmRide}
              >
                Confirm {selectedRide?.name || 'Service'}
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
                 <CardContent className="flex flex-col h-full gap-4 p-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Your driver is on the way!</h2>
                        <p className="text-primary font-bold text-lg">{eta} min away</p>
                    </div>
                    <TripDetailsCard driver={confirmedDriver}/>
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <Button variant="outline" size="lg" className="h-14 text-base rounded-2xl"><Phone className="mr-2"/> Call</Button>
                        <Button variant="outline" size="lg" className="h-14 text-base rounded-2xl"><MessageSquare className="mr-2"/> Message</Button>
                    </div>
                    <Button onClick={handleCompleteTrip} className="mt-2 h-14 rounded-full text-lg">Simulate Trip Completion</Button>
                </CardContent>
            ) : null;
        case 'completed':
            return (
                <CardContent className="flex flex-col h-full gap-4 p-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Thank you for riding with Hatid!</h2>
                        <p className="text-muted-foreground">Please rate your experience.</p>
                    </div>
                    <Card className="bg-secondary/50">
                        <CardContent className="p-4 space-y-2">
                             <div className="flex justify-between items-center">
                                <p className="font-semibold">Total Fare:</p>
                                <p className="font-bold text-lg">₱{selectedRide?.price.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <p className="text-muted-foreground">Payment Method:</p>
                                <p className="text-muted-foreground">Credit Card</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-2 text-center">
                        <Label className="font-semibold">Rate Your Driver</Label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                key={star}
                                className={cn(
                                    "w-10 h-10 cursor-pointer",
                                    rating >= star ? "text-primary fill-primary" : "text-muted-foreground/50"
                                )}
                                onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>
                     <Textarea placeholder="Add a comment..."/>

                    <div className="space-y-2">
                        <Label className="font-semibold">Show Appreciation to Your Driver</Label>
                         <div className="grid grid-cols-4 gap-2">
                            <Button variant={tip === 20 ? 'secondary' : 'outline'} onClick={() => setTip(20)}>₱20</Button>
                            <Button variant={tip === 50 ? 'secondary' : 'outline'} onClick={() => setTip(50)}>₱50</Button>
                            <Button variant={tip === 100 ? 'secondary' : 'outline'} onClick={() => setTip(100)}>₱100</Button>
                            <Input 
                                type="number" 
                                placeholder="Custom" 
                                className="text-center"
                                onChange={(e) => setTip(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    
                    <Button onClick={reset} className="mt-auto h-14 rounded-full text-lg" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                        Submit & Finish
                    </Button>
                </CardContent>
            );
        case 'discovery':
            return (
                 <CardContent className="flex flex-col h-full gap-4 p-4">
                     <Tabs value={discoveryTab} onValueChange={setDiscoveryTab} className="w-full">
                        <TabsContent value="places" className="mt-0">
                            <SuggestedPlaces />
                        </TabsContent>
                        <TabsContent value="food" className="mt-0">
                            <FoodSuggestionCard />
                        </TabsContent>
                        <TabsContent value="picks" className="mt-0">
                            <PersonalizedRecommendations />
                        </TabsContent>
                    </Tabs>
                 </CardContent>
            )
    }
  };

  const renderDiscoveryContent = () => {
    switch (discoveryTab) {
        case 'places':
            return <SuggestedPlaces />;
        case 'food':
            return <FoodSuggestionCard />;
        case 'picks':
            return <PersonalizedRecommendations />;
        default:
            return <SuggestedPlaces/>;
    }
  }

  const mainContentHeight = view === 'request' ? 'h-full' : 'h-full';

  return (
    <Card className="flex h-full w-full flex-col rounded-t-3xl shadow-2xl overflow-hidden">
        <div className={cn('transition-all duration-300', view === 'request' ? 'h-full' : 'h-full')}>
             <ScrollArea className="h-full">
                {view === 'discovery' ? (
                  <CardContent className='p-4'>
                    {renderDiscoveryContent()}
                  </CardContent>
                ) : renderContent()}
             </ScrollArea>
        </div>
      
       {(view === 'request' || view === 'setLocation') && (
         <div className="mt-auto border-t bg-background rounded-b-3xl">
            <div className="grid grid-cols-3 gap-2 p-2">
                <Button variant={discoveryTab === 'places' ? "secondary" : "ghost"} className="flex-col h-16 rounded-2xl text-xs" onClick={() => {setView('discovery'); setDiscoveryTab('places')}}>
                    <MapPin/>
                    <span>Places</span>
                </Button>
                 <Button variant={discoveryTab === 'food' ? "secondary" : "ghost"} className="flex-col h-16 rounded-2xl text-xs" onClick={() => {setView('discovery'); setDiscoveryTab('food')}}>
                    <Utensils/>
                    <span>Dining</span>
                </Button>
                 <Button variant={discoveryTab === 'picks' ? "secondary" : "ghost"} className="flex-col h-16 rounded-2xl text-xs" onClick={() => {setView('discovery'); setDiscoveryTab('picks')}}>
                    <Sparkles/>
                    <span>For You</span>
                </Button>
            </div>
        </div>
       )}
        {view === 'discovery' && (
             <div className="mt-auto p-2 border-t bg-background rounded-b-3xl">
                <Button className='w-full h-14 rounded-full text-lg' onClick={() => setView('request')}>Back to Ride</Button>
             </div>
        )}
    </Card>
  );
}
