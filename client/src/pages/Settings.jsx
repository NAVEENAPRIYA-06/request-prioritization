import React from 'react';
import { User, Shield, Key } from 'lucide-react';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="p-12 animate-in fade-in duration-700">
      <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase mb-10">Account Settings</h2>
      
      <div className="max-w-2xl space-y-6">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-white flex items-center space-x-6">
          <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 italic">{user.name}</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{user.role} Access Level</p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white">
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center space-x-4">
              <Shield className="text-blue-500" size={20} />
              <span className="text-sm font-bold text-slate-700">Email Address</span>
            </div>
            <span className="text-xs font-black text-slate-400">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;