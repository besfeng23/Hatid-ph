import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Palette, Users, DollarSign, 
  TrendingUp, TrendingDown, Minus, CheckCircle2, AlertCircle,
  Sparkles, ChevronRight, Bell, ArrowUpRight, ArrowDownRight, 
  Briefcase, Menu, X, SlidersHorizontal, ArrowRight, Search,
  Activity, Command, Settings
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_BRIEF = {
  bestOpportunity: { campaign: 'Summer Sale', impact: '+$5,520 Rev', type: 'scale' },
  biggestWaste: { campaign: 'Cold Traffic Test', impact: '-$3,100 Loss', type: 'pause' },
};

const MOCK_METRICS = {
  totalSpend: 15400, totalRevenue: 48200, netProfit: 12800, roas: 3.13,
};

const MOCK_CAMPAIGNS = [
  { id: 'c1', name: 'Summer Sale Campaign', status: 'active', spend: 5200, revenue: 18400, roas: 3.54, trend: 'improving', action: 'Scale +25%' },
  { id: 'c2', name: 'Cold Traffic Test', status: 'active', spend: 3100, revenue: 1850, roas: 0.60, trend: 'declining', action: 'Pause' },
  { id: 'c3', name: 'Retargeting Sequence', status: 'active', spend: 4200, revenue: 16800, roas: 4.00, trend: 'stable', action: null },
  { id: 'c4', name: 'Win-back Offer', status: 'paused', spend: 1200, revenue: 2100, roas: 1.75, trend: 'declining', action: 'Audit' },
];

const MOCK_RECOMMENDATIONS = [
  {
    id: 'r1', type: 'scale', title: 'Scale High-Performing Campaign',
    desc: 'Summer Sale Campaign is achieving 3.54 ROAS with an improving trend.',
    rationale: 'ROAS exceeds the 2.5x profitability threshold. Trend analysis shows decreasing CPA over the last 4 days.',
    impact: { rev: 5520, profit: 3200 }, req: 1300,
    confidence: 'high', status: 'pending'
  },
  {
    id: 'r2', type: 'pause', title: 'Pause Underperforming Ad Sets',
    desc: 'Cold Traffic Test is operating at a severe loss with 0.60 ROAS.',
    rationale: 'Cost of acquisition ($85) is triple the target margin. Continuing spend will compound daily losses.',
    impact: { rev: 0, profit: 3100 }, req: 0,
    confidence: 'high', status: 'pending'
  }
];

const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutGrid },
  { id: 'recommendations', label: 'Insights', icon: Sparkles, badge: 2 },
  { id: 'audiences', label: 'Audiences', icon: Users },
  { id: 'creatives', label: 'Creatives', icon: Palette },
  { id: 'financial', label: 'Financials', icon: DollarSign },
];

// --- APPLE-STYLE UI COMPONENTS ---

const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white/70 backdrop-blur-3xl rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] ring-1 ring-black/[0.03] ${noPadding ? '' : 'p-7 md:p-8'} ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'gray', className = '' }) => {
  const styles = {
    green: 'bg-[#34c759]/10 text-[#248a3d]',
    red: 'bg-[#ff3b30]/10 text-[#c9241b]',
    orange: 'bg-[#ff9500]/10 text-[#b36800]',
    blue: 'bg-[#0071e3]/10 text-[#0052a3]',
    gray: 'bg-black/5 text-[#86868b]'
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = "inline-flex items-center justify-center rounded-full text-[14px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";
  const styles = {
    primary: "bg-[#1d1d1f] text-white hover:bg-[#000000] shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]",
    secondary: "bg-black/[0.03] text-[#1d1d1f] hover:bg-black/[0.06] backdrop-blur-xl",
    ghost: "text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/5",
    accent: "bg-[#0071e3] text-white hover:bg-[#0066cc] shadow-[0_4px_14px_rgba(0,113,227,0.3)] hover:shadow-[0_6px_20px_rgba(0,113,227,0.4)]"
  };
  return (
    <button className={`${base} ${styles[variant]} px-5 py-2.5 ${className}`} {...props}>
      {children}
    </button>
  );
};

// Fluid Area Sparkline
const SparklineArea = ({ data, color, id }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 100}`);
  const polylineStr = points.join(' ');
  const polygonStr = `0,100 ${polylineStr} 100,100`;

  return (
    <svg className="w-24 h-12 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={polygonStr} fill={`url(#gradient-${id})`} />
      <polyline points={polylineStr} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
      <circle cx="100" cy={100 - ((data[data.length - 1] - min) / range) * 100} r="3.5" fill="white" stroke={color} strokeWidth="2.5" className="shadow-sm" />
    </svg>
  );
};

