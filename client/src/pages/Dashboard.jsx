import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Activity, Clock, CheckCircle, AlertCircle, Layout, Zap, 
  Bell, Star, MessageSquare, X, Mail, Shield, Calendar 
} from 'lucide-react';

// --- SUB-COMPONENT: User Profile Intelligence Modal ---
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
            <div className="w-24 h-24 rounded-[2.5rem] bg-blue-50 flex items-center justify-center text-4xl font-black text-blue-600 shadow-inner border border-blue-100 mb-4 overflow-hidden">
              {user.profile_pic ? (
                <img src={user.profile_pic} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">{user.name}</h2>
            <span className="bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-2">
              System {user.role}
            </span>
          </div>

          <div className="space-y-3">
            <DetailRow icon={<Mail size={14}/>} label="Primary Email" value={user.email} />
            <DetailRow icon={<Shield size={14}/>} label="Access Tier" value={`${user.role} Access`} />
            <DetailRow icon={<Calendar size={14}/>} label="Account Active" value={new Date(user.created_at || Date.now()).toLocaleDateString()} />
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
    <div className="flex flex-col text-left">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-bold text-slate-700">{value}</span>
    </div>
  </div>
);

// --- SUB-COMPONENT: Admin Feedback Dropdown ---
const AdminNotificationDropdown = ({ feedbackList, onClose }) => (
  <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2">
    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Feedback Alerts</h4>
      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black">{feedbackList.length}</span>
    </div>
    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
      {feedbackList.length > 0 ? feedbackList.map((f) => (
        <div key={f.id} className="p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors text-left">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 font-black text-[10px] uppercase">
                {f.user_name.charAt(0)}
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-800 uppercase italic">{f.user_name}</p>
                <div className="flex text-amber-400">
                  {[...Array(f.rating)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                </div>
              </div>
            </div>
            <div className="text-[9px] font-bold text-slate-300">
              {new Date(f.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <p className="text-[10px] font-medium text-slate-500 italic pl-10">"{f.comment || 'Rated 5-stars'}"</p>
        </div>
      )) : (
        <div className="py-12 text-center opacity-30">
          <MessageSquare className="mx-auto mb-2 text-slate-400" size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No New Feedback</p>
        </div>
      )}
    </div>
    <button onClick={onClose} className="w-full py-4 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors">Close Alerts</button>
  </div>
);

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, open: 0, progress: 0, resolved: 0, urgent: 0 });
  const [adminFeedback, setAdminFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const url = isAdmin 
          ? 'http://localhost:5000/api/requests/admin/all' 
          : `http://localhost:5000/api/requests/user/${user.id}`;
        const res = await axios.get(url);
        const data = res.data;
        
        setStats({
          total: data.length,
          open: data.filter(r => r.status === 'Open').length,
          progress: data.filter(r => r.status === 'In Progress').length,
          resolved: data.filter(r => r.status === 'Resolved').length,
          urgent: data.filter(r => r.priority === 'Critical' && r.status !== 'Resolved').length
        });

        if (isAdmin) {
          const feedbackRes = await axios.get('http://localhost:5000/api/feedback/admin/notifications');
          setAdminFeedback(feedbackRes.data);
        }
      } catch (err) {
        console.error("Dashboard sync error");
      }
    };
    fetchDashboardData();
  }, [isAdmin, user.id]);

  const circumference = 565.48; 
  const total = stats.total || 1;
  const progressLevel = circumference - ((stats.progress + stats.resolved) / total) * circumference;
  const resolvedLevel = circumference - (stats.resolved / total) * circumference;

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div className="text-left">
          <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
            <Layout size={12} /> <span>SmartService Intelligence</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">
            Hello, {user.name.split(' ')[0]}
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          {isAdmin && (
            <div className="relative">
              <button 
                onClick={() => setShowFeedback(!showFeedback)}
                className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-500 hover:scale-110 transition-all relative"
              >
                <Bell size={22} />
                {adminFeedback.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse shadow-lg shadow-rose-500/50"></span>
                )}
              </button>
              
              {showFeedback && (
                <AdminNotificationDropdown 
                  feedbackList={adminFeedback} 
                  onClose={() => setShowFeedback(false)} 
                />
              )}
            </div>
          )}
          

          {/* User Profile Card Trigger */}
          <button 
            onClick={() => setShowProfile(true)}
            className="bg-white px-4 py-2 rounded-2xl border border-slate-100 flex items-center space-x-4 shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-pointer group text-left"
          >
             <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center text-slate-500 font-black text-sm border border-slate-100 shadow-inner group-hover:bg-blue-50 transition-colors">
               {user.profile_pic ? (
                 <img src={user.profile_pic} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 user.name.charAt(0)
               )}
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-800">{user.name}</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{user.role} Hub</span>
             </div>
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Volume" value={stats.total} icon={<Activity size={20}/>} color="blue" />
        <StatCard label="Pending" value={stats.open} icon={<Clock size={20}/>} color="amber" />
        <StatCard label="Completed" value={stats.resolved} icon={<CheckCircle size={20}/>} color="emerald" />
        <StatCard label="Critical" value={stats.urgent} icon={<AlertCircle size={20}/>} color="rose" pulse={stats.urgent > 0} />
      </div>

      {/* CHARTS & INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200/40 border border-slate-50 text-left">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-12 text-center lg:text-left">Service Distribution</h3>
          <div className="flex flex-col md:flex-row items-center justify-around gap-12">
            <div className="relative w-80 h-80 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" stroke="#f1f5f9" strokeWidth="18" fill="transparent" />
                <circle cx="100" cy="100" r="90" stroke="#fbbf24" strokeWidth="18" fill="transparent" strokeDasharray={circumference} strokeDashoffset={0} />
                <circle cx="100" cy="100" r="90" stroke="#3b82f6" strokeWidth="18" fill="transparent" strokeDasharray={circumference} strokeDashoffset={progressLevel} className="animate-pulse" />
                <circle cx="100" cy="100" r="90" stroke="#10b981" strokeWidth="18" fill="transparent" strokeDasharray={circumference} strokeDashoffset={resolvedLevel} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-7xl font-black text-slate-800 tracking-tighter leading-none">{stats.total}</span>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Global Total</span>
              </div>
            </div>
            <div className="space-y-4 w-full max-w-sm">
              <LegendItem color="bg-amber-400" label="Open / New" count={stats.open} />
              <LegendItem color="bg-blue-500" label="In Progress" count={stats.progress} />
              <LegendItem color="bg-emerald-500" label="Resolved" count={stats.resolved} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group text-left">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={160} /></div>
          <div className="relative z-10">
            <h3 className="text-xl font-black italic uppercase tracking-tight mb-4 flex items-center space-x-2"><Zap size={20} className="text-amber-400" /><span>Smart Insights</span></h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">{isAdmin ? "Review critical priority requests to maintain high resolution efficiency." : "Service tickets are being evaluated by the administration."}</p>
          </div>
          <button className="relative z-10 w-full py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl border border-white/20 transition-all font-black text-[10px] uppercase tracking-widest italic shadow-lg">Analytics Overview</button>
        </div>
      </div>

      {/* User Intelligence Modal Triggered by Header */}
      {showProfile && (
        <UserProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color, pulse }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-white hover:-translate-y-1 transition-all duration-300 text-left">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${color === 'blue' ? 'bg-blue-50 text-blue-500' : color === 'amber' ? 'bg-amber-50 text-amber-500' : color === 'emerald' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center space-x-3">
      <p className="text-4xl font-black text-slate-800 tracking-tighter">{value}</p>
      {pulse && <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />}
    </div>
  </div>
);

const LegendItem = ({ color, label, count }) => (
  <div className="flex items-center justify-between p-5 bg-slate-50/40 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
    <div className="flex items-center space-x-4">
      <div className={`w-3 h-3 rounded-full ${color} shadow-sm`} />
      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-xl font-black text-slate-800">{count}</span>
  </div>
);

export default Dashboard;