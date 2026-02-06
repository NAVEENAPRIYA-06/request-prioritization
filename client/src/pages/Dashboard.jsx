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
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, highPriority: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);

      // 2. Fetch real stats from the database
      axios.get(`http://localhost:5000/api/requests/stats/${parsedUser.id}`)
        .then(res => setStats(res.data))
        .catch(err => console.error("Error fetching dashboard stats:", err));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e2330] text-white flex flex-col">
        <div className="p-6 text-center border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-widest text-pink-500">RequestHub</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* Dashboard Home Link */}
          <Link to="/dashboard" className="flex items-center w-full p-3 space-x-3 bg-pink-500 rounded-xl">
            <LayoutDashboard size={20} />
            <span className="text-base font-medium">Dashboard</span>
          </Link>

          {/* My Requests Link */}
          <Link to="/my-requests" className="flex items-center w-full p-3 space-x-3 hover:bg-gray-800 rounded-xl transition text-gray-300 hover:text-white">
            <ClipboardList size={20} />
            <span className="text-base font-medium">My Requests</span>
          </Link>

          {/* New Request Link (Perfectly Aligned) */}
          <Link to="/new-request" className="flex items-center w-full p-3 space-x-3 hover:bg-gray-800 rounded-xl transition text-gray-300 hover:text-white">
            <PlusCircle size={20} className="ml-0.5" />
            <span className="text-base font-medium">New Request</span>
          </Link>

          {/* Admin Reports (Only visible if user role is admin) */}
          {user.role === 'admin' && (
            <Link to="/admin-panel" className="flex items-center w-full p-3 space-x-3 hover:bg-gray-800 rounded-xl transition text-gray-300 hover:text-white">
              <BarChart3 size={20} />
              <span className="text-base font-medium">Admin Panel</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-3 space-x-3 hover:bg-red-900/30 text-red-400 rounded-xl transition"
          >
            <LogOut size={20} />
            <span className="text-base font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800">Welcome, {user.name}!</h2>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-400 cursor-pointer hover:text-gray-600" />
            <div className="flex items-center space-x-2 border-l pl-4">
              <span className="text-sm font-medium text-gray-700">{user.role.toUpperCase()}</span>
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Data Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Requests" value={stats.total} color="bg-blue-500" />
            <StatCard title="Pending" value={stats.pending} color="bg-yellow-500" />
            <StatCard title="Resolved" value={stats.resolved} color="bg-green-500" />
            <StatCard title="High Priority" value={stats.highPriority} color="bg-red-500" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border h-64 flex flex-col items-center justify-center text-gray-400">
             <BarChart3 size={40} className="mb-4 opacity-20" />
             <p>Chart.js visualization will appear here once analytics are connected.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transform transition hover:scale-105">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default Dashboard;