// Reusable Sidebar Navigation Content
const SidebarNav = ({ currentView, onNavigate }) => (
  <>
    <div className="mb-5 px-4">
       <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em]">Menu</p>
    </div>
    <div className="space-y-1.5">
      {NAV_ITEMS.map(item => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[14px] font-medium transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group ${
              isActive 
                ? 'bg-[#1d1d1f] text-white shadow-md shadow-black/10' 
                : 'text-[#1d1d1f] hover:bg-black/5'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} className={`${isActive ? 'text-white' : 'text-[#86868b] group-hover:text-[#1d1d1f]'} transition-colors duration-300`} />
              <span className={isActive ? 'font-semibold tracking-tight' : 'tracking-tight'}>{item.label}</span>
            </div>
            {item.badge && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${isActive ? 'bg-white/20 text-white' : 'bg-[#0071e3] text-white shadow-sm'}`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>

    <div className="mt-auto md:mt-12 pt-6 px-4">
       <button className="w-full flex items-center space-x-3.5 text-sm p-3 -mx-3 rounded-[20px] hover:bg-black/5 transition-colors text-left group">
         <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-gray-50 to-gray-200 shadow-sm ring-1 ring-black/5 flex items-center justify-center text-[#1d1d1f] group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <Briefcase size={16} strokeWidth={2} />
         </div>
         <div className="flex flex-col min-w-0">
           <span className="font-semibold text-[#1d1d1f] truncate text-[14px] tracking-tight">Acme Corp Global</span>
           <span className="text-[12px] font-medium text-[#86868b]">Enterprise Plan</span>
         </div>
       </button>
    </div>
  </>
);

// --- VIEWS ---

const OverviewView = () => {
  const metricCards = [
    { id: 'sp', label: 'Total Spend', value: `$${MOCK_METRICS.totalSpend.toLocaleString()}`, change: '+12.5%', isUp: true, spark: [2,3,2,5,4,6,7], color: '#86868b' },
    { id: 'rev', label: 'Total Revenue', value: `$${MOCK_METRICS.totalRevenue.toLocaleString()}`, change: '+28.4%', isUp: true, spark: [3,4,6,5,8,9,11], color: '#34c759' },
    { id: 'prof', label: 'Net Profit', value: `$${MOCK_METRICS.netProfit.toLocaleString()}`, change: '+18.2%', isUp: true, spark: [1,2,2,4,3,5,6], color: '#0071e3' },
    { id: 'roas', label: 'Avg. ROAS', value: `${MOCK_METRICS.roas.toFixed(2)}x`, change: '-0.12x', isUp: false, spark: [4,4,3,3,2,3,2], color: '#ff3b30' },
  ];

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div>
          <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1d1d1f] tracking-tighter leading-tight">Overview</h2>
          <p className="text-[15px] text-[#86868b] mt-1 font-medium tracking-tight">Real-time intelligence for the current cycle.</p>
        </div>
        <div className="flex w-full sm:w-auto space-x-3">
          <Button variant="secondary" className="w-full sm:w-auto"><SlidersHorizontal size={16} className="mr-2" /> Filters</Button>
          <Button variant="primary" className="w-full sm:w-auto">Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
        {metricCards.map(metric => (
          <Card key={metric.id} className="flex flex-col justify-between group cursor-default hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex justify-between items-start mb-10">
              <span className="text-[14px] font-semibold text-[#86868b] tracking-tight">{metric.label}</span>
              <Badge variant={metric.isUp ? 'green' : 'red'} className="!px-2.5 !py-0.5 !text-[10px]">
                {metric.isUp ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                {metric.change}
              </Badge>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl md:text-[42px] font-semibold text-[#1d1d1f] tracking-tighter tabular-nums leading-none">{metric.value}</h3>
              <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                 <SparklineArea data={metric.spark} color={metric.color} id={metric.id} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card noPadding className="overflow-hidden flex flex-col group">
        <div className="px-6 md:px-8 py-5 md:py-6 border-b border-black/[0.04] flex justify-between items-center bg-white/30">
          <h3 className="text-[18px] font-semibold text-[#1d1d1f] tracking-tight">Active Campaigns</h3>
          <button className="text-[14px] font-semibold text-[#0071e3] hover:text-[#0052a3] transition-colors flex items-center">
            View All <ChevronRight size={16} className="ml-0.5"/>
          </button>
        </div>
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full text-left whitespace-nowrap min-w-[700px]">
            <thead>
              <tr className="border-b border-black/[0.03] bg-black/[0.01]">
                <th className="px-6 md:px-8 py-4 text-[12px] font-semibold text-[#86868b] uppercase tracking-widest">Campaign</th>
                <th className="px-6 md:px-8 py-4 text-[12px] font-semibold text-[#86868b] uppercase tracking-widest">Status</th>
                <th className="px-6 md:px-8 py-4 text-[12px] font-semibold text-[#86868b] uppercase tracking-widest text-right">Spend</th>
                <th className="px-6 md:px-8 py-4 text-[12px] font-semibold text-[#86868b] uppercase tracking-widest text-right">Revenue</th>
                <th className="px-6 md:px-8 py-4 text-[12px] font-semibold text-[#86868b] uppercase tracking-widest text-right">ROAS</th>
                <th className="px-6 md:px-8 py-4 text-[12px] font-semibold text-[#86868b] uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03] bg-white/40">
              {MOCK_CAMPAIGNS.map(camp => (
                <tr key={camp.id} className="hover:bg-black/[0.02] transition-colors duration-300">
                  <td className="px-6 md:px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-11 h-11 shrink-0 rounded-[14px] bg-black/[0.03] ring-1 ring-black/[0.03] flex items-center justify-center text-[#1d1d1f]">
                        <Briefcase size={18} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[16px] font-semibold text-[#1d1d1f] truncate tracking-tight">{camp.name}</p>
                        <div className="flex items-center mt-1 space-x-1.5 text-[13px] text-[#86868b] font-medium">
                          {camp.trend === 'improving' ? <TrendingUp size={14} className="text-[#34c759]"/> : camp.trend === 'declining' ? <TrendingDown size={14} className="text-[#ff3b30]"/> : <Minus size={14} className="text-[#86868b]"/>}
                          <span className="capitalize">{camp.trend}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-5"><Badge variant={camp.status === 'active' ? 'green' : 'gray'}>{camp.status}</Badge></td>
                  <td className="px-6 md:px-8 py-5 text-right text-[15px] font-medium text-[#86868b] tabular-nums">${camp.spend.toLocaleString()}</td>
                  <td className="px-6 md:px-8 py-5 text-right text-[15px] font-semibold text-[#1d1d1f] tabular-nums">${camp.revenue.toLocaleString()}</td>
                  <td className="px-6 md:px-8 py-5 text-right">
                    <span className={`text-[15px] font-semibold tabular-nums ${camp.roas >= 2.5 ? 'text-[#34c759]' : camp.roas < 1 ? 'text-[#ff3b30]' : 'text-[#ff9500]'}`}>
                      {camp.roas.toFixed(2)}x
                    </span>
                  </td>
                  <td className="px-6 md:px-8 py-5 text-center">
                    {camp.action ? (
                      <button className="text-[13px] font-semibold text-[#0071e3] bg-[#0071e3]/10 hover:bg-[#0071e3]/20 px-4 py-2 rounded-full transition-colors ease-[cubic-bezier(0.16,1,0.3,1)]">
                        {camp.action}
                      </button>
                    ) : <span className="text-[#86868b]">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const RecommendationsView = () => {
  const [recs, setRecs] = useState(MOCK_RECOMMENDATIONS);

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1d1d1f] tracking-tighter leading-tight">Insights</h2>
          <p className="text-[15px] text-[#86868b] mt-1 font-medium tracking-tight">Algorithmic actions awaiting approval.</p>
        </div>
        <div className="flex p-1 bg-black/[0.04] rounded-full w-full sm:w-auto overflow-x-auto ring-1 ring-black/[0.02]">
          <button className="flex-1 sm:flex-none px-6 py-2 bg-white text-[#1d1d1f] font-semibold rounded-full text-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] whitespace-nowrap transition-all">
            Pending ({recs.filter(r=>r.status==='pending').length})
          </button>
          <button className="flex-1 sm:flex-none px-6 py-2 text-[#86868b] hover:text-[#1d1d1f] font-medium rounded-full text-[14px] transition-all whitespace-nowrap">
            History
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:gap-8">
        {recs.map(rec => (
          <Card key={rec.id} className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${rec.status !== 'pending' ? 'opacity-40 saturate-50 scale-[0.98] pointer-events-none' : ''}`}>
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
              
              {/* Left Column - Details */}
              <div className="flex-1 space-y-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-5">
                    <div className={`mt-1 shrink-0 w-14 h-14 flex items-center justify-center rounded-full ${rec.type === 'scale' ? 'bg-[#34c759]/10 text-[#248a3d]' : 'bg-[#ff3b30]/10 text-[#c9241b]'}`}>
                      {rec.type === 'scale' ? <Sparkles size={26} strokeWidth={2} /> : <AlertCircle size={26} strokeWidth={2} />}
                    </div>
                    <div>
                      <h3 className="text-[22px] md:text-[24px] font-semibold text-[#1d1d1f] leading-tight tracking-tight">{rec.title}</h3>
                      <p className="text-[16px] text-[#86868b] mt-1.5 leading-relaxed font-medium">{rec.desc}</p>
                    </div>
                  </div>
                  <Badge variant={rec.confidence === 'high' ? 'green' : 'orange'} className="shrink-0 hidden sm:inline-flex">
                    {rec.confidence} Match
                  </Badge>
                </div>
                
                <div className="ml-0 sm:ml-[76px] p-6 rounded-[20px] bg-black/[0.02] ring-1 ring-black/[0.02]">
                  <p className="text-[15px] text-[#1d1d1f] leading-relaxed">
                    <span className="font-semibold mr-2">Rationale:</span>
                    {rec.rationale}
                  </p>
                </div>
                
                <div className="ml-0 sm:ml-[76px] flex flex-wrap gap-5 pt-2">
                  <div className="flex items-center space-x-2.5 text-[#86868b]">
                    <CheckCircle2 size={18} className="text-[#34c759]" strokeWidth={2.5} />
                    <span className="font-medium text-[14px]">Suppression Safe</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-[#86868b]">
                    <CheckCircle2 size={18} className="text-[#34c759]" strokeWidth={2.5} />
                    <span className="font-medium text-[14px]">Budget Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Financials & Action */}
              <div className="lg:w-80 shrink-0 flex flex-col justify-between pt-6 lg:pt-0 lg:pl-10 lg:border-l lg:border-black/[0.05] mt-2 lg:mt-0">
                <div className="space-y-6">
                  <div>
                    <span className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2">Proj. Profit Impact</span>
                    <span className={`block text-4xl md:text-[42px] font-semibold tracking-tighter tabular-nums leading-none ${rec.impact.profit > 0 ? 'text-[#34c759]' : 'text-[#ff3b30]'}`}>
                      {rec.impact.profit > 0 ? '+' : ''}${rec.impact.profit.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2">Required Budget</span>
                    <span className="block text-[22px] font-semibold text-[#1d1d1f] tabular-nums leading-none">${rec.req.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col gap-3.5">
                  <Button 
                    variant="accent" 
                    className="w-full py-3.5 text-[15px]"
                    onClick={() => setRecs(recs.map(r => r.id === rec.id ? {...r, status: 'approved'} : r))}
                  >
                    Execute Action
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full py-3.5 text-[15px]"
                    onClick={() => setRecs(recs.map(r => r.id === rec.id ? {...r, status: 'rejected'} : r))}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentView, setCurrentView] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNavClick = (id) => {
    setCurrentView(id);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    }
    return () => { 
      if (typeof document !== 'undefined' && document.body) document.body.style.overflow = 'auto'; 
    };
  }, [isMobileMenuOpen]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] font-sans text-[#1d1d1f] selection:bg-[#0071e3]/20 selection:text-[#0071e3]">
      
      {/* Top Navbar - Apple Glass Effect */}
      <header className="sticky top-0 z-40 bg-[#fbfbfd]/70 backdrop-blur-[40px] backdrop-saturate-[180%] border-b border-black/[0.04]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-[64px] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden p-2 -ml-2 text-[#1d1d1f] focus:outline-none rounded-full hover:bg-black/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="w-8 h-8 shrink-0 rounded-full bg-[#1d1d1f] flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs tracking-widest pl-0.5">OS</span>
            </div>
            <h1 className="text-[20px] font-semibold tracking-tight hidden sm:block">RetargetOS</h1>
          </div>

          <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#34c759] shadow-[0_0_10px_rgba(52,199,89,0.8)]"></div>
              <span className="text-[12px] font-semibold text-[#86868b] tracking-wide">All Systems Nominal</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden md:flex items-center px-4 py-1.5 bg-black/[0.04] rounded-full text-[#86868b] hover:bg-black/[0.06] transition-colors cursor-text">
              <Search size={16} className="mr-2" />
              <span className="text-[14px] font-medium mr-10">Search</span>
              <kbd className="text-[12px] font-sans font-medium opacity-50">⌘K</kbd>
            </div>
            <button className="text-[#1d1d1f] hover:opacity-70 transition-opacity relative p-1.5">
              <Bell size={20} strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ff3b30] border-2 border-[#fbfbfd] rounded-full"></span>
            </button>
            <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr from-[#0071e3] to-[#409cff] flex items-center justify-center text-white font-medium text-sm shadow-[0_4px_10px_rgba(0,113,227,0.3)] cursor-pointer hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Physics-based motion */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div 
          className={`absolute top-0 left-0 w-[300px] bg-[#fbfbfd]/90 backdrop-blur-[40px] backdrop-saturate-[180%] h-full flex flex-col p-6 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <button 
            className="absolute top-6 right-6 p-2.5 text-[#86868b] hover:text-[#1d1d1f] bg-black/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
          <div className="flex items-center space-x-3 mb-10 pl-1 mt-1">
            <div className="w-9 h-9 rounded-full bg-[#1d1d1f] flex items-center justify-center">
              <span className="text-white font-bold text-xs tracking-widest pl-0.5">OS</span>
            </div>
            <h1 className="text-[20px] font-semibold tracking-tight">RetargetOS</h1>
          </div>
          <nav className="flex flex-col flex-1 relative">
            <SidebarNav currentView={currentView} onNavigate={handleNavClick} />
          </nav>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 md:py-12 flex flex-col md:flex-row gap-8 md:gap-14">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-60 shrink-0">
          <nav className="space-y-1 sticky top-[104px] flex flex-col h-[calc(100vh-140px)]">
            <SidebarNav currentView={currentView} onNavigate={handleNavClick} />
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-20">
          {currentView === 'overview' && <OverviewView />}
          {currentView === 'recommendations' && <RecommendationsView />}
          
          {/* Empty States for unbuilt views */}
          {['audiences', 'creatives', 'financial'].includes(currentView) && (
            <div className="flex flex-col items-center justify-center h-[60vh] md:h-[500px] bg-black/[0.02] rounded-[32px] ring-1 ring-black/[0.02] animate-in fade-in duration-700 px-6 text-center mt-4">
               <div className="w-20 h-20 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center mb-6">
                 <Activity size={32} strokeWidth={1.5} className="text-[#86868b]" />
               </div>
               <h3 className="text-[24px] font-semibold text-[#1d1d1f] capitalize tracking-tight">{currentView} Module</h3>
               <p className="text-[16px] text-[#86868b] mt-2 max-w-sm font-medium leading-relaxed">This operational module is not available in the current preview environment.</p>
               <Button variant="secondary" className="mt-8 px-6" onClick={() => setCurrentView('overview')}>Return to Dashboard</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
