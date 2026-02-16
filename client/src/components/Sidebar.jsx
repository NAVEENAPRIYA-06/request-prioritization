import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, History, BarChart3, Settings, 
  LogOut, ClipboardList, PlusCircle, Bell, HelpCircle, Star, 
  Timer, ShieldCheck, FolderTree, Activity, Menu, X 
} from 'lucide-react';

const Sidebar = () => {
  // State to handle mobile toggle
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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
    { name: 'Resolved Vault', icon: <History size={20} />, path: '/archives' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
    { name: 'Departments', icon: <FolderTree size={20} />, path: '/departments' },
    { name: 'System Health', icon: <Activity size={20} />, path: '/system-health' },
    { name: 'User Directory', icon: <Users size={20} />, path: '/users' },
    { name: 'Audit Logs', icon: <ShieldCheck size={20} />, path: '/audit-logs' },
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

  // Helper to close sidebar when a link is clicked on mobile
  const handleNav = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* MOBILE TOGGLE BUTTON - High Z-Index to stay on top */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-6 left-6 z-[10001] p-3 bg-white shadow-2xl rounded-2xl text-slate-800 hover:scale-105 active:scale-95 transition-all"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* DIM OVERLAY - Blurs background and closes menu on click */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-md z-[9998] transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <div className={`fixed left-0 top-0 h-screen w-72 ${theme.bg} flex flex-col text-white shadow-2xl z-[9999] transition-transform duration-500 ease-in-out lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 mb-2">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">{theme.hubName}</h1>
          <div className="h-1.5 w-12 bg-white/30 mt-2 rounded-full"></div>
        </div>

        <nav className="px-6 space-y-2 overflow-y-auto custom-scrollbar pb-10">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
                location.pathname === link.path ? theme.active : theme.hover
              }`}
            >
              {link.icon} <span className="italic">{link.name}</span>
            </button>
          ))}

          <div className="h-px bg-white/10 my-6 mx-4"></div>

          <button 
            onClick={() => handleNav('/settings')}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
              location.pathname === '/settings' ? theme.active : theme.hover
            }`}
          >
            <Settings size={20} /> <span className="italic">Settings</span>
          </button>
          
          <button 
            onClick={() => { localStorage.clear(); handleNav('/login'); }} 
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${theme.hover}`}
          >
            <LogOut size={20} /> <span className="italic">Sign Out</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;