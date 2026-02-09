// client/src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, History, BarChart3, Settings, 
  LogOut, ClipboardList, PlusCircle, Bell, HelpCircle, Star, Timer 
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
    { name: 'New Request', icon: <PlusCircle size={20} />, path: '/new-request' },
    { name: 'My Requests', icon: <ClipboardList size={20} />, path: '/my-requests' },
    { name: 'SLA Tracker', icon: <Timer size={20} />, path: '/sla-tracker' },
    { name: 'Help Center', icon: <HelpCircle size={20} />, path: '/help' },
    { name: 'Feedback', icon: <Star size={20} />, path: '/feedback' },
    { name: 'Notifications', icon: <Bell size={20} />, path: '/notifications' },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <div className={`fixed left-0 top-0 h-screen w-72 ${theme.bg} flex flex-col text-white shadow-2xl z-50`}>
      <div className="p-10 mb-2">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">{theme.hubName}</h1>
        <div className="h-1.5 w-12 bg-white/30 mt-2 rounded-full"></div>
      </div>

      {/* Consolidated Nav - Removes the gap between Notifications and Settings */}
      <nav className="px-6 space-y-2 overflow-y-auto custom-scrollbar pb-10">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
              location.pathname === link.path ? theme.active : theme.hover
            }`}
          >
            {link.icon} <span className="italic">{link.name}</span>
          </button>
        ))}

        {/* Visual Divider sitting naturally in the list */}
        <div className="h-px bg-white/10 my-6 mx-4"></div>

        <button 
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
            location.pathname === '/settings' ? theme.active : theme.hover
          }`}
        >
          <Settings size={20} /> <span className="italic">Settings</span>
        </button>
        
        <button 
          onClick={() => { localStorage.clear(); navigate('/login'); }} 
          className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${theme.hover}`}
        >
          <LogOut size={20} /> <span className="italic">Sign Out</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;