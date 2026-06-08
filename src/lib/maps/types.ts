
export type Coordinates = {
  lat: number;
  lng: number;
};

export type AddressText = string;

export type PlaceId = string;

export type RouteProviderName = 'google' | 'demo';

export type ResolvedPlace = {
  provider: RouteProviderName;
  providerPlaceId?: string;
  displayName: string;
  formattedAddress: string;
  coordinates: Coordinates;
  city?: string;
  region?: string;
  country?: string;
  raw?: any;
};

export type RouteEstimate = {
  provider: RouteProviderName;
  pickup: ResolvedPlace;
  dropoff: ResolvedPlace;
  distanceMeters: number;
  distanceKm: number;
  durationSeconds: number;
  durationMinutes: number;
  trafficDurationSeconds?: number;
  polyline?: string;
  tollsEstimate?: string;
  calculatedAt: string;
  expiresAt?: string;
  providerMetadata?: any;
};

export type GeocodeRequest = {
  address: AddressText;
};

export type RouteEstimateRequest = {
  pickup: GeocodeRequest | PlaceId;
  dropoff: GeocodeRequest | PlaceId;
};

export type PlacesAutocompleteRequest = {
  input: string;
  sessionToken?: string;
  location?: Coordinates;
  radius?: number;
};

export type PlacesAutocompleteSuggestion = {
  placeId: PlaceId;
  description: string;
  //structured_formatting: any;
};

