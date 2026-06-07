"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDemoPlaceLabel = formatDemoPlaceLabel;
exports.buildRideOptionsHref = buildRideOptionsHref;
exports.resolvePrototypeRideSelection = resolvePrototypeRideSelection;
const location_suggestions_1 = require("@/lib/demo/location-suggestions");
function normalizeText(value) {
    return (value ?? '').trim().replace(/\s+/g, ' ');
}
function formatDemoPlaceLabel(place) {
    return `${place.name}, ${place.address}`;
}
function buildRideOptionsHref({ pickup = location_suggestions_1.demoPickup, destination, }) {
    const params = new URLSearchParams({
        pickup: normalizeText(pickup) || location_suggestions_1.demoPickup,
        destination: normalizeText(destination) || location_suggestions_1.demoDestination,
    });
    return `/rider/ride-options?${params.toString()}`;
}
function resolvePrototypeRideSelection({ pickup, destination, }) {
    const normalizedPickup = normalizeText(pickup);
    const normalizedDestination = normalizeText(destination);
    return {
        pickup: normalizedPickup || location_suggestions_1.demoPickup,
        destination: normalizedDestination || location_suggestions_1.demoDestination,
        usedFallback: !normalizedPickup || !normalizedDestination,
    };
}
