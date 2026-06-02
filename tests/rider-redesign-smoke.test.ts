import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { demoLocationSuggestions, demoPickup, demoRecentSearches, demoSavedPlaces } from '../src/lib/demo/location-suggestions';
import { riderPrototypeHonesty, riderRedesignScreens } from '../src/lib/rider/rider-ui-state';
import { buildRideOptionsHref, resolvePrototypeRideSelection } from '../src/lib/rider/prototype-ride-flow';
import { TripSummaryCard } from '../src/components/rider/booking/trip-summary-card';

test('rider redesign registers the required smoke-screen routes', () => {
  assert.deepEqual(riderRedesignScreens.map((screen) => screen.route), [
    '/onboarding/permissions',
    '/onboarding/profile',
    '/',
    '/rider/search',
    '/rider/saved-places',
    '/rider/ride-options',
  ]);
});

test('rider demo data supports destination search, saved places, and ride-option smoke coverage', () => {
  assert.ok(demoLocationSuggestions.length >= 4);
  assert.ok(demoSavedPlaces.some((place) => place.tag === 'home'));
  assert.ok(demoSavedPlaces.some((place) => place.tag === 'work'));
  assert.ok(demoRecentSearches.length >= 2);
});

test('prototype honesty copy prevents fake map, fare, and payment claims', () => {
  assert.match(riderPrototypeHonesty.mapDisclaimer, /not live routing or dispatch/i);
  assert.match(riderPrototypeHonesty.fareDisclaimer, /estimates/i);
  assert.match(riderPrototypeHonesty.paymentDisclaimer, /no live charging or wallet balance/i);
});

test('search selection is carried into the ride-options summary state', () => {
  const chosenPlace = demoRecentSearches[1];
  const href = buildRideOptionsHref({
    pickup: demoPickup,
    destination: `${chosenPlace.name}, ${chosenPlace.address}`,
  });
  const parsed = new URL(href, 'https://hatid.test');
  const selection = resolvePrototypeRideSelection({
    pickup: parsed.searchParams.get('pickup'),
    destination: parsed.searchParams.get('destination'),
  });

  assert.equal(selection.pickup, demoPickup);
  assert.equal(selection.destination, `${chosenPlace.name}, ${chosenPlace.address}`);
  assert.equal(selection.usedFallback, false);

  const markup = renderToStaticMarkup(React.createElement(TripSummaryCard, selection));
  assert.ok(markup.includes(chosenPlace.name));
  assert.ok(markup.includes(demoPickup));
});

test('ride-options selection resolver falls back to honest prototype defaults when route state is missing', () => {
  const selection = resolvePrototypeRideSelection({ pickup: '', destination: null });

  assert.equal(selection.pickup, demoPickup);
  assert.equal(selection.usedFallback, true);
  assert.match(selection.destination, /bonifacio high street/i);
});
