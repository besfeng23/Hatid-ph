"use client";

import React, { useEffect, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Shield,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Bell,
  Menu,
  Wallet,
  Package,
  Home,
  Briefcase,
  Plane,
  Plus,
  Star,
  Clock,
  User,
  Navigation,
  Tag,
  Phone,
  MessageSquare,
} from 'lucide-react';

/**
 * Hatid Canonical UI/UX Baseline
 *
 * Architecture alignment:
 * - This route is a frontend-only canonical visual baseline.
 * - It does not create trips, mutate wallets, call dispatch, or simulate backend authority.
 * - Production integration must route commands through the approved Supabase Edge Function
 *   service layer: auth-service, trip-service, dispatch-service, workflow-service, ledger-service.
 * - Demo labels are intentionally marked where the backend is not implemented yet.
 */

type Screen =
  | 'splash'
  | 'login'
  | 'otp'
  | 'profile'
  | 'permissions'
  | 'home'
  | 'dropoff-search'
  | 'dropoff-selected'
  | 'saved-places'
  | 'choose-ride'
  | 'searching'
  | 'driver-assigned'
  | 'active-trip'
  | 'trip-completed';

type Navigate = (screen: Screen) => void;

type LogoProps = {
  className?: string;
  light?: boolean;
};

type MapBackgroundProps = {
  type?: 'home' | 'route' | 'active' | 'dropoff';
};

const HatidLogo = ({ className = 'text-2xl', light = false }: LogoProps) => (
  <div className={`flex items-center font-bold italic tracking-tight ${className}`}>
    <div className="relative flex items-center justify-center">
      <div className={`${light ? 'text-white' : 'text-[#0033cc]'} text-[36px] h-8 flex items-center -skew-x-12`}>H</div>
      <div className="absolute -top-1 -right-1 flex">
        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
      </div>
      <div className={`absolute w-full h-[3.5px] ${light ? 'bg-white' : 'bg-red-500'} bottom-0.5 -skew-x-12 opacity-90 shadow-sm`} />
    </div>
    <div className="flex flex-col justify-center leading-none ml-0.5">
      <span className={`${light ? 'text-white' : 'text-[#0033cc]'} mt-1 text-[28px] tracking-tighter uppercase`}>ATID</span>
      <span className={`text-[6px] ${light ? 'text-blue-200' : 'text-gray-500'} font-normal not-italic tracking-[0.15em] uppercase mt-[3px]`}>Biyahe natin. Bansa natin.</span>
    </div>
  </div>
);

