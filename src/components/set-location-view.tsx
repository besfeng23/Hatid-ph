
'use client';

import { useState, useEffect, useMemo } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Star, Home, Briefcase, Bookmark, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { ScrollArea } from './ui/scroll-area';

interface SetLocationViewProps {
  pickup: string;
  destination: string;
  onConfirm: (pickup: string, destination: string) => void;
  onBack: () => void;
}

const mockSuggestions = [
  'Ayala Avenue, Makati',
  'Ayala Triangle Gardens, Makati',
  'Ayala Malls Circuit',
  'Ayala Center Cebu',
];

export function SetLocationView({
  pickup: initialPickup,
  destination: initialDestination,
  onConfirm,
  onBack,
}: SetLocationViewProps) {
  const [pickup, setPickup] = useState(initialPickup);
  const [destination, setDestination] = useState(initialDestination);
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<'pickup' | 'destination'>('destination');
  
  const { user } = useUser();
  const firestore = useFirestore();

  const savedLocationsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'savedLocations'));
  }, [user, firestore]);

  const { data: savedLocations, isLoading: isLoadingLocations } = useCollection(savedLocationsQuery);

  const homeLocation = useMemo(() => savedLocations?.find(l => l.name === 'Home'), [savedLocations]);
  const workLocation = useMemo(() => savedLocations?.find(l => l.name === 'Work'), [savedLocations]);
  const otherSaved = useMemo(() => savedLocations?.filter(l => l.name !== 'Home' && l.name !== 'Work'), [savedLocations]);

  useEffect(() => {
    if (pickup.length > 2) {
      setPickupSuggestions(mockSuggestions.filter(s => s.toLowerCase().includes(pickup.toLowerCase())));
    } else {
      setPickupSuggestions([]);
    }
  }, [pickup]);

  useEffect(() => {
    if (destination.length > 2) {
      setDestinationSuggestions(mockSuggestions.filter(s => s.toLowerCase().includes(destination.toLowerCase())));
    } else {
      setDestinationSuggestions([]);
    }
  }, [destination]);

  const handleSaveLocation = (name: string, address: string) => {
    if (!user || !firestore) return;
    const ref = collection(firestore, `users/${user.uid}/savedLocations`);
    addDocumentNonBlocking(ref, {
        riderId: user.uid,
        name: name,
        address: address,
        latitude: 0, // Placeholder
        longitude: 0 // Placeholder
    });
  }

  return (
    <>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft />
          </Button>
          <CardTitle className="text-2xl font-bold text-foreground">Set Location</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-4 h-[calc(100%-2rem)] w-px bg-border" />
          <div className="space-y-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <Input
                placeholder="Pickup Location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                onFocus={() => setActiveField('pickup')}
                className="h-14 rounded-2xl pl-10 text-base"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" size={20} />
              <Input
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setActiveField('destination')}
                className="h-14 rounded-2xl pl-10 text-base"
              />
            </div>
          </div>
        </div>

        <ScrollArea className="h-64">
          <div className="space-y-4 pr-4">
            {(activeField === 'pickup' && pickupSuggestions.length > 0) ||
            (activeField === 'destination' && destinationSuggestions.length > 0) ? (
              <div className="space-y-2">
                {(activeField === 'pickup' ? pickupSuggestions : destinationSuggestions).map((s, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start h-auto"
                    onClick={() => {
                      if (activeField === 'pickup') setPickup(s);
                      else setDestination(s);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <MapPin size={16} />
                      <span>{s}</span>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <>
                 <div className="space-y-2">
                    <h4 className="font-semibold text-muted-foreground px-2">Saved Places</h4>
                    {isLoadingLocations && <div className="flex justify-center p-4"><Loader2 className="animate-spin"/></div>}
                    <Button variant="ghost" className="w-full justify-start h-auto" onClick={() => setDestination(homeLocation?.address || '')} disabled={!homeLocation}>
                        <div className="flex items-center gap-4">
                            <Home size={16} />
                            <div className="text-left">
                                <p>Home</p>
                                <p className="text-xs text-muted-foreground">{homeLocation ? homeLocation.address : "Set your home address"}</p>
                            </div>
                        </div>
                    </Button>
                     <Button variant="ghost" className="w-full justify-start h-auto" onClick={() => setDestination(workLocation?.address || '')} disabled={!workLocation}>
                        <div className="flex items-center gap-4">
                            <Briefcase size={16} />
                            <div className="text-left">
                                <p>Work</p>
                                <p className="text-xs text-muted-foreground">{workLocation ? workLocation.address : "Set your work address"}</p>
                            </div>
                        </div>
                    </Button>
                     {otherSaved && otherSaved.map((loc) => (
                        <Button key={loc.id} variant="ghost" className="w-full justify-start h-auto" onClick={() => setDestination(loc.address)}>
                             <div className="flex items-center gap-4">
                                <Bookmark size={16} />
                                <div className="text-left">
                                    <p>{loc.name}</p>
                                    <p className="text-xs text-muted-foreground">{loc.address}</p>
                                </div>
                            </div>
                        </Button>
                     ))}
                </div>
                <Separator />
                <div className="space-y-2">
                     <h4 className="font-semibold text-muted-foreground px-2">Recent Searches</h4>
                     <Button variant="ghost" className="w-full justify-start">SM Megamall</Button>
                     <Button variant="ghost" className="w-full justify-start">Greenbelt 5</Button>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
        <Button onClick={() => onConfirm(pickup, destination)} size="lg" className="w-full h-14 rounded-full text-lg font-bold">
          Confirm Locations
        </Button>
      </CardContent>
    </>
  );
}
