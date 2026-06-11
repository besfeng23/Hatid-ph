'use client';

import { useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bike,
  Briefcase,
  Car,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  MapPin,
  Package,
  Phone,
  Plus,
  Search,
  Settings,
  Shield,
  Star,
  Truck,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

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

function HatidLogo({ light = false, large = false }: { light?: boolean; large?: boolean }) {
  return (
    <div className="flex flex-col items-start">
      <span
        className={cn(
          'font-black tracking-tight leading-none',
          large ? 'text-4xl' : 'text-2xl',
          light ? 'text-white' : 'text-[#0033CC]',
        )}
      >
        Hatid
      </span>
      {large && <span className="mt-2 text-[11px] font-medium tracking-wide text-blue-100">Biyahe natin. Bansa natin.</span>}
    </div>
  );
}

function PhoneFrame({ children, showNav, current, go }: { children: ReactNode; showNav: boolean; current: Screen; go: (screen: Screen) => void }) {
  return (
    <main className="min-h-screen bg-[#0F172A] sm:p-6 flex items-center justify-center font-sans text-[#0F172A]">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-[0_12px_30px_-4px_rgba(15,23,42,0.08)] sm:h-[844px] sm:max-w-[390px] sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-900">
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
          <button
            key={screen}
            onClick={() => go(screen)}
            className={cn('flex w-16 flex-col items-center justify-center gap-1', active ? 'text-[#0033CC]' : 'text-slate-400 hover:text-slate-600')}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span className="mt-0.5 text-[10px] font-semibold">{label}</span>
          </button>
        );
      })}
    </nav>
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

function Header({ title, back, go }: { title: string; back?: Screen; go: (screen: Screen) => void }) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 bg-white px-5 pb-4 pt-10 sm:pt-12">
      {back && (
        <button onClick={() => go(back)} className="text-slate-500 active:scale-95">
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="flex-1 text-2xl font-black tracking-tight text-[#0F172A]">{title}</h1>
    </div>
  );
}

