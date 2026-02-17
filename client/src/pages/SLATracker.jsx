import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Timer, AlertTriangle, Zap, Clock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const SLATracker = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
const API_BASE_URL = "https://request-prioritization-production.up.railway.app";
  // Fetch metrics and handle auto-escalation logic from the backend
  const fetchSLAMetrics = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/requests/sla-tracker`);
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to sync SLA intelligence");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSLAMetrics();
    // Refresh timers and escalation checks every 60 seconds
    const interval = setInterval(fetchSLAMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  // Determine visual styling based on time remaining
  const getStatusConfig = (ms) => {
    if (ms < 0) return { 
      label: 'Overdue', 
      color: 'text-rose-500', 
      bg: 'bg-rose-50', 
      border: 'border-rose-500', 
      icon: <AlertTriangle size={20} /> 
    };
    if (ms < 3600000) return { 
      label: 'Near Deadline', 
      color: 'text-amber-500', 
      bg: 'bg-amber-50', 
      border: 'border-amber-400', 
      icon: <Clock size={20} /> 
    };
    return { 
      label: 'On Track', 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-400', 
      icon: <Timer size={20} /> 
    };
  };

  const formatTime = (ms) => {
    const absoluteMs = Math.abs(ms);
    const hours = Math.floor(absoluteMs / (1000 * 60 * 60));
    const mins = Math.floor((absoluteMs % (1000 * 60 * 60)) / (1000 * 60));
    return ms < 0 ? `-${hours}h ${mins}m` : `${hours}h ${mins}m`;
  };

  if (loading) return (
    <div className="p-12 text-center font-black text-slate-300 animate-pulse uppercase tracking-[0.5em] italic">
      Syncing Live Deadlines...
    </div>
  );

  return (
    <div className="p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-slate-100">SLA Intelligence</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Live Active Request Monitoring</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-50 flex items-center space-x-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[10px] font-black uppercase text-slate-500 italic">Real-time Stream Active</span>
        </div>
      </div>

      {/* SLA List */}
      <div className="grid grid-cols-1 gap-6">
        {requests.length > 0 ? requests.map((req) => {
          const config = getStatusConfig(req.msRemaining);
          return (
            <div 
              key={req.id} 
              className={`bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border-l-8 transition-all hover:scale-[1.01] flex items-center justify-between ${config.border}`}
            >
              <div className="flex items-center space-x-8">
                {/* Status Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${config.bg} ${config.color} shadow-inner`}>
                  {config.icon}
                </div>

                {/* Info Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">{req.title}</h4>
                    
                    {/* Priority Tag */}
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      req.priority === 'Critical' ? 'bg-rose-100 text-rose-600 shadow-sm shadow-rose-100' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {req.priority}
                    </span>

                    {/* Auto-Escalation Badge */}
                    {req.autoEscalation === 'Active' && (
                      <div className="flex items-center text-[8px] font-black text-rose-600 uppercase bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg animate-bounce shadow-sm">
                        <Zap size={10} className="mr-1" /> Escalated by System
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <Clock size={10} className="mr-1" /> Status: {req.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                      ID: #{req.id.toString().padStart(4, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timer Section */}
              <div className="text-right">
                <div className={`text-4xl font-black tracking-tighter italic mb-1 ${config.color}`}>
                  {formatTime(req.msRemaining)}
                </div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  Target: {new Date(req.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
          );
        }) : (
          <div className="py-32 text-center opacity-20">
            <Timer size={64} className="mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">No Active SLA Targets Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SLATracker;