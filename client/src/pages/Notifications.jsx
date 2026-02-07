import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, Clock, CheckCircle, MessageSquare } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetching user's requests to show status changes as notifications
        const res = await axios.get(`http://localhost:5000/api/requests/user/${user.id}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications");
      }
    };
    fetchNotifications();
  }, [user.id]);

  return (
    <div className="p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-[#8e4585]/20">Notifications</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Live Request Updates</p>
      </div>

      <div className="max-w-4xl space-y-4">
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <div key={note.id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white flex items-center justify-between group hover:border-purple-100 transition-all">
              <div className="flex items-center space-x-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  note.status === 'Resolved' ? 'bg-emerald-50 text-emerald-500' : 'bg-purple-50 text-[#8e4585]'
                }`}>
                  {note.status === 'Resolved' ? <CheckCircle size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 italic uppercase text-sm">
                    Request #{note.id}: {note.title}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">
                    Status updated to <span className="text-[#8e4585] italic">{note.status}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  {new Date(note.updated_at || note.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50 p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
            <Bell size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No new alerts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;