function Splash({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-[#0033CC] px-6 pb-12 pt-24">
      <div className="flex flex-1 items-center justify-center">
        <div className="scale-150">
          <HatidLogo light large />
        </div>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-[0_12px_30px_-4px_rgba(15,23,42,0.08)]">
        <h1 className="mb-2 text-2xl font-black tracking-tight text-[#0F172A]">Welcome.</h1>
        <p className="mb-6 text-sm font-medium text-slate-500">Your reliable Philippine mobility partner.</p>
        <button onClick={() => go('login')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0033CC] py-4 font-bold text-white transition-transform active:scale-[0.98]">
          Get Started <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function Login({ go, phone, setPhone }: { go: (screen: Screen) => void; phone: string; setPhone: (value: string) => void }) {
  const valid = phone.replace(/\D/g, '').length >= 10;
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-16">
      <button onClick={() => go('splash')} className="mb-8 w-max text-slate-400 active:scale-95">
        <ArrowLeft size={24} />
      </button>
      <h1 className="mb-2 text-2xl font-black tracking-tight text-[#0F172A]">Enter your mobile number</h1>
      <p className="mb-8 text-sm text-slate-500">We&apos;ll send you a secure code to verify your account.</p>
      <div className="mb-6 flex overflow-hidden rounded-xl border border-slate-300 transition-all focus-within:border-[#0033CC] focus-within:ring-2 focus-within:ring-blue-100">
        <div className="flex items-center border-r border-slate-300 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-500">🇵🇭 +63</div>
        <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" placeholder="9XX XXX XXXX" maxLength={10} className="w-full bg-transparent px-4 py-4 font-bold text-[#0F172A] outline-none" />
      </div>
      <button disabled={!valid} onClick={() => go('otp')} className="mt-auto mb-6 w-full rounded-xl bg-[#0033CC] py-4 font-bold text-white transition-transform active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 sm:mb-0 sm:mt-0">
        Continue
      </button>
    </section>
  );
}

function Otp({ go, otp, setOtp }: { go: (screen: Screen) => void; otp: string; setOtp: (value: string) => void }) {
  const valid = otp.replace(/\D/g, '').length >= 6;
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-16">
      <button onClick={() => go('login')} className="mb-8 w-max text-slate-400 active:scale-95">
        <ArrowLeft size={24} />
      </button>
      <h1 className="mb-2 text-2xl font-black tracking-tight text-[#0F172A]">Verify Number</h1>
      <p className="mb-10 text-sm text-slate-500">Enter the 6-digit code sent to your phone.</p>
      <input value={otp} onChange={(event) => setOtp(event.target.value)} type="tel" maxLength={6} className="mb-10 h-16 w-full rounded-xl border border-slate-300 text-center text-3xl font-black tracking-[0.75em] text-[#0F172A] shadow-sm outline-none transition-all focus:border-[#0033CC] focus:ring-2 focus:ring-blue-100" placeholder="------" />
      <button disabled={!valid} onClick={() => go('profile')} className="mt-auto mb-10 w-full rounded-xl bg-[#0033CC] py-4 font-bold text-white transition-transform active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400">
        Verify & Continue
      </button>
    </section>
  );
}

function Profile({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-16">
      <h1 className="mb-2 text-2xl font-black tracking-tight text-[#0F172A]">Set up profile</h1>
      <p className="mb-10 text-sm text-slate-500">Add your details to start using Hatid.</p>
      <label className="mb-2 ml-1 block text-xs font-bold text-slate-700">Full Name</label>
      <div className="flex items-center rounded-xl border border-slate-300 px-4 py-1 transition-all focus-within:border-[#0033CC] focus-within:ring-2 focus-within:ring-blue-100">
        <User size={18} className="text-slate-400" />
        <input type="text" placeholder="e.g. Maria Santos" className="w-full py-3 pl-3 text-sm font-bold text-[#0F172A] outline-none" />
      </div>
      <div className="mt-auto pb-10">
        <button onClick={() => go('permissions')} className="w-full rounded-xl bg-[#0033CC] py-4 font-bold text-white transition-transform active:scale-[0.98]">
          Save Profile
        </button>
      </div>
    </section>
  );
}

function Permissions({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col bg-white px-6 pt-16">
      <div className="mb-10">
        <HatidLogo />
      </div>
      <h1 className="mb-2 text-2xl font-black tracking-tight text-[#0F172A]">Let&apos;s keep every ride safe.</h1>
      <p className="mb-10 text-sm text-slate-500">Enable these required permissions so Hatid can locate you, notify you, and protect your trip.</p>
      <div className="mb-10 space-y-6">
        <Permission icon={MapPin} title="Location" detail="Needed for pickup routing" />
        <Permission icon={Bell} title="Notifications" detail="Ride updates and safety alerts" />
      </div>
      <div className="mt-auto pb-10">
        <button onClick={() => go('home')} className="w-full rounded-xl bg-[#0033CC] py-4 font-bold text-white transition-transform active:scale-[0.98]">
          Allow Required Permissions
        </button>
      </div>
    </section>
  );
}

function Permission({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <div className="flex items-start gap-4">
      <Icon size={24} className="mt-0.5 text-[#0033CC]" />
      <div>
        <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
        <p className="text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

function HomeScreen({ go }: { go: (screen: Screen) => void }) {
  const services = [
    { label: 'Ride', icon: Car },
    { label: 'Moto', icon: Bike },
    { label: 'XL', icon: Truck },
    { label: 'Padala', icon: Package },
  ];
  return (
    <section className="relative flex h-full flex-col bg-white">
      <div className="z-10 flex items-center justify-between bg-white px-5 pb-4 pt-10 sm:pt-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-bold text-slate-600">MS</div>
          <h2 className="text-sm font-bold text-[#0F172A]">Hi, Maria</h2>
        </div>
        <button className="p-2 text-slate-500">
          <Bell size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-32 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="mb-4 text-2xl font-black tracking-tight text-[#0F172A]">Saan ang punta?</h1>
        <button onClick={() => go('book-search')} className="mb-6 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-transform active:scale-[0.99]">
          <Search size={20} className="text-slate-400" />
          <span className="flex-1 text-left text-sm font-medium text-slate-500">Where to?</span>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm">
            <Clock size={12} /> Now
          </div>
        </button>
        <div className="mb-8 grid grid-cols-4 gap-3">
          {services.map(({ label, icon: Icon }) => (
            <button key={label} className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#0033CC]">
                <Icon size={24} strokeWidth={2.2} />
              </div>
              <span className="text-xs font-bold text-slate-700">{label}</span>
            </button>
          ))}
        </div>
        <WalletSummary go={go} />
        <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Recent Places</h3>
        <button onClick={() => go('book-choose')} className="flex w-full items-center gap-4 rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Briefcase size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0F172A]">Work</h4>
            <p className="text-[11px] text-slate-500">BGC Corporate Center, Taguig</p>
          </div>
        </button>
      </div>
    </section>
  );
}

function WalletSummary({ go }: { go: (screen: Screen) => void }) {
  return (
    <button onClick={() => go('wallet')} className="mb-8 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0033CC]">
          <Wallet size={16} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500">Hatid Wallet</p>
          <p className="text-sm font-black text-[#0F172A]">₱1,250.00</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-medium text-slate-500">Linked</p>
        <p className="text-xs font-bold text-blue-600">GCash</p>
      </div>
    </button>
  );
}

function BookSearch({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="relative z-50 flex h-full flex-col bg-white">
      <div className="flex gap-3 border-b border-slate-100 px-5 pb-4 pt-10 shadow-sm sm:pt-12">
        <button onClick={() => go('home')} className="mt-3 text-slate-500">
          <ArrowLeft size={24} />
        </button>
        <div className="relative flex-1 space-y-3">
          <div className="absolute bottom-6 left-2.5 top-6 w-px bg-slate-300" />
          <InputPin dot="bg-slate-800" value="Current Location" readOnly />
          <InputPin dot="bg-[#EF4444]" placeholder="Where to?" focused />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <button onClick={() => go('book-choose')} className="flex w-full items-center gap-4 border-b border-slate-100 py-3 text-left">
          <Clock size={20} className="text-slate-400" />
          <div>
            <h4 className="text-sm font-bold text-[#0F172A]">Ayala Triangle Gardens</h4>
            <p className="text-[11px] text-slate-500">Paseo de Roxas, Makati City</p>
          </div>
        </button>
      </div>
    </section>
  );
}

function InputPin({ dot, value, placeholder, readOnly, focused }: { dot: string; value?: string; placeholder?: string; readOnly?: boolean; focused?: boolean }) {
  return (
    <div className="relative flex items-center">
      <div className={cn('absolute left-[7px] h-1.5 w-1.5 rounded-full ring-4 ring-white', dot)} />
      <input value={value} readOnly={readOnly} placeholder={placeholder} className={cn('w-full rounded-lg py-2.5 pl-8 pr-3 text-sm font-bold text-slate-800 outline-none', focused ? 'border border-[#0033CC] bg-white shadow-sm focus:ring-1 focus:ring-[#0033CC]' : 'border border-slate-100 bg-slate-50')} />
    </div>
  );
}

function BookChoose({ go, ride, setRide }: { go: (screen: Screen) => void; ride: RideType; setRide: (ride: RideType) => void }) {
  return (
    <section className="relative z-50 flex h-full flex-col bg-slate-100">
      <MapBackground className="h-56">
        <span />
      </MapBackground>
      <button onClick={() => go('book-search')} className="absolute left-5 top-12 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm">
        <ArrowLeft size={20} />
      </button>
      <div className="relative z-20 -mt-4 flex flex-1 flex-col rounded-t-[24px] bg-white shadow-[0_12px_30px_-4px_rgba(15,23,42,0.08)]">
        <div className="mx-auto mb-4 mt-2 h-1 w-10 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <RideOption selected={ride === 'car'} icon={Car} title="Hatid Car" detail="3 mins • 4 seats" price="₱212.00" onClick={() => setRide('car')} />
          <RideOption selected={ride === 'moto'} icon={Bike} title="Hatid Moto" detail="1 min • 1 seat" price="₱138.00" onClick={() => setRide('moto')} />
        </div>
        <div className="border-t border-slate-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Wallet size={18} className="text-[#0033CC]" />
            <span className="text-sm font-bold text-[#0F172A]">Hatid Wallet <span className="ml-1 font-normal text-slate-400">₱1,250</span></span>
          </div>
          <button onClick={() => go('book-active')} className="w-full rounded-xl bg-[#0033CC] py-4 font-bold text-white transition-transform active:scale-[0.98]">
            Confirm {ride === 'car' ? 'Car' : 'Moto'}
          </button>
        </div>
      </div>
    </section>
  );
}

function RideOption({ selected, icon: Icon, title, detail, price, onClick }: { selected: boolean; icon: LucideIcon; title: string; detail: string; price: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn('flex w-full cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-colors', selected ? 'border-[#0033CC] bg-blue-50/30' : 'border-slate-200 bg-white')}>
      <Icon size={36} strokeWidth={2.5} className="text-[#0F172A]" />
      <div className="flex-1">
        <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
        <p className="text-[11px] text-slate-500">{detail}</p>
      </div>
      <span className="text-sm font-black text-[#0F172A]">{price}</span>
    </button>
  );
}

function BookActive({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="relative z-50 flex h-full flex-col bg-slate-100">
      <div className="absolute left-5 right-5 top-10 z-20 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:top-12">
        <div className="mb-1 flex items-start justify-between">
          <h3 className="text-sm font-black text-[#0F172A]">Driver is arriving</h3>
          <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#0033CC]">2 mins</span>
        </div>
        <p className="text-[11px] font-medium text-slate-500">Please wait at the pickup point.</p>
      </div>
      <MapBackground className="flex-1" />
      <div className="relative z-30 -mt-4 flex flex-col rounded-t-[24px] bg-white px-5 pb-6 pt-2 shadow-[0_12px_30px_-4px_rgba(15,23,42,0.08)]">
        <div className="mx-auto mb-4 mt-2 h-1 w-10 rounded-full bg-slate-200" />
        <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-xs font-bold text-slate-500">Your Ride PIN</span>
          <span className="text-lg font-black tracking-widest text-[#0F172A]">4821</span>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-bold text-slate-600">JC</div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Juan Dela Cruz</h3>
              <p className="text-[11px] text-slate-500">Toyota Vios • ABC-1234</p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-green-600">LTFRB Verified</p>
            </div>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#0033CC]">
            <Phone size={18} />
          </button>
        </div>
        <div className="mt-auto flex gap-3">
          <button className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700">Share Trip</button>
          <button className="flex-1 rounded-xl border border-red-100 bg-red-50 py-3 text-xs font-bold text-red-600">Emergency</button>
        </div>
        <button onClick={() => go('book-completed')} className="mt-4 text-[10px] font-medium text-slate-400 underline">End Demo Trip</button>
      </div>
    </section>
  );
}

function Completed({ go, rating, setRating }: { go: (screen: Screen) => void; rating: number; setRating: (rating: number) => void }) {
  return (
    <section className="relative z-50 flex h-full flex-col bg-white px-6 pt-16">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
          <Check size={32} strokeWidth={3} />
        </div>
        <h1 className="mb-1 text-2xl font-black tracking-tight text-[#0F172A]">You&apos;ve arrived.</h1>
        <p className="text-sm text-slate-500">Hope you enjoyed your ride with Juan.</p>
      </div>
      <div className="mb-8 flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-4 text-sm font-bold text-[#0F172A]">Rate your driver</h3>
        <div className="mb-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} onClick={() => setRating(value)}>
              <Star size={36} fill={value <= rating ? 'currentColor' : 'none'} className={value <= rating ? 'text-[#F59E0B]' : 'text-slate-300'} />
            </button>
          ))}
        </div>
      </div>
      {rating > 0 && (
        <div className="mb-8">
          <p className="mb-3 text-center text-xs font-bold text-slate-500">Add a tip? (100% goes to driver)</p>
          <div className="flex justify-center gap-3">
            {['₱20', '₱50', '₱100'].map((tip) => <button key={tip} className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">{tip}</button>)}
          </div>
        </div>
      )}
      <div className="mt-auto space-y-3 pb-10">
        <button onClick={() => go('home')} className="w-full rounded-xl bg-[#0033CC] py-4 font-bold text-white transition-transform active:scale-[0.98]">Submit & Return Home</button>
        <button onClick={() => go('receipt')} className="w-full rounded-xl border border-slate-200 bg-white py-4 font-bold text-slate-700 transition-transform active:scale-[0.98]">View Detailed Receipt</button>
      </div>
    </section>
  );
}

function Receipt({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="relative z-50 flex h-full flex-col bg-slate-50">
      <Header title="Trip Receipt" back="home" go={go} />
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 border-b border-slate-100 pb-6 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Total Paid</p>
            <h2 className="text-4xl font-black text-[#0F172A]">₱212.00</h2>
            <p className="mt-2 text-xs text-slate-400">June 11, 2026 • 10:45 AM</p>
          </div>
          <div className="mb-6 space-y-4 border-b border-slate-100 pb-6 text-sm">
            <Line label="Base Fare" value="₱80.00" />
            <Line label="Distance (7.2 km)" value="₱132.00" />
            <Line label="Tip" value="₱0.00" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Paid via GCash</span>
            <span className="rounded border border-green-200 bg-green-50 px-2 py-1 text-xs font-bold text-green-700">Successful</span>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-400">TXID: HTD-98213-AB29 • Ledger Verified</p>
      </div>
    </section>
  );
}

function Trips({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="relative flex h-full flex-col bg-slate-50">
      <Header title="Your Trips" go={go} />
      <div className="border-b border-slate-100 bg-white px-5 pb-2 pt-4">
        <div className="flex gap-4">
          <button className="border-b-2 border-[#0033CC] pb-2 text-sm font-bold text-[#0033CC]">Past</button>
          <button className="pb-2 text-sm font-bold text-slate-400">Upcoming</button>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 pb-32">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-[#0F172A]">
                <Car size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Hatid Car</h3>
                <p className="text-[11px] text-slate-500">June 11, 2026 • 10:45 AM</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-[#0F172A]">₱212.00</p>
              <span className="text-[9px] font-bold uppercase text-green-600">Completed</span>
            </div>
          </div>
          <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 px-2 py-3 text-xs font-medium text-slate-600">
            <p className="flex items-center gap-2"><MapPin size={12} /> BGC Corporate Center</p>
            <div className="my-1 ml-1.5 h-2 w-0.5 bg-slate-300" />
            <p className="flex items-center gap-2"><MapPin size={12} /> Ayala Triangle Gardens</p>
          </div>
          <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
            <button onClick={() => go('receipt')} className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700">View Receipt</button>
            <button onClick={() => go('home')} className="flex-1 rounded-lg border border-blue-100 bg-blue-50 py-2 text-xs font-bold text-[#0033CC]">Rebook</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function WalletScreen() {
  return (
    <section className="relative flex h-full flex-col bg-white">
      <Header title="Wallet" go={() => undefined} />
      <div className="border-b border-slate-100 px-5 pb-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded border border-green-200 bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700"><Shield size={10} /> Fully Verified</div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Available Balance</p>
          <h2 className="mb-1 text-3xl font-black text-[#0F172A]">₱1,250.00</h2>
          <p className="mb-5 text-[10px] font-medium text-slate-400">Monthly Limit: ₱100,000.00</p>
          <div className="flex gap-3">
            <button className="flex-1 rounded-lg bg-[#0F172A] py-2.5 text-xs font-bold text-white">Top Up</button>
            <button className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700">Send</button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32">
        <h3 className="mb-4 text-sm font-bold text-[#0F172A]">Payment Methods</h3>
        <div className="mb-8 space-y-3">
          <Method label="GCash" status="Linked" blue />
          <Method label="Cash" check />
        </div>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-bold text-[#0F172A]">Recent Transactions</h3><button className="text-xs font-bold text-[#0033CC]">View Receipts</button></div>
        <Transaction icon={Car} title="Hatid Car" detail="TX-98213 • Today" amount="-₱212.00" />
        <Transaction icon={Plus} title="GCash Top Up" detail="TX-98100 • Yesterday" amount="+₱500.00" positive />
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <Shield size={16} className="mt-0.5 shrink-0 text-slate-400" />
          <p className="text-[10px] leading-relaxed text-slate-500">Balances governed by secure backend ledger. All transactions are securely audited and client is not authoritative for payments.</p>
        </div>
      </div>
    </section>
  );
}

function Safety() {
  return (
    <section className="relative flex h-full flex-col bg-slate-50">
      <Header title="Safety Center" go={() => undefined} />
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32">
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-red-100 bg-red-50 p-6">
          <AlertTriangle size={100} className="absolute -bottom-6 -right-6 text-red-500 opacity-10" />
          <h2 className="relative z-10 mb-2 text-xl font-black tracking-tight text-red-700">Emergency SOS</h2>
          <p className="relative z-10 mb-6 pr-4 text-xs font-medium text-red-600/80">Quickly call emergency services and share your trip details with trusted contacts.</p>
          <div className="relative z-10 space-y-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 font-bold text-white shadow-sm transition-transform active:scale-95"><Phone size={18} /> Call 911</button>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-4 font-bold text-red-600 transition-transform active:scale-95"><User size={18} /> Notify trusted contacts</button>
          </div>
        </div>
        <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Safety Features</h3>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <SafetyItem icon={MapPin} label="Share live trip" />
          <SafetyItem icon={Shield} label="Community Guidelines" />
          <SafetyItem icon={HelpCircle} label="Contact Hatid Support" last />
        </div>
      </div>
    </section>
  );
}

function Account({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="relative flex h-full flex-col bg-white">
      <Header title="Account" go={go} />
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xl font-bold text-slate-600">MS</div>
          <div>
            <h2 className="text-lg font-black leading-tight text-[#0F172A]">Maria Santos</h2>
            <p className="text-xs font-medium text-slate-500">+63 968 184 1001</p>
            <span className="mt-1 inline-block rounded border border-green-200 bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-700">KYC Verified</span>
          </div>
        </div>
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <AccountItem icon={User} label="Personal Information" />
          <AccountItem icon={Shield} label="Verification & Limits" />
          <AccountItem icon={CreditCard} label="Payment Methods" />
          <AccountItem icon={FileText} label="Saved Places" />
          <AccountItem icon={User} label="Trusted Contacts" />
          <AccountItem icon={HelpCircle} label="Help Center" />
          <AccountItem icon={Settings} label="Settings" last />
        </div>
        <button onClick={() => go('splash')} className="flex w-full items-center justify-center gap-2 rounded-xl p-4 text-sm font-bold text-slate-500 transition-transform active:scale-95">Log Out</button>
      </div>
    </section>
  );
}

function Method({ label, status, blue, check }: { label: string; status?: string; blue?: boolean; check?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
      <span className={cn('text-sm font-bold', blue ? 'text-blue-600' : 'text-slate-800')}>{label}</span>
      {status && <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">{status}</span>}
      {check && <Check size={16} className="text-green-500" />}
    </div>
  );
}

function Transaction({ icon: Icon, title, detail, amount, positive }: { icon: LucideIcon; title: string; detail: string; amount: string; positive?: boolean }) {
  return (
    <div className="group flex cursor-pointer items-center justify-between border-b border-slate-100 pb-4 pt-1">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-500"><Icon size={16} strokeWidth={2.5} /></div>
        <div><h4 className="text-sm font-bold text-[#0F172A] transition-colors group-hover:text-[#0033CC]">{title}</h4><p className="text-[10px] text-slate-400">{detail}</p></div>
      </div>
      <div className="text-right"><p className={cn('text-sm font-bold', positive ? 'text-green-600' : 'text-[#0F172A]')}>{amount}</p><p className="text-[9px] text-slate-400 underline">{positive ? 'Receipt' : 'Report Issue'}</p></div>
    </div>
  );
}

function SafetyItem({ icon: Icon, label, last }: { icon: LucideIcon; label: string; last?: boolean }) {
  return (
    <button className={cn('flex w-full items-center gap-4 p-4 text-left hover:bg-slate-50', !last && 'border-b border-slate-100')}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#0033CC]"><Icon size={16} /></div>
      <span className="flex-1 text-sm font-bold text-slate-800">{label}</span>
      <ChevronRight size={16} className="text-slate-300" />
    </button>
  );
}

function AccountItem({ icon: Icon, label, last }: { icon: LucideIcon; label: string; last?: boolean }) {
  return (
    <button className={cn('flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50', !last && 'border-b border-slate-100')}>
      <Icon size={18} className="text-slate-400" />
      <span className="flex-1 text-sm font-bold text-slate-700">{label}</span>
      <ChevronRight size={16} className="text-slate-300" />
    </button>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-slate-500">{label}</span><span className="font-bold text-[#0F172A]">{value}</span></div>;
}

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [ride, setRide] = useState<RideType>('car');
  const [rating, setRating] = useState(0);

  const go = (next: Screen) => setScreen(next);

  const render = () => {
    switch (screen) {
      case 'splash': return <Splash go={go} />;
      case 'login': return <Login go={go} phone={phone} setPhone={setPhone} />;
      case 'otp': return <Otp go={go} otp={otp} setOtp={setOtp} />;
      case 'profile': return <Profile go={go} />;
      case 'permissions': return <Permissions go={go} />;
      case 'home': return <HomeScreen go={go} />;
      case 'book-search': return <BookSearch go={go} />;
      case 'book-choose': return <BookChoose go={go} ride={ride} setRide={setRide} />;
      case 'book-active': return <BookActive go={go} />;
      case 'book-completed': return <Completed go={go} rating={rating} setRating={setRating} />;
      case 'receipt': return <Receipt go={go} />;
      case 'trips': return <Trips go={go} />;
      case 'wallet': return <WalletScreen />;
      case 'safety': return <Safety />;
      case 'account': return <Account go={go} />;
      default: return <Splash go={go} />;
    }
  };

  return <PhoneFrame showNav={navRoutes.includes(screen)} current={screen} go={go}>{render()}</PhoneFrame>;
}
