'use client';

import { useState } from 'react';
import {
  Bell,
  Briefcase,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Plane,
  Shield,
  Star,
  Tag,
  User,
  Wallet,
} from 'lucide-react';

type Screen =
  | 'splash'
  | 'login'
  | 'otp'
  | 'profile'
  | 'permissions'
  | 'home'
  | 'dropoff-search'
  | 'dropoff-selected'
  | 'choose-ride'
  | 'searching'
  | 'driver-assigned'
  | 'active-trip'
  | 'trip-completed';

type Navigate = (screen: Screen) => void;

const HatidLogo = ({ small = false }: { small?: boolean }) => (
  <div className="flex items-center font-bold italic tracking-tight">
    <div className="relative flex items-center justify-center">
      <div className={`${small ? 'text-[28px]' : 'text-[36px]'} h-8 flex items-center -skew-x-12 text-[#0033cc]`}>
        H
      </div>
      <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
      <div className="absolute w-full h-[3px] bg-red-500 bottom-0.5 -skew-x-12 opacity-90 shadow-sm" />
    </div>
    <div className="flex flex-col justify-center leading-none ml-0.5">
      <span className={`${small ? 'text-[22px]' : 'text-[28px]'} text-[#0033cc] mt-1 tracking-tighter uppercase`}>
        ATID
      </span>
      {!small && (
        <span className="text-[6px] text-gray-500 font-normal not-italic tracking-[0.15em] uppercase mt-[3px]">
          Biyahe natin. Bansa natin.
        </span>
      )}
    </div>
  </div>
);

const MapBackground = ({ type = 'home' }: { type?: 'home' | 'route' | 'dropoff' | 'active' }) => (
  <div className="absolute inset-0 bg-[#eef2f5] overflow-hidden -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5" />
    <div className="absolute top-[30%] left-[-20%] w-[150%] h-8 bg-white/80 rotate-12 shadow-sm rounded-full" />
    <div className="absolute top-[50%] left-[-20%] w-[150%] h-12 bg-white/80 -rotate-[15deg] shadow-sm rounded-full" />
    <div className="absolute top-[20%] right-10 w-24 h-48 bg-[#d4ebd4]/60 rounded-2xl" />
    <div className="absolute bottom-[40%] left-10 w-32 h-32 bg-[#d4ebd4]/60 rounded-full blur-[2px]" />
    <span className="absolute top-[32%] left-[40%] text-[10px] text-gray-500 font-medium rotate-12">Kalayaan Ave</span>
    <span className="absolute top-[52%] left-[20%] text-[10px] text-gray-500 font-medium -rotate-[15deg]">C-5</span>
    <span className="absolute top-[25%] left-[60%] text-xs text-gray-400 font-bold uppercase tracking-wider">BGC</span>
    {type === 'home' && (
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 animate-slide-up">
        <div className="bg-[#0033cc] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg mb-2.5 relative">
          You are here
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#0033cc] rotate-45 rounded-sm" />
        </div>
        <div className="w-20 h-20 bg-blue-500/15 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-10 h-10 bg-blue-500/25 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#0033cc] rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,51,204,0.6)]" />
          </div>
        </div>
      </div>
    )}
    {(type === 'route' || type === 'active') && (
      <div className="absolute inset-0 z-10 animate-slide-up">
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          <path d="M 120,380 L 180,320 L 220,360 L 280,280 L 320,290" stroke="rgba(0,51,204,0.2)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 120,380 L 180,320 L 220,360 L 280,280 L 320,290" stroke="#0033cc" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="absolute top-[370px] left-[110px] w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
        </div>
        <div className="absolute top-[280px] left-[300px] w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
          <div className="w-4 h-4 bg-[#0033cc] border-2 border-white rounded-full shadow-sm" />
        </div>
      </div>
    )}
    {type === 'dropoff' && (
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 animate-slide-up">
        <div className="bg-white border border-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-xl shadow-lg mb-2">
          Use this location
        </div>
        <MapPin className="text-red-500 fill-red-500 w-11 h-11 drop-shadow-[0_8px_8px_rgba(239,68,68,0.3)] animate-bounce" />
      </div>
    )}
    <button className="absolute right-4 bottom-[340px] bg-white/95 p-3.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] z-10 text-gray-700 active:scale-90 transition-transform">
      <Navigation size={22} strokeWidth={2.5} />
    </button>
  </div>
);

