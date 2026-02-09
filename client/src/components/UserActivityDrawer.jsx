import React from 'react';
import { X, FileText, Star, Activity } from 'lucide-react';

const UserActivityDrawer = ({ user, stats, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.05)] z-[110] border-l border-slate-100 animate-in slide-in-from-right duration-500 flex flex-col">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">Member Intelligence</h3>
        <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all text-slate-300 hover:text-rose-500">
          <X size={20} />
        </button>
      </div>

      <div className="p-10 flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-[2rem] bg-blue-50 mx-auto mb-4 flex items-center justify-center text-3xl font-black text-blue-500 shadow-inner">
            {user.name.charAt(0)}
          </div>
          <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">{user.name}</h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{user.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
            <Star size={16} className="mx-auto mb-2 text-amber-400" fill="currentColor" />
            <p className="text-2xl font-black text-slate-800 tracking-tighter">{stats.rating}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase">Avg Rating</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
            <Activity size={16} className="mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-black text-slate-800 tracking-tighter">
              {stats.requests.reduce((acc, curr) => acc + curr.count, 0)}
            </p>
            <p className="text-[8px] font-black text-slate-400 uppercase">Total Req</p>
          </div>
        </div>

        {/* Request Breakdown */}
        <div className="space-y-3">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4">Lifecycle Distribution</p>
          {stats.requests.map((s, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-slate-500 uppercase italic">{s.status}</span>
              <span className="text-xs font-black text-slate-800">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserActivityDrawer;