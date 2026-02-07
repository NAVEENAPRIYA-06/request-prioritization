import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Clock, CheckCircle, AlertCircle, Layout, Zap } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, open: 0, progress: 0, resolved: 0, urgent: 0 });
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = isAdmin 
          ? 'http://localhost:5000/api/requests/admin/all' 
          : `http://localhost:5000/api/requests/user/${user.id}`;
        const res = await axios.get(url);
        const data = res.data;
        
        setStats({
          total: data.length,
          open: data.filter(r => r.status === 'Open').length,
          progress: data.filter(r => r.status === 'In Progress').length,
          resolved: data.filter(r => r.status === 'Resolved').length,
          urgent: data.filter(r => r.priority === 'Critical' && r.status !== 'Resolved').length
        });
      } catch (err) {
        console.error("Dashboard sync error");
      }
    };
    fetchStats();
  }, [isAdmin, user.id]);

  // --- CHART MATH ---
  const circumference = 565.48; // 2 * PI * 90
  const total = stats.total || 1;

  // Layering logic: bottom to top
  // Layer 1: Yellow (Full Total start)
  const openLevel = 0; 
  
  // Layer 2: Blue (Progress + Resolved) covers part of the Yellow
  const progressLevel = circumference - ((stats.progress + stats.resolved) / total) * circumference;
  
  // Layer 3: Green (Resolved) covers part of the Blue
  const resolvedLevel = circumference - (stats.resolved / total) * circumference;

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
            <Layout size={12} /> <span>SmartService Intelligence</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">
            Hello, {user.name.split(' ')[0]}
          </h1>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 flex items-center space-x-3 shadow-sm">
           <div className={`w-3 h-3 rounded-full ${isAdmin ? 'bg-[#0077be]' : 'bg-[#8e4585]'} animate-pulse`} />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{user.role} Hub</span>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Volume" value={stats.total} icon={<Activity size={20}/>} color="blue" />
        <StatCard label="Pending" value={stats.open} icon={<Clock size={20}/>} color="amber" />
        <StatCard label="Completed" value={stats.resolved} icon={<CheckCircle size={20}/>} color="emerald" />
        <StatCard label="Critical" value={stats.urgent} icon={<AlertCircle size={20}/>} color="rose" pulse={stats.urgent > 0} />
      </div>

      {/* Main Analytics Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200/40 border border-slate-50">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-12 text-center lg:text-left">Service Distribution</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-around gap-12">
            
            <div className="relative w-80 h-80 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Track */}
                <circle cx="100" cy="100" r="90" stroke="#f1f5f9" strokeWidth="18" fill="transparent" />
                
                {/* Layer 1: Amber/Yellow (Open/New) */}
                <circle cx="100" cy="100" r="90" stroke="#fbbf24" strokeWidth="18" fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={openLevel} />
                
                {/* Layer 2: Blue (In Progress + Resolved) */}
                <circle cx="100" cy="100" r="90" stroke="#3b82f6" strokeWidth="18" fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={progressLevel} 
                  className="animate-pulse" />
                
                {/* Layer 3: Green (Resolved Only) */}
                <circle cx="100" cy="100" r="90" stroke="#10b981" strokeWidth="18" fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={resolvedLevel} 
                  className="transition-all duration-1000" />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-7xl font-black text-slate-800 tracking-tighter leading-none">{stats.total}</span>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Global Total</span>
              </div>
            </div>

            {/* Legend Area with Fixed Amber Dot */}
            <div className="space-y-4 w-full max-w-sm">
              <LegendItem color="bg-amber-400" label="Open / New" count={stats.open} />
              <LegendItem color="bg-blue-500" label="In Progress" count={stats.progress} />
              <LegendItem color="bg-emerald-500" label="Resolved" count={stats.resolved} />
              
              <div className="pt-6 mt-2 border-t border-slate-100 flex items-center justify-between px-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Sync</span>
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Insight Card */}
        <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={160} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-black italic uppercase tracking-tight mb-4 flex items-center space-x-2">
              <Zap size={20} className="text-amber-400" />
              <span>Smart Insights</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              {isAdmin 
                ? "Immediate review required for critical priority requests. Monitor the queue to maintain high resolution efficiency." 
                : "Your service tickets are being evaluated by the administration. Status updates will trigger in your personal notification hub."}
            </p>
          </div>
          <button className="relative z-10 w-full py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl border border-white/20 transition-all font-black text-[10px] uppercase tracking-widest italic shadow-lg">
            Analytics Overview
          </button>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatCard = ({ label, value, icon, color, pulse }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-white hover:-translate-y-1 transition-all duration-300">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${
      color === 'blue' ? 'bg-blue-50 text-blue-500' :
      color === 'amber' ? 'bg-amber-50 text-amber-500' :
      color === 'emerald' ? 'bg-emerald-50 text-emerald-500' :
      'bg-rose-50 text-rose-500'
    }`}>
      {icon}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center space-x-3">
      <p className="text-4xl font-black text-slate-800 tracking-tighter">{value}</p>
      {pulse && <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />}
    </div>
  </div>
);

const LegendItem = ({ color, label, count }) => (
  <div className="flex items-center justify-between p-5 bg-slate-50/40 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-default">
    <div className="flex items-center space-x-4">
      <div className={`w-3 h-3 rounded-full ${color} shadow-sm`} />
      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-xl font-black text-slate-800">{count}</span>
  </div>
);

export default Dashboard;