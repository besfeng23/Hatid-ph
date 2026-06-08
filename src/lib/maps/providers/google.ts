
import type { MapsProvider } from '../provider';
import type {
  GeocodeRequest,
  ResolvedPlace,
  PlacesAutocompleteRequest,
  PlacesAutocompleteSuggestion,
  PlaceId,
  RouteEstimateRequest,
  RouteEstimate,
  Coordinates,
} from '../types';

// This is a placeholder for the Google Maps provider.
// It will be implemented in a later phase.
export const googleMapsProvider: MapsProvider = {
  async geocodeAddress(input: GeocodeRequest): Promise<ResolvedPlace[]> {
    throw new Error('Not implemented');
  },

  async reverseGeocode(coordinates: Coordinates): Promise<ResolvedPlace[]> {
    throw new Error('Not implemented');
  },

  async getPlaceAutocomplete(input: PlacesAutocompleteRequest): Promise<PlacesAutocompleteSuggestion[]> {
    throw new Error('Not implemented');
  },

  async resolvePlace(placeId: PlaceId): Promise<ResolvedPlace> {
    throw new Error('Not implemented');
  },

  async estimateRoute(input: RouteEstimateRequest): Promise<RouteEstimate> {
    throw new Error('Not implemented');
  },
};
