export const riderRedesignScreens = [
  { id: 'permissions', route: '/onboarding/permissions', label: 'Permissions onboarding' },
  { id: 'profile', route: '/onboarding/profile', label: 'Rider profile setup' },
  { id: 'home', route: '/', label: 'Rider home map' },
  { id: 'search', route: '/rider/search', label: 'Drop-off search' },
  { id: 'saved-places', route: '/rider/saved-places', label: 'Saved places' },
  { id: 'ride-options', route: '/rider/ride-options', label: 'Ride options fare estimate' },
] as const;

export const riderPrototypeHonesty = {
  mapDisclaimer: 'Map is a visual prototype shell, not live routing or dispatch.',
  fareDisclaimer: 'Fares shown are estimates for prototype review only.',
  paymentDisclaimer: 'Cash is a ride payment preference preview; no live charging or wallet balance is shown.',
} as const;
