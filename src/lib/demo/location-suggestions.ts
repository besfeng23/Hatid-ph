export type DemoPlace = {
  id: string;
  name: string;
  address: string;
  tag?: 'home' | 'work' | 'favorite' | 'recent' | 'suggestion';
  note?: string;
};

export const demoPickup = 'Current pickup area · Manila';
export const demoDestination = 'Bonifacio High Street, Taguig';

export const demoLocationSuggestions: DemoPlace[] = [
  { id: 'ayala-ave', name: 'Ayala Avenue', address: 'Makati, Metro Manila', tag: 'suggestion' },
  { id: 'bgc-high-street', name: 'Bonifacio High Street', address: 'BGC, Taguig', tag: 'suggestion' },
  { id: 'sm-megamall', name: 'SM Megamall', address: 'EDSA, Mandaluyong', tag: 'suggestion' },
  { id: 'cebu-it', name: 'Cebu IT Park', address: 'Lahug, Cebu City', tag: 'suggestion' },
];

export const demoSavedPlaces: DemoPlace[] = [
  { id: 'home', name: 'Home', address: 'Saved home address', tag: 'home', note: 'Use your saved home when available' },
  { id: 'work', name: 'Work', address: 'Saved work address', tag: 'work', note: 'Use your saved workplace when available' },
  { id: 'favorite-market', name: 'Market! Market!', address: 'BGC, Taguig', tag: 'favorite' },
];

export const demoRecentSearches: DemoPlace[] = [
  { id: 'recent-greenbelt', name: 'Greenbelt 5', address: 'Ayala Center, Makati', tag: 'recent' },
  { id: 'recent-naia', name: 'NAIA Terminal 3', address: 'Pasay City', tag: 'recent' },
  { id: 'recent-ust', name: 'University of Santo Tomas', address: 'España, Manila', tag: 'recent' },
];
