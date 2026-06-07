
'use client';
import React, { useState, useEffect } from 'react';
import { 
  Camera, CheckCircle2, Shield, ChevronRight, ChevronLeft, MapPin, 
  Bell, Menu, Wallet, Car, Bike, Package, Home, Briefcase, 
  Plane, Plus, Search, Star, Clock, User, X, Navigation, 
  MoreHorizontal, CreditCard, Tag
} from 'lucide-react';

// --- Global Styles for Hiding Scrollbars & Animations ---
const style = document.createElement('style');
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  @keyframes slideUp {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// --- Shared Components ---

const HatidLogo = ({ className = "text-2xl" }) => (
  <div className={`flex items-center font-bold italic tracking-tight ${className}`}>
    <div className="relative flex items-center justify-center mr-1">
      <div className="text-[#0033cc] text-3xl h-8 flex items-center -skew-x-12">H</div>
      <div className="absolute -top-1 -right-1 flex">
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
      </div>
      <div className="absolute w-full h-[3px] bg-red-500 bottom-1.5 -skew-x-12 opacity-90 shadow-sm"></div>
    </div>
    <div className="flex flex-col justify-center leading-none">
      <span className="text-[#0033cc] mt-1 tracking-tighter">HATID</span>
      <span className="text-[6px] text-gray-500 font-normal not-italic tracking-widest uppercase mt-[2px]">Biyahe natin. Bansa natin.</span>
    </div>
  </div>
);

const SimpleLogo = ({ className = "text-2xl" }) => (
  <div className={`flex items-center font-bold italic tracking-tight ${className}`}>
    <div className="relative flex items-center justify-center mr-1">
      <div className="text-[#0033cc] text-3xl h-8 flex items-center -skew-x-12">H</div>
      <div className="absolute top-0 right-0 flex">
        <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
      </div>
      <div className="absolute w-[80%] h-[2.5px] bg-red-500 bottom-2 -skew-x-12 shadow-sm"></div>
    </div>
    <span className="text-[#0033cc] tracking-tighter">Hatid</span>
  </div>
);

const BottomNav = ({ activeTab, setActiveTab }) => {
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
            <span className={`text-[10px] font-semibold transition-colors duration-300 ${isActive ? 'text-[#0033cc]' : 'text-gray-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const MapBackground = ({ type = 'home' }) => {
  return (
    <div className="absolute inset-0 bg-[#eef2f5] overflow-hidden -z-10">
      {/* Soft Map Overlay Gradient for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5 z-0 pointer-events-none"></div>
      
      {/* Simulated Map Textures */}
      <div className="absolute w-full h-full opacity-70 z-0">
        <div className="absolute top-[30%] left-[-20%] w-[150%] h-8 bg-white/80 backdrop-blur-sm transform rotate-12 shadow-sm rounded-full"></div>
        <div className="absolute top-[50%] left-[-20%] w-[150%] h-12 bg-white/80 backdrop-blur-sm transform -rotate-[15deg] shadow-sm rounded-full"></div>
        <div className="absolute top-[20%] right-10 w-24 h-48 bg-[#d4ebd4]/60 rounded-2xl"></div>
        <div className="absolute bottom-[40%] left-10 w-32 h-32 bg-[#d4ebd4]/60 rounded-full blur-[2px]"></div>
        <div className="absolute top-[10%] left-[60%] w-[100%] h-6 bg-white/80 transform rotate-[45deg] shadow-sm"></div>
        <div className="absolute top-[70%] right-[10%] w-[80%] h-4 bg-white/80 transform -rotate-12 shadow-sm"></div>
        
        {/* Fake Labels */}
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
            <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-[#0033cc] rotate-45 rounded-sm"></div>
          </div>
          <div className="w-20 h-20 bg-blue-500/15 rounded-full flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
            <div className="w-10 h-10 bg-blue-500/25 rounded-full flex items-center justify-center animate-[pulse_1.5s_ease-in-out_infinite]">
              <div className="w-4 h-4 bg-[#0033cc] rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,51,204,0.6)]"></div>
            </div>
          </div>
        </div>
      )}

      {type === 'route' && (
        <div className="absolute inset-0 z-10 animate-slide-up">
           <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              {/* Route Line Shadow */}
              <path 
                d="M 120,380 L 180,320 L 220,360 L 280,280 L 320,290" 
                stroke="rgba(0,51,204,0.2)" 
                strokeWidth="8" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transform translate-y-1"
              />
              {/* Actual Route Line */}
              <path 
                d="M 120,380 L 180,320 L 220,360 L 280,280 L 320,290" 
                stroke="#0033cc" 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
           </svg>
           {/* Start Pin */}
           <div className="absolute top-[370px] left-[110px] w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
             <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
           </div>
           {/* End Pin */}
           <div className="absolute top-[280px] left-[310px] w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 z-10">
             <div className="w-3.5 h-3.5 bg-[#0033cc] border-2 border-white rounded-full shadow-sm"></div>
           </div>
           
           {/* ETA Tooltip */}
           <div className="absolute top-[300px] left-[220px] bg-[#0033cc] text-white rounded-lg shadow-xl overflow-hidden flex flex-col transform -translate-y-2">
              <div className="px-3 py-1.5 bg-[#0033cc] font-bold text-center text-xs tracking-wide">18 min</div>
              <div className="px-3 py-1 bg-[#002288] text-[10px] text-center font-medium opacity-90">7.2 km</div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#002288] rotate-45"></div>
           </div>
        </div>
      )}

      {type === 'dropoff' && (
         <div className="absolute top-[45%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 animate-slide-up">
         <div className="bg-white border border-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-xl shadow-lg mb-2 relative">
           Use this location
           <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-white border-b border-r border-red-100 rotate-45 rounded-sm"></div>
         </div>
         <MapPin className="text-red-500 fill-red-500 w-11 h-11 drop-shadow-[0_8px_8px_rgba(239,68,68,0.3)] animate-bounce" />
       </div>
      )}

      {/* Locate Me Button */}
      {(type === 'home' || type === 'dropoff' || type === 'route') && (
        <button className="absolute bottom-[340px] right-4 bg-white/95 backdrop-blur p-3.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] z-10 text-gray-700 active:scale-90 transition-transform">
          <Navigation size={22} className="text-gray-800" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

// --- Screens ---

const ScreenProfileSetup = ({ onNext }) => (
  <div className="flex flex-col h-full bg-white overflow-y-auto w-full hide-scrollbar animate-slide-up">
    <div className="px-6 py-4 pt-12 flex justify-between items-center bg-white/95 backdrop-blur-sm sticky top-0 z-20">
      <SimpleLogo />
      <div className="bg-blue-50 text-[#0033cc] text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide">
        Step 1 of 3
      </div>
    </div>
    
    <div className="px-6 py-4 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-[#0033cc] text-white flex items-center justify-center text-xs font-bold z-10 shadow-sm">1</div>
      <div className="h-[2px] w-12 bg-[#0033cc] mx-[-2px]"></div>
      <div className="h-[2px] w-12 bg-gray-200 mx-[-2px]"></div>
      <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold z-10">2</div>
      <div className="h-[2px] w-24 bg-gray-200 mx-[-2px]"></div>
      <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold z-10">3</div>
    </div>

    <div className="px-6 py-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2.5 tracking-tight">Set up your profile</h1>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed pr-4 font-medium">
        We need a few basic details to create your secure Hatid account and serve you better nationwide.
      </p>

      <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl p-5 mb-6">
        <div className="flex items-center gap-5 border-b border-gray-100 pb-5 mb-5">
          <div className="relative group cursor-pointer active:scale-95 transition-transform">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex flex-col items-center justify-center overflow-hidden border-2 border-blue-100 group-hover:border-blue-300 transition-colors">
               <div className="w-7 h-7 bg-blue-200 rounded-full mb-1"></div>
               <div className="w-12 h-8 bg-blue-200 rounded-t-full"></div>
            </div>
            <button className="absolute bottom-0 right-0 bg-[#0033cc] text-white p-1.5 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform">
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">Add a profile photo</h3>
            <p className="text-xs text-gray-500 mb-3 leading-snug">Help drivers and others identify you easily.</p>
            <button className="text-[#0033cc] text-xs font-bold border border-blue-200 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors active:scale-95">
              Add photo later
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="group">
            <label className="text-xs font-bold text-gray-600 ml-1 mb-1.5 block">Full name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-gray-400 group-focus-within:text-[#0033cc] transition-colors" size={18} />
              <input type="text" defaultValue="Maria Santos" className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 font-bold focus:border-[#0033cc] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-600 ml-1 mb-1.5 block">Mobile number</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-gray-400">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <input type="text" defaultValue="+63 917 845 2814" className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-24 text-gray-900 font-bold bg-gray-50/80 outline-none cursor-not-allowed text-opacity-80" readOnly />
              <div className="absolute right-2.5 bg-blue-50 text-[#0033cc] text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-sm border border-blue-100">
                <CheckCircle2 size={12} className="fill-[#0033cc] text-white" />
                Verified
              </div>
            </div>
          </div>

          <div className="group">
            <label className="text-xs font-bold text-gray-600 ml-1 mb-1.5 block">Email address</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-gray-400 group-focus-within:text-[#0033cc] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <input type="email" defaultValue="maria.santos@gmail.com" className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 font-bold focus:border-[#0033cc] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 group">
              <label className="text-xs font-bold text-gray-600 ml-1 mb-1.5 block">Date of birth</label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400 group-focus-within:text-[#0033cc] transition-colors">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <input type="text" defaultValue="Aug 14, 1996" className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-8 text-gray-900 font-bold focus:border-[#0033cc] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                <ChevronRight className="absolute right-3.5 text-gray-400 rotate-90" size={16} />
              </div>
            </div>
            <div className="flex-1 group">
              <label className="text-xs font-bold text-gray-600 ml-1 mb-1.5 block">Gender</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 text-gray-400 group-focus-within:text-[#0033cc] transition-colors" size={18} />
                <input type="text" defaultValue="Female" className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-8 text-gray-900 font-bold focus:border-[#0033cc] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                <ChevronRight className="absolute right-3.5 text-gray-400 rotate-90" size={16} />
              </div>
            </div>
          </div>

          <div className="group">
            <label className="text-xs font-bold text-gray-600 ml-1 mb-1.5 block">City / home base</label>
            <div className="relative flex items-center">
              <MapPin className="absolute left-3.5 text-gray-400 group-focus-within:text-[#0033cc] transition-colors" size={18} />
              <input type="text" defaultValue="Quezon City" className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-8 text-gray-900 font-bold focus:border-[#0033cc] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
              <ChevronRight className="absolute right-3.5 text-gray-400 rotate-90" size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 flex gap-3 mb-8 items-start shadow-sm">
        <Shield className="text-[#0033cc] mt-0.5 shrink-0" size={20} />
        <p className="text-xs text-gray-600 leading-relaxed pr-2 font-medium">
          Your information is protected with industry-standard encryption and handled in accordance with the <span className="text-[#0033cc] font-bold cursor-pointer hover:underline">Philippine Data Privacy Act (RA 10173).</span>
        </p>
      </div>

      <div className="space-y-3.5 pb-8">
        <button 
          onClick={onNext}
          className="w-full bg-[#0033cc] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-800 active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(0,51,204,0.25)] text-[15px]"
        >
          Continue
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
        <button className="w-full bg-white text-[#0033cc] border-2 border-blue-100 font-bold py-3.5 rounded-xl hover:bg-blue-50 active:scale-[0.98] transition-all text-[15px]">
          Save and finish later
        </button>
      </div>

      <div className="flex justify-center items-center gap-1.5 pb-10 pt-2 opacity-80">
         <Shield size={12} className="text-gray-400" />
         <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Secured & trusted nationwide</p>
      </div>
    </div>
  </div>
);

const ScreenPermissions = ({ onNext }) => {
  const permissions = [
    { icon: MapPin, title: 'Location', desc: 'Used to set your pickup location, find nearby drivers, and track trips.' },
    { icon: Bell, title: 'Notifications', desc: 'Get real-time updates about your rides, promos, and important alerts.' },
    { icon: User, title: 'Contacts', desc: 'Easily add contacts for emergency and share trip details.' },
    { icon: Camera, title: 'Camera', desc: 'Take or upload photos for your profile and trip verification.' },
    { icon: MoreHorizontal, title: 'Microphone', desc: 'Used for calls with your driver or support when needed.', isMic: true },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto w-full hide-scrollbar animate-slide-up">
      <div className="px-6 py-6 pt-12 flex justify-center items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-50/50">
        <HatidLogo className="text-2xl scale-110" />
      </div>

      <div className="px-6 py-4 pb-6 text-center">
        <h1 className="text-3xl font-extrabold text-[#001144] mb-3 tracking-tight">Allow Permissions</h1>
        <p className="text-gray-500 text-[15px] px-2 leading-relaxed font-medium">
          Hatid needs the following permissions to provide you a safe and reliable ride experience.
        </p>
      </div>

      <div className="px-6 flex-1">
        <div className="space-y-3.5 mb-8">
          {permissions.map((p, idx) => (
            <button key={idx} className="w-full text-left border border-gray-100 hover:border-blue-200 rounded-2xl p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,51,204,0.05)] bg-white active:scale-[0.98] transition-all group">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-[#0033cc] group-hover:bg-[#0033cc] group-hover:text-white transition-colors">
                {p.isMic ? (
                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                ) : (
                  <p.icon size={22} strokeWidth={2.5} className={p.icon === MapPin ? 'fill-current opacity-20' : p.icon === Bell ? 'fill-current opacity-20' : p.icon === User ? 'fill-current opacity-20' : p.icon === Camera ? 'fill-current opacity-20' : ''} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#001144] text-[15px] mb-0.5">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-snug pr-2 font-medium">{p.desc}</p>
              </div>
              <div className="text-[#0033cc] text-sm font-bold flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                Allow <ChevronRight size={18} strokeWidth={2.5} />
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[#f8fafe] border border-blue-100/50 rounded-2xl p-4.5 flex gap-3.5 mb-8 items-start shadow-inner">
          <div className="bg-[#0033cc] text-white p-2 rounded-xl shadow-sm shrink-0">
             <Shield size={20} strokeWidth={2.5} />
          </div>
          <div>
             <h4 className="font-bold text-[#001144] text-sm mb-1">Your safety and privacy are our priority.</h4>
             <p className="text-xs text-gray-600 leading-relaxed font-medium">
               We only use these permissions to improve your Hatid experience. You can change them anytime in your phone settings.
             </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-12 space-y-3.5 bg-white">
        <button 
          onClick={onNext}
          className="w-full bg-[#0033cc] text-white font-bold py-4 rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(0,51,204,0.25)] text-[15px]"
        >
          Allow All Permissions
        </button>
        <button 
          onClick={onNext}
          className="w-full bg-white text-[#0033cc] font-bold py-3.5 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all text-[15px]"
        >
          Maybe Later
        </button>
        <div className="flex justify-center items-center gap-1.5 pt-4 opacity-80">
           <Shield size={12} className="text-gray-400" />
           <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">GDPR & DPA Compliant</p>
        </div>
      </div>
    </div>
  );
};

const ScreenHome = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex flex-col h-full relative overflow-hidden w-full bg-[#f2f5f9] animate-slide-up">
      {/* Subtle top background styling */}
      <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/60 to-transparent pointer-events-none"></div>

      {/* Top Header */}
      <div className="px-5 pt-[52px] pb-2 flex justify-between items-center relative z-10">
        <button className="bg-white p-3.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] text-gray-800 active:scale-90 transition-transform">
          <Menu size={22} strokeWidth={2.5} />
        </button>
        <div className="bg-white px-5 py-2.5 rounded-[1.5rem] shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-center">
          <HatidLogo className="text-xl scale-[0.85] origin-center -my-1" />
        </div>
        <button className="bg-white p-3.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] text-gray-800 relative active:scale-90 transition-transform">
          <Bell size={22} strokeWidth={2.5} />
          <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
        </button>
      </div>

      {/* Greeting & Wallet */}
      <div className="px-6 mt-4 flex justify-between items-start relative z-10">
        <div>
          <p className="text-gray-500 font-extrabold text-[13px] mb-1.5 flex items-center gap-1">Hello, Maria! <span className="text-lg">👋</span></p>
          <h2 className="text-[32px] font-extrabold text-[#001144] tracking-tight leading-[1.05]">
            Where are<br/>you<br/>going today?
          </h2>
        </div>
        <button className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.04)] active:scale-95 transition-transform mt-1">
          <Wallet size={24} className="text-[#0033cc]" strokeWidth={2} />
          <div className="text-right">
            <p className="text-[9px] text-gray-400 font-bold leading-none uppercase tracking-widest mb-1">Wallet</p>
            <p className="text-[15px] font-extrabold text-[#0033cc] tracking-tight leading-none">₱250.00</p>
          </div>
          <ChevronRight size={16} className="text-gray-300" strokeWidth={3} />
        </button>
      </div>

      {/* Bottom Sheet UI */}
      <div className="mt-8 flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.05)] z-20 flex flex-col px-6 pt-5 pb-5 relative">
         {/* Drag Handle */}
         <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
         
         {/* Search Card */}
         <button className="w-full bg-white border border-gray-100 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-shadow rounded-3xl p-5 mb-5 relative text-left group" onClick={() => onNavigate('dropoff-search')}>
            <div className="flex items-center gap-4 mb-4 relative z-10">
               <div className="w-3.5 h-3.5 rounded-full bg-[#0033cc] shadow-[0_0_0_3px_white,0_2px_5px_rgba(0,51,204,0.3)] z-10 group-hover:scale-110 transition-transform"></div>
               <span className="text-[#001144] font-extrabold text-[16px] flex-1">Where to?</span>
            </div>
            <div className="absolute left-[26px] top-9 bottom-9 w-[2px] border-l-[2px] border-dashed border-gray-200 z-0"></div>
            <div className="w-full h-[1px] bg-gray-100 ml-9 mb-4"></div>
            <div className="flex items-center gap-4 relative z-10">
               <MapPin className="text-red-500 fill-red-500 w-[22px] h-[22px] z-10 drop-shadow-sm group-hover:scale-110 transition-transform -ml-[1px]" />
               <span className="text-gray-900 font-extrabold text-[16px] flex-1">Enter drop-off location</span>
            </div>
         </button>

         {/* Quick Places */}
         <div className="flex justify-between gap-3 mb-5">
            <button className="flex-1 flex flex-col justify-center items-center py-4 px-2 border border-gray-100 rounded-3xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:border-blue-100 active:scale-95 transition-all">
               <Home className="text-[#0033cc] fill-transparent mb-2" size={26} strokeWidth={2} />
               <span className="text-[13px] font-extrabold text-gray-900 mb-0.5">Home</span>
               <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center px-1">BGC, Taguig</span>
            </button>
            <button className="flex-1 flex flex-col justify-center items-center py-4 px-2 border border-gray-100 rounded-3xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:border-blue-100 active:scale-95 transition-all">
               <Briefcase className="text-[#0033cc] fill-transparent mb-2" size={26} strokeWidth={2} />
               <span className="text-[13px] font-extrabold text-gray-900 mb-0.5">Work</span>
               <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center px-1">Ortigas</span>
            </button>
            <button className="flex-1 flex flex-col justify-center items-center py-4 px-2 border border-gray-100 rounded-3xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:border-blue-100 active:scale-95 transition-all">
               <Plane className="text-[#0033cc] fill-transparent mb-2 transform -rotate-45" size={26} strokeWidth={2} />
               <span className="text-[13px] font-extrabold text-gray-900 mb-0.5">NAIA T3</span>
               <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center px-1">Pasay City</span>
            </button>
         </div>

         {/* Safety Banner */}
         <button className="w-full bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-md rounded-[1.25rem] p-4 flex items-center justify-between active:scale-[0.98] group transition-all">
            <div className="flex gap-4 items-center">
              <div className="bg-[#0033cc] text-white p-3 rounded-[14px] shadow-[0_4px_10px_rgba(0,51,204,0.2)] group-hover:scale-105 transition-transform">
                <Shield size={20} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-[#001144] text-[13px] mb-0.5">Hatid is committed to your safety.</h4>
                <p className="text-[#0033cc] text-[11px] font-bold">Learn more about our safety standards</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#0033cc] group-hover:translate-x-1 transition-transform" strokeWidth={3} />
         </button>
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

const ScreenDropOffSearch = ({ onNavigate }) => {
  const recentSearches = [
    { title: 'Ayala Malls Glorietta', desc: 'Palm Drive, Makati City', icon: Clock },
    { title: 'SM Mall of Asia', desc: 'Seaside Blvd, Pasay City', icon: Clock },
    { title: 'Robinsons Galleria', desc: 'Ortigas Ave, Quezon City', icon: Clock },
    { title: 'Greenbelt 5', desc: 'Ayala Center, Makati City', icon: Clock },
    { title: 'NAIA Terminal 1', desc: 'Newport Blvd, Pasay City', icon: Clock },
  ];

  return (
    <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up">
      <div className="px-5 py-4 pt-12 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="p-1.5 rounded-full hover:bg-gray-100 active:scale-90 transition-all">
            <ChevronLeft size={24} className="text-gray-900" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Drop-off location</h1>
        </div>
        <SimpleLogo className="text-lg" />
      </div>

      <div className="px-5 py-3.5 bg-white z-20 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
        <div className="relative flex items-center group">
          <MapPin className="absolute left-4 text-red-500 fill-red-500 w-[22px] h-[22px] group-focus-within:animate-bounce" />
          <input 
            autoFocus
            type="text" 
            placeholder="Where are you going?" 
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-gray-900 font-bold focus:border-[#0033cc] focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none shadow-inner transition-all text-[15px]"
          />
          <button className="absolute right-4 text-gray-400 hover:text-gray-600 bg-gray-200/50 hover:bg-gray-200 p-1 rounded-full transition-colors active:scale-90">
             <X size={16} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white hide-scrollbar">
        {/* Map Preview Area */}
        <div className="h-44 relative overflow-hidden w-full bg-[#eef2f5] cursor-pointer group" onClick={() => onNavigate('dropoff-selected')}>
           <MapBackground type="home" />
           <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10 flex items-center justify-center">
             <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white transform group-hover:scale-105 transition-all">
               Tap map to select via pin
             </div>
           </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-end mb-3.5">
             <h3 className="font-extrabold text-[15px] text-gray-900">Saved places</h3>
             <button className="text-[#0033cc] text-xs font-bold hover:underline active:scale-95 transition-transform" onClick={() => onNavigate('saved-places')}>View all</button>
          </div>
          
          <div className="flex gap-3.5 mb-8 overflow-x-auto pb-2 hide-scrollbar">
            <button className="flex-1 flex flex-col justify-center items-center py-3 px-2 border border-gray-100 hover:border-blue-200 rounded-2xl bg-gray-50 hover:bg-blue-50/50 transition-colors active:scale-95 min-w-[85px] shadow-sm">
               <Home className="text-[#0033cc] fill-[#0033cc]/10 mb-1.5" size={20} strokeWidth={2.5} />
               <span className="text-xs font-extrabold text-gray-900 mb-0.5">Home</span>
               <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center px-1">BGC, Taguig</span>
            </button>
            <button className="flex-1 flex flex-col justify-center items-center py-3 px-2 border border-gray-100 hover:border-blue-200 rounded-2xl bg-gray-50 hover:bg-blue-50/50 transition-colors active:scale-95 min-w-[85px] shadow-sm">
               <Briefcase className="text-[#0033cc] fill-[#0033cc]/10 mb-1.5" size={20} strokeWidth={2.5} />
               <span className="text-xs font-extrabold text-gray-900 mb-0.5">Work</span>
               <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center px-1">Ortigas</span>
            </button>
            <button className="flex-[1.2] flex flex-col justify-center items-center py-3 px-2 border border-gray-100 hover:border-blue-200 rounded-2xl bg-gray-50 hover:bg-blue-50/50 transition-colors active:scale-95 min-w-[95px] shadow-sm">
               <Plane className="text-[#0033cc] fill-[#0033cc]/10 mb-1.5" size={20} strokeWidth={2.5} />
               <span className="text-xs font-extrabold text-gray-900 mb-0.5">NAIA T3</span>
               <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center px-1">Pasay City</span>
            </button>
            <button className="flex flex-col justify-center items-center py-3 px-4 border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-2xl bg-white transition-colors active:scale-95 min-w-[80px]">
               <Plus className="text-gray-400 mb-1" size={20} strokeWidth={2.5} />
               <span className="text-[11px] font-extrabold text-gray-500 mt-0.5">Add new</span>
            </button>
          </div>

          <div className="flex justify-between items-center mb-2">
             <h3 className="font-extrabold text-[15px] text-gray-900">Recent searches</h3>
             <button className="text-gray-400 hover:text-gray-600 text-xs font-bold transition-colors">Clear</button>
          </div>

          <div className="space-y-1">
            {recentSearches.map((item, idx) => (
              <button key={idx} className="w-full flex items-center gap-4 py-3.5 border-b border-gray-50 text-left hover:bg-gray-50 active:bg-gray-100 rounded-xl px-2 -mx-2 transition-colors group" onClick={() => onNavigate('choose-ride')}>
                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center transition-all shrink-0">
                  <item.icon size={18} className="text-gray-500" strokeWidth={2.5} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-extrabold text-gray-900 text-[15px] mb-0.5 truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-medium truncate">{item.desc}</p>
                </div>
                <Star size={18} className="text-gray-300 group-hover:text-yellow-400 group-hover:fill-yellow-400 transition-colors" strokeWidth={2} />
              </button>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-[#fff8e6] to-[#fffcf5] border border-yellow-100 rounded-2xl p-4 flex gap-4 items-center shadow-sm">
            <div className="bg-[#ffcc00] text-blue-900 p-2.5 rounded-xl shadow-sm shrink-0">
              <Shield size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-[#001144] text-sm mb-0.5">Your safety is our priority.</h4>
              <p className="text-gray-600 text-[11px] font-medium leading-snug">Share your trip and PIN with your loved ones.</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" strokeWidth={2.5} />
          </div>
        </div>
      </div>
      <BottomNav activeTab={'home'} setActiveTab={() => {}} />
    </div>
  );
};

const ScreenDropOffSelected = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up">
      <div className="px-5 py-4 pt-12 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('dropoff-search')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors active:scale-90">
            <ChevronLeft size={22} className="text-gray-900" strokeWidth={2.5} />
          </button>
          <h1 className="text-lg font-extrabold text-gray-900">Drop-off location</h1>
        </div>
        <SimpleLogo className="text-lg" />
      </div>

      <div className="absolute top-[100px] left-5 right-5 z-30">
        <div className="relative flex items-center shadow-[0_8px_25px_rgba(0,51,204,0.15)] rounded-2xl bg-white border-2 border-[#0033cc] transform transition-all">
          <MapPin className="absolute left-4 text-red-500 fill-red-500 w-[22px] h-[22px] z-10 animate-bounce" />
          <input 
            type="text" 
            value="Ayala Triangle Gardens"
            readOnly
            className="w-full bg-transparent py-4 pl-12 pr-12 text-[#001144] font-extrabold text-[15px] outline-none cursor-default"
          />
          <button className="absolute right-4 text-gray-400 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors active:scale-90">
             <X size={16} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative z-10">
         <MapBackground type="dropoff" />
      </div>

      <div className="bg-white rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] p-6 z-30 pb-10">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        <div className="flex justify-between items-start mb-6">
           <div>
             <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Ayala Triangle Gardens</h2>
             <p className="text-gray-500 text-sm font-medium leading-relaxed">Paseo de Roxas St cor Makati Ave, cor Ayala Ave, Makati</p>
           </div>
        </div>
        <button 
          onClick={() => onNavigate('choose-ride')}
          className="w-full bg-[#0033cc] text-white font-extrabold py-4.5 rounded-xl shadow-[0_8px_20px_rgba(0,51,204,0.3)] text-lg hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Confirm Destination
          <ChevronRight size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

const ScreenSavedPlaces = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full bg-white w-full z-50 animate-slide-up">
      <div className="px-5 py-4 pt-12 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('dropoff-search')} className="p-1.5 rounded-full hover:bg-gray-100 active:scale-90 transition-all">
            <ChevronLeft size={24} className="text-gray-900" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Saved places</h1>
        </div>
        <SimpleLogo className="text-lg" />
      </div>

      <div className="p-5 flex-1 overflow-y-auto pb-24 hide-scrollbar">
        <div className="relative flex items-center mb-6 group">
          <Search className="absolute left-4 text-gray-400 group-focus-within:text-[#0033cc] transition-colors" size={20} strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Search your saved places" 
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-full py-3.5 pl-12 pr-4 text-gray-900 font-bold focus:border-[#0033cc] focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-[15px]"
          />
        </div>

        <div className="bg-gradient-to-r from-[#f0f4ff] to-white border border-blue-100 rounded-2xl p-4.5 flex gap-4 items-center mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="bg-[#0033cc] text-white p-2.5 rounded-full shadow-md shrink-0 relative z-10">
            <Star className="fill-white w-5 h-5" />
          </div>
          <div className="relative z-10 pr-6">
            <h4 className="font-extrabold text-[#001144] text-sm mb-0.5">Quick and easy booking</h4>
            <p className="text-gray-600 text-xs font-medium leading-snug">Save your frequent locations to book rides faster.</p>
          </div>
          <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-white/50 hover:bg-white p-1 rounded-full transition-colors z-10">
             <X size={16} strokeWidth={3} />
          </button>
        </div>

        <div className="flex justify-between items-end mb-3">
           <h3 className="font-extrabold text-gray-900 text-lg">Favorites</h3>
           <button className="text-[#0033cc] text-sm font-bold hover:underline active:scale-95 transition-transform">Edit</button>
        </div>

        <div className="space-y-0 mb-8 bg-white border border-gray-100 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden">
          {[
             { icon: Home, title: 'Home', desc: 'BGC, Taguig City', sub: '7th Ave, Bonifacio Global City' },
             { icon: Briefcase, title: 'Work', desc: 'Ortigas Center, Pasig City', sub: 'Exchange Rd, Ortigas Center' },
             { icon: Plane, title: 'NAIA Terminal 3', desc: 'Pasay City', sub: 'Andrews Ave, Pasay City' }
          ].map((item, i) => (
             <button key={i} className="w-full flex items-center gap-4 py-4 px-4 border-b border-gray-50 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center shrink-0 transition-all border border-transparent group-hover:border-blue-100">
                  <item.icon className="text-[#0033cc] fill-[#0033cc]/10" size={24} strokeWidth={2} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-extrabold text-gray-900 text-[15px] mb-0.5">{item.title}</h4>
                  <p className="text-xs text-gray-800 font-bold truncate">{item.desc}</p>
                  <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">{item.sub}</p>
                </div>
                <div className="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Star className="text-yellow-400 fill-yellow-400 drop-shadow-sm" size={20} />
                  <MoreHorizontal className="text-gray-400 hover:text-gray-600" size={22} strokeWidth={2.5} />
                </div>
             </button>
          ))}
        </div>

        <div className="flex justify-between items-end mb-3">
           <h3 className="font-extrabold text-gray-900 text-lg">Other saved places</h3>
           <button className="text-[#0033cc] text-sm font-bold hover:underline active:scale-95 transition-transform">Add new</button>
        </div>

        <div className="border border-gray-100 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden mb-8">
           <button className="w-full flex items-center gap-4 py-4 px-4 border-b border-gray-50 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors group">
             <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center shrink-0 transition-all">
               <MapPin className="text-gray-500" size={20} strokeWidth={2.5} />
             </div>
             <div className="flex-1 overflow-hidden">
               <h4 className="font-extrabold text-gray-900 text-[15px] mb-0.5 truncate">UP Diliman</h4>
               <p className="text-xs text-gray-800 font-bold truncate">Quezon City</p>
               <p className="text-[11px] text-gray-500 font-medium mt-0.5 truncate">C.P. Garcia Ave, Quezon City</p>
             </div>
             <div className="flex items-center gap-3">
               <Star className="text-gray-300 group-hover:text-gray-400 transition-colors" size={20} strokeWidth={2.5} />
               <MoreHorizontal className="text-gray-400" size={22} strokeWidth={2.5} />
             </div>
          </button>
        </div>

        <button className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-4.5 flex items-center justify-between px-5 hover:bg-gray-50 hover:border-[#0033cc] active:scale-[0.98] transition-all group">
           <div className="flex items-center gap-3.5">
             <div className="bg-blue-50 group-hover:bg-[#0033cc] text-[#0033cc] group-hover:text-white p-2 rounded-full transition-colors">
               <Plus size={20} strokeWidth={3} />
             </div>
             <span className="font-extrabold text-gray-700 group-hover:text-[#0033cc] text-[15px] transition-colors">Add new saved place</span>
           </div>
        </button>
      </div>

      <BottomNav activeTab={'home'} setActiveTab={() => {}} />
    </div>
  );
};

const ScreenChooseRide = ({ onNavigate }) => {
  const rides = [
    { id: 'car', name: 'Hatid Car', cap: 4, desc: 'Affordable everyday rides', eta: '3 - 5 min', price: '₱212.00', img: 'https://img.icons8.com/color/96/000000/sedan.png' },
    { id: 'moto', name: 'Hatid Moto', cap: 1, desc: 'Beat traffic, faster arrivals', eta: '2 - 4 min', price: '₱138.00', img: 'https://img.icons8.com/color/96/000000/motorcycle.png' },
    { id: 'pool', name: 'Hatid Car Pool', cap: 4, desc: 'Share a ride, save more', eta: '5 - 8 min', price: '₱168.00', img: 'https://img.icons8.com/color/96/000000/minivan.png' },
    { id: 'xl', name: 'Hatid XL', cap: 6, desc: 'For group rides and extra space', eta: '4 - 7 min', price: '₱328.00', img: 'https://img.icons8.com/color/96/000000/van.png' },
  ];

  const [selectedRide, setSelectedRide] = useState('car');
  const activeRide = rides.find(r => r.id === selectedRide);

  return (
    <div className="flex flex-col h-full relative overflow-hidden w-full bg-white z-50 animate-slide-up">
      <div className="px-5 py-4 pt-12 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('dropoff-search')} className="p-1.5 rounded-full hover:bg-gray-100 active:scale-90 transition-all">
            <ChevronLeft size={24} className="text-gray-900" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Choose your ride</h1>
        </div>
        <SimpleLogo className="text-lg" />
      </div>

      {/* Floating Route Card */}
      <div className="absolute top-[100px] left-5 right-5 bg-white rounded-3xl shadow-[0_12px_35px_rgba(0,0,0,0.1)] p-5 z-20 border border-gray-100/50 backdrop-blur-sm">
         <div className="relative pl-7">
            <div className="absolute left-1 top-2.5 bottom-4 w-0.5 border-l-2 border-dashed border-gray-300"></div>
            
            <div className="flex justify-between items-center mb-5 relative group cursor-pointer">
               <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-white border-4 border-[#0033cc] shadow-[0_2px_5px_rgba(0,51,204,0.3)] group-hover:scale-110 transition-transform"></div>
               <span className="text-[15px] font-extrabold text-gray-900 truncate pr-4 group-hover:text-[#0033cc] transition-colors">7th Ave, BGC, Taguig</span>
               <button className="text-[#0033cc] text-xs font-bold bg-blue-50 px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
            </div>
            
            <div className="w-full h-[1px] bg-gray-100 mb-5"></div>
            
            <div className="flex justify-between items-center relative group cursor-pointer">
               <MapPin className="absolute -left-[35px] text-red-500 fill-red-500 w-[22px] h-[22px] drop-shadow-sm group-hover:scale-110 transition-transform" />
               <span className="text-[15px] font-extrabold text-gray-900 truncate pr-4 group-hover:text-red-600 transition-colors">Ayala Triangle Gardens</span>
               <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                 <Plus size={14} strokeWidth={3} />
               </button>
            </div>
         </div>
      </div>

      <div className="h-44 relative shrink-0 z-10">
         <MapBackground type="route" />
      </div>

      <div className="flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.08)] z-30 flex flex-col relative overflow-hidden -mt-6">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-20">
           <div className="flex items-start gap-3.5">
              <div className="bg-blue-50 p-2.5 rounded-full mt-0.5 text-[#0033cc] shadow-inner">
                 <Tag size={20} className="fill-[#0033cc]/20" strokeWidth={2.5} />
              </div>
              <div>
                 <h4 className="font-extrabold text-gray-900 text-sm mb-0.5">Fares are estimates</h4>
                 <p className="text-[11px] text-gray-500 font-medium leading-snug">Actual fare may vary due to traffic,<br/>demand, and route.</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Payment</p>
              <button className="flex items-center gap-1.5 bg-[#e8f5e9] text-[#2e7d32] px-3.5 py-1.5 rounded-xl text-sm font-extrabold border border-[#c8e6c9] hover:bg-[#c8e6c9] active:scale-95 transition-all shadow-sm">
                <Wallet size={16} strokeWidth={2.5} />
                Cash <ChevronRight size={14} className="rotate-90 ml-0.5" strokeWidth={3} />
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5 hide-scrollbar bg-gray-50/30">
           {rides.map(ride => (
             <button 
               key={ride.id} 
               onClick={() => setSelectedRide(ride.id)}
               className={`w-full text-left flex items-center gap-4 p-4 rounded-[1.5rem] border-2 transition-all duration-200 active:scale-[0.98] ${
                 selectedRide === ride.id 
                   ? 'border-[#0033cc] bg-blue-50/40 shadow-[0_8px_20px_rgba(0,51,204,0.08)]' 
                   : 'border-transparent bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md'
               }`}
             >
                <div className="w-[72px] h-[52px] bg-transparent flex justify-center items-center relative">
                   <img src={ride.img} className={`w-[72px] object-contain transition-transform duration-300 ${selectedRide === ride.id ? 'scale-110 drop-shadow-md' : 'drop-shadow-sm'}`} alt={ride.name} />
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                     <h3 className="font-extrabold text-[#001144] text-[16px] tracking-tight">{ride.name}</h3>
                     <div className="flex items-center bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 text-[10px] font-extrabold gap-1">
                       <User size={10} strokeWidth={3} /> {ride.cap}
                     </div>
                   </div>
                   <p className="text-xs text-gray-500 font-medium mb-1.5">{ride.desc}</p>
                   <p className="text-[11px] text-[#0033cc] font-extrabold bg-blue-50/80 inline-block px-2 py-0.5 rounded-md">ETA: {ride.eta}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                   <span className="font-extrabold text-gray-900 text-lg tracking-tight">{ride.price}</span>
                   <div className={`w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center transition-colors ${selectedRide === ride.id ? 'border-[#0033cc]' : 'border-gray-300'}`}>
                      <div className={`w-3 h-3 rounded-full bg-[#0033cc] transition-transform duration-200 ${selectedRide === ride.id ? 'scale-100' : 'scale-0'}`}></div>
                   </div>
                </div>
             </button>
           ))}
        </div>

        <div className="px-6 py-5 border-t border-gray-100 bg-white">
           <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-[#ffcc00] to-[#ffaa00] p-1.5 rounded-lg shadow-sm">
                  <Tag size={16} className="text-blue-900 fill-blue-900/20" strokeWidth={2.5} />
                </div>
                <span className="font-extrabold text-[15px] text-gray-900">Have a promo code?</span>
              </div>
              <button className="text-[#0033cc] text-[15px] font-bold flex items-center hover:underline group">
                Add code <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </button>
           </div>
           
           <button className="w-full bg-[#0033cc] text-white font-extrabold py-4.5 rounded-2xl shadow-[0_8px_25px_rgba(0,51,204,0.3)] text-lg flex justify-between px-6 items-center hover:bg-blue-800 active:scale-[0.98] transition-all relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative z-10">Confirm {activeRide.name}</span>
              <span className="relative z-10 tracking-tight">{activeRide.price}</span>
           </button>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

export default function HatidApp() {
  const [currentScreen, setCurrentScreen] = useState('profile');

  // Add styles dynamically on mount
  useEffect(() => {
    const styleId = 'hatid-animations';
    if (!document.getElementById(styleId)) {
        const customStyle = document.createElement('style');
        customStyle.id = styleId;
        customStyle.textContent = `
        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }
        `;
        document.head.appendChild(customStyle);
    }
  }, []);

  // Simple Router Simulation
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4 font-sans selection:bg-blue-200">
      <div className="w-full max-w-[400px] h-[850px] max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border-[10px] border-gray-800 ring-4 ring-gray-700/50 flex flex-col">
        {/* iPhone Notch Simulation */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-[28px] bg-gray-800 rounded-b-[20px] z-[100] flex justify-center items-center gap-3">
           <div className="w-14 h-1.5 bg-black/40 rounded-full"></div>
           <div className="w-2.5 h-2.5 bg-black/50 rounded-full border border-gray-900"></div>
        </div>

        {/* Screen Switching Context */}
        <div className="flex-1 bg-white relative overflow-hidden">
          {currentScreen === 'profile' && <ScreenProfileSetup onNext={() => setCurrentScreen('permissions')} />}
          {currentScreen === 'permissions' && <ScreenPermissions onNext={() => setCurrentScreen('home')} />}
          {currentScreen === 'home' && <ScreenHome onNavigate={setCurrentScreen} />}
          {currentScreen === 'dropoff-search' && <ScreenDropOffSearch onNavigate={setCurrentScreen} />}
          {currentScreen === 'dropoff-selected' && <ScreenDropOffSelected onNavigate={setCurrentScreen} />}
          {currentScreen === 'saved-places' && <ScreenSavedPlaces onNavigate={setCurrentScreen} />}
          {currentScreen === 'choose-ride' && <ScreenChooseRide onNavigate={setCurrentScreen} />}
        </div>
        
        {/* iOS Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-36 h-1.5 bg-gray-300 rounded-full z-[100]"></div>
      </div>
    </div>
  );
}
