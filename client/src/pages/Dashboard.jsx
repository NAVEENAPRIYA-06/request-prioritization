import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(loggedInUser));
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
          <button className="flex items-center w-full p-3 space-x-3 bg-pink-500 rounded-xl">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center w-full p-3 space-x-3 hover:bg-gray-800 rounded-xl transition">
            <ClipboardList size={20} />
            <span>My Requests</span>
          </button>
          <button className="flex items-center w-full p-3 space-x-3 hover:bg-gray-800 rounded-xl transition">
               
  <Link 
    to="/new-request" 
    className="flex items-center w-full p-3 space-x-3 hover:bg-gray-800 rounded-xl transition text-gray-300 hover:text-white"
  >
    <PlusCircle size={20}  />
    <span>New Request</span>
  </Link>

          </button>
          {user.role === 'admin' && (
            <button className="flex items-center w-full p-3 space-x-3 hover:bg-gray-800 rounded-xl transition">
              <BarChart3 size={20} />
              <span>Admin Reports</span>
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-3 space-x-3 hover:bg-red-900/30 text-red-400 rounded-xl transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
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

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Requests" value="0" color="bg-blue-500" />
            <StatCard title="Pending" value="0" color="bg-yellow-500" />
            <StatCard title="Resolved" value="0" color="bg-green-500" />
            <StatCard title="High Priority" value="0" color="bg-red-500" />
          </div>

          {/* Placeholder for Charts */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border h-64 flex items-center justify-center text-gray-400">
            Chart.js visualization will go here...
          </div>
        </main>
      </div>
    </div>
  );
};

// Simple StatCard component
const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default Dashboard;