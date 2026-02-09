import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Activity, CheckCircle, Clock, Star, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, urgent: 0 });
  const [feedback, setFeedback] = useState({ averageRating: 0, latestFeedback: [], distribution: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllMetrics = async () => {
      try {
        // Fetching from the combined stats endpoint
        const res = await axios.get('http://localhost:5000/api/requests/admin/stats-full');
        
        // Destructure data from the combined response
        const { requests = [], averageRating = 0, latestFeedback = [] } = res.data;

        setStats({
          total: requests.length,
          resolved: requests.filter(r => r.status === 'Resolved').length,
          pending: requests.filter(r => r.status === 'Open' || r.status === 'Pending').length,
          urgent: requests.filter(r => r.priority === 'Critical').length
        });

        setFeedback({ 
            averageRating: parseFloat(averageRating || 0).toFixed(1), 
            latestFeedback: latestFeedback 
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Analytics Sync Error:", err);
        toast.error("Failed to load real-time analytics intelligence");
        setLoading(false);
      }
    };
    fetchAllMetrics();
  }, []);

  const resolveRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  if (loading) return (
    <div className="p-12 flex items-center justify-center min-h-screen">
      <div className="text-xs font-black text-slate-300 animate-pulse tracking-[0.5em] uppercase italic">
        Syncing Intelligence Hub...
      </div>
    </div>
  );

  return (
    <div className="p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-slate-100">System Analytics</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Resolution Efficiency Progress Ring */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-white flex flex-col items-center justify-center">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-10 w-full italic">Resolution Efficiency</h3>
          <div className="relative w-56 h-56 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="18" fill="transparent" className="text-slate-100" />
               <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="18" fill="transparent" strokeDasharray="283" strokeDashoffset={283 - (283 * resolveRate) / 100} className="text-emerald-500 transition-all duration-1000" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black text-slate-800 tracking-tighter">{resolveRate}%</span>
                <span className="text-[9px] font-black text-slate-400 uppercase block">Success Rate</span>
             </div>
          </div>
        </div>

        {/* Service Quality (Feedback) Section */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-white">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest italic">Service Quality</h3>
            <div className="flex items-center space-x-1 text-[#8e4585]">
               <Star size={16} fill="#8e4585" />
               <span className="text-xl font-black">{feedback.averageRating}</span>
            </div>
          </div>

          <div className="space-y-4">
            {feedback.latestFeedback.length > 0 ? feedback.latestFeedback.map((f) => (
              <div key={f.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] font-black uppercase text-slate-400">{f.user_name}</span>
                  <div className="flex text-[#8e4585]">
                    {[...Array(parseInt(f.rating))].map((_, i) => <Star key={i} size={8} fill="#8e4585" />)}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-600 italic line-clamp-2">"{f.comment || 'No comment provided.'}"</p>
              </div>
            )) : (
              <div className="text-center py-10 opacity-20 flex flex-col items-center">
                <MessageSquare className="mb-2 text-slate-400" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Feedback Records</p>
              </div>
            )}
          </div>
        </div>

        {/* System Health Monitor */}
        <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <BarChart3 size={120} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest italic mb-4 relative z-10 text-blue-400">System Health</h3>
          <p className="text-slate-400 text-xs font-medium mb-10 relative z-10 italic">Global Infrastructure Status</p>
          <div className="space-y-4 relative z-10">
            {['API Latency: 24ms', 'Database Sync: Stable', 'Auth Service: Active'].map((text, i) => (
              <div key={i} className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 w-fit px-4 py-2 rounded-xl border border-emerald-400/20">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
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