const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4 font-sans selection:bg-blue-200">
    <div className="w-full max-w-[400px] h-[850px] max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border-[10px] border-gray-800 ring-4 ring-gray-700/50 flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[28px] bg-gray-800 rounded-b-[20px] z-[100] flex justify-center items-center gap-3">
        <div className="w-14 h-1.5 bg-black/40 rounded-full" />
        <div className="w-2.5 h-2.5 bg-black/50 rounded-full border border-gray-900" />
      </div>
      <div className="absolute top-10 left-5 z-[110] rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold px-3 py-1 shadow-sm">
        CANONICAL UI BASELINE
      </div>
      <div className="flex-1 bg-white relative overflow-hidden">{children}</div>
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-gray-300 rounded-full z-[100]" />
    </div>
  </div>
);

const Splash = ({ onNext }: { onNext: () => void }) => (
  <button onClick={onNext} className="h-full w-full flex flex-col items-center justify-center bg-white animate-fade-in relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#0033cc] rounded-full blur-[80px] opacity-20" />
    <HatidLogo />
  </button>
);

const Login = ({ onNext, phone, setPhone }: { onNext: () => void; phone: string; setPhone: (value: string) => void }) => (
  <div className="h-full bg-white flex flex-col px-6 pt-20 animate-slide-up">
    <HatidLogo />
    <h1 className="text-[32px] font-extrabold text-[#001144] tracking-tight leading-[1.1] mt-8 mb-3">What&apos;s your<br />number?</h1>
    <p className="text-gray-500 mb-8 font-medium text-[15px]">We&apos;ll text you a code to verify your phone.</p>
    <div className="flex border-2 border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#0033cc] focus-within:ring-4 focus-within:ring-blue-500/10 transition-all mb-8 shadow-sm">
      <div className="bg-gray-50 px-4 py-4 flex items-center border-r border-gray-200 font-extrabold text-gray-700">🇵🇭 +63</div>
      <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="9XX XXX XXXX" className="w-full px-4 py-4 outline-none font-bold text-gray-900 text-lg bg-transparent" />
    </div>
    <button onClick={onNext} className="w-full bg-[#0033cc] text-white font-extrabold py-4 rounded-2xl shadow-[0_8px_20px_rgba(0,51,204,0.25)] active:scale-[0.98] transition-all text-[16px] flex justify-center items-center gap-2">
      Continue <ChevronRight size={20} strokeWidth={3} />
    </button>
    <p className="mt-auto pb-10 text-center text-xs text-gray-400 font-medium leading-relaxed">
      By continuing, you agree to Hatid&apos;s <br /><span className="text-[#0033cc] font-bold">Terms of Service</span> and <span className="text-[#0033cc] font-bold">Privacy Policy</span>.
    </p>
  </div>
);

const Otp = ({ onNext, onBack, phone }: { onNext: () => void; onBack: () => void; phone: string }) => (
  <div className="h-full bg-white flex flex-col px-6 pt-20 animate-slide-up relative">
    <button onClick={onBack} className="absolute top-12 left-5 p-2 bg-gray-50 rounded-full text-gray-600 active:scale-90 transition-transform">
      <ChevronLeft size={22} strokeWidth={2.5} />
    </button>
    <h1 className="text-[32px] font-extrabold text-[#001144] tracking-tight leading-[1.1] mb-3 mt-4">Enter code</h1>
    <p className="text-gray-500 mb-8 font-medium text-[15px]">A 6-digit code was sent to <span className="font-bold text-gray-900">+63 {phone}</span></p>
    <div className="flex gap-2.5 mb-8 justify-between">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <input key={item} type="text" maxLength={1} className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-extrabold text-[#001144] focus:border-[#0033cc] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm" />
      ))}
    </div>
    <button onClick={onNext} className="w-full bg-[#0033cc] text-white font-extrabold py-4 rounded-2xl shadow-[0_8px_20px_rgba(0,51,204,0.25)] active:scale-[0.98] transition-all text-[16px]">
      Verify & Continue
    </button>
  </div>
);

