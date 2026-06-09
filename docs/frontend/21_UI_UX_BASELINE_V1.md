# Hatid UI/UX Governance Baseline V1

Document ID: 21_UI_UX_BASELINE_V1  
Status: Frozen  
Priority: Architecture-level  
Scope: Rider app, driver app, mobile web, future mobile apps  
Authority: Canonical UI/UX specification

## Purpose

The supplied React prototype is not a mockup.

It is the canonical UI/UX specification for the Hatid platform.

All future implementation work must replicate the visual language, interaction patterns, navigation behavior, spacing system, component hierarchy, animation behavior, and overall user experience represented in the prototype.

Engineers are not authorized to redesign screens unless approved through ADR.

## Design Authority

The prototype is the single source of truth for:

- Rider app UI
- Mobile navigation
- onboarding flows
- booking flows
- active trip flows
- wallet interactions
- safety interactions
- rating and review patterns
- component behavior

If implementation preference conflicts with the prototype, the prototype wins.

## Visual Identity

Mandatory:

- Primary blue: `#0033CC`
- Dark blue: `#002288`
- Navy text: `#001144`
- Red accent: `#EF4444`
- Success green palette for completed/payment success
- Light neutral background: `#F2F5F9`, `#EEF2F5`, white surfaces
- Soft shadows
- Large rounded cards
- Bold typography
- Premium mobile-first presentation

The app must feel:

- Filipino
- transport-first
- premium
- safe
- trustworthy
- modern super-app quality

Forbidden:

- Bootstrap default look
- generic SaaS dashboard look
- plain Material defaults
- crypto/gaming style
- sharp harsh enterprise UI for rider/driver flows

## Canonical Components

The following prototype components become design primitives:

- `HatidLogo`
- `SimpleLogo`
- `BottomNav`
- `MapBackground`
- phone input
- OTP input
- profile setup card
- permission card
- ride selection card
- active trip bottom sheet
- driver assigned card
- completion/rating sheet

## Mobile-First Target

Design target:

- width: 390–400px
- height: 844–850px
- touch-first layout

Desktop is secondary.

Admin portal may diverge structurally but must still use Hatid design tokens.

## Screen Patterns

Mandatory Rider flow:

1. Splash
2. Phone input
3. OTP verify
4. Profile setup
5. Permissions
6. Home dashboard
7. Drop-off search
8. Drop-off selected
9. Ride selection
10. Searching
11. Driver assigned
12. Active trip
13. Trip completed
14. Rating and feedback

Future screens must inherit these patterns.

## Interaction Model

Required:

- slide-up transitions
- fade-in transitions
- active scale feedback
- soft shadow lift
- animated route/pin states
- bottom sheet interactions
- glassmorphism headers
- rounded card containers

Animation standard:

- 150ms–400ms
- preferred easing: `cubic-bezier(0.16, 1, 0.3, 1)`

Forbidden:

- page reload transitions
- browser-native unstyled forms
- abrupt state changes
- inconsistent animations

## Design Tokens

### Colors

```ts
primary: '#0033CC'
primaryDark: '#002288'
navy: '#001144'
danger: '#EF4444'
success: '#22C55E'
surface: '#FFFFFF'
surfaceMuted: '#F2F5F9'
mapSurface: '#EEF2F5'
```

### Radius

- small: 12px
- medium: 16px
- large: 24px
- xl: 32px
- bottom-sheet: 40px

### Touch Targets

Minimum touch target: 44x44px.

### Shadows

Use only soft elevation.

Harsh dark shadows are forbidden.

## Map Experience

The map is the primary canvas.

Booking and trip flows must prioritize:

- current location
- pickup
- drop-off
- route
- driver movement
- ETA
- navigation action

Map must not become a small secondary widget in rider/driver flows.

## Accessibility

Required:

- WCAG AA contrast
- screen reader labels
- dynamic font scaling where possible
- minimum 44px touch targets
- reduced motion support
- keyboard accessibility for web

## Implementation Enforcement

Every frontend PR must pass:

- [ ] matches UI baseline
- [ ] uses approved design tokens
- [ ] uses approved component patterns
- [ ] no unauthorized redesign
- [ ] mobile-first verified
- [ ] accessibility verified
- [ ] no hardcoded new design language
- [ ] no unauthorized icon style changes

## Future Screen Rule

Future screens must inherit Hatid visual language:

- wallet
- top-up
- promos
- referrals
- safety center
- emergency SOS
- driver onboarding
- driver earnings
- driver offers
- admin portal
- compliance portal

## Prototype Preservation

The original prototype must be stored in:

`docs/frontend/reference/HATID_CANONICAL_PROTOTYPE.tsx`

Screenshots should be stored in:

`docs/frontend/reference/screenshots/`

Frontend PRs should visually compare against these references where feasible.
