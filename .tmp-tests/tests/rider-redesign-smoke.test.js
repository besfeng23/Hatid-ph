"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const react_1 = __importDefault(require("react"));
const server_1 = require("react-dom/server");
const location_suggestions_1 = require("../src/lib/demo/location-suggestions");
const rider_ui_state_1 = require("../src/lib/rider/rider-ui-state");
const prototype_ride_flow_1 = require("../src/lib/rider/prototype-ride-flow");
const trip_summary_card_1 = require("../src/components/rider/booking/trip-summary-card");
(0, node_test_1.default)('rider redesign registers the required smoke-screen routes', () => {
    strict_1.default.deepEqual(rider_ui_state_1.riderRedesignScreens.map((screen) => screen.route), [
        '/onboarding/permissions',
        '/onboarding/profile',
        '/',
        '/rider/search',
        '/rider/saved-places',
        '/rider/ride-options',
    ]);
});
(0, node_test_1.default)('rider demo data supports destination search, saved places, and ride-option smoke coverage', () => {
    strict_1.default.ok(location_suggestions_1.demoLocationSuggestions.length >= 4);
    strict_1.default.ok(location_suggestions_1.demoSavedPlaces.some((place) => place.tag === 'home'));
    strict_1.default.ok(location_suggestions_1.demoSavedPlaces.some((place) => place.tag === 'work'));
    strict_1.default.ok(location_suggestions_1.demoRecentSearches.length >= 2);
});
(0, node_test_1.default)('prototype honesty copy prevents fake map, fare, and payment claims', () => {
    strict_1.default.match(rider_ui_state_1.riderPrototypeHonesty.mapDisclaimer, /not live routing or dispatch/i);
    strict_1.default.match(rider_ui_state_1.riderPrototypeHonesty.fareDisclaimer, /estimates/i);
    strict_1.default.match(rider_ui_state_1.riderPrototypeHonesty.paymentDisclaimer, /no live charging or wallet balance/i);
});
(0, node_test_1.default)('search selection is carried into the ride-options summary state', () => {
    const chosenPlace = location_suggestions_1.demoRecentSearches[1];
    const href = (0, prototype_ride_flow_1.buildRideOptionsHref)({
        pickup: location_suggestions_1.demoPickup,
        destination: `${chosenPlace.name}, ${chosenPlace.address}`,
    });
    const parsed = new URL(href, 'https://hatid.test');
    const selection = (0, prototype_ride_flow_1.resolvePrototypeRideSelection)({
        pickup: parsed.searchParams.get('pickup'),
        destination: parsed.searchParams.get('destination'),
    });
    strict_1.default.equal(selection.pickup, location_suggestions_1.demoPickup);
    strict_1.default.equal(selection.destination, `${chosenPlace.name}, ${chosenPlace.address}`);
    strict_1.default.equal(selection.usedFallback, false);
    const markup = (0, server_1.renderToStaticMarkup)(react_1.default.createElement(trip_summary_card_1.TripSummaryCard, selection));
    strict_1.default.ok(markup.includes(chosenPlace.name));
    strict_1.default.ok(markup.includes(location_suggestions_1.demoPickup));
});
(0, node_test_1.default)('ride-options selection resolver falls back to honest prototype defaults when route state is missing', () => {
    const selection = (0, prototype_ride_flow_1.resolvePrototypeRideSelection)({ pickup: '', destination: null });
    strict_1.default.equal(selection.pickup, location_suggestions_1.demoPickup);
    strict_1.default.equal(selection.usedFallback, true);
    strict_1.default.match(selection.destination, /bonifacio high street/i);
});
