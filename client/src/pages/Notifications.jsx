import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, Info, AlertTriangle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  const themeColor = isAdmin ? 'text-[#0077be]' : 'text-[#8e4585]';
  const bgColor = isAdmin ? 'bg-[#0077be]' : 'bg-[#8e4585]';

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/${user.id}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Notification sync error");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user.id]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/read/${id}`);
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to update notification");
    }
  };

  return (
    <div className="p-12 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className={`text-5xl font-black ${themeColor} tracking-tighter italic uppercase underline decoration-slate-200`}>Notifications</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Stay updated on your workspace activity</p>
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full">
          {notifications.filter(n => !n.is_read).length} Unread
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => !n.is_read && markAsRead(n.id)}
              className={`group relative bg-white p-8 rounded-[2.5rem] border transition-all duration-300 flex items-start space-x-6 cursor-pointer ${
                n.is_read ? 'opacity-60 border-slate-100' : `border-white shadow-xl shadow-slate-200/40 hover:-translate-y-1`
              }`}
            >
              <div className={`p-4 rounded-2xl ${
                n.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                n.type === 'alert' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
              }`}>
                {n.type === 'success' ? <CheckCircle size={24}/> : n.type === 'alert' ? <AlertTriangle size={24}/> : <Info size={24}/>}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">{n.title}</h4>
                  <span className="text-[9px] font-bold text-slate-300 uppercase flex items-center">
                    <Clock size={10} className="mr-1"/> {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-500 leading-relaxed">{n.message}</p>
              </div>

              {!n.is_read && (
                <div className={`w-2 h-2 rounded-full ${bgColor} animate-pulse absolute top-8 right-8`} />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Bell size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Your inbox is clear</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;