const SimpleLogo = ({ className = 'text-2xl', light = false }: LogoProps) => (
  <div className={`flex items-center font-bold italic tracking-tight ${className}`}>
    <div className="relative flex items-center justify-center">
      <div className={`${light ? 'text-white' : 'text-[#0033cc]'} text-[32px] h-8 flex items-center -skew-x-12`}>H</div>
      <div className="absolute top-0 -right-0.5 flex">
        <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
      </div>
      <div className={`absolute w-[90%] h-[3px] ${light ? 'bg-white' : 'bg-red-500'} bottom-1 left-[5%] -skew-x-12 shadow-sm`} />
    </div>
    <span className={`${light ? 'text-white' : 'text-[#0033cc]'} tracking-tighter text-[28px] mt-[3px] ml-0.5`}>atid</span>
  </div>
);

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'trips', icon: Clock, label: 'Trips' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'safety', icon: Shield, label: 'Safety' },
    { id: 'account', icon: User, label: 'Account' },
  ];

  return (
    <div className="absolute bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around py-2 pb-6 px-2 z-50 rounded-b-[2.5rem] shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-16 gap-1 transition-all duration-200 active:scale-90 ${isActive ? 'text-[#0033cc]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <div className={`p-1.5 rounded-full transition-colors duration-300 ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'fill-[#0033cc]/10' : ''} />
            </div>
            <span className={`text-[10px] font-semibold transition-colors duration-300 ${isActive ? 'text-[#0033cc]' : 'text-gray-400'}`}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const MapBackground = ({ type = 'home' }: MapBackgroundProps) => (
  <div className="absolute inset-0 bg-[#eef2f5] overflow-hidden -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5 z-0 pointer-events-none" />
    <div className="absolute w-full h-full opacity-70 z-0">
      <div className="absolute top-[30%] left-[-20%] w-[150%] h-8 bg-white/80 backdrop-blur-sm transform rotate-12 shadow-sm rounded-full" />
      <div className="absolute top-[50%] left-[-20%] w-[150%] h-12 bg-white/80 backdrop-blur-sm transform -rotate-[15deg] shadow-sm rounded-full" />
      <div className="absolute top-[20%] right-10 w-24 h-48 bg-[#d4ebd4]/60 rounded-2xl" />
      <div className="absolute bottom-[40%] left-10 w-32 h-32 bg-[#d4ebd4]/60 rounded-full blur-[2px]" />
      <div className="absolute top-[10%] left-[60%] w-[100%] h-6 bg-white/80 transform rotate-[45deg] shadow-sm" />
      <div className="absolute top-[70%] right-[10%] w-[80%] h-4 bg-white/80 transform -rotate-12 shadow-sm" />
      <span className="absolute top-[32%] left-[40%] text-[10px] text-gray-500 font-medium rotate-12 drop-shadow-sm">Kalayaan Ave</span>
      <span className="absolute top-[52%] left-[20%] text-[10px] text-gray-500 font-medium -rotate-[15deg] drop-shadow-sm">C-5</span>
      <span className="absolute top-[25%] left-[60%] text-xs text-gray-400 font-bold uppercase tracking-wider">Bonifacio Global City</span>
      <span className="absolute top-[45%] left-[70%] text-xs text-gray-400 font-bold uppercase tracking-wider">Pateros</span>
      <span className="absolute top-[60%] left-[25%] text-xs text-gray-400 font-bold uppercase tracking-wider">Pinagsama</span>
    </div>

    {type === 'home' && (
      <div className="absolute top-[45%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 animate-slide-up">
        <div className="bg-[#0033cc] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg mb-2.5 relative">
          You are here
          <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-[#0033cc] rotate-45 rounded-sm" />
        </div>
        <div className="w-20 h-20 bg-blue-500/15 rounded-full flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
          <div className="w-10 h-10 bg-blue-500/25 rounded-full flex items-center justify-center animate-[pulse_1.5s_ease-in-out_infinite]">
            <div className="w-4 h-4 bg-[#0033cc] rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,51,204,0.6)]" />
          </div>
        </div>
      </div>
    )}

    {(type === 'route' || type === 'active') && (
      <div className="absolute inset-0 z-10 animate-slide-up">
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          <path d="M 120,380 L 180,320 L 220,360 L 280,280 L 320,290" stroke="rgba(0,51,204,0.2)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="transform translate-y-1" />
          <path d="M 120,380 L 180,320 L 220,360 L 280,280 L 320,290" stroke="#0033cc" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="absolute top-[370px] left-[110px] w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
        </div>
        {type === 'active' ? (
          <div className="absolute top-[280px] left-[270px] w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg border border-gray-100 z-10">
            <img src="https://img.icons8.com/color/96/000000/sedan.png" className="w-8 drop-shadow-sm" alt="Car" />
          </div>
        ) : (
          <div className="absolute top-[280px] left-[310px] w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 z-10">
            <div className="w-3.5 h-3.5 bg-[#0033cc] border-2 border-white rounded-full shadow-sm" />
          </div>
        )}
        {type === 'route' && (
          <div className="absolute top-[300px] left-[220px] bg-[#0033cc] text-white rounded-lg shadow-xl overflow-hidden flex flex-col transform -translate-y-2">
            <div className="px-3 py-1.5 bg-[#0033cc] font-bold text-center text-xs tracking-wide">18 min</div>
            <div className="px-3 py-1 bg-[#002288] text-[10px] text-center font-medium opacity-90">7.2 km</div>
          </div>
        )}
      </div>
    )}

    {type === 'dropoff' && (
      <div className="absolute top-[45%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 animate-slide-up">
        <div className="bg-white border border-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-xl shadow-lg mb-2 relative">
          Use this location
          <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-white border-b border-r border-red-100 rotate-45 rounded-sm" />
        </div>
        <MapPin className="text-red-500 fill-red-500 w-11 h-11 drop-shadow-[0_8px_8px_rgba(239,68,68,0.3)] animate-bounce" />
      </div>
    )}

    {(type === 'home' || type === 'dropoff' || type === 'route' || type === 'active') && (
      <button className={`absolute right-4 bg-white/95 backdrop-blur p-3.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] z-10 text-gray-700 active:scale-90 transition-transform ${type === 'active' ? 'bottom-[370px]' : 'bottom-[340px]'}`}>
        <Navigation size={22} className="text-gray-800" strokeWidth={2.5} />
      </button>
    )}
  </div>
);

const DemoBadge = () => (
  <div className="absolute top-10 left-5 z-[110] rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold px-3 py-1 shadow-sm">
    CANONICAL UI BASELINE · DEMO ONLY
  </div>
);

const ScreenSplash = ({ onNext }: { onNext: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onNext, 2500);
    return () => clearTimeout(timer);
  }, [onNext]);
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#0033cc] rounded-full blur-[80px] opacity-20 pointer-events-none z-0" />
      <HatidLogo className="animate-logo-alive z-10" light={false} />
    </div>
  );
};

const ScreenLogin = ({ onNext, phoneNumber, setPhoneNumber }: { onNext: () => void; phoneNumber: string; setPhoneNumber: (value: string) => void }) => (
  <div className="h-full bg-white flex flex-col px-6 pt-20 animate-slide-up">
    <SimpleLogo className="mb-8 scale-110 origin-left" />
    <h1 className="text-[32px] font-extrabold text-[#001144] tracking-tight leading-[1.1] mb-3">What's your<br />number?</h1>
    <p className="text-gray-500 mb-8 font-medium text-[15px]">We'll text you a code to verify your phone.</p>
    <div className="flex border-2 border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#0033cc] focus-within:ring-4 focus-within:ring-blue-500/10 transition-all mb-8 shadow-sm">
      <div className="bg-gray-50 px-4 py-4 flex items-center border-r border-gray-200 font-extrabold text-gray-700">🇵🇭 +63</div>
      <input type="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="9XX XXX XXXX" className="w-full px-4 py-4 outline-none font-bold text-gray-900 text-lg bg-transparent" />
    </div>
    <button onClick={onNext} className="w-full bg-[#0033cc] text-white font-extrabold py-4 rounded-2xl shadow-[0_8px_20px_rgba(0,51,204,0.25)] active:scale-[0.98] transition-all text-[16px] flex justify-center items-center gap-2">
      Continue <ChevronRight size={20} strokeWidth={3} />
    </button>
    <div className="mt-auto pb-10 text-center">
      <p className="text-xs text-gray-400 font-medium leading-relaxed">By continuing, you agree to Hatid's <br /><span className="text-[#0033cc] font-bold">Terms of Service</span> and <span className="text-[#0033cc] font-bold">Privacy Policy</span>.</p>
    </div>
  </div>
);

