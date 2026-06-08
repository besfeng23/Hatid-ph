
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
} from './types';

export interface MapsProvider {
  geocodeAddress(input: GeocodeRequest): Promise<ResolvedPlace[]>;
  reverseGeocode(coordinates: Coordinates): Promise<ResolvedPlace[]>;
  getPlaceAutocomplete(input: PlacesAutocompleteRequest): Promise<PlacesAutocompleteSuggestion[]>;
  resolvePlace(placeId: PlaceId): Promise<ResolvedPlace>;
  estimateRoute(input: RouteEstimateRequest): Promise<RouteEstimate>;
}