const Profile = ({ onNext, phone }: { onNext: () => void; phone: string }) => (
  <div className="h-full bg-white overflow-y-auto px-6 pt-14 pb-8 animate-slide-up">
    <div className="flex justify-between items-center mb-6"><HatidLogo small /><div className="bg-blue-50 text-[#0033cc] text-[11px] font-bold px-3 py-1.5 rounded-full">Step 1 of 3</div></div>
    <h1 className="text-3xl font-extrabold text-gray-900 mb-2.5 tracking-tight">Set up your profile</h1>
    <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">We need a few basic details to create your secure Hatid account.</p>
    <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl p-5 mb-6">
      <div className="flex items-center gap-5 border-b border-gray-100 pb-5 mb-5">
        <div className="relative"><div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-100"><User className="text-blue-200" size={42} /></div><button className="absolute bottom-0 right-0 bg-[#0033cc] text-white p-1.5 rounded-full border-2 border-white shadow-md"><Camera size={14} /></button></div>
        <div><h3 className="font-bold text-gray-900 mb-1">Add a profile photo</h3><p className="text-xs text-gray-500 leading-snug">Help drivers identify you easily.</p></div>
      </div>
      <div className="space-y-4">
        <input defaultValue="Maria Santos" className="w-full border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 font-bold focus:border-[#0033cc] outline-none" />
        <input value={`+63 ${phone}`} readOnly className="w-full border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 font-bold bg-gray-50" />
        <input defaultValue="maria.santos@gmail.com" className="w-full border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 font-bold focus:border-[#0033cc] outline-none" />
        <input defaultValue="Quezon City" className="w-full border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 font-bold focus:border-[#0033cc] outline-none" />
      </div>
    </div>
    <button onClick={onNext} className="w-full bg-[#0033cc] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(0,51,204,0.25)]">Continue <ChevronRight size={18} strokeWidth={2.5} /></button>
  </div>
);

const Permissions = ({ onNext }: { onNext: () => void }) => (
  <div className="h-full bg-white overflow-y-auto px-6 pt-14 pb-10 animate-slide-up">
    <div className="flex justify-center mb-8"><HatidLogo /></div>
    <h1 className="text-3xl font-extrabold text-[#001144] mb-3 text-center tracking-tight">Allow Permissions</h1>
    <p className="text-gray-500 text-[15px] text-center leading-relaxed font-medium mb-8">Hatid needs these permissions to provide a safe and reliable ride experience.</p>
    {[
      ['Location', MapPin],
      ['Notifications', Bell],
      ['Contacts', User],
      ['Camera', Camera],
      ['Microphone', Phone],
    ].map(([label, Icon]) => (
      <button key={label as string} className="w-full text-left border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm bg-white active:scale-[0.98] transition-all mb-3">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0033cc]"><Icon size={22} strokeWidth={2.5} /></div>
        <div className="flex-1"><h3 className="font-bold text-[#001144] text-[15px]">{label as string}</h3><p className="text-xs text-gray-500">Required for trip safety and app reliability.</p></div>
        <ChevronRight className="text-[#0033cc]" size={18} />
      </button>
    ))}
    <button onClick={onNext} className="w-full mt-4 bg-[#0033cc] text-white font-bold py-4 rounded-xl shadow-[0_4px_15px_rgba(0,51,204,0.25)]">Allow All Permissions</button>
  </div>
);

