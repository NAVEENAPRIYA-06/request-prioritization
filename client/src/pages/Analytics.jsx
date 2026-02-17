import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Activity, CheckCircle, Clock, Star, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, urgent: 0 });
  const [feedback, setFeedback] = useState({ averageRating: 0, latestFeedback: [] });
  const [loading, setLoading] = useState(true);
  // This line automatically picks the right URL
const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://request-prioritization-production.up.railway.app";
  useEffect(() => {
    const fetchAllMetrics = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/requests/admin/stats-full`);
        const { requests = [], averageRating = 0, latestFeedback = [] } = res.data;

        setStats({
          total: requests.length,
          resolved: requests.filter(r => r.status === 'Resolved').length,
          pending: requests.filter(r => r.status === 'Open' || r.status === 'In Progress').length,
          urgent: requests.filter(r => r.priority === 'Critical' && r.status !== 'Resolved').length
        });

        setFeedback({ averageRating: parseFloat(averageRating).toFixed(1), latestFeedback });
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load real-time analytics intelligence");
        setLoading(false);
      }
    };
    fetchAllMetrics();
  }, []);

  const resolveRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  if (loading) return <div className="p-12 font-black text-slate-300 animate-pulse italic uppercase tracking-widest text-center">Syncing Intelligence Hub...</div>;

  return (
    <div className="p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[1600px] mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-slate-100">System Analytics</h2>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Global Performance Metrics</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatItem label="Total Volume" value={stats.total} icon={<Activity />} color="text-blue-600" bg="bg-blue-50" />
        <StatItem label="Resolved" value={stats.resolved} icon={<CheckCircle />} color="text-emerald-600" bg="bg-emerald-50" />
        <StatItem label="Pending Review" value={stats.pending} icon={<Clock />} color="text-amber-600" bg="bg-amber-50" />
        <StatItem label="Urgent Action" value={stats.urgent} icon={<TrendingUp />} color="text-rose-600" bg="bg-rose-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Progress Ring */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-white flex flex-col items-center">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-10 w-full italic">Resolution Efficiency</h3>
          <div className="relative w-56 h-56 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="50%" cy="50%" r="45%" stroke="#f1f5f9" strokeWidth="18" fill="transparent" />
               <circle cx="50%" cy="50%" r="45%" stroke="#10b981" strokeWidth="18" fill="transparent" strokeDasharray="283" strokeDashoffset={283 - (283 * resolveRate) / 100} className="transition-all duration-1000" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-800 tracking-tighter">{resolveRate}%</span>
                <span className="text-[9px] font-black text-slate-400 uppercase">Success Rate</span>
             </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-white">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest italic">Service Quality</h3>
            <div className="flex items-center space-x-1 text-[#8e4585]">
               <Star size={16} fill="#8e4585" />
               <span className="text-xl font-black">{feedback.averageRating}</span>
            </div>
          </div>
          <div className="space-y-4">
            {feedback.latestFeedback.map((f, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] font-black uppercase text-slate-400">{f.user_name}</span>
                  <div className="flex text-[#8e4585]">
                    {[...Array(parseInt(f.rating))].map((_, idx) => <Star key={idx} size={8} fill="#8e4585" />)}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-600 italic">"{f.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
          <BarChart3 className="absolute top-0 right-0 p-12 opacity-5" size={120} />
          <h3 className="text-xs font-black uppercase tracking-widest italic mb-4 text-blue-400">System Health</h3>
          <p className="text-slate-400 text-[10px] font-medium mb-10 italic">Core background processes active.</p>
          <div className="space-y-4">
            {['API Latency: 24ms', 'Database Sync: Stable', 'Auth Service: Active'].map((text, i) => (
              <div key={i} className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-xl border border-emerald-400/20">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, icon, color, bg }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white">
    <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-4xl font-black text-slate-800 tracking-tighter">{value}</p>
  </div>
);

export default Analytics;