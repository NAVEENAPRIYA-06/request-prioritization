import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // RESTORED: Hardcoded to local server
        const res = await axios.get(`http://localhost:5000/api/requests/user/${user.id}`);
        const sorted = res.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setNotifications(sorted);
      } catch (err) {
        console.error("Notification sync error");
      }
    };
    fetchNotifications();
  }, [user.id]);

  return (
    <div className="p-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-[#8e4585]/20">
          Activity Feed
        </h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
          Real-time service updates for {user.name}
        </p>
      </div>

      <div className="max-w-5xl space-y-6">
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <div key={note.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white flex items-center justify-between group hover:scale-[1.01] transition-all">
              <div className="flex items-center space-x-8">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner ${
                  note.status === 'Resolved' ? 'bg-emerald-50 text-emerald-500' : 
                  note.status === 'In Progress' ? 'bg-blue-50 text-blue-500 animate-pulse' : 
                  'bg-amber-50 text-amber-500'
                }`}>
                  {note.status === 'Resolved' ? <CheckCircle size={28} /> : 
                   note.status === 'In Progress' ? <Activity size={28} /> : 
                   <Clock size={28} />}
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ticket #REQ-{note.id}</span>
                    <ArrowRight size={12} className="text-slate-300" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      note.priority === 'Critical' ? 'text-rose-500' : 'text-slate-400'
                    }`}>
                      {note.priority} Priority
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-slate-800 italic uppercase tracking-tight">
                    {note.title}
                  </h4>
                  <p className="text-sm font-bold text-slate-400 mt-1">
                    Your request moved to <span className={`italic ${
                      note.status === 'Resolved' ? 'text-emerald-500' : 'text-[#8e4585]'
                    }`}>{note.status}</span>
                  </p>
                </div>
              </div>

              <div className="text-right hidden md:block">
                <p className="text-xs font-black text-slate-800 uppercase italic">
                  {new Date(note.updated_at || note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                  {new Date(note.updated_at || note.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50 p-24 rounded-[4rem] text-center border-2 border-dashed border-slate-200">
            <Bell size={48} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-slate-300 font-black uppercase text-sm tracking-widest italic">All Quiet on the Western Front</h3>
            <p className="text-slate-300 text-xs font-bold mt-2">No active notifications found for your account.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Activity = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export default Notifications;