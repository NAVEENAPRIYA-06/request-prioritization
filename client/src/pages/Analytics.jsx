import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, PieChart, TrendingUp, Activity, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, urgent: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/requests/admin/all');
        const data = res.data;
        setStats({
          total: data.length,
          resolved: data.filter(r => r.status === 'Resolved').length,
          pending: data.filter(r => r.status === 'Open').length,
          urgent: data.filter(r => r.priority === 'Critical').length
        });
      } catch (err) {
        toast.error("Failed to load real-time analytics");
      }
    };
    fetchStats();
  }, []);

  const resolveRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">System Analytics</h2>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Global Performance Metrics</p>
      </div>

      {/* Main Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Total Volume', value: stats.total, icon: <Activity />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Resolved', value: stats.resolved, icon: <CheckCircle />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Review', value: stats.pending, icon: <Clock />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Urgent Action', value: stats.urgent, icon: <TrendingUp />, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white">
            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
              {item.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
            <p className="text-4xl font-black text-slate-800 tracking-tighter">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Visual Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-white flex flex-col items-center">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic mb-10 w-full">Resolution Efficiency</h3>
          <div className="relative w-64 h-64 flex items-center justify-center">
             {/* Progress Ring */}
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-slate-100" />
               <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray="283" strokeDashoffset={283 - (283 * resolveRate) / 100} className="text-emerald-500 transition-all duration-1000" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-800">{resolveRate}%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase">Success Rate</span>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <BarChart3 size={120} />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tighter italic mb-4 relative z-10 text-blue-400">System Health</h3>
          <p className="text-slate-400 font-medium mb-10 relative z-10">All background processes are operating within normal parameters.</p>
          <div className="space-y-6 relative z-10">
            {['API Latency: 24ms', 'Database Sync: Stable', 'Auth Service: Active'].map((text, i) => (
              <div key={i} className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 w-fit px-4 py-2 rounded-xl">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;