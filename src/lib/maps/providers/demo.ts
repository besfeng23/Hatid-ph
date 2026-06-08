
import type { MapsProvider } from '../provider';
import type {
  AddressText,
  Coordinates,
  GeocodeRequest,
  PlaceId,
  PlacesAutocompleteRequest,
  PlacesAutocompleteSuggestion,
  ResolvedPlace,
  RouteEstimate,
  RouteEstimateRequest,
} from '../types';

const demoPlaces: ResolvedPlace[] = [
  {
    provider: 'demo',
    providerPlaceId: 'demo-place-1',
    displayName: 'Mega Mall',
    formattedAddress: 'Mega Mall, Ortigas Center, Mandaluyong, Metro Manila',
    coordinates: { lat: 14.585, lng: 121.059 },
    city: 'Mandaluyong',
    country: 'Philippines',
  },
  {
    provider: 'demo',
    providerPlaceId: 'demo-place-2',
    displayName: 'Greenbelt',
    formattedAddress: 'Greenbelt, Ayala Center, Makati, Metro Manila',
    coordinates: { lat: 14.551, lng: 121.022 },
    city: 'Makati',
    country: 'Philippines',
  },
];

export const demoMapsProvider: MapsProvider = {
  async geocodeAddress(input: GeocodeRequest): Promise<ResolvedPlace[]> {
    return demoPlaces.filter((p) => p.formattedAddress.toLowerCase().includes(input.address.toLowerCase()));
  },

  async reverseGeocode(coordinates: Coordinates): Promise<ResolvedPlace[]> {
    return [demoPlaces[0]];
  },

  async getPlaceAutocomplete(input: PlacesAutocompleteRequest): Promise<PlacesAutocompleteSuggestion[]> {
    return demoPlaces.map((p) => ({
      placeId: p.providerPlaceId!,
      description: p.formattedAddress,
    }));
  },

  async resolvePlace(placeId: PlaceId): Promise<ResolvedPlace> {
    const place = demoPlaces.find((p) => p.providerPlaceId === placeId);
    if (!place) {
      throw new Error('Demo place not found');
    }
    return place;
  },

  async estimateRoute(input: RouteEstimateRequest): Promise<RouteEstimate> {
    const pickup =
      typeof input.pickup === 'string'
        ? await this.resolvePlace(input.pickup as PlaceId)
        : (await this.geocodeAddress(input.pickup as GeocodeRequest))[0];

    const dropoff =
      typeof input.dropoff === 'string'
        ? await this.resolvePlace(input.dropoff as PlaceId)
        : (await this.geocodeAddress(input.dropoff as GeocodeRequest))[0];

    return {
      provider: 'demo',
      pickup,
      dropoff,
      distanceMeters: 5000,
      distanceKm: 5,
      durationSeconds: 1200,
      durationMinutes: 20,
      calculatedAt: new Date().toISOString(),
    };
  },
};
