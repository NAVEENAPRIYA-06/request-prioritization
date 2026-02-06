import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  ClipboardList, 
  PlusCircle, 
  LogOut, 
  User, 
  Bell,
  ShieldCheck,
  Settings
} from 'lucide-react';
import RequestChart from '../components/RequestChart';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, highPriority: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      axios.get(`http://localhost:5000/api/requests/stats/${parsedUser.id}/${parsedUser.role}`)
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  
  // NEW THEME COLOR VARIABLES
  // Admin: Ocean/Azure Blue Profile
  // Employee: Plum Profile
  const sidebarBg = isAdmin ? 'bg-[#0077be]' : 'bg-[#8e4585]'; // Azure vs Plum
  const activeBtn = isAdmin ? 'bg-[#005a92]' : 'bg-[#72376a]'; // Darker shades for active state
  const accentColor = isAdmin ? 'text-blue-100' : 'text-purple-100';
  const iconBg = isAdmin ? 'bg-blue-50 text-[#0077be]' : 'bg-purple-50 text-[#8e4585]';

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`w-64 ${sidebarBg} text-white flex flex-col shadow-2xl transition-all duration-500`}>
        <div className="p-8 text-center border-b border-white/10">
          <h1 className="text-2xl font-black tracking-tighter italic">
            {isAdmin ? 'AdminHub' : 'RequestHub'}
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link to="/dashboard" className={`flex items-center w-full p-3.5 space-x-3 ${activeBtn} rounded-2xl shadow-lg`}>
            <LayoutDashboard size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
          </Link>

          {!isAdmin && (
            <>
              <NavLink to="/my-requests" icon={<ClipboardList size={20} />} label="My Requests" />
              <NavLink to="/new-request" icon={<PlusCircle size={20} />} label="New Request" />
            </>
          )}

          {isAdmin && (
            <NavLink to="/admin-panel" icon={<ShieldCheck size={20} />} label="System Admin" />
          )}

          <NavLink to="/profile" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center w-full p-3.5 space-x-3 text-white/70 hover:text-white rounded-2xl transition-all font-bold text-xs uppercase tracking-widest">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Corporate Portal</span>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isAdmin ? "Global Monitoring" : `Hello, ${user.name.split(' ')[0]}`}
            </h2>
          </div>
          
          <div className="flex items-center space-x-6">
            <Bell className="text-slate-300 hover:text-slate-500 cursor-pointer" size={22} />
            <Link to="/profile" className="flex items-center space-x-3 pl-6 border-l border-slate-200 group">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">{user.role}</p>
                <p className={`text-sm font-bold text-slate-700 group-hover:${isAdmin ? 'text-blue-600' : 'text-purple-700'} transition`}>{user.name}</p>
              </div>
              <div className={`w-11 h-11 ${iconBg} rounded-2xl flex items-center justify-center shadow-inner`}>
                <User size={22} />
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <StatCard title="Volume" value={stats.total} dotColor={isAdmin ? "bg-blue-400" : "bg-purple-400"} />
            <StatCard title="Pending" value={stats.pending} dotColor="bg-amber-400" />
            <StatCard title="Resolved" value={stats.resolved} dotColor="bg-emerald-400" />
            <StatCard title="Urgent" value={stats.highPriority} dotColor="bg-rose-400" />
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 h-[28rem]">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">System Analytics</h3>
            <div className="h-64">
              <RequestChart stats={stats} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const NavLink = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center w-full p-3.5 space-x-3 text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
    {icon}
    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
  </Link>
);

const StatCard = ({ title, value, dotColor }) => (
  <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 hover:translate-y-[-4px] transition-transform duration-300">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</h3>
      <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
    </div>
    <p className="text-4xl font-black text-slate-800 tracking-tighter">{value}</p>
  </div>
);

export default Dashboard;