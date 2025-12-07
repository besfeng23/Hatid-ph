import React from 'react';
import { getSuggestedPlaces, SuggestedPlacesOutput } from '@/ai/flows/suggested-places';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MapPin } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

async function SuggestedPlacesData() {
  try {
    const fakeInput = {
      searchHistory: 'malls in BGC, historic sites, coffee shops near me',
      localEvents: 'BGC has a weekend market, There is a concert in MOA arena, Intramuros has a new night tour',
    };
    const suggestions = await getSuggestedPlaces(fakeInput);
    return <SuggestedPlacesClient suggestions={suggestions.suggestions} />;
  } catch (error) {
    console.error("Failed to get suggested places:", error);
    return <div className="text-destructive">Could not load suggestions.</div>;
  }
}

export function SuggestedPlaces() {
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold tracking-tight">Discover Manila</h3>
      <p className="text-muted-foreground">AI-powered suggestions just for you.</p>
      <React.Suspense fallback={<SuggestionsSkeleton />}>
        <SuggestedPlacesData />
      </React.Suspense>
    </div>
  );
}

function SuggestedPlacesClient({ suggestions }: { suggestions: SuggestedPlacesOutput['suggestions'] }) {
    
  const placeImages = {
      'Intramuros': PlaceHolderImages.find(p => p.id === 'place_intramuros'),
      'Bonifacio Global City': PlaceHolderImages.find(p => p.id === 'place_bgc'),
      'National Museum Complex': PlaceHolderImages.find(p => p.id === 'place_museum'),
  };

  const getImageUrl = (name: string) => {
    const key = Object.keys(placeImages).find(k => name.includes(k));
    return key ? placeImages[key as keyof typeof placeImages] : PlaceHolderImages.find(p => p.id === 'place_market');
  }

  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent>
        {suggestions.map((item, index) => {
            const image = getImageUrl(item.placeName);
            return (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-full">
                <div className="p-1">
                  <Card className="overflow-hidden bg-background/50">
                    <CardContent className="flex aspect-[4/3] items-center justify-center p-0 relative">
                        {image && (
                            <Image src={image.imageUrl} alt={item.placeName} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={image.imageHint}/>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4">
                            <h4 className="text-lg font-bold text-white">{item.placeName}</h4>
                            <p className="text-xs text-white/80">{item.reason}</p>
                        </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex"/>
      <CarouselNext className="hidden sm:flex"/>
    </Carousel>
  );
}

function SuggestionsSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    )
}
