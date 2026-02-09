import React from 'react';
import { Star, Clock, User, MessageSquare } from 'lucide-react';

const AdminNotificationDropdown = ({ feedbackList, onClose }) => {
  return (
    <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New User Feedback</h4>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black">{feedbackList.length} New</span>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {feedbackList.length > 0 ? feedbackList.map((f) => (
          <div key={f.id} className="p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-default">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-800 uppercase italic">{f.user_name}</p>
                  <div className="flex text-amber-400">
                    {[...Array(f.rating)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-[9px] font-bold text-slate-300">
                <Clock size={10} className="mr-1" />
                {new Date(f.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <p className="text-[10px] font-medium text-slate-500 italic pl-10">"{f.comment || 'Rated without comment'}"</p>
            <p className="text-[8px] font-black text-slate-300 uppercase mt-2 pl-10">
              {new Date(f.created_at).toLocaleDateString()}
            </p>
          </div>
        )) : (
          <div className="py-12 text-center opacity-30">
            <MessageSquare className="mx-auto mb-2" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest">No Feedback Yet</p>
          </div>
        )}
      </div>
      <button 
        onClick={onClose}
        className="w-full py-4 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors"
      >
        Close Panel
      </button>
    </div>
  );
};

export default AdminNotificationDropdown;