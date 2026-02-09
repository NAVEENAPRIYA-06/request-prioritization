import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Added HelpCircle and Star to the imports
import { 
  LayoutDashboard, Users, History, BarChart3, Settings, 
  LogOut, ClipboardList, PlusCircle, Bell, HelpCircle, Star 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const theme = {
    bg: isAdmin ? 'bg-[#0077be]' : 'bg-[#8e4585]',
    active: 'bg-white/20 border-l-4 border-white shadow-lg translate-x-2',
    hover: 'hover:bg-white/10 opacity-70 hover:opacity-100',
    hubName: isAdmin ? 'AdminHub' : 'RequestHub'
  };

  const adminLinks = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'System Admin', icon: <History size={20} />, path: '/admin-panel' },
    { name: 'User Directory', icon: <Users size={20} />, path: '/users' },
    { name: 'Resolved Vault', icon: <History size={20} />, path: '/archives' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
  ];

  const employeeLinks = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'My Requests', icon: <ClipboardList size={20} />, path: '/my-requests' },
    { name: 'New Request', icon: <PlusCircle size={20} />, path: '/new-request' },
    { name: 'Notifications', icon: <Bell size={20} />, path: '/notifications' },
    // Step 1: Help Center Added
    { name: 'Help Center', icon: <HelpCircle size={20} />, path: '/help' },
    // Step 2: Feedback Added (Placeholder for next step)
    { name: 'Feedback', icon: <Star size={20} />, path: '/feedback' },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <div className={`fixed left-0 top-0 h-screen w-72 ${theme.bg} flex flex-col text-white shadow-2xl z-50`}>
      <div className="p-10 mb-8">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">{theme.hubName}</h1>
        <div className="h-1 w-12 bg-white/30 mt-2 rounded-full"></div>
      </div>

      <nav className="flex-1 px-6 space-y-3 overflow-y-auto custom-scrollbar">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
              location.pathname === link.path ? theme.active : theme.hover
            }`}
          >
            {link.icon}
            <span>{link.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-white/10 space-y-4 bg-black/5">
        <button 
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center space-x-4 px-6 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest ${
            location.pathname === '/settings' ? 'bg-white/20' : 'opacity-60 hover:opacity-100 hover:bg-white/10'
          }`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
        
        <button 
          onClick={() => { localStorage.clear(); navigate('/login'); }} 
          className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl bg-black/10 hover:bg-black/20 text-rose-200 transition-all font-black text-xs uppercase tracking-widest"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;