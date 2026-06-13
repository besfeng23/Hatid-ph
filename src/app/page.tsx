'use client';

import { useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bike,
  Briefcase,
  Car,
  Check,
  Clock,
  CreditCard,
  HelpCircle,
  Home,
  MapPin,
  Phone,
  Search,
  Settings,
  Shield,
  Star,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import { HatidIconTile, HatidTrustPill, HatidWordmark } from '../components/hatid-brand';

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
  | 'trips'
  | 'wallet'
  | 'safety'
  | 'account';

type RideType = 'car' | 'moto';

const navItems: { screen: Screen; label: string; icon: LucideIcon }[] = [
  { screen: 'home', label: 'Home', icon: Home },
  { screen: 'trips', label: 'Trips', icon: Clock },
  { screen: 'wallet', label: 'Wallet', icon: Wallet },
  { screen: 'safety', label: 'Safety', icon: Shield },
  { screen: 'account', label: 'Account', icon: User },
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function PhoneFrame({ children, showNav, current, go }: { children: ReactNode; showNav: boolean; current: Screen; go: (screen: Screen) => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 font-sans text-slate-900 sm:p-6">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[844px] sm:max-w-[390px] sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-900">
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
      {navItems.map(({ screen, label, icon: Icon }) => {
        const active = current === screen;
        return (
          <button key={screen} onClick={() => go(screen)} className={cn('flex w-16 flex-col items-center justify-center gap-1', active ? 'text-[#0033CC]' : 'text-slate-400 hover:text-slate-600')}>
            <Icon size={21} strokeWidth={active ? 2.5 : 2} />
            <span className="mt-0.5 text-[10px] font-semibold">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Header({ title, back, go }: { title: string; back?: Screen; go: (screen: Screen) => void }) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 bg-white px-5 pb-4 pt-10 sm:pt-12">
      {back && (
        <button onClick={() => go(back)} className="text-slate-500 active:scale-95">
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="flex-1 text-2xl font-black tracking-tight text-slate-900">{title}</h1>
    </div>
  );
}

function MapBackground({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden bg-slate-100', className)}>
      <div className="absolute inset-0 opacity-90" style={{ backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute left-[-12%] top-[30%] h-5 w-[130%] rotate-12 rounded-full bg-white/85 shadow-sm" />
      <div className="absolute left-[18%] top-[52%] h-4 w-[75%] -rotate-12 rounded-full bg-white/85 shadow-sm" />
      <div className="absolute right-8 top-20 h-20 w-24 rounded-2xl bg-emerald-100/60" />
      <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#0033CC] shadow-lg" />
      {children}
    </div>
  );
}

function Splash({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-[#0033CC] px-6 pb-10 pt-20 text-white">
      <div className="flex flex-1 items-center justify-center">
        <HatidWordmark light large tagline="Biyahe natin. Bansa natin." />
      </div>
      <div className="rounded-[2rem] bg-white p-6 text-slate-900 shadow-xl">
        <HatidTrustPill tone="blue">Philippine mobility prototype</HatidTrustPill>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.04em]">Ride with confidence.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">A lightweight passenger preview for safe city trips, family rides, and everyday commutes.</p>
        <button onClick={() => go('login')} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0033CC] py-4 text-sm font-black text-white active:scale-[0.99]">
          Get Started <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function Login({ go, phone, setPhone }: { go: (screen: Screen) => void; phone: string; setPhone: (value: string) => void }) {
  const valid = phone.replace(/\D/g, '').length >= 10;
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-14">
      <button onClick={() => go('splash')} className="mb-8 w-max text-slate-400 active:scale-95">
        <ArrowLeft size={24} />
      </button>
      <HatidWordmark compact tagline="Secure sign in" />
      <h1 className="mt-8 text-2xl font-black tracking-tight text-slate-900">Enter your mobile number</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">We&apos;ll send a one-time code. Demo only, no real SMS is sent.</p>
      <div className="mt-8 flex overflow-hidden rounded-2xl border border-slate-300 transition-all focus-within:border-[#0033CC] focus-within:ring-2 focus-within:ring-blue-100">
        <div className="flex items-center border-r border-slate-300 bg-slate-50 px-4 py-4 text-sm font-black text-slate-600">+63</div>
        <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" placeholder="9XX XXX XXXX" maxLength={10} className="w-full bg-transparent px-4 py-4 font-bold text-slate-900 outline-none" />
      </div>
      <button disabled={!valid} onClick={() => go('otp')} className="mb-8 mt-auto w-full rounded-2xl bg-[#0033CC] py-4 text-sm font-black text-white active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400">
        Continue
      </button>
    </section>
  );
}

function Otp({ go, otp, setOtp }: { go: (screen: Screen) => void; otp: string; setOtp: (value: string) => void }) {
  const valid = otp.replace(/\D/g, '').length >= 6;
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-14">
      <button onClick={() => go('login')} className="mb-8 w-max text-slate-400 active:scale-95">
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-2xl font-black tracking-tight text-slate-900">Verify number</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">Use any 6 digits for this prototype flow.</p>
      <input value={otp} onChange={(event) => setOtp(event.target.value)} type="tel" maxLength={6} className="mt-10 h-16 w-full rounded-2xl border border-slate-300 text-center text-3xl font-black tracking-[0.75em] text-slate-900 outline-none focus:border-[#0033CC] focus:ring-2 focus:ring-blue-100" placeholder="------" />
      <button disabled={!valid} onClick={() => go('profile')} className="mb-8 mt-auto w-full rounded-2xl bg-[#0033CC] py-4 text-sm font-black text-white active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400">
        Verify & Continue
      </button>
    </section>
  );
}

function Profile({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-16">
      <h1 className="text-2xl font-black tracking-tight text-slate-900">Set up profile</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">These fields are prototype-only until Supabase profile saving is wired.</p>
      <label className="mt-8 block text-xs font-black uppercase tracking-wide text-slate-500">Full name</label>
      <div className="mt-2 flex items-center rounded-2xl border border-slate-300 px-4 py-1 focus-within:border-[#0033CC] focus-within:ring-2 focus-within:ring-blue-100">
        <User size={18} className="text-slate-400" />
        <input type="text" placeholder="e.g. Maria Santos" className="w-full py-3 pl-3 text-sm font-bold outline-none" />
      </div>
      <button onClick={() => go('permissions')} className="mb-8 mt-auto w-full rounded-2xl bg-[#0033CC] py-4 text-sm font-black text-white active:scale-[0.99]">
        Continue
      </button>
    </section>
  );
}

function Permissions({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-16">
      <HatidWordmark tagline="Passenger safety setup" />
      <h1 className="mt-10 text-2xl font-black tracking-tight text-slate-900">Let&apos;s keep every ride safe.</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">Permission copy is demo-safe and does not imply live emergency or dispatch operations.</p>
      <div className="mt-8 space-y-4">
        <InfoRow icon={MapPin} title="Location" detail="Needed for pickup and routing previews." />
        <InfoRow icon={Bell} title="Notifications" detail="Used for ride updates once backend flows are active." />
        <InfoRow icon={Shield} title="Safety" detail="Safety actions must be server-owned before production use." />
      </div>
      <button onClick={() => go('home')} className="mb-8 mt-auto w-full rounded-2xl bg-[#0033CC] py-4 text-sm font-black text-white active:scale-[0.99]">
        Continue to Hatid
      </button>
    </section>
  );
}

function HomeScreen({ go }: { go: (screen: Screen) => void }) {
  const services = [
    { label: 'Ride', icon: Car },
    { label: 'Moto', icon: Bike },
    { label: 'Work', icon: Briefcase },
    { label: 'Card', icon: CreditCard },
  ];
  return (
    <section className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between bg-white px-5 pb-4 pt-10 sm:pt-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Good afternoon</p>
          <h2 className="mt-1 text-lg font-black text-slate-900">Hi, Maria</h2>
        </div>
        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 text-slate-500">
          <Bell size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-32 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="rounded-[2rem] bg-[#0033CC] p-5 text-white shadow-lg">
          <HatidWordmark light compact tagline="BGC • Makati • QC • Pasay" />
          <h1 className="mt-6 text-3xl font-black tracking-[-0.04em]">Saan ang punta?</h1>
          <button onClick={() => go('book-search')} className="mt-5 flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left text-slate-900 active:scale-[0.99]">
            <Search size={20} className="text-slate-400" />
            <span className="flex-1 text-sm font-bold text-slate-600">Where to?</span>
            <span className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-600">Now</span>
          </button>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {services.map(({ label, icon: Icon }) => (
            <button key={label} className="flex flex-col items-center gap-2">
              <HatidIconTile active={label === 'Ride'}>
                <Icon size={21} />
              </HatidIconTile>
              <span className="text-xs font-bold text-slate-700">{label}</span>
            </button>
          ))}
        </div>
        <WalletSummary go={go} />
        <h3 className="mb-3 mt-6 text-sm font-black text-slate-900">Recent places</h3>
        <button onClick={() => go('book-choose')} className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm active:scale-[0.99]">
          <HatidIconTile>
            <Briefcase size={18} />
          </HatidIconTile>
          <div>
            <h4 className="text-sm font-black text-slate-900">Work</h4>
            <p className="text-xs text-slate-500">BGC Corporate Center, Taguig</p>
          </div>
        </button>
      </div>
    </section>
  );
}

function WalletSummary({ go }: { go: (screen: Screen) => void }) {
  return (
    <button onClick={() => go('wallet')} className="mt-6 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
      <div className="flex items-center gap-3">
        <HatidIconTile>
          <Wallet size={18} />
        </HatidIconTile>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">Hatid Wallet</p>
          <p className="text-sm font-black text-slate-900">Demo balance</p>
        </div>
      </div>
      <HatidTrustPill tone="slate">Server-owned later</HatidTrustPill>
    </button>
  );
}

function BookSearch({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white">
      <Header title="Search destination" back="home" go={go} />
      <div className="border-b border-slate-100 px-5 py-4">
        <InputPin dot="bg-slate-800" value="Current location" readOnly />
        <div className="mt-3">
          <InputPin dot="bg-red-500" placeholder="Where to?" focused />
        </div>
      </div>
      <div className="flex-1 p-5">
        <button onClick={() => go('book-choose')} className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left shadow-sm">
          <Clock size={20} className="text-slate-400" />
          <div>
            <h4 className="text-sm font-black text-slate-900">Ayala Triangle Gardens</h4>
            <p className="text-xs text-slate-500">Paseo de Roxas, Makati City</p>
          </div>
        </button>
      </div>
    </section>
  );
}

function InputPin({ dot, value, placeholder, readOnly, focused }: { dot: string; value?: string; placeholder?: string; readOnly?: boolean; focused?: boolean }) {
  return (
    <div className="relative flex items-center">
      <div className={cn('absolute left-[7px] h-2 w-2 rounded-full ring-4 ring-white', dot)} />
      <input value={value} readOnly={readOnly} placeholder={placeholder} className={cn('w-full rounded-2xl py-3 pl-8 pr-3 text-sm font-bold text-slate-800 outline-none', focused ? 'border border-[#0033CC] bg-white shadow-sm focus:ring-2 focus:ring-blue-100' : 'border border-slate-100 bg-slate-50')} />
    </div>
  );
}

function BookChoose({ go, ride, setRide }: { go: (screen: Screen) => void; ride: RideType; setRide: (ride: RideType) => void }) {
  return (
    <section className="flex h-full flex-col bg-slate-100">
      <MapBackground className="h-60">
        <div className="absolute left-5 right-5 top-10 rounded-[1.5rem] border border-white/80 bg-white/95 p-4 shadow-sm backdrop-blur sm:top-12">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Route preview</p>
              <h2 className="mt-1 text-lg font-black tracking-tight text-slate-900">BGC to Makati</h2>
              <p className="mt-1 text-xs text-slate-500">Ayala Triangle Gardens • traffic-aware demo</p>
            </div>
            <HatidTrustPill tone="blue">Estimate</HatidTrustPill>
          </div>
          <div className="mt-3 flex gap-2">
            <HatidTrustPill tone="green">Family-safe</HatidTrustPill>
            <HatidTrustPill tone="slate">Server-priced later</HatidTrustPill>
          </div>
        </div>
      </MapBackground>
      <div className="relative z-20 -mt-5 flex flex-1 flex-col rounded-t-[30px] bg-white shadow-lg">
        <div className="mx-auto mb-4 mt-2 h-1 w-10 rounded-full bg-slate-200" />
        <div className="px-5 pb-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Choose ride</p>
          <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">Pick the right Hatid</h3>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
          <RideOption selected={ride === 'car'} icon={Car} title="Hatid Car" detail="Comfortable city ride" meta="3 mins • 4 seats • BGC-ready" estimate="Fare estimate pending" onClick={() => setRide('car')} />
          <RideOption selected={ride === 'moto'} icon={Bike} title="Hatid Moto" detail="Fast solo trip" meta="1 min • 1 seat • helmet workflow later" estimate="Fare estimate pending" onClick={() => setRide('moto')} />
        </div>
        <div className="border-t border-slate-100 bg-white p-5">
          <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs font-bold leading-5 text-[#0033CC]">Fare, dispatch, driver assignment, and wallet charging must be confirmed by server workflows before real use.</p>
          </div>
          <button onClick={() => go('book-active')} className="w-full rounded-2xl bg-[#0033CC] py-4 text-sm font-black text-white active:scale-[0.99]">
            Continue demo ride
          </button>
        </div>
      </div>
    </section>
  );
}

function RideOption({ selected, icon: Icon, title, detail, meta, estimate, onClick }: { selected: boolean; icon: LucideIcon; title: string; detail: string; meta: string; estimate: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn('w-full rounded-[1.35rem] border p-4 text-left transition-colors', selected ? 'border-[#0033CC] bg-blue-50' : 'border-slate-200 bg-white')}>
      <div className="flex items-start gap-4">
        <HatidIconTile active={selected}>
          <Icon size={22} />
        </HatidIconTile>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">{title}</h3>
              <p className="mt-1 text-xs text-slate-500">{detail}</p>
            </div>
            {selected && <HatidTrustPill tone="blue">Selected</HatidTrustPill>}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-white/80 px-3 py-2">
            <p className="text-[11px] font-bold text-slate-500">{meta}</p>
            <p className="text-[11px] font-black text-slate-700">{estimate}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

function BookActive({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-slate-100">
      <div className="absolute left-5 right-5 top-10 z-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:top-12">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-black text-slate-900">Driver is arriving</h3>
          <HatidTrustPill>2 mins</HatidTrustPill>
        </div>
        <p className="mt-1 text-xs text-slate-500">Prototype driver state only.</p>
      </div>
      <MapBackground className="flex-1" />
      <div className="relative z-30 -mt-4 rounded-t-[28px] bg-white px-5 pb-6 pt-2 shadow-lg">
        <div className="mx-auto mb-4 mt-2 h-1 w-10 rounded-full bg-slate-200" />
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-xs font-black text-slate-500">Ride PIN</span>
          <span className="text-lg font-black tracking-widest text-slate-900">4821</span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-slate-100 font-black text-slate-600">JC</div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Juan Dela Cruz</h3>
              <p className="text-xs text-slate-500">Toyota Vios • ABC-1234</p>
              <p className="mt-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-600">Verification copy demo</p>
            </div>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-[#0033CC]">
            <Phone size={18} />
          </button>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 rounded-2xl border border-slate-200 py-3 text-xs font-black text-slate-700">Share Trip</button>
          <button className="flex-1 rounded-2xl border border-red-100 bg-red-50 py-3 text-xs font-black text-red-600">Safety Help</button>
        </div>
        <button onClick={() => go('book-completed')} className="mt-4 w-full text-xs font-semibold text-slate-400 underline">End demo trip</button>
      </div>
    </section>
  );
}

function Completed({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
        <Check size={32} strokeWidth={3} />
      </div>
      <h1 className="mt-6 text-2xl font-black tracking-tight text-slate-900">You&apos;ve arrived.</h1>
      <p className="mt-2 text-sm text-slate-500">Receipt and fare data are demo-only until ledger-backed flows are live.</p>
      <div className="mt-8 flex justify-center gap-1 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={28} fill="currentColor" />
        ))}
      </div>
      <button onClick={() => go('home')} className="mb-8 mt-auto w-full rounded-2xl bg-[#0033CC] py-4 text-sm font-black text-white active:scale-[0.99]">
        Back to home
      </button>
    </section>
  );
}

function Trips({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white">
      <Header title="Trips" go={go} />
      <div className="space-y-3 p-5">
        <TripCard title="BGC to Makati" detail="Prototype trip • Today" />
        <TripCard title="Pasay to NAIA" detail="Prototype trip • Yesterday" />
      </div>
    </section>
  );
}

function TripCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function WalletScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white">
      <Header title="Wallet" go={go} />
      <div className="space-y-4 p-5">
        <div className="rounded-[2rem] bg-[#0033CC] p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">Demo wallet</p>
          <h2 className="mt-2 text-3xl font-black">Ledger-safe preview</h2>
          <p className="mt-3 text-sm leading-6 text-blue-50">Balances, payments, and refunds must be server-owned before production use.</p>
        </div>
        <InfoRow icon={CreditCard} title="GCash / Maya placeholders" detail="Payment methods are display-only in this prototype." />
        <InfoRow icon={Wallet} title="No client balance edits" detail="Real balances must come from an auditable ledger." />
      </div>
    </section>
  );
}

function SafetyScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white">
      <Header title="Safety" go={go} />
      <div className="space-y-4 p-5">
        <InfoRow icon={Shield} title="Share trip" detail="Designed for family visibility once backend flows are active." />
        <InfoRow icon={Phone} title="Safety help" detail="No emergency-response promise until operations workflow exists." />
        <InfoRow icon={HelpCircle} title="Report an issue" detail="Incident handling must be server-owned and auditable." />
      </div>
    </section>
  );
}

function Account({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white">
      <Header title="Account" go={go} />
      <div className="space-y-4 p-5">
        <HatidWordmark tagline="Passenger preview" />
        <InfoRow icon={User} title="Maria Santos" detail="+63 917 000 0000" />
        <InfoRow icon={Settings} title="Settings" detail="Language, notifications, and accessibility." />
        <InfoRow icon={HelpCircle} title="Support" detail="Help center and incident reporting preview." />
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <HatidIconTile>
        <Icon size={20} />
      </HatidIconTile>
      <div>
        <h3 className="text-sm font-black text-slate-900">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [ride, setRide] = useState<RideType>('car');

  const showNav = ['home', 'trips', 'wallet', 'safety', 'account'].includes(screen);
  const go = (next: Screen) => setScreen(next);

  return (
    <PhoneFrame showNav={showNav} current={screen} go={go}>
      {screen === 'splash' && <Splash go={go} />}
      {screen === 'login' && <Login go={go} phone={phone} setPhone={setPhone} />}
      {screen === 'otp' && <Otp go={go} otp={otp} setOtp={setOtp} />}
      {screen === 'profile' && <Profile go={go} />}
      {screen === 'permissions' && <Permissions go={go} />}
      {screen === 'home' && <HomeScreen go={go} />}
      {screen === 'book-search' && <BookSearch go={go} />}
      {screen === 'book-choose' && <BookChoose go={go} ride={ride} setRide={setRide} />}
      {screen === 'book-active' && <BookActive go={go} />}
      {screen === 'book-completed' && <Completed go={go} />}
      {screen === 'trips' && <Trips go={go} />}
      {screen === 'wallet' && <WalletScreen go={go} />}
      {screen === 'safety' && <SafetyScreen go={go} />}
      {screen === 'account' && <Account go={go} />}
    </PhoneFrame>
  );
}
