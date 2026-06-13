'use client';

import { useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { HatidIconTile, HatidTrustPill, HatidWordmark } from '../components/hatid-brand';
import { getHatidIcon, type HatidIconName } from '../components/hatid-icons';

type Screen =
  | 'splash'
  | 'login'
  | 'otp'
  | 'profile'
  | 'permissions'
  | 'home'
  | 'book-search'
  | 'book-choose'
  | 'book-active'
  | 'book-completed'
  | 'receipt'
  | 'trips'
  | 'wallet'
  | 'safety'
  | 'account';

type RideType = 'car' | 'moto';

const BLUE = '#0033CC';
const INK = '#0F172A';

const navRoutes: Screen[] = ['home', 'trips', 'wallet', 'safety', 'account'];

const navItems: { screen: Screen; label: string; icon: HatidIconName }[] = [
  { screen: 'home', label: 'Home', icon: 'home' },
  { screen: 'trips', label: 'Trips', icon: 'clock' },
  { screen: 'wallet', label: 'Wallet', icon: 'wallet' },
  { screen: 'safety', label: 'Safety', icon: 'shield' },
  { screen: 'account', label: 'Account', icon: 'user' },
];

const savedPlaces = [
  { label: 'Home', detail: 'Sampaloc, Manila', icon: 'home' as HatidIconName },
  { label: 'Work', detail: 'BGC, Taguig', icon: 'briefcase' as HatidIconName },
  { label: 'NAIA Terminal 3', detail: 'Pasay City', icon: 'mapPin' as HatidIconName },
];

const destinationSuggestions = [
  'Ayala Triangle, Makati',
  'SM North EDSA, Quezon City',
  'Ortigas Center, Pasig',
  'NAIA Terminal 3, Pasay',
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function AppIcon({ name, size = 20, className = '', strokeWidth = 2.2 }: { name: HatidIconName; size?: number; className?: string; strokeWidth?: number }) {
  const Icon = getHatidIcon(name);
  return <Icon aria-hidden="true" className={className} size={size} strokeWidth={strokeWidth} />;
}

function PhoneFrame({ children, showNav, current, go }: { children: ReactNode; showNav: boolean; current: Screen; go: (screen: Screen) => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F172A] font-sans text-[#0F172A] sm:p-6">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#F8FAFC] shadow-[0_12px_30px_-4px_rgba(15,23,42,0.08)] sm:h-[844px] sm:max-w-[390px] sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-900">
        <div className="absolute left-1/2 top-0 z-[100] hidden h-[25px] w-[120px] -translate-x-1/2 items-center justify-center rounded-b-[18px] bg-slate-900 sm:flex">
          <div className="h-1 w-12 rounded-full bg-black/40" />
        </div>
        <div className="relative flex-1 overflow-hidden">{children}</div>
        {showNav && <BottomNav current={current} go={go} />}
      </div>
    </main>
  );
}

function BottomNav({ current, go }: { current: Screen; go: (screen: Screen) => void }) {
  return (
    <nav className="absolute bottom-0 z-50 flex w-full justify-around border-t border-slate-200 bg-white/95 pb-6 pt-3 backdrop-blur sm:pb-8">
      {navItems.map(({ screen, label, icon }) => {
        const active = current === screen;
        return (
          <button
            key={screen}
            onClick={() => go(screen)}
            className={cn('flex w-16 flex-col items-center justify-center gap-1 transition-colors', active ? 'text-[#0033CC]' : 'text-slate-400 hover:text-slate-600')}
          >
            <AppIcon name={icon} size={21} strokeWidth={active ? 2.5 : 2} />
            <span className="mt-0.5 text-[10px] font-semibold">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Header({ title, back, go, action }: { title: string; back?: Screen; go: (screen: Screen) => void; action?: ReactNode }) {
  return (
    <header className="flex items-center gap-4 border-b border-slate-100 bg-white px-5 pb-4 pt-10 sm:pt-12">
      {back && (
        <button aria-label="Back" onClick={() => go(back)} className="rounded-full p-1 text-slate-500 active:scale-95">
          <AppIcon name="back" size={24} />
        </button>
      )}
      <h1 className="flex-1 text-2xl font-black tracking-tight text-[#0F172A]">{title}</h1>
      {action}
    </header>
  );
}

function MapBackground({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div
      className={cn('relative overflow-hidden bg-slate-100', className)}
      style={{
        backgroundColor: '#F1F5F9',
        backgroundImage:
          'linear-gradient(45deg, transparent 48%, #E2E8F0 48%, #E2E8F0 52%, transparent 52%), linear-gradient(-45deg, transparent 48%, #E2E8F0 48%, #E2E8F0 52%, transparent 52%), linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
        backgroundSize: '150px 150px, 150px 150px, 30px 30px, 30px 30px',
        backgroundPosition: 'center center',
      }}
    >
      <div className="absolute left-[18%] top-[48%] h-3 w-[72%] -rotate-12 rounded-full bg-white/80 shadow-sm" />
      <div className="absolute left-[-20%] top-[30%] h-5 w-[130%] rotate-12 rounded-full bg-white/80 shadow-sm" />
      <div className="absolute right-8 top-20 h-20 w-24 rounded-2xl bg-emerald-100/50" />
      <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#0033CC] shadow-lg" />
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled = false }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button disabled={disabled} onClick={onClick} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0033CC] py-4 font-bold text-white transition-transform active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400">
      {children}
    </button>
  );
}

function Splash({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-[#0033CC] px-6 pb-10 pt-20">
      <div className="flex flex-1 items-center justify-center">
        <HatidWordmark light large tagline="Biyahe natin. Bansa natin." />
      </div>
      <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_30px_-4px_rgba(15,23,42,0.08)]">
        <HatidTrustPill>Passenger prototype</HatidTrustPill>
        <h1 className="mb-2 mt-5 text-3xl font-black tracking-tight text-[#0F172A]">Move around the Philippines with confidence.</h1>
        <p className="mb-6 text-sm leading-6 text-slate-500">A polished Hatid preview for rides, wallet readiness, safety, and support. Real dispatch and payments remain server-owned.</p>
        <PrimaryButton onClick={() => go('login')}>
          Get Started <AppIcon name="forward" size={18} />
        </PrimaryButton>
      </div>
    </section>
  );
}

function Login({ go, phone, setPhone }: { go: (screen: Screen) => void; phone: string; setPhone: (value: string) => void }) {
  const valid = phone.replace(/\D/g, '').length >= 10;
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-16">
      <button onClick={() => go('splash')} className="mb-8 w-max rounded-full text-slate-400 active:scale-95" aria-label="Back">
        <AppIcon name="back" size={24} />
      </button>
      <HatidWordmark compact tagline="Secure sign in" />
      <h1 className="mb-2 mt-10 text-2xl font-black tracking-tight text-[#0F172A]">Enter your mobile number</h1>
      <p className="mb-8 text-sm leading-6 text-slate-500">We&apos;ll send a one-time code. Philippine mobile numbers only for this preview.</p>
      <div className="mb-4 flex overflow-hidden rounded-2xl border border-slate-300 transition-all focus-within:border-[#0033CC] focus-within:ring-2 focus-within:ring-blue-100">
        <div className="flex items-center border-r border-slate-300 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-600">+63</div>
        <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" placeholder="9XX XXX XXXX" maxLength={10} className="w-full bg-transparent px-4 py-4 font-bold text-[#0F172A] outline-none" />
      </div>
      <p className="text-xs text-slate-400">No real OTP is sent from this prototype screen.</p>
      <div className="mt-auto pb-8">
        <PrimaryButton disabled={!valid} onClick={() => go('otp')}>Continue</PrimaryButton>
      </div>
    </section>
  );
}

function Otp({ go, otp, setOtp }: { go: (screen: Screen) => void; otp: string; setOtp: (value: string) => void }) {
  const valid = otp.replace(/\D/g, '').length >= 6;
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-16">
      <button onClick={() => go('login')} className="mb-8 w-max rounded-full text-slate-400 active:scale-95" aria-label="Back">
        <AppIcon name="back" size={24} />
      </button>
      <h1 className="mb-2 text-2xl font-black tracking-tight text-[#0F172A]">Verify number</h1>
      <p className="mb-10 text-sm leading-6 text-slate-500">Enter the 6-digit code shown by your test flow or demo operator.</p>
      <input value={otp} onChange={(event) => setOtp(event.target.value)} type="tel" maxLength={6} className="mb-5 h-16 w-full rounded-2xl border border-slate-300 text-center text-3xl font-black tracking-[0.75em] text-[#0F172A] shadow-sm outline-none transition-all focus:border-[#0033CC] focus:ring-2 focus:ring-blue-100" placeholder="------" />
      <HatidTrustPill tone="slate">Prototype verification state</HatidTrustPill>
      <div className="mt-auto pb-8">
        <PrimaryButton disabled={!valid} onClick={() => go('profile')}>Verify & Continue</PrimaryButton>
      </div>
    </section>
  );
}

function Profile({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-16">
      <h1 className="mb-2 text-2xl font-black tracking-tight text-[#0F172A]">Set up profile</h1>
      <p className="mb-8 text-sm leading-6 text-slate-500">Add the details riders expect to see in a trustworthy national mobility app.</p>
      <div className="mb-4 grid h-20 w-20 place-items-center rounded-[1.75rem] bg-blue-50 text-[#0033CC]">
        <AppIcon name="user" size={30} />
      </div>
      <label className="mb-2 ml-1 block text-xs font-bold text-slate-700">Full name</label>
      <div className="flex items-center rounded-2xl border border-slate-300 px-4 py-1 transition-all focus-within:border-[#0033CC] focus-within:ring-2 focus-within:ring-blue-100">
        <AppIcon name="user" size={18} className="text-slate-400" />
        <input type="text" placeholder="e.g. Maria Santos" className="w-full py-3 pl-3 text-sm font-bold text-[#0F172A] outline-none" />
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-400">Saving will connect to the server profile helpers in a later PR.</p>
      <div className="mt-auto pb-8">
        <PrimaryButton onClick={() => go('permissions')}>Save Profile</PrimaryButton>
      </div>
    </section>
  );
}

function Permissions({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-16">
      <HatidWordmark tagline="Ride safety setup" />
      <h1 className="mb-2 mt-10 text-2xl font-black tracking-tight text-[#0F172A]">Let&apos;s keep every ride safe.</h1>
      <p className="mb-8 text-sm leading-6 text-slate-500">Location and notifications help the server verify trip events, routing, and safety alerts.</p>
      <div className="space-y-4">
        <Permission icon="mapPin" title="Location" detail="Pickup routing and trip status context" />
        <Permission icon="notification" title="Notifications" detail="Ride updates and safety reminders" />
        <Permission icon="shield" title="Safety" detail="Emergency contacts and incident reporting readiness" />
      </div>
      <div className="mt-auto pb-8">
        <PrimaryButton onClick={() => go('home')}>Allow Required Permissions</PrimaryButton>
      </div>
    </section>
  );
}

function Permission({ icon, title, detail }: { icon: HatidIconName; title: string; detail: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <HatidIconTile active>
        <AppIcon name={icon} size={22} />
      </HatidIconTile>
      <div>
        <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

function HomeScreen({ go }: { go: (screen: Screen) => void }) {
  const services = [
    { label: 'Ride', icon: 'car' as HatidIconName },
    { label: 'Moto', icon: 'bike' as HatidIconName },
    { label: 'XL', icon: 'truck' as HatidIconName },
    { label: 'Padala', icon: 'package' as HatidIconName },
  ];

  return (
    <section className="relative flex h-full flex-col bg-white">
      <div className="z-10 flex items-center justify-between bg-white px-5 pb-4 pt-10 sm:pt-12">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-xs font-black text-[#0033CC]">MS</div>
          <div>
            <p className="text-sm font-black text-[#0F172A]">Hi, Maria</p>
            <p className="text-[11px] font-semibold text-slate-400">Manila, PH</p>
          </div>
        </div>
        <button aria-label="Notifications" className="rounded-full p-2 text-slate-500">
          <AppIcon name="notification" size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-32 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-4 rounded-[2rem] bg-[#0033CC] p-5 text-white shadow-[0_12px_30px_-4px_rgba(0,51,204,0.18)]">
          <HatidWordmark light compact tagline="Passenger preview" />
          <p className="mt-5 text-sm leading-6 text-blue-100">Fast, safe, and familiar mobility flows for Filipino riders.</p>
        </div>
        <button onClick={() => go('book-search')} className="mb-5 flex w-full items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 text-left shadow-sm active:scale-[0.99]">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-500">
            <AppIcon name="search" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-[#0F172A]">Where are you going?</p>
            <p className="text-xs text-slate-400">Search BGC, Makati, NAIA, QC...</p>
          </div>
          <AppIcon name="next" size={18} className="text-slate-300" />
        </button>
        <div className="mb-5 grid grid-cols-4 gap-3">
          {services.map((service) => (
            <button key={service.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
              <span className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-2xl bg-white text-[#0033CC] shadow-sm">
                <AppIcon name={service.icon} size={21} />
              </span>
              <span className="text-[11px] font-bold text-slate-700">{service.label}</span>
            </button>
          ))}
        </div>
        <section className="mb-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-black text-[#0F172A]">Saved places</h2>
            <button className="text-xs font-bold text-[#0033CC]">Manage</button>
          </div>
          <div className="space-y-3">
            {savedPlaces.map((place) => (
              <button key={place.label} onClick={() => go('book-choose')} className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm">
                <HatidIconTile>
                  <AppIcon name={place.icon} size={19} />
                </HatidIconTile>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#0F172A]">{place.label}</p>
                  <p className="text-xs text-slate-400">{place.detail}</p>
                </div>
                <AppIcon name="next" size={18} className="text-slate-300" />
              </button>
            ))}
          </div>
        </section>
        <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-4">
          <HatidTrustPill>Architecture-safe preview</HatidTrustPill>
          <p className="mt-3 text-xs leading-5 text-slate-600">Trip status, driver availability, wallet balances, and payments must be server-owned before real launch.</p>
        </div>
      </div>
    </section>
  );
}

function SearchScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white">
      <Header title="Destination" back="home" go={go} />
      <div className="p-5">
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <AppIcon name="search" size={20} className="text-slate-400" />
          <input autoFocus placeholder="Search places in the Philippines" className="w-full bg-transparent text-sm font-bold outline-none" />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Suggested</p>
        <div className="space-y-3">
          {destinationSuggestions.map((destination) => (
            <button key={destination} onClick={() => go('book-choose')} className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm">
              <HatidIconTile active>
                <AppIcon name="mapPin" size={19} />
              </HatidIconTile>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">{destination}</p>
                <p className="text-xs text-slate-400">Traffic-aware preview route</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChooseRide({ go, rideType, setRideType }: { go: (screen: Screen) => void; rideType: RideType; setRideType: (ride: RideType) => void }) {
  const rides = [
    { id: 'car' as RideType, title: 'Hatid Car', eta: '4 min', fare: 'Fare estimate preview', icon: 'car' as HatidIconName },
    { id: 'moto' as RideType, title: 'Hatid Moto', eta: '2 min', fare: 'Lower-cost preview', icon: 'bike' as HatidIconName },
  ];
  return (
    <section className="flex h-full flex-col bg-white">
      <Header title="Choose ride" back="book-search" go={go} />
      <MapBackground className="h-[44%]" />
      <div className="-mt-8 flex flex-1 flex-col rounded-t-[2rem] bg-white p-5 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Destination</p>
            <h2 className="text-lg font-black text-[#0F172A]">BGC, Taguig</h2>
          </div>
          <HatidTrustPill tone="slate">Demo estimate</HatidTrustPill>
        </div>
        <div className="space-y-3">
          {rides.map((ride) => {
            const selected = rideType === ride.id;
            return (
              <button key={ride.id} onClick={() => setRideType(ride.id)} className={cn('flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors', selected ? 'border-[#0033CC] bg-blue-50' : 'border-slate-100 bg-white')}>
                <HatidIconTile active={selected}>
                  <AppIcon name={ride.icon} size={22} />
                </HatidIconTile>
                <div className="flex-1">
                  <p className="text-sm font-black text-[#0F172A]">{ride.title}</p>
                  <p className="text-xs text-slate-500">{ride.eta} away · {ride.fare}</p>
                </div>
                {selected && <AppIcon name="check" size={20} className="text-[#0033CC]" />}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-400">Final fares, matching, and driver availability must come from backend services.</p>
        <div className="mt-auto">
          <PrimaryButton onClick={() => go('book-active')}>Request ride preview</PrimaryButton>
        </div>
      </div>
    </section>
  );
}

function ActiveRide({ go, rideType }: { go: (screen: Screen) => void; rideType: RideType }) {
  return (
    <section className="relative flex h-full flex-col bg-white">
      <MapBackground className="flex-1">
        <div className="absolute left-5 right-5 top-12 rounded-[1.5rem] bg-white/95 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <HatidIconTile active>
              <AppIcon name={rideType === 'car' ? 'car' : 'bike'} size={22} />
            </HatidIconTile>
            <div className="flex-1">
              <p className="text-sm font-black text-[#0F172A]">Driver assigned preview</p>
              <p className="text-xs text-slate-500">Arriving in 4 min · Makati traffic considered</p>
            </div>
          </div>
        </div>
      </MapBackground>
      <div className="rounded-t-[2rem] bg-white p-5 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-sm font-black text-slate-600">RJ</div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-[#0F172A]">Ramon J.</h2>
            <p className="text-xs text-slate-500">Toyota Vios · ABC 1234</p>
          </div>
          <HatidTrustPill tone="green">Checked</HatidTrustPill>
        </div>
        <div className="mb-5 grid grid-cols-3 gap-3">
          <button className="rounded-2xl border border-slate-100 bg-slate-50 py-3 text-xs font-bold text-slate-600">Share</button>
          <button className="rounded-2xl border border-slate-100 bg-slate-50 py-3 text-xs font-bold text-slate-600">Call</button>
          <button className="rounded-2xl border border-red-100 bg-red-50 py-3 text-xs font-bold text-red-700">Safety</button>
        </div>
        <p className="mb-4 text-xs leading-5 text-slate-400">Safety controls are prototype UI until incident workflows, audit trails, and emergency handling are server-backed.</p>
        <PrimaryButton onClick={() => go('book-completed')}>Complete demo trip</PrimaryButton>
      </div>
    </section>
  );
}

function CompletedRide({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white px-6 pb-8 pt-16 text-center">
      <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-[2rem] bg-emerald-50 text-emerald-700">
        <AppIcon name="check" size={34} />
      </div>
      <h1 className="text-2xl font-black text-[#0F172A]">Trip completed</h1>
      <p className="mx-auto mt-2 max-w-[280px] text-sm leading-6 text-slate-500">This is a demo trip completion state. Real receipts and settlement must come from the backend ledger.</p>
      <div className="my-8 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 text-left">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Route</p>
        <p className="mt-2 text-sm font-bold text-[#0F172A]">Sampaloc, Manila → BGC, Taguig</p>
      </div>
      <div className="mt-auto space-y-3">
        <PrimaryButton onClick={() => go('receipt')}>View receipt preview</PrimaryButton>
        <button onClick={() => go('home')} className="w-full rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-600">Back home</button>
      </div>
    </section>
  );
}

function Receipt({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white">
      <Header title="Receipt" back="book-completed" go={go} />
      <div className="p-5">
        <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-5">
          <HatidTrustPill tone="slate">Ledger-derived preview</HatidTrustPill>
          <div className="mt-5 space-y-4 text-sm">
            <Row label="Base fare" value="Server-owned" />
            <Row label="Distance/time" value="Reconciled" />
            <Row label="Payment status" value="Not final in client" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Trips({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="h-full bg-white pb-28">
      <Header title="Trips" go={go} />
      <div className="space-y-3 p-5">
        {['Today · BGC, Taguig', 'Yesterday · NAIA Terminal 3', 'Last week · Ortigas Center'].map((trip) => (
          <button key={trip} onClick={() => go('receipt')} className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm">
            <HatidIconTile>
              <AppIcon name="car" size={20} />
            </HatidIconTile>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#0F172A]">{trip}</p>
              <p className="text-xs text-slate-400">Receipt preview available</p>
            </div>
            <AppIcon name="next" size={18} className="text-slate-300" />
          </button>
        ))}
      </div>
    </section>
  );
}

function WalletScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="h-full bg-white pb-28">
      <Header title="Wallet" go={go} />
      <div className="p-5">
        <div className="rounded-[2rem] bg-[#0F172A] p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Balance preview</p>
          <h2 className="mt-2 text-4xl font-black">₱••••</h2>
          <p className="mt-3 text-xs leading-5 text-slate-300">Client display only. Real balances must be ledger-derived, auditable, idempotent, and reconciled.</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <WalletCard icon="creditCard" title="GCash / Maya" detail="Method placeholder" />
          <WalletCard icon="wallet" title="Cash" detail="Common PH option" />
        </div>
      </div>
    </section>
  );
}

function WalletCard({ icon, title, detail }: { icon: HatidIconName; title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <HatidIconTile active>
        <AppIcon name={icon} size={20} />
      </HatidIconTile>
      <p className="mt-4 text-sm font-black text-[#0F172A]">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function Safety({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="h-full bg-white pb-28">
      <Header title="Safety" go={go} />
      <div className="p-5">
        <div className="rounded-[2rem] border border-red-100 bg-red-50 p-5">
          <HatidTrustPill tone="red">Prototype safety center</HatidTrustPill>
          <h2 className="mt-4 text-xl font-black text-[#0F172A]">Safety tools must be backed by real workflows.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Emergency, incident, and support actions are UI previews until backend escalation and audit trails are implemented.</p>
        </div>
        <div className="mt-5 space-y-3">
          <SafetyRow icon="phone" title="Emergency call shortcut" detail="Requires device and local handling" />
          <SafetyRow icon="shield" title="Share trip" detail="Server trip state required before launch" />
          <SafetyRow icon="fileText" title="Report an incident" detail="Incident workflow pending" />
        </div>
      </div>
    </section>
  );
}

function SafetyRow({ icon, title, detail }: { icon: HatidIconName; title: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <HatidIconTile>
        <AppIcon name={icon} size={20} />
      </HatidIconTile>
      <div>
        <p className="text-sm font-black text-[#0F172A]">{title}</p>
        <p className="text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

function Account({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="h-full bg-white pb-28">
      <Header title="Account" go={go} />
      <div className="p-5">
        <div className="mb-5 flex items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-sm font-black text-[#0033CC]">MS</div>
          <div>
            <p className="text-lg font-black text-[#0F172A]">Maria Santos</p>
            <p className="text-xs text-slate-500">+63 9XX XXX XXXX</p>
          </div>
        </div>
        <div className="space-y-3">
          <AccountRow icon="user" label="Profile" />
          <AccountRow icon="settings" label="App settings" />
          <AccountRow icon="help" label="Support" />
          <AccountRow icon="fileText" label="Legal and compliance" />
        </div>
      </div>
    </section>
  );
}

function AccountRow({ icon, label }: { icon: HatidIconName; label: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm">
      <AppIcon name={icon} size={20} className="text-slate-500" />
      <span className="flex-1 text-sm font-bold text-[#0F172A]">{label}</span>
      <AppIcon name="next" size={18} className="text-slate-300" />
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-[#0F172A]">{value}</span>
    </div>
  );
}

function ScreenRouter({ screen, go, phone, setPhone, otp, setOtp, rideType, setRideType }: { screen: Screen; go: (screen: Screen) => void; phone: string; setPhone: (value: string) => void; otp: string; setOtp: (value: string) => void; rideType: RideType; setRideType: (ride: RideType) => void }) {
  switch (screen) {
    case 'splash':
      return <Splash go={go} />;
    case 'login':
      return <Login go={go} phone={phone} setPhone={setPhone} />;
    case 'otp':
      return <Otp go={go} otp={otp} setOtp={setOtp} />;
    case 'profile':
      return <Profile go={go} />;
    case 'permissions':
      return <Permissions go={go} />;
    case 'home':
      return <HomeScreen go={go} />;
    case 'book-search':
      return <SearchScreen go={go} />;
    case 'book-choose':
      return <ChooseRide go={go} rideType={rideType} setRideType={setRideType} />;
    case 'book-active':
      return <ActiveRide go={go} rideType={rideType} />;
    case 'book-completed':
      return <CompletedRide go={go} />;
    case 'receipt':
      return <Receipt go={go} />;
    case 'trips':
      return <Trips go={go} />;
    case 'wallet':
      return <WalletScreen go={go} />;
    case 'safety':
      return <Safety go={go} />;
    case 'account':
      return <Account go={go} />;
    default:
      return <HomeScreen go={go} />;
  }
}

export default function HatidPassengerPreview() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [rideType, setRideType] = useState<RideType>('car');
  const showNav = navRoutes.includes(screen);

  return (
    <PhoneFrame showNav={showNav} current={screen} go={setScreen}>
      <ScreenRouter screen={screen} go={setScreen} phone={phone} setPhone={setPhone} otp={otp} setOtp={setOtp} rideType={rideType} setRideType={setRideType} />
    </PhoneFrame>
  );
}