const HomeScreen = ({ onNavigate }: { onNavigate: Navigate }) => (
  <div className="flex flex-col h-full relative overflow-hidden w-full bg-[#f2f5f9] animate-slide-up">
    <div className="px-5 pt-[52px] pb-2 flex justify-between items-center relative z-10">
      <button className="bg-white p-3.5 rounded-full shadow-sm text-gray-800"><Menu size={22} strokeWidth={2.5} /></button>
      <div className="bg-white px-5 py-2.5 rounded-[1.5rem] shadow-sm"><HatidLogo small /></div>
      <button className="bg-white p-3.5 rounded-full shadow-sm text-gray-800 relative"><Bell size={22} strokeWidth={2.5} /><div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" /></button>
    </div>
    <div className="px-6 mt-4 flex justify-between items-start relative z-10"><div><p className="text-gray-500 font-extrabold text-[13px] mb-1.5">Hello, Maria! 👋</p><h2 className="text-[32px] font-extrabold text-[#001144] tracking-tight leading-[1.05]">Where are<br />you<br />going today?</h2></div><button className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm mt-1"><Wallet size={24} className="text-[#0033cc]" /><div className="text-right"><p className="text-[9px] text-gray-400 font-bold uppercase">Wallet</p><p className="text-[15px] font-extrabold text-[#0033cc]">₱250.00</p></div></button></div>
    <div className="mt-8 flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.05)] z-20 flex flex-col px-6 pt-5 pb-24 relative">
      <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
      <button onClick={() => onNavigate('dropoff-search')} className="w-full bg-white border border-gray-100 shadow-[0_8px_25px_rgba(0,0,0,0.04)] rounded-3xl p-5 mb-5 relative text-left">
        <div className="flex items-center gap-4 mb-4"><div className="w-3.5 h-3.5 rounded-full bg-[#0033cc]" /><span className="text-[#001144] font-extrabold text-[16px]">Where to?</span></div>
        <div className="h-px bg-gray-100 ml-9 mb-4" />
        <div className="flex items-center gap-4"><MapPin className="text-red-500 fill-red-500 w-[22px] h-[22px]" /><span className="text-gray-900 font-extrabold text-[16px]">Enter drop-off location</span></div>
      </button>
      <div className="flex gap-3 mb-5">{[['Home', Home, 'BGC, Taguig'], ['Work', Briefcase, 'Ortigas'], ['NAIA T3', Plane, 'Pasay City']].map(([label, Icon, sub]) => <button key={label as string} className="flex-1 flex flex-col items-center py-4 px-2 border border-gray-100 rounded-3xl bg-white shadow-sm"><Icon className="text-[#0033cc] mb-2" size={26} /><span className="text-[13px] font-extrabold text-gray-900">{label as string}</span><span className="text-[10px] text-gray-500 truncate">{sub as string}</span></button>)}</div>
      <button className="w-full bg-white border border-gray-100 rounded-[1.25rem] p-4 flex items-center justify-between shadow-sm"><div className="flex gap-4 items-center"><div className="bg-[#0033cc] text-white p-3 rounded-[14px]"><Shield size={20} /></div><div className="text-left"><h4 className="font-extrabold text-[#001144] text-[13px]">Hatid is committed to your safety.</h4><p className="text-[#0033cc] text-[11px] font-bold">Learn more about safety standards</p></div></div><ChevronRight className="text-[#0033cc]" size={18} /></button>
    </div>
  </div>
);

const DropoffSearch = ({ onNavigate }: { onNavigate: Navigate }) => (
  <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up">
    <div className="px-5 py-4 pt-12 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/95 z-20"><div className="flex items-center gap-3"><button onClick={() => onNavigate('home')} className="p-1.5 rounded-full hover:bg-gray-100"><ChevronLeft size={24} /></button><h1 className="text-xl font-extrabold text-gray-900">Drop-off location</h1></div><HatidLogo small /></div>
    <div className="px-5 py-3.5 bg-white z-20"><div className="relative flex items-center"><MapPin className="absolute left-4 text-red-500 fill-red-500 w-[22px] h-[22px]" /><input placeholder="Where are you going?" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-gray-900 font-bold focus:border-[#0033cc] outline-none text-[15px]" /></div></div>
    <div className="flex-1 overflow-y-auto bg-white"><div className="h-44 relative overflow-hidden w-full bg-[#eef2f5] cursor-pointer" onClick={() => onNavigate('dropoff-selected')}><MapBackground type="home" /><div className="absolute inset-0 bg-black/5 z-10 flex items-center justify-center"><div className="bg-white/90 px-5 py-2.5 rounded-full text-sm font-bold text-gray-800 shadow-sm">Tap map to select via pin</div></div></div><div className="p-5"><h3 className="font-extrabold text-[15px] text-gray-900 mb-3">Recent searches</h3>{['Ayala Triangle Gardens', 'SM Mall of Asia', 'Robinsons Galleria'].map((place) => <button key={place} onClick={() => onNavigate('choose-ride')} className="w-full flex items-center gap-4 py-3.5 border-b border-gray-50 text-left"><div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><Clock size={18} className="text-gray-500" /></div><div><h4 className="font-extrabold text-gray-900 text-[15px]">{place}</h4><p className="text-xs text-gray-500 font-medium">Metro Manila, Philippines</p></div></button>)}</div></div>
  </div>
);

const DropoffSelected = ({ onNavigate }: { onNavigate: Navigate }) => (
  <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up">
    <div className="px-5 py-4 pt-12 flex items-center justify-between sticky top-0 bg-white/95 z-30 border-b border-gray-100"><button onClick={() => onNavigate('dropoff-search')} className="p-2 bg-gray-50 rounded-full"><ChevronLeft size={22} /></button><h1 className="text-lg font-extrabold text-gray-900">Drop-off location</h1><HatidLogo small /></div>
    <div className="absolute top-[100px] left-5 right-5 z-30"><div className="relative flex items-center shadow-[0_8px_25px_rgba(0,51,204,0.15)] rounded-2xl bg-white border-2 border-[#0033cc]"><MapPin className="absolute left-4 text-red-500 fill-red-500 w-[22px] h-[22px]" /><input value="Ayala Triangle Gardens" readOnly className="w-full bg-transparent py-4 pl-12 pr-12 text-[#001144] font-extrabold text-[15px] outline-none" /></div></div>
    <div className="flex-1 relative"><MapBackground type="dropoff" /></div>
    <div className="bg-white rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] p-6 z-30 pb-10"><div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" /><h2 className="text-2xl font-extrabold text-gray-900 mb-1">Ayala Triangle Gardens</h2><p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">Paseo de Roxas St cor Makati Ave, Makati</p><button onClick={() => onNavigate('choose-ride')} className="w-full bg-[#0033cc] text-white font-extrabold py-4 rounded-xl shadow-[0_8px_20px_rgba(0,51,204,0.3)] text-lg flex items-center justify-center gap-2">Confirm Destination <ChevronRight size={20} /></button></div>
  </div>
);

const ChooseRide = ({ onNavigate }: { onNavigate: Navigate }) => {
  const rides = [
    ['Hatid Car', 'Affordable everyday rides', '₱212.00', '3 - 5 min'],
    ['Hatid Moto', 'Beat traffic, faster arrivals', '₱138.00', '2 - 4 min'],
    ['Hatid Car Pool', 'Share a ride, save more', '₱168.00', '5 - 8 min'],
  ];
  const [selected, setSelected] = useState(0);
  return (
    <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up">
      <div className="px-5 py-4 pt-12 flex items-center gap-3 bg-white z-30"><button onClick={() => onNavigate('dropoff-search')}><ChevronLeft size={24} /></button><h1 className="text-xl font-extrabold text-gray-900">Choose your ride</h1></div>
      <div className="h-44 relative shrink-0"><MapBackground type="route" /></div>
      <div className="flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.08)] z-30 flex flex-col -mt-6 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center"><div className="flex gap-3"><div className="bg-blue-50 p-2.5 rounded-full text-[#0033cc]"><Tag size={20} /></div><div><h4 className="font-extrabold text-gray-900 text-sm">Fares are estimates</h4><p className="text-[11px] text-gray-500">Actual fare may vary due to traffic.</p></div></div><div className="text-right"><p className="text-[10px] text-gray-400 font-bold uppercase">Payment</p><div className="flex items-center gap-1.5 bg-[#e8f5e9] text-[#2e7d32] px-3.5 py-1.5 rounded-xl text-sm font-extrabold"><Wallet size={16} /> Cash</div></div></div>
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5 bg-gray-50/30">{rides.map(([name, desc, price, eta], index) => <button key={name} onClick={() => setSelected(index)} className={`w-full text-left flex items-center gap-4 p-4 rounded-[1.5rem] border-2 transition-all ${selected === index ? 'border-[#0033cc] bg-blue-50/40' : 'border-transparent bg-white shadow-sm'}`}><div className="w-[72px] h-[52px] flex justify-center items-center"><span className="text-4xl">🚗</span></div><div className="flex-1"><h3 className="font-extrabold text-[#001144] text-[16px]">{name}</h3><p className="text-xs text-gray-500 font-medium">{desc}</p><p className="text-[11px] text-[#0033cc] font-extrabold bg-blue-50 inline-block px-2 py-0.5 rounded-md">ETA: {eta}</p></div><span className="font-extrabold text-gray-900 text-lg">{price}</span></button>)}</div>
        <div className="px-6 py-5 border-t border-gray-100"><button onClick={() => onNavigate('searching')} className="w-full bg-[#0033cc] text-white font-extrabold py-4 rounded-2xl shadow-[0_8px_25px_rgba(0,51,204,0.3)] text-lg flex justify-between px-6 items-center"><span>Confirm {rides[selected][0]}</span><span>{rides[selected][2]}</span></button></div>
      </div>
    </div>
  );
};

const Searching = ({ onNavigate }: { onNavigate: Navigate }) => (
  <div className="h-full flex flex-col items-center justify-center bg-[#f2f5f9] p-8 text-center animate-fade-in relative overflow-hidden">
    <HatidLogo small />
    <div className="relative w-40 h-40 my-10 flex items-center justify-center"><div className="absolute inset-0 border-[3px] border-[#0033cc]/30 rounded-full animate-ping" /><div className="absolute inset-12 bg-white rounded-full flex items-center justify-center shadow-2xl z-10 text-4xl">🚗</div></div>
    <h2 className="text-[26px] font-extrabold text-[#001144] mb-3">Finding a driver</h2>
    <p className="text-gray-500 font-medium px-4 leading-relaxed mb-8">Matching you with the nearest Hatid driver.</p>
    <button onClick={() => onNavigate('driver-assigned')} className="text-[#0033cc] font-extrabold">Continue Demo</button>
  </div>
);

const DriverAssigned = ({ onNavigate }: { onNavigate: Navigate }) => (
  <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up"><div className="h-1/2 relative z-10 bg-[#eef2f5]"><MapBackground type="route" /></div><div className="flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] p-6 z-30 pb-10 flex flex-col -mt-8"><div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" /><div className="flex justify-between items-start mb-6"><div><h2 className="text-[26px] font-extrabold text-[#001144]">Driver arriving</h2><p className="text-[#0033cc] font-bold text-lg animate-pulse">in 3 mins</p></div><div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-center"><p className="font-extrabold text-gray-900 text-lg tracking-widest">ABC 1234</p><p className="text-[10px] text-gray-500 font-bold uppercase">Plate No.</p></div></div><div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-3xl p-4 mb-6"><div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center"><User className="text-gray-400" size={32} /></div><div className="flex-1"><h3 className="font-extrabold text-[#001144] text-[16px]">Juan Dela Cruz</h3><p className="text-gray-500 text-xs font-medium">Toyota Vios - Silver</p></div></div><button onClick={() => onNavigate('active-trip')} className="w-full bg-[#0033cc] text-white font-extrabold py-4 rounded-xl shadow-[0_8px_20px_rgba(0,51,204,0.3)] mt-auto">Continue Demo</button></div></div>
);

const ActiveTrip = ({ onNavigate }: { onNavigate: Navigate }) => (
  <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up"><div className="absolute top-[52px] left-5 right-5 bg-white rounded-2xl shadow-sm p-4 z-20 flex justify-between items-center border border-gray-100"><div><h3 className="font-extrabold text-[#001144] text-[16px]">On the way to destination</h3><p className="text-[#0033cc] font-bold text-[13px]">Arrival at 10:24 AM</p></div><div className="bg-blue-50 p-2.5 rounded-full"><Shield className="text-[#0033cc]" size={22} /></div></div><div className="flex-1 relative bg-[#eef2f5]"><MapBackground type="active" /></div><div className="bg-white rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] z-30 p-6 pb-8 -mt-8"><div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" /><h3 className="font-extrabold text-[#001144] text-[16px] mb-1">Juan Dela Cruz</h3><p className="text-gray-500 text-xs font-medium mb-6">Toyota Vios - Silver · ABC 1234</p><button className="w-full border border-gray-200 rounded-2xl py-4 mb-3 font-extrabold text-gray-700">Share trip details</button><button className="w-full bg-red-50 text-red-600 rounded-2xl py-4 font-extrabold mb-5"><Shield size={18} className="inline mr-2" />Emergency Assistance</button><button onClick={() => onNavigate('trip-completed')} className="text-[11px] font-bold text-gray-400 mx-auto block uppercase tracking-widest">Simulate Drop-off</button></div></div>
);

const Completed = ({ onNavigate }: { onNavigate: Navigate }) => {
  const [rating, setRating] = useState(0);
  return <div className="flex flex-col h-full bg-[#f2f5f9] relative overflow-hidden z-50"><div className="absolute inset-0 bg-black/40 z-10" /><div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-20 p-6 pb-10 flex flex-col items-center animate-slide-up shadow-[0_-20px_50px_rgba(0,0,0,0.2)]"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg -mt-12"><CheckCircle2 size={36} className="text-green-500" /></div><h2 className="text-[28px] font-extrabold text-[#001144] mb-1">You have arrived!</h2><p className="text-gray-500 text-[15px] font-medium mb-6">Hope you enjoyed your Hatid ride.</p><div className="w-full bg-gray-50 rounded-3xl p-5 mb-8 border border-gray-100"><div className="flex justify-between items-center mb-4"><span className="text-gray-500 font-bold text-[15px]">Total Fare</span><span className="text-3xl font-extrabold text-[#001144]">₱212.00</span></div><div className="flex justify-between items-center"><span className="text-gray-500 font-bold text-[15px]">Payment Method</span><div className="flex items-center gap-2 font-extrabold text-[#2e7d32] bg-[#e8f5e9] px-3 py-1.5 rounded-lg"><Wallet size={16} /> Cash</div></div></div><h3 className="font-extrabold text-[#001144] mb-4 text-[16px]">How was your ride?</h3><div className="flex gap-2.5 mb-8">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={42} onClick={() => setRating(star)} className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-100'} />)}</div><button onClick={() => onNavigate('home')} className="w-full bg-[#0033cc] text-white py-4 rounded-2xl font-extrabold shadow-[0_8px_20px_rgba(0,51,204,0.3)]">Submit & Continue</button></div></div>;
};

export default function HatidHomePage() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [phone, setPhone] = useState('968 184 1001');

  return (
    <PhoneFrame>
      {screen === 'splash' && <Splash onNext={() => setScreen('login')} />}
      {screen === 'login' && <Login onNext={() => setScreen('otp')} phone={phone} setPhone={setPhone} />}
      {screen === 'otp' && <Otp onNext={() => setScreen('profile')} onBack={() => setScreen('login')} phone={phone} />}
      {screen === 'profile' && <Profile onNext={() => setScreen('permissions')} phone={phone} />}
      {screen === 'permissions' && <Permissions onNext={() => setScreen('home')} />}
      {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
      {screen === 'dropoff-search' && <DropoffSearch onNavigate={setScreen} />}
      {screen === 'dropoff-selected' && <DropoffSelected onNavigate={setScreen} />}
      {screen === 'choose-ride' && <ChooseRide onNavigate={setScreen} />}
      {screen === 'searching' && <Searching onNavigate={setScreen} />}
      {screen === 'driver-assigned' && <DriverAssigned onNavigate={setScreen} />}
      {screen === 'active-trip' && <ActiveTrip onNavigate={setScreen} />}
      {screen === 'trip-completed' && <Completed onNavigate={setScreen} />}
    </PhoneFrame>
  );
}