const ScreenOTP = ({ onNext, onBack, phoneNumber }: { onNext: () => void; onBack: () => void; phoneNumber: string }) => (
  <div className="h-full bg-white flex flex-col px-6 pt-20 animate-slide-up relative">
    <button onClick={onBack} className="absolute top-12 left-5 p-2 bg-gray-50 rounded-full text-gray-600 active:scale-90 transition-transform"><ChevronLeft size={22} strokeWidth={2.5} /></button>
    <h1 className="text-[32px] font-extrabold text-[#001144] tracking-tight leading-[1.1] mb-3 mt-4">Enter code</h1>
    <p className="text-gray-500 mb-8 font-medium text-[15px]">A 6-digit code was sent to <span className="font-bold text-gray-900">+63 {phoneNumber}</span></p>
    <div className="flex gap-2.5 mb-8 justify-between">
      {[0, 1, 2, 3, 4, 5].map((item) => <input key={item} type="text" maxLength={1} className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-extrabold text-[#001144] focus:border-[#0033cc] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm" />)}
    </div>
    <button onClick={onNext} className="w-full bg-[#0033cc] text-white font-extrabold py-4 rounded-2xl shadow-[0_8px_20px_rgba(0,51,204,0.25)] active:scale-[0.98] transition-all text-[16px]">Verify & Continue</button>
    <div className="mt-6 text-center"><button className="text-[#0033cc] font-bold text-sm hover:underline">Resend Code (0:45)</button></div>
  </div>
);

const ScreenProfileSetup = ({ onNext, phoneNumber }: { onNext: () => void; phoneNumber: string }) => (
  <div className="flex flex-col h-full bg-white overflow-y-auto w-full hide-scrollbar animate-slide-up">
    <div className="px-6 py-4 pt-12 flex justify-between items-center bg-white/95 backdrop-blur-sm sticky top-0 z-20">
      <SimpleLogo />
      <div className="bg-blue-50 text-[#0033cc] text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide">Step 1 of 3</div>
    </div>
    <div className="px-6 py-4 flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-[#0033cc] text-white flex items-center justify-center text-xs font-bold z-10 shadow-sm">1</div><div className="h-[2px] w-12 bg-[#0033cc] mx-[-2px]" /><div className="h-[2px] w-12 bg-gray-200 mx-[-2px]" /><div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold z-10">2</div><div className="h-[2px] w-24 bg-gray-200 mx-[-2px]" /><div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold z-10">3</div></div>
    <div className="px-6 py-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2.5 tracking-tight">Set up your profile</h1>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed pr-4 font-medium">We need a few basic details to create your secure Hatid account and serve you better nationwide.</p>
      <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl p-5 mb-6">
        <div className="flex items-center gap-5 border-b border-gray-100 pb-5 mb-5"><div className="relative group cursor-pointer active:scale-95 transition-transform"><div className="w-20 h-20 bg-blue-50 rounded-full flex flex-col items-center justify-center overflow-hidden border-2 border-blue-100 group-hover:border-blue-300 transition-colors"><div className="w-7 h-7 bg-blue-200 rounded-full mb-1" /><div className="w-12 h-8 bg-blue-200 rounded-t-full" /></div><button className="absolute bottom-0 right-0 bg-[#0033cc] text-white p-1.5 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform"><Camera size={14} /></button></div><div className="flex-1"><h3 className="font-bold text-gray-900 mb-1">Add a profile photo</h3><p className="text-xs text-gray-500 mb-3 leading-snug">Help drivers and others identify you easily.</p><button className="text-[#0033cc] text-xs font-bold border border-blue-200 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors active:scale-95">Add photo later</button></div></div>
        <div className="space-y-4">
          <label className="block text-xs font-bold text-gray-600 ml-1">Full name<input type="text" defaultValue="Maria Santos" className="mt-1.5 w-full border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 font-bold focus:border-[#0033cc] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" /></label>
          <label className="block text-xs font-bold text-gray-600 ml-1">Mobile number<input type="text" value={`+63 ${phoneNumber}`} className="mt-1.5 w-full border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 font-bold bg-gray-50/80 outline-none cursor-not-allowed" readOnly /></label>
          <label className="block text-xs font-bold text-gray-600 ml-1">Email address<input type="email" defaultValue="maria.santos@gmail.com" className="mt-1.5 w-full border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 font-bold focus:border-[#0033cc] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" /></label>
          <label className="block text-xs font-bold text-gray-600 ml-1">City / home base<input type="text" defaultValue="Quezon City" className="mt-1.5 w-full border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 font-bold focus:border-[#0033cc] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" /></label>
        </div>
      </div>
      <button onClick={onNext} className="w-full bg-[#0033cc] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-800 active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(0,51,204,0.25)] text-[15px]">Continue <ChevronRight size={18} strokeWidth={2.5} /></button>
    </div>
  </div>
);

const ScreenPermissions = ({ onNext }: { onNext: () => void }) => {
  const permissions = [
    { icon: MapPin, title: 'Location', desc: 'Used to set your pickup location, find nearby drivers, and track trips.' },
    { icon: Bell, title: 'Notifications', desc: 'Get real-time updates about your rides, promos, and important alerts.' },
    { icon: User, title: 'Contacts', desc: 'Easily add contacts for emergency and share trip details.' },
    { icon: Camera, title: 'Camera', desc: 'Take or upload photos for your profile and trip verification.' },
    { icon: Phone, title: 'Microphone', desc: 'Used for calls with your driver or support when needed.' },
  ];
  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto w-full hide-scrollbar animate-slide-up">
      <div className="px-6 py-6 pt-12 flex justify-center items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-50/50"><HatidLogo className="text-2xl scale-110" /></div>
      <div className="px-6 py-4 pb-6 text-center"><h1 className="text-3xl font-extrabold text-[#001144] mb-3 tracking-tight">Allow Permissions</h1><p className="text-gray-500 text-[15px] px-2 leading-relaxed font-medium">Hatid needs the following permissions to provide you a safe and reliable ride experience.</p></div>
      <div className="px-6 flex-1"><div className="space-y-3.5 mb-8">{permissions.map((permission) => <button key={permission.title} className="w-full text-left border border-gray-100 hover:border-blue-200 rounded-2xl p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] bg-white active:scale-[0.98] transition-all group"><div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-[#0033cc]"><permission.icon size={22} strokeWidth={2.5} /></div><div className="flex-1"><h3 className="font-bold text-[#001144] text-[15px] mb-0.5">{permission.title}</h3><p className="text-xs text-gray-500 leading-snug pr-2 font-medium">{permission.desc}</p></div><div className="text-[#0033cc] text-sm font-bold flex items-center">Allow <ChevronRight size={18} strokeWidth={2.5} /></div></button>)}</div></div>
      <div className="px-6 pb-12 space-y-3.5 bg-white"><button onClick={onNext} className="w-full bg-[#0033cc] text-white font-bold py-4 rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(0,51,204,0.25)] text-[15px]">Allow All Permissions</button><button onClick={onNext} className="w-full bg-white text-[#0033cc] font-bold py-3.5 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all text-[15px]">Maybe Later</button></div>
    </div>
  );
};

const ScreenHome = ({ onNavigate }: { onNavigate: Navigate }) => {
  const [activeTab, setActiveTab] = useState('home');
  return (
    <div className="flex flex-col h-full relative overflow-hidden w-full bg-[#f2f5f9] animate-slide-up">
      <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
      <div className="px-5 pt-[52px] pb-2 flex justify-between items-center relative z-10"><button className="bg-white p-3.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] text-gray-800 active:scale-90 transition-transform"><Menu size={22} strokeWidth={2.5} /></button><div className="bg-white px-5 py-2.5 rounded-[1.5rem] shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-center"><HatidLogo className="text-xl scale-[0.85] origin-center -my-1" /></div><button className="bg-white p-3.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] text-gray-800 relative active:scale-90 transition-transform"><Bell size={22} strokeWidth={2.5} /><div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" /></button></div>
      <div className="px-6 mt-4 flex justify-between items-start relative z-10"><div><p className="text-gray-500 font-extrabold text-[13px] mb-1.5 flex items-center gap-1">Hello, Maria! <span className="text-lg">👋</span></p><h2 className="text-[32px] font-extrabold text-[#001144] tracking-tight leading-[1.05]">Where are<br />you<br />going today?</h2></div><button className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.04)] active:scale-95 transition-transform mt-1"><Wallet size={24} className="text-[#0033cc]" strokeWidth={2} /><div className="text-right"><p className="text-[9px] text-gray-400 font-bold leading-none uppercase tracking-widest mb-1">Wallet</p><p className="text-[15px] font-extrabold text-[#0033cc] tracking-tight leading-none">₱250.00</p></div><ChevronRight size={16} className="text-gray-300" strokeWidth={3} /></button></div>
      <div className="mt-8 flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.05)] z-20 flex flex-col px-6 pt-5 pb-5 relative"><div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" /><button className="w-full bg-white border border-gray-100 shadow-[0_8px_25px_rgba(0,0,0,0.04)] rounded-3xl p-5 mb-5 relative text-left group" onClick={() => onNavigate('dropoff-search')}><div className="flex items-center gap-4 mb-4 relative z-10"><div className="w-3.5 h-3.5 rounded-full bg-[#0033cc] shadow-[0_0_0_3px_white,0_2px_5px_rgba(0,51,204,0.3)] z-10" /><span className="text-[#001144] font-extrabold text-[16px] flex-1">Where to?</span></div><div className="absolute left-[26px] top-9 bottom-9 w-[2px] border-l-[2px] border-dashed border-gray-200 z-0" /><div className="w-full h-[1px] bg-gray-100 ml-9 mb-4" /><div className="flex items-center gap-4 relative z-10"><MapPin className="text-red-500 fill-red-500 w-[22px] h-[22px] z-10 drop-shadow-sm -ml-[1px]" /><span className="text-gray-900 font-extrabold text-[16px] flex-1">Enter drop-off location</span></div></button><div className="flex justify-between gap-3 mb-5">{[['Home', Home, 'BGC, Taguig'], ['Work', Briefcase, 'Ortigas'], ['NAIA T3', Plane, 'Pasay City']].map(([label, Icon, sub]) => <button key={label as string} className="flex-1 flex flex-col justify-center items-center py-4 px-2 border border-gray-100 rounded-3xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] active:scale-95 transition-all"><Icon className="text-[#0033cc] fill-transparent mb-2" size={26} strokeWidth={2} /><span className="text-[13px] font-extrabold text-gray-900 mb-0.5">{label as string}</span><span className="text-[10px] text-gray-500 font-medium truncate w-full text-center px-1">{sub as string}</span></button>)}</div><button className="w-full bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] rounded-[1.25rem] p-4 flex items-center justify-between active:scale-[0.98] group transition-all"><div className="flex gap-4 items-center"><div className="bg-[#0033cc] text-white p-3 rounded-[14px] shadow-[0_4px_10px_rgba(0,51,204,0.2)]"><Shield size={20} strokeWidth={2.5} /></div><div className="text-left"><h4 className="font-extrabold text-[#001144] text-[13px] mb-0.5">Hatid is committed to your safety.</h4><p className="text-[#0033cc] text-[11px] font-bold">Learn more about our safety standards</p></div></div><ChevronRight size={18} className="text-[#0033cc]" strokeWidth={3} /></button></div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

const ScreenDropOffSearch = ({ onNavigate }: { onNavigate: Navigate }) => {
  const recentSearches = [
    { title: 'Ayala Triangle Gardens', desc: 'Paseo de Roxas St, Makati City', icon: Clock },
    { title: 'SM Mall of Asia', desc: 'Seaside Blvd, Pasay City', icon: Clock },
    { title: 'Robinsons Galleria', desc: 'Ortigas Ave, Quezon City', icon: Clock },
  ];
  return (
    <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up">
      <div className="px-5 py-4 pt-12 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-20"><div className="flex items-center gap-3"><button onClick={() => onNavigate('home')} className="p-1.5 rounded-full hover:bg-gray-100 active:scale-90 transition-all"><ChevronLeft size={24} className="text-gray-900" strokeWidth={2.5} /></button><h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Drop-off location</h1></div><SimpleLogo className="text-lg" /></div>
      <div className="px-5 py-3.5 bg-white z-20 shadow-[0_4px_15px_rgba(0,0,0,0.02)]"><div className="relative flex items-center group"><MapPin className="absolute left-4 text-red-500 fill-red-500 w-[22px] h-[22px]" /><input type="text" placeholder="Where are you going?" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-gray-900 font-bold focus:border-[#0033cc] focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none shadow-inner transition-all text-[15px]" /></div></div>
      <div className="flex-1 overflow-y-auto bg-white hide-scrollbar"><div className="h-44 relative overflow-hidden w-full bg-[#eef2f5] cursor-pointer group" onClick={() => onNavigate('dropoff-selected')}><MapBackground type="home" /><div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10 flex items-center justify-center"><div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white transform group-hover:scale-105 transition-all">Tap map to select via pin</div></div></div><div className="p-5"><div className="flex justify-between items-end mb-3.5"><h3 className="font-extrabold text-[15px] text-gray-900">Saved places</h3><button className="text-[#0033cc] text-xs font-bold hover:underline active:scale-95 transition-transform" onClick={() => onNavigate('saved-places')}>View all</button></div><div className="flex gap-3.5 mb-8 overflow-x-auto pb-2 hide-scrollbar"><button className="flex-1 flex flex-col justify-center items-center py-3 px-2 border border-gray-100 rounded-2xl bg-gray-50 min-w-[85px] shadow-sm"><Home className="text-[#0033cc] fill-[#0033cc]/10 mb-1.5" size={20} strokeWidth={2.5} /><span className="text-xs font-extrabold text-gray-900 mb-0.5">Home</span></button><button className="flex-1 flex flex-col justify-center items-center py-3 px-2 border border-gray-100 rounded-2xl bg-gray-50 min-w-[85px] shadow-sm"><Briefcase className="text-[#0033cc] fill-[#0033cc]/10 mb-1.5" size={20} strokeWidth={2.5} /><span className="text-xs font-extrabold text-gray-900 mb-0.5">Work</span></button><button className="flex flex-col justify-center items-center py-3 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-white min-w-[80px]"><Plus className="text-gray-400 mb-1" size={20} strokeWidth={2.5} /><span className="text-[11px] font-extrabold text-gray-500 mt-0.5">Add new</span></button></div><h3 className="font-extrabold text-[15px] text-gray-900 mb-2">Recent searches</h3>{recentSearches.map((item) => <button key={item.title} className="w-full flex items-center gap-4 py-3.5 border-b border-gray-50 text-left hover:bg-gray-50 active:bg-gray-100 rounded-xl px-2 -mx-2 transition-colors group" onClick={() => onNavigate('choose-ride')}><div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all shrink-0"><item.icon size={18} className="text-gray-500" strokeWidth={2.5} /></div><div className="flex-1 overflow-hidden"><h4 className="font-extrabold text-gray-900 text-[15px] mb-0.5 truncate">{item.title}</h4><p className="text-xs text-gray-500 font-medium truncate">{item.desc}</p></div></button>)}</div></div>
    </div>
  );
};

const ScreenDropOffSelected = ({ onNavigate }: { onNavigate: Navigate }) => (
  <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up">
    <div className="px-5 py-4 pt-12 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-gray-100"><div className="flex items-center gap-3"><button onClick={() => onNavigate('dropoff-search')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors active:scale-90"><ChevronLeft size={22} className="text-gray-900" strokeWidth={2.5} /></button><h1 className="text-lg font-extrabold text-gray-900">Drop-off location</h1></div><SimpleLogo className="text-lg" /></div>
    <div className="absolute top-[100px] left-5 right-5 z-30"><div className="relative flex items-center shadow-[0_8px_25px_rgba(0,51,204,0.15)] rounded-2xl bg-white border-2 border-[#0033cc] transform transition-all"><MapPin className="absolute left-4 text-red-500 fill-red-500 w-[22px] h-[22px] z-10 animate-bounce" /><input type="text" value="Ayala Triangle Gardens" readOnly className="w-full bg-transparent py-4 pl-12 pr-12 text-[#001144] font-extrabold text-[15px] outline-none cursor-default" /></div></div>
    <div className="flex-1 relative z-10"><MapBackground type="dropoff" /></div>
    <div className="bg-white rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] p-6 z-30 pb-10"><div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" /><div className="flex justify-between items-start mb-6"><div><h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Ayala Triangle Gardens</h2><p className="text-gray-500 text-sm font-medium leading-relaxed">Paseo de Roxas St cor Makati Ave, cor Ayala Ave, Makati</p></div></div><button onClick={() => onNavigate('choose-ride')} className="w-full bg-[#0033cc] text-white font-extrabold py-4 rounded-xl shadow-[0_8px_20px_rgba(0,51,204,0.3)] text-lg hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">Confirm Destination <ChevronRight size={20} strokeWidth={3} /></button></div>
  </div>
);

const ScreenChooseRide = ({ onNavigate }: { onNavigate: Navigate }) => {
  const rides = [
    { id: 'car', name: 'Hatid Car', cap: 4, desc: 'Affordable everyday rides', eta: '3 - 5 min', price: '₱212.00', img: 'https://img.icons8.com/color/96/000000/sedan.png' },
    { id: 'moto', name: 'Hatid Moto', cap: 1, desc: 'Beat traffic, faster arrivals', eta: '2 - 4 min', price: '₱138.00', img: 'https://img.icons8.com/color/96/000000/motorcycle.png' },
    { id: 'pool', name: 'Hatid Car Pool', cap: 4, desc: 'Share a ride, save more', eta: '5 - 8 min', price: '₱168.00', img: 'https://img.icons8.com/color/96/000000/minivan.png' },
  ];
  const [selectedRide, setSelectedRide] = useState('car');
  const activeRide = rides.find((ride) => ride.id === selectedRide) ?? rides[0];
  return (
    <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up"><div className="px-5 py-4 pt-12 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"><div className="flex items-center gap-3"><button onClick={() => onNavigate('dropoff-search')} className="p-1.5 rounded-full hover:bg-gray-100 active:scale-90 transition-all"><ChevronLeft size={24} className="text-gray-900" strokeWidth={2.5} /></button><h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Choose your ride</h1></div><SimpleLogo className="text-lg" /></div><div className="absolute top-[100px] left-5 right-5 bg-white rounded-3xl shadow-[0_12px_35px_rgba(0,0,0,0.1)] p-5 z-20 border border-gray-100/50 backdrop-blur-sm"><div className="relative pl-7"><div className="absolute left-1 top-2.5 bottom-4 w-0.5 border-l-2 border-dashed border-gray-300" /><div className="flex justify-between items-center mb-5 relative group cursor-pointer"><div className="absolute -left-[30px] w-4 h-4 rounded-full bg-white border-4 border-[#0033cc] shadow-[0_2px_5px_rgba(0,51,204,0.3)]" /><span className="text-[15px] font-extrabold text-gray-900 truncate pr-4">7th Ave, BGC, Taguig</span></div><div className="w-full h-[1px] bg-gray-100 mb-5" /><div className="flex justify-between items-center relative group cursor-pointer"><MapPin className="absolute -left-[35px] text-red-500 fill-red-500 w-[22px] h-[22px] drop-shadow-sm" /><span className="text-[15px] font-extrabold text-gray-900 truncate pr-4">Ayala Triangle Gardens</span></div></div></div><div className="h-44 relative shrink-0 z-10"><MapBackground type="route" /></div><div className="flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.08)] z-30 flex flex-col relative overflow-hidden -mt-6"><div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-20"><div className="flex items-start gap-3.5"><div className="bg-blue-50 p-2.5 rounded-full mt-0.5 text-[#0033cc] shadow-inner"><Tag size={20} className="fill-[#0033cc]/20" strokeWidth={2.5} /></div><div><h4 className="font-extrabold text-gray-900 text-sm mb-0.5">Fares are estimates</h4><p className="text-[11px] text-gray-500 font-medium leading-snug">Actual fare may vary due to traffic,<br />demand, and route.</p></div></div><div className="text-right"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Payment</p><button className="flex items-center gap-1.5 bg-[#e8f5e9] text-[#2e7d32] px-3.5 py-1.5 rounded-xl text-sm font-extrabold border border-[#c8e6c9] shadow-sm"><Wallet size={16} strokeWidth={2.5} />Cash <ChevronRight size={14} className="rotate-90 ml-0.5" strokeWidth={3} /></button></div></div><div className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5 hide-scrollbar bg-gray-50/30">{rides.map((ride) => <button key={ride.id} onClick={() => setSelectedRide(ride.id)} className={`w-full text-left flex items-center gap-4 p-4 rounded-[1.5rem] border-2 transition-all duration-200 active:scale-[0.98] ${selectedRide === ride.id ? 'border-[#0033cc] bg-blue-50/40 shadow-[0_8px_20px_rgba(0,51,204,0.08)]' : 'border-transparent bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md'}`}><div className="w-[72px] h-[52px] bg-transparent flex justify-center items-center relative"><img src={ride.img} className={`w-[72px] object-contain transition-transform duration-300 ${selectedRide === ride.id ? 'scale-110 drop-shadow-md' : 'drop-shadow-sm'}`} alt={ride.name} /></div><div className="flex-1"><div className="flex items-center gap-2 mb-1"><h3 className="font-extrabold text-[#001144] text-[16px] tracking-tight">{ride.name}</h3><div className="flex items-center bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 text-[10px] font-extrabold gap-1"><User size={10} strokeWidth={3} /> {ride.cap}</div></div><p className="text-xs text-gray-500 font-medium mb-1.5">{ride.desc}</p><p className="text-[11px] text-[#0033cc] font-extrabold bg-blue-50/80 inline-block px-2 py-0.5 rounded-md">ETA: {ride.eta}</p></div><div className="text-right flex flex-col items-end gap-3"><span className="font-extrabold text-gray-900 text-lg tracking-tight">{ride.price}</span><div className={`w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center transition-colors ${selectedRide === ride.id ? 'border-[#0033cc]' : 'border-gray-300'}`}><div className={`w-3 h-3 rounded-full bg-[#0033cc] transition-transform duration-200 ${selectedRide === ride.id ? 'scale-100' : 'scale-0'}`} /></div></div></button>)}</div><div className="px-6 py-5 border-t border-gray-100 bg-white"><button onClick={() => onNavigate('searching')} className="w-full bg-[#0033cc] text-white font-extrabold py-4 rounded-2xl shadow-[0_8px_25px_rgba(0,51,204,0.3)] text-lg flex justify-between px-6 items-center hover:bg-blue-800 active:scale-[0.98] transition-all relative overflow-hidden group"><span className="relative z-10">Confirm {activeRide.name}</span><span className="relative z-10 tracking-tight">{activeRide.price}</span></button></div></div></div>
  );
};

const ScreenSearching = ({ onNavigate }: { onNavigate: Navigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => onNavigate('driver-assigned'), 2500);
    return () => clearTimeout(timer);
  }, [onNavigate]);
  return <div className="h-full flex flex-col items-center justify-center bg-[#f2f5f9] p-8 text-center animate-fade-in relative overflow-hidden"><div className="absolute top-[52px] w-full text-center z-20"><SimpleLogo className="justify-center scale-90 opacity-60" /></div><div className="relative w-40 h-40 mb-10 flex items-center justify-center z-10"><div className="absolute inset-0 border-[3px] border-[#0033cc]/30 rounded-full animate-ping shadow-[0_0_20px_rgba(0,51,204,0.2)]" /><div className="absolute inset-6 border-[3px] border-[#0033cc]/60 rounded-full animate-ping delay-300 shadow-[0_0_20px_rgba(0,51,204,0.3)]" /><div className="absolute inset-12 bg-white rounded-full flex items-center justify-center shadow-2xl z-10"><img src="https://img.icons8.com/color/96/000000/sedan.png" className="w-12" alt="Car" /></div></div><h2 className="text-[26px] font-extrabold text-[#001144] mb-3 tracking-tight z-10">Finding a driver</h2><p className="text-gray-500 font-medium px-4 leading-relaxed z-10">Matching you with the nearest Hatid driver for your ride to Ayala Triangle.</p></div>;
};

const ScreenDriverAssigned = ({ onNavigate }: { onNavigate: Navigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => onNavigate('active-trip'), 3000);
    return () => clearTimeout(timer);
  }, [onNavigate]);
  return <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up"><div className="h-1/2 relative z-10 bg-[#eef2f5] overflow-hidden"><MapBackground type="route" /></div><div className="flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] p-6 z-30 pb-10 flex flex-col -mt-8 relative"><div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" /><div className="flex justify-between items-start mb-6"><div><h2 className="text-[26px] font-extrabold text-[#001144] tracking-tight mb-1">Driver arriving</h2><p className="text-[#0033cc] font-bold text-lg animate-pulse">in 3 mins</p></div><div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-center mt-1"><p className="font-extrabold text-gray-900 text-lg tracking-widest leading-none">ABC 1234</p><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Plate No.</p></div></div><div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-3xl p-4 mb-6 shadow-sm"><div className="relative"><div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center"><User className="text-gray-400" size={32} /></div><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-2 py-0.5 flex items-center shadow-sm text-[10px] font-bold border border-gray-100">4.9 <Star size={10} className="text-yellow-400 fill-yellow-400 ml-0.5" /></div></div><div className="flex-1"><h3 className="font-extrabold text-[#001144] text-[16px]">Juan Dela Cruz</h3><p className="text-gray-500 text-xs font-medium mt-0.5">Toyota Vios - Silver</p></div><div className="flex gap-2"><button className="bg-blue-50 text-[#0033cc] p-3 rounded-full shadow-sm active:scale-95 transition-transform"><MessageSquare size={18} fill="currentColor" /></button><button className="bg-blue-50 text-[#0033cc] p-3 rounded-full shadow-sm active:scale-95 transition-transform"><Phone size={18} fill="currentColor" /></button></div></div><button onClick={() => onNavigate('active-trip')} className="w-full bg-[#0033cc] text-white font-extrabold py-4 rounded-xl shadow-[0_8px_20px_rgba(0,51,204,0.3)] text-[16px] hover:bg-blue-800 transition-colors mt-auto">Continue Demo</button></div></div>;
};

const ScreenActiveTrip = ({ onNavigate }: { onNavigate: Navigate }) => <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up"><div className="absolute top-[52px] left-5 right-5 bg-white rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.06)] p-4 z-20 flex justify-between items-center border border-gray-100"><div><h3 className="font-extrabold text-[#001144] text-[16px]">On the way to destination</h3><p className="text-[#0033cc] font-bold text-[13px] mt-0.5">Arrival at 10:24 AM</p></div><div className="bg-blue-50 p-2.5 rounded-full"><Shield className="text-[#0033cc]" size={22} strokeWidth={2.5} /></div></div><div className="flex-1 relative z-10 bg-[#eef2f5] overflow-hidden"><MapBackground type="active" /></div><div className="bg-white rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] z-30 flex flex-col p-6 pb-8 relative -mt-8"><div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" /><div className="flex justify-between items-center mb-5"><div className="flex items-center gap-4"><div className="relative"><div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center"><User className="text-gray-400" size={32} /></div><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-2 py-0.5 flex items-center shadow-sm text-[10px] font-bold border border-gray-100">4.9 <Star size={10} className="text-yellow-400 fill-yellow-400 ml-0.5" /></div></div><div><h3 className="font-extrabold text-[#001144] text-[16px]">Juan Dela Cruz</h3><p className="text-gray-500 text-xs font-medium mt-0.5">Toyota Vios - Silver</p></div></div><div className="bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1 text-center"><p className="font-extrabold text-gray-900 text-sm tracking-widest">ABC 1234</p></div></div><div className="flex gap-3 mb-6"><div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl flex items-center px-4 py-3 focus-within:border-[#0033cc] transition-colors shadow-inner"><input type="text" placeholder="Message Juan..." className="bg-transparent w-full outline-none text-sm font-bold text-gray-800 placeholder-gray-400" /></div><button className="bg-blue-50 text-[#0033cc] p-3.5 rounded-2xl shadow-sm active:scale-95 transition-transform"><Phone size={20} fill="currentColor" /></button></div><button className="w-full border border-gray-200 rounded-2xl py-4 mb-3 font-extrabold text-gray-700 hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 active:scale-[0.98]">Share trip details <ChevronRight size={18} strokeWidth={3} /></button><button className="w-full bg-red-50 text-red-600 rounded-2xl py-4 font-extrabold hover:bg-red-100 transition-colors flex justify-center items-center gap-2 active:scale-[0.98]"><Shield size={18} fill="currentColor" /> Emergency Assistance</button><button onClick={() => onNavigate('trip-completed')} className="mt-5 text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors mx-auto uppercase tracking-widest">Simulate Drop-off</button></div></div>;

const ScreenTripCompleted = ({ onNavigate }: { onNavigate: Navigate }) => {
  const [rating, setRating] = useState(0);
  return <div className="flex flex-col h-full bg-[#f2f5f9] animate-fade-in relative w-full overflow-hidden z-50"><div className="absolute inset-0 bg-[#eef2f5] overflow-hidden opacity-50 z-0 pointer-events-none" /><div className="absolute inset-0 bg-black/40 z-10 transition-opacity" /><div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-20 p-6 pb-10 flex flex-col items-center animate-slide-up shadow-[0_-20px_50px_rgba(0,0,0,0.2)]"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg -mt-12"><CheckCircle2 size={36} className="text-green-500 fill-green-500/20" strokeWidth={2.5} /></div><h2 className="text-[28px] font-extrabold text-[#001144] mb-1 tracking-tight">You have arrived!</h2><p className="text-gray-500 text-[15px] font-medium mb-6">Hope you enjoyed your Hatid ride.</p><div className="w-full bg-gray-50 rounded-3xl p-5 mb-8 border border-gray-100 shadow-inner"><div className="flex justify-between items-center mb-4"><span className="text-gray-500 font-bold text-[15px]">Total Fare</span><span className="text-3xl font-extrabold text-[#001144] tracking-tight">₱212.00</span></div><div className="w-full border-t-2 border-dashed border-gray-200 mb-4" /><div className="flex justify-between items-center"><span className="text-gray-500 font-bold text-[15px]">Payment Method</span><div className="flex items-center gap-2 font-extrabold text-[#2e7d32] bg-[#e8f5e9] px-3 py-1.5 rounded-lg border border-[#c8e6c9]"><Wallet size={16} strokeWidth={2.5} /> Cash</div></div></div><h3 className="font-extrabold text-[#001144] mb-4 text-[16px]">How was your ride with Juan?</h3><div className="flex gap-2.5 mb-8">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={42} onClick={() => setRating(star)} className={`cursor-pointer transition-all active:scale-90 ${star <= rating ? 'text-yellow-400 fill-yellow-400 drop-shadow-md scale-110' : 'text-gray-300 fill-gray-100 hover:scale-105'}`} strokeWidth={1.5} />)}</div><div className="flex flex-wrap justify-center gap-2 mb-8">{['Clean car', 'Smooth driving', 'Friendly', 'Great music', 'Polite'].map((tag) => <span key={tag} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-[#0033cc] hover:text-[#0033cc] hover:bg-blue-50 cursor-pointer transition-all shadow-sm active:scale-95">{tag}</span>)}</div><button onClick={() => onNavigate('home')} className="w-full bg-[#0033cc] text-white py-4 rounded-2xl font-extrabold shadow-[0_8px_20px_rgba(0,51,204,0.3)] hover:bg-blue-800 transition-colors text-[16px] active:scale-[0.98]">Submit & Continue</button></div></div>;
};

const ScreenSavedPlaces = ({ onNavigate }: { onNavigate: Navigate }) => (
  <div className="h-full bg-white px-6 pt-14 animate-slide-up">
    <button onClick={() => onNavigate('dropoff-search')} className="mb-6 p-2 bg-gray-50 rounded-full"><ChevronLeft size={22} /></button>
    <h1 className="text-3xl font-extrabold text-[#001144] mb-2">Saved places</h1>
    <p className="text-gray-500 font-medium mb-6">Supabase-backed saved places will be implemented through the approved service layer. This baseline keeps visual behavior only.</p>
    {['Home · BGC, Taguig', 'Work · Ortigas', 'NAIA T3 · Pasay City'].map((place) => <button key={place} onClick={() => onNavigate('choose-ride')} className="w-full text-left border border-gray-100 rounded-2xl p-4 mb-3 font-extrabold text-gray-900 shadow-sm">{place}</button>)}
  </div>
);

export default function HatidCanonicalUiPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [phoneNumber, setPhoneNumber] = useState('968 184 1001');

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4 font-sans selection:bg-blue-200">
      <div className="w-full max-w-[400px] h-[850px] max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border-[10px] border-gray-800 ring-4 ring-gray-700/50 flex flex-col">
        <DemoBadge />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-[28px] bg-gray-800 rounded-b-[20px] z-[100] flex justify-center items-center gap-3"><div className="w-14 h-1.5 bg-black/40 rounded-full" /><div className="w-2.5 h-2.5 bg-black/50 rounded-full border border-gray-900" /></div>
        <div className="flex-1 bg-white relative overflow-hidden">
          {currentScreen === 'splash' && <ScreenSplash onNext={() => setCurrentScreen('login')} />}
          {currentScreen === 'login' && <ScreenLogin onNext={() => setCurrentScreen('otp')} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />}
          {currentScreen === 'otp' && <ScreenOTP onNext={() => setCurrentScreen('profile')} onBack={() => setCurrentScreen('login')} phoneNumber={phoneNumber} />}
          {currentScreen === 'profile' && <ScreenProfileSetup onNext={() => setCurrentScreen('permissions')} phoneNumber={phoneNumber} />}
          {currentScreen === 'permissions' && <ScreenPermissions onNext={() => setCurrentScreen('home')} />}
          {currentScreen === 'home' && <ScreenHome onNavigate={setCurrentScreen} />}
          {currentScreen === 'dropoff-search' && <ScreenDropOffSearch onNavigate={setCurrentScreen} />}
          {currentScreen === 'dropoff-selected' && <ScreenDropOffSelected onNavigate={setCurrentScreen} />}
          {currentScreen === 'saved-places' && <ScreenSavedPlaces onNavigate={setCurrentScreen} />}
          {currentScreen === 'choose-ride' && <ScreenChooseRide onNavigate={setCurrentScreen} />}
          {currentScreen === 'searching' && <ScreenSearching onNavigate={setCurrentScreen} />}
          {currentScreen === 'driver-assigned' && <ScreenDriverAssigned onNavigate={setCurrentScreen} />}
          {currentScreen === 'active-trip' && <ScreenActiveTrip onNavigate={setCurrentScreen} />}
          {currentScreen === 'trip-completed' && <ScreenTripCompleted onNavigate={setCurrentScreen} />}
        </div>
        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-36 h-1.5 bg-gray-300 rounded-full z-[100]" />
      </div>
    </div>
  );
}
