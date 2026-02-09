import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, 
  TrendingUp, Calendar, Zap, ShieldCheck, Activity, CheckCircle, Clock
} from 'recharts';

const Analytics = () => {
  // Initialize with default values to prevent "undefined" crashes
  const [data, setData] = useState({ 
    trendData: [], 
    stats: { total: 0, resolved: 0, pending: 0, urgent: 0 } 
  });
  const [timeframe, setTimeframe] = useState('DAILY');
  const themeColor = "text-[#0077be]";
  const bgColor = "bg-[#0077be]";

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/requests/admin/analytics?timeframe=${timeframe.toLowerCase()}`);
        setData(res.data);
      } catch (err) {
        console.error("Analytics sync error");
      }
    };
    fetchAnalytics();
  }, [timeframe]);

  // Calculate success rate safely
  const successRate = data.stats?.total > 0 
    ? ((data.stats.resolved / data.stats.total) * 100).toFixed(0) 
    : 0;

  return (
    <div className="p-12 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-slate-100">System Analytics</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Global Performance Metrics</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          {['DAILY', 'WEEKLY', 'MONTHLY'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                timeframe === t ? `${bgColor} text-white shadow-lg shadow-blue-500/20` : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <StatCard label="Total Volume" value={data.stats?.total} color="blue" />
        <StatCard label="Resolved" value={data.stats?.resolved} color="emerald" />
        <StatCard label="Pending" value={data.stats?.pending} color="amber" />
        <StatCard label="Urgent" value={data.stats?.urgent} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Efficiency Gauge */}
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-white flex flex-col items-center">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-10 w-full">Resolution Efficiency</h3>
          <div className="relative w-64 h-64 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" cy="50" r="45" stroke="#10b981" strokeWidth="8" fill="transparent" 
                  strokeDasharray="282.7" 
                  strokeDashoffset={282.7 - (282.7 * (successRate / 100))}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-800 tracking-tighter">{successRate}%</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Success Rate</span>
             </div>
          </div>
        </div>

        {/* The Graph - Added h-[400px] to fix "width/height should be greater than 0" error */}
        <div className="lg:col-span-2 bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden h-[450px]">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3 italic">
                <TrendingUp className="text-[#0077be]" size={20} />
                <h3 className="text-xs font-black uppercase tracking-[0.3em]">System Traffic Trend</h3>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center">
                <Calendar size={12} className="mr-2"/> LIVE FEED: {timeframe}
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trendData}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0077be" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0077be" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px', fontWeight: '900' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#0077be" 
                    strokeWidth={5} 
                    fillOpacity={1} 
                    fill="url(#colorTrend)" 
                    animationDuration={2000}
                  />
                  <XAxis dataKey="label" stroke="#475569" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} dy={15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl flex flex-col justify-between">
           <div>
              <h4 className="text-sm font-black text-[#0077be] italic uppercase tracking-widest mb-4">System Health</h4>
              <p className="text-xs font-bold text-slate-400 leading-relaxed mb-8">All background processes are operating within normal parameters.</p>
              <div className="space-y-3">
                 <HealthPill label="API Latency" value="24ms" />
                 <HealthPill label="Database Sync" value="Stable" />
                 <HealthPill label="Auth Service" value="Online" />
              </div>
           </div>
           <Zap className="opacity-5 self-end" size={80} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className={`text-4xl font-black tracking-tighter ${
        color === 'blue' ? 'text-blue-500' : 
        color === 'emerald' ? 'text-emerald-500' : 
        color === 'amber' ? 'text-amber-500' : 'text-rose-500'
    }`}>{value || 0}</div>
  </div>
);

const HealthPill = ({ label, value }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
     <span className="text-[10px] font-black uppercase text-slate-400">{label}: <span className="text-emerald-400">{value}</span></span>
     <ShieldCheck size={14} className="text-emerald-400 opacity-50" />
  </div>
);

export default Analytics;