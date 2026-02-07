import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  History, 
  Settings, 
  LogOut, 
  ClipboardList, 
  PlusCircle,
  BarChart3,
  Bell
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  // Branding and Theme Configuration
  const theme = {
    bg: isAdmin ? 'bg-[#0077be]' : 'bg-[#8e4585]',
    active: 'bg-white/20 border-l-4 border-white shadow-lg translate-x-2',
    hover: 'hover:bg-white/10 opacity-70 hover:opacity-100',
    hubName: isAdmin ? 'AdminHub' : 'RequestHub'
  };

  // Main navigation links - REMOVED Settings from here to prevent double icons
  const adminLinks = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'System Admin', icon: <ShieldCheck size={20} />, path: '/admin-panel' },
    { name: 'User Directory', icon: <Users size={20} />, path: '/users' },
    { name: 'Resolved Vault', icon: <History size={20} />, path: '/archives' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
  ];

  const employeeLinks = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'My Requests', icon: <ClipboardList size={20} />, path: '/my-requests' },
    { name: 'New Request', icon: <PlusCircle size={20} />, path: '/new-request' },
    { name: 'Notifications', icon: <Bell size={20} />, path: '/notifications' },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`fixed left-0 top-0 h-screen w-72 ${theme.bg} flex flex-col text-white shadow-2xl z-50 transition-all duration-500`}>
      
      {/* Sidebar Header */}
      <div className="p-10 mb-8">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">
          {theme.hubName}
        </h1>
        <div className="h-1 w-12 bg-white/30 mt-2 rounded-full"></div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-6 space-y-3">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
                isActive ? theme.active : theme.hover
              }`}
            >
              {link.icon}
              <span className="truncate">{link.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Section - This is where the single Settings icon remains */}
      <div className="p-8 border-t border-white/10 space-y-4">
        <button 
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center space-x-4 px-6 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest ${
            location.pathname === '/settings' ? 'bg-white/20 opacity-100' : 'opacity-60 hover:opacity-100 hover:bg-white/10'
          }`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl bg-black/10 hover:bg-black/20 text-rose-200 transition-all font-black text-xs uppercase tracking-widest group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;