import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplet, 
  Flame, 
  Dumbbell, 
  TrendingUp, 
  Calendar as CalendarIcon,
  ChevronRight,
  Menu,
  Settings,
  Bell,
  Search,
  Plus,
  Zap,
  Coffee,
  Trophy,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Apple
} from 'lucide-react';
import './_group.css';

// SVG components for smooth rings and charts
const ProgressRing = ({ percentage, color = "#22c55e", size = 120, strokeWidth = 8, children }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 1.5s ease-in-out"
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
};

const Sparkline = ({ data, color = "#22c55e", height = 40, width = 100 }: any) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((d: number, i: number) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon 
        points={`0,${height} ${points} ${width},${height}`} 
        fill={`url(#gradient-${color})`} 
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const MacroDonut = ({ protein, carbs, fat, size = 160, strokeWidth = 12 }: any) => {
  const total = protein + carbs + fat;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const proteinPct = protein / total;
  const carbsPct = carbs / total;
  const fatPct = fat / total;
  
  const proteinOffset = 0;
  const carbsOffset = proteinPct * circumference;
  const fatOffset = (proteinPct + carbsPct) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Fat - Orange */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f97316"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${fatPct * circumference - 4} ${circumference}`}
          strokeDashoffset={-fatOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        {/* Carbs - Blue */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${carbsPct * circumference - 4} ${circumference}`}
          strokeDashoffset={-carbsOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        {/* Protein - Green */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#22c55e"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${proteinPct * circumference - 4} ${circumference}`}
          strokeDashoffset={-proteinOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-white tracking-tight">{Math.round((protein/total)*100)}%</span>
        <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Protein</span>
      </div>
    </div>
  );
};


export function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayStr = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  }).format(new Date());

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0b0c10] font-dm text-[#e2e8f0] flex overflow-hidden selection:bg-[#22c55e] selection:text-black">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 bg-[#0b0c10]/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
          <div className={`flex items-center gap-3 overflow-hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <div className="h-8 w-8 rounded-lg bg-[#22c55e] flex items-center justify-center text-black font-bold text-xl">H</div>
            <span className="font-bold text-xl tracking-tight text-white whitespace-nowrap">Hanma</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -mr-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
          {[
            { icon: Activity, label: 'Dashboard', active: true },
            { icon: Dumbbell, label: 'Workouts' },
            { icon: Apple, label: 'Nutrition' },
            { icon: TrendingUp, label: 'Progress' },
            { icon: Target, label: 'Goals' },
            { icon: CalendarIcon, label: 'Schedule' }
          ].map((item, i) => (
            <a 
              key={i} 
              href="#" 
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                item.active 
                  ? 'bg-white/5 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {item.active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#22c55e] rounded-r-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              )}
              <item.icon size={22} className={item.active ? 'text-[#22c55e]' : 'group-hover:text-gray-300 transition-colors'} />
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 hidden'}`}>
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <a href="#" className={`flex items-center gap-4 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200`}>
            <Settings size={22} />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Settings
            </span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#0b0c10]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex flex-col animate-fade-in">
            <span className="text-sm font-medium text-gray-400 tracking-wide uppercase">{todayStr}</span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Good morning, Rahul.</h1>
          </div>
          
          <div className="flex items-center gap-6 animate-fade-in">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-[#15171e] text-sm text-white placeholder-gray-500 rounded-full pl-10 pr-4 py-2 border border-white/5 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/50 transition-all w-64"
              />
            </div>
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#22c55e] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            </button>
            <div className="h-10 w-10 rounded-full border border-white/10 overflow-hidden cursor-pointer hover:border-[#22c55e]/50 transition-colors p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                <img src="/__mockup/images/rahul-avatar.jpg" alt="Rahul" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Quick Actions Row */}
          <div className="flex gap-4 mb-8 animate-fade-in stagger-1">
            {[
              { icon: Apple, label: 'Log Meal', color: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20' },
              { icon: Droplet, label: 'Log Water', color: 'bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/20' },
              { icon: Dumbbell, label: 'Start Workout', color: 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20 hover:bg-[#22c55e]/20', primary: true },
              { icon: Activity, label: 'View Progress', color: 'bg-white/5 text-gray-300 border-white/10' },
            ].map((action, i) => (
              <button 
                key={i} 
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${action.color} ${action.primary ? 'shadow-[0_0_20px_rgba(34,197,94,0.15)] ring-1 ring-[#22c55e]/30' : ''}`}
              >
                <action.icon size={18} />
                <span className="font-semibold text-sm tracking-wide">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
            
            {/* Calories Ring - Large */}
            <div className="col-span-4 row-span-2 glass-panel rounded-3xl p-6 flex flex-col relative overflow-hidden animate-fade-in stagger-2">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Flame size={120} />
              </div>
              <div className="flex items-center justify-between mb-8 z-10">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Flame className="text-orange-500" size={20} />
                  Energy
                </h2>
                <button className="text-gray-400 hover:text-white"><ChevronRight size={20} /></button>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center z-10 mt-4">
                <ProgressRing percentage={(1820 / 2450) * 100} color="#22c55e" size={220} strokeWidth={14}>
                  <span className="text-4xl font-bold text-white tracking-tighter mb-1">1,820</span>
                  <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">/ 2,450 kcal</span>
                </ProgressRing>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8 z-10 border-t border-white/5 pt-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Active</p>
                  <p className="text-xl font-bold text-white">450 <span className="text-sm text-gray-500 font-normal">kcal</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Resting</p>
                  <p className="text-xl font-bold text-white">1,820 <span className="text-sm text-gray-500 font-normal">kcal</span></p>
                </div>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="col-span-8 row-span-1 glass-panel rounded-3xl p-6 relative overflow-hidden animate-fade-in stagger-3 bg-gradient-to-br from-[#111218] to-[#151b1e]">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#22c55e]">
                  <Zap size={18} className="fill-[#22c55e]" />
                  <span className="text-sm font-bold uppercase tracking-wider">Hanma Intelligence</span>
                </div>
              </div>
              <h3 className="text-2xl font-medium text-white leading-snug max-w-2xl">
                Your recovery is peaking. Based on your last 7 days of sleep and nutrition, you're primed for today's <span className="text-[#22c55e] font-bold">Push Day</span>. Increase your protein intake by 15g post-workout to optimize muscle synthesis.
              </h3>
              <div className="mt-6 flex items-center gap-4">
                <button className="bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors border border-white/5">
                  View Analysis
                </button>
                <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                  Dismiss
                </button>
              </div>
            </div>

            {/* Macros Donut */}
            <div className="col-span-4 row-span-1 glass-panel rounded-3xl p-6 flex flex-col justify-between animate-fade-in stagger-4">
               <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-white">Macros</h2>
                <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded-md">Today</span>
              </div>
              <div className="flex items-center justify-between h-full">
                <MacroDonut protein={145} carbs={180} fat={65} size={130} strokeWidth={10} />
                <div className="flex flex-col gap-3 justify-center pl-4 border-l border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#22c55e]" /> Protein</span>
                    <span className="text-lg font-bold text-white leading-none">145<span className="text-xs text-gray-500 font-medium">g</span></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Carbs</span>
                    <span className="text-lg font-bold text-white leading-none">180<span className="text-xs text-gray-500 font-medium">g</span></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#f97316]" /> Fat</span>
                    <span className="text-lg font-bold text-white leading-none">65<span className="text-xs text-gray-500 font-medium">g</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Workout */}
            <div className="col-span-4 row-span-1 glass-panel rounded-3xl p-0 relative overflow-hidden group animate-fade-in stagger-5 border-[#22c55e]/20">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#111218]/80 to-transparent z-10" />
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 bg-[url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
              
              <div className="relative z-20 h-full p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-md">
                    Scheduled
                  </div>
                  <button className="bg-white/10 p-2 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors">
                    <ArrowUpRight size={16} className="text-white" />
                  </button>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Push Day</h3>
                  <p className="text-sm text-gray-300 font-medium flex items-center gap-2">
                    <Dumbbell size={14} className="text-[#22c55e]" /> 6 exercises • 45 mins
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="col-span-12 grid grid-cols-4 gap-6 animate-fade-in stagger-6">
              
              {/* Water */}
              <div className="glass-panel rounded-3xl p-5 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-[#0ea5e9]/10 rounded-xl text-[#0ea5e9]">
                    <Droplet size={20} />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Target: 3.5L</span>
                </div>
                <div className="mt-auto">
                  <div className="flex items-end gap-1 mb-2">
                    <h3 className="text-3xl font-bold text-white tracking-tight">2.1</h3>
                    <span className="text-gray-400 font-medium pb-1">L</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0ea5e9] rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>

              {/* Body Fat */}
              <div className="glass-panel rounded-3xl p-5 flex flex-col">
                 <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
                    <Activity size={20} />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-1 rounded-md">
                    <ArrowDownRight size={12} /> 1.2%
                  </span>
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-bold text-white tracking-tight mb-1">23<span className="text-xl text-gray-400 font-medium ml-1">%</span></h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Body Fat</p>
                </div>
              </div>

              {/* Weight */}
              <div className="glass-panel rounded-3xl p-5 flex flex-col">
                 <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <Target size={20} />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Goal: 75kg</span>
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-bold text-white tracking-tight mb-1">78.0<span className="text-xl text-gray-400 font-medium ml-1">kg</span></h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Current Weight</p>
                </div>
              </div>

              {/* Streak */}
              <div className="glass-panel rounded-3xl p-5 flex flex-col relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
                  <Trophy size={100} />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-500">
                    <Flame size={20} className="fill-yellow-500/20" />
                  </div>
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-bold text-white tracking-tight mb-1">14<span className="text-xl text-gray-400 font-medium ml-1">days</span></h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Active Streak</p>
                </div>
              </div>

            </div>

            {/* Weekly Activity Line Chart */}
            <div className="col-span-12 glass-panel rounded-3xl p-6 animate-fade-in stagger-7">
               <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Activity Strain</h2>
                  <p className="text-sm text-gray-500">Caloric expenditure over the last 7 days</p>
                </div>
                <select className="bg-[#15171e] text-sm text-white border border-white/5 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#22c55e]">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-40 w-full mt-4 relative">
                {/* Dummy chart lines - normally Recharts */}
                <div className="absolute inset-0 flex items-end">
                   <Sparkline data={[2100, 2400, 1800, 2800, 2200, 2900, 2450]} color="#22c55e" height={160} width={1000} />
                </div>
                {/* X-axis labels */}
                <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-500 font-medium transform translate-y-6 px-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex gap-8">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Weekly Avg</p>
                  <p className="text-xl font-bold text-white">2,378 <span className="text-sm text-gray-500 font-normal">kcal/day</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Highest Day</p>
                  <p className="text-xl font-bold text-white">2,900 <span className="text-sm text-gray-500 font-normal">kcal</span></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
