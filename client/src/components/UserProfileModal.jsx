// client/src/components/UserProfileModal.jsx
import React from 'react';
import { X, Mail, Shield, Calendar, User as UserIcon } from 'lucide-react';

const UserProfileModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[200] animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">Account Intelligence</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-rose-500 transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-24 h-24 rounded-[2.5rem] bg-blue-50 flex items-center justify-center text-4xl font-black text-blue-600 shadow-inner border border-blue-100 mb-4">
              {user.profile_pic ? <img src={user.profile_pic} className="w-full h-full object-cover" alt="" /> : user.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">{user.name}</h2>
            <span className="bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-2">
              System {user.role}
            </span>
          </div>

          <div className="space-y-3">
            <DetailRow icon={<Mail size={14}/>} label="Primary Email" value={user.email} />
            <DetailRow icon={<Shield size={14}/>} label="Access Tier" value={`${user.role} Access`} />
            <DetailRow icon={<Calendar size={14}/>} label="Account Since" value={new Date(user.created_at || Date.now()).toLocaleDateString()} />
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#8e4585] transition-all shadow-lg"
          >
            Close Intelligence
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
    <div className="text-blue-500">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-bold text-slate-700">{value}</span>
    </div>
  </div>
);

export default UserProfileModal;