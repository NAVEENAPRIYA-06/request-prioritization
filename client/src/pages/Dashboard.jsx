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
  BarChart3,
  ShieldCheck
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

      // Fetch stats based on Role (Admin gets all, Employee gets personal)
      axios.get(`http://localhost:5000/api/requests/stats/${parsedUser.id}/${parsedUser.role}`)
        .then(res => setStats(res.data))
        .catch(err => console.error("Error fetching dashboard stats:", err));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  // Determine theme based on role
  const isAdmin = user.role === 'admin';
  const sidebarBg = isAdmin ? 'bg-[#1e293b]' : 'bg-[#1e2330]'; // Deep Navy for Admin
  const accentColor = isAdmin ? 'text-blue-400' : 'text-pink-500';
  const activeBtn = isAdmin ? 'bg-blue-600' : 'bg-pink-500';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`w-64 ${sidebarBg} text-white flex flex-col transition-colors duration-500`}>
        <div className="p-6 text-center border-b border-gray-700/50">
          <h1 className={`text-xl font-bold tracking-widest ${accentColor}`}>
            {isAdmin ? 'AdminHub' : 'RequestHub'}
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className={`flex items-center w-full p-3 space-x-3 ${activeBtn} rounded-xl`}>
            <LayoutDashboard size={20} />
            <span className="text-base font-medium">Dashboard</span>
          </Link>

          {!isAdmin && (
            <>
              <Link to="/my-requests" className="flex items-center w-full p-3 space-x-3 hover:bg-gray-800 rounded-xl transition text-gray-300 hover:text-white">
                <ClipboardList size={20} />
                <span className="text-base font-medium">My Requests</span>
              </Link>

              <Link to="/new-request" className="flex items-center w-full p-3 space-x-3 hover:bg-gray-800 rounded-xl transition text-gray-300 hover:text-white">
                <PlusCircle size={20} className="ml-0.5" />
                <span className="text-base font-medium">New Request</span>
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin-panel" className="flex items-center w-full p-3 space-x-3 hover:bg-blue-900/30 rounded-xl transition text-blue-100 hover:text-white border border-blue-500/20">
              <ShieldCheck size={20} />
              <span className="text-base font-medium">Admin Control</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-gray-700/50">
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
          <div className="flex items-center space-x-2">
            {isAdmin && <ShieldCheck className="text-blue-600" size={20} />}
            <h2 className="text-xl font-semibold text-gray-800">
              {isAdmin ? "Company Overview" : `Welcome, ${user.name}!`}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-400 cursor-pointer hover:text-gray-600" />
            <div className="flex items-center space-x-2 border-l pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">{user.role}</p>
                <p className="text-sm font-medium text-gray-700 leading-none">{user.name}</p>
              </div>
              <div className={`w-10 h-10 ${isAdmin ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'} rounded-full flex items-center justify-center`}>
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title={isAdmin ? "Total Company Requests" : "My Total Requests"} value={stats.total} color="bg-blue-500" />
            <StatCard title="Pending Review" value={stats.pending} color="bg-yellow-500" />
            <StatCard title="Successfully Resolved" value={stats.resolved} color="bg-green-500" />
            <StatCard title="Urgent/Critical" value={stats.highPriority} color="bg-red-500" />
          </div>

          {/* Analytics Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border h-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isAdmin ? "Company-Wide Analytics" : "Personal Request Trends"}
            </h3>
            <p className="text-sm text-gray-400 mb-6">Visual representation of request status and priority</p>
            <div className="h-64">
              <RequestChart stats={stats} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
    </div>
    <p className="text-3xl font-extrabold text-gray-800">{value}</p>
  </div>
);

export default Dashboard;