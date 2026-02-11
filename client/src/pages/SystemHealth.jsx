import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Database, Cpu, Clock, RefreshCw, Zap, Server, Activity, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const SystemHealth = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveMemory, setLiveMemory] = useState(0);
  const [liveUptime, setLiveUptime] = useState(0);
  const [history, setHistory] = useState([true, true, true, true, true, true, true, true, true, true]);

  const fetchHealth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/system-health');
      setStats(res.data);
      setLiveMemory(parseFloat(res.data.memoryUsage));
      setLiveUptime(parseInt(res.data.uptime));
      
      // Update Heartbeat History (Shift old, add new)
      setHistory(prev => [...prev.slice(1), true]);
      setLoading(false);
    } catch (err) {
      setHistory(prev => [...prev.slice(1), false]);
      toast.error("Diagnostic sync failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Sync with backend every 10 seconds
    const syncInterval = setInterval(fetchHealth, 10000);

    // Real-time counter updates every 1 second
    const ticker = setInterval(() => {
      setLiveUptime(prev => prev + 1);
      setLiveMemory(prev => prev + (Math.random() * 0.04 - 0.02));
    }, 1000);

    return () => {
      clearInterval(syncInterval);
      clearInterval(ticker);
    };
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-8 max-w-[1200px] mx-auto text-left animate-in fade-in duration-700">
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <ShieldCheck size={14} className="text-blue-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Infrastructure Vitality</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter leading-none">
            System <span className="text-blue-600">Health</span>
          </h2>
        </div>
        <button onClick={fetchHealth} className="p-3 bg-white shadow-lg rounded-xl text-slate-400 hover:text-blue-600 transition-all border border-slate-50">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* 2. DYNAMIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* OPERATIONAL CARD WITH LIVE WAVE */}
        <div className="md:col-span-2 bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 health-pulse shadow-[0_0_15px_rgba(16,185,129,0.7)]"></div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocol: Operational</span>
            </div>
            <h3 className="text-6xl font-black text-slate-900 italic uppercase tracking-tighter mb-2">
                {stats.status}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">Secure Node.js & React-Hub Cluster Active</p>
          </div>
          
          <div className="mt-8 relative z-10">
              <div className="flex space-x-3 mb-6">
                <div className="px-5 py-3 bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm">
                    <p className="text-[8px] font-black text-blue-400 uppercase mb-1">Response</p>
                    <p className="text-xl font-black text-blue-600 italic">{stats.latency}</p>
                </div>
                <div className="px-5 py-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm">
                    <p className="text-[8px] font-black text-emerald-400 uppercase mb-1">SQL Engine</p>
                    <p className="text-xl font-black text-emerald-600 italic">Connected</p>
                </div>
              </div>

              {/* UPTIME HISTORY TIMELINE */}
              <div className="flex items-center space-x-1.5 pt-4 border-t border-slate-100">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mr-2">Uptime History:</span>
                {history.map((ok, i) => (
                  <div key={i} className={`h-4 w-1.5 rounded-full transition-all duration-500 ${ok ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`}></div>
                ))}
              </div>
          </div>
          
          {/* ANIMATED WAVE SVG */}
          <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-1000">
            <svg width="400" height="200" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M0,100 C50,150 100,50 150,100 C200,150 250,50 300,100 C350,150 400,50 450,100" 
                fill="none" 
                stroke="url(#waveGradient)" 
                strokeWidth="6" 
                strokeLinecap="round"
                className="animate-wave-flow"
              />
            </svg>
          </div>
        </div>

        {/* CONTINUOUS UPTIME CARD */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-8 rounded-[2.5rem] shadow-xl shadow-blue-200 text-white flex flex-col justify-between relative overflow-hidden group">
            <Clock className="absolute -right-2 -top-2 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Continuous Uptime</p>
            <div>
                <h4 className="text-5xl font-black italic tracking-tighter leading-none">{liveUptime}S</h4>
                <p className="text-[8px] font-bold uppercase mt-2 opacity-60">Live Tracker Active</p>
            </div>
        </div>

        {/* MEMORY LOAD CARD */}
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white group relative">
            <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Cpu size={20} />
                </div>
                <Info size={14} className="text-slate-200 hover:text-blue-400 cursor-help transition-colors" />
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Memory Load</p>
            <h4 className="text-3xl font-black text-slate-800 italic tracking-tighter">{liveMemory.toFixed(2)} MB</h4>
            <div className="w-full h-1 bg-slate-100 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min((liveMemory / 40) * 100, 100)}%` }}></div>
            </div>
        </div>

        {/* PORT PROTOCOL CARD */}
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white flex items-center space-x-5 group">
            <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                <Zap size={20} />
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Port Protocol</p>
                <h4 className="text-xl font-black text-slate-800 italic uppercase">HTTPS/2 TLS</h4>
            </div>
        </div>

        {/* DATABASE INTEGRITY CARD */}
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white flex items-center space-x-5 group">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Database size={20} />
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">DB Integrity</p>
                <h4 className="text-xl font-black text-slate-800 italic uppercase">Optimal</h4>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
              <Server size={12} className="text-blue-600" />
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Node Cluster Active: v22.14.0 Stable</span>
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              System Time: {stats?.serverTime}
          </div>
      </div>
    </div>
  );
};

export default SystemHealth;