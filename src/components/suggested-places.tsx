
'use client';

import React, { useEffect, useState } from 'react';
import { SuggestedPlacesOutput } from '@/ai/flows/suggested-places';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from './ui/skeleton';

const mockSuggestions: SuggestedPlacesOutput['suggestions'] = [
  {
    placeName: 'Intramuros',
    description: 'The historic walled city of Manila.',
    reason: 'A great place to explore Philippine history, based on your interest in historic sites.',
  },
  {
    placeName: 'BGC Weekend Market',
    description: 'A lively market with local food and crafts.',
    reason: 'Matches the local events and your interest in exploring new areas.',
  },
  {
    placeName: 'National Museum Complex',
    description: 'Explore Filipino art, history, and culture.',
    reason: 'A perfect follow-up to your searches for cultural spots.',
  },
];


export function SuggestedPlaces() {
  const [suggestions, setSuggestions] = useState<SuggestedPlacesOutput['suggestions'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        // Using mock data to avoid hitting API rate limits during development
        setSuggestions(mockSuggestions);
      } catch (e) {
        console.error("Failed to get suggested places:", e);
        setError("Could not load suggestions.");
      }
    }

    fetchSuggestions();
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold tracking-tight">Discover Manila</h3>
      <p className="text-muted-foreground">AI-powered suggestions just for you.</p>
      {error && <div className="text-destructive">{error}</div>}
      {!suggestions && !error && <SuggestionsSkeleton />}
      {suggestions && <SuggestedPlacesClient suggestions={suggestions} />}
    </div>
  );
}

function SuggestedPlacesClient({ suggestions }: { suggestions: SuggestedPlacesOutput['suggestions'] }) {
    
  const placeImages = {
      'Intramuros': PlaceHolderImages.find(p => p.id === 'place_intramuros'),
      'BGC': PlaceHolderImages.find(p => p.id === 'place_bgc'),
      'National Museum Complex': PlaceHolderImages.find(p => p.id === 'place_museum'),
      'Market': PlaceHolderImages.find(p => p.id === 'place_market'),
  };

  const getImageUrl = (name: string) => {
    if (name.includes('Intramuros')) return placeImages['Intramuros'];
    if (name.includes('BGC')) return placeImages['BGC'];
    if (name.includes('Museum')) return placeImages['National Museum Complex'];
    return placeImages['Market'];
  }

  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent>
        {suggestions.map((item, index) => {
            const image = getImageUrl(item.placeName);
            return (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-full">
                <div className="p-1">
                  <Card className="overflow-hidden bg-secondary">
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
