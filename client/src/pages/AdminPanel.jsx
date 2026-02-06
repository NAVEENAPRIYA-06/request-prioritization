import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, ArrowLeft, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [allRequests, setAllRequests] = useState([]);
  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests/admin/all');
      
      // The Priority Algorithm: Sorting by urgency and then by date
      const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
      const sortedData = res.data.sort((a, b) => {
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.created_at) - new Date(a.created_at); // Newest first for same priority
      });
      
      setAllRequests(sortedData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/update-status/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchAllData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      Critical: "bg-red-100 text-red-700 border-red-200 animate-pulse",
      High: "bg-orange-100 text-orange-700 border-orange-200",
      Medium: "bg-blue-100 text-blue-700 border-blue-200",
      Low: "bg-gray-100 text-gray-700 border-gray-200"
    };
    return `px-3 py-1 rounded-full text-xs font-black border ${styles[priority] || styles.Low}`;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="p-2 bg-white rounded-full shadow-sm border hover:bg-gray-50 text-gray-600 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Control Center</h2>
              <p className="text-gray-500 text-sm flex items-center">
                <Clock size={14} className="mr-1" /> 
                Live request feed sorted by business priority
              </p>
            </div>
          </div>
          <div className="hidden md:flex bg-white p-3 rounded-2xl border shadow-sm items-center space-x-4">
             <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-gray-400 uppercase">System Status</span>
                <span className="text-sm font-bold text-green-500">Active Monitoring</span>
             </div>
             <Shield size={28} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
              <tr>
                <th className="p-5 font-bold text-xs uppercase tracking-wider">Employee</th>
                <th className="p-5 font-bold text-xs uppercase tracking-wider">Request Title</th>
                <th className="p-5 font-bold text-xs uppercase tracking-wider">Priority</th>
                <th className="p-5 font-bold text-xs uppercase tracking-wider">Current Status</th>
                <th className="p-5 font-bold text-xs uppercase tracking-wider text-center">Manage Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition group">
                  <td className="p-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                        {req.employee_name?.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-700">{req.employee_name}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-gray-800 font-medium">{req.title}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{req.category}</p>
                  </td>
                  <td className="p-5">
                    <span className={getPriorityBadge(req.priority)}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center space-x-2">
                       {req.status === 'Resolved' ? <CheckCircle size={16} className="text-green-500" /> : <Clock size={16} className="text-yellow-500" />}
                       <span className="text-sm font-semibold text-gray-600">{req.status}</span>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <select 
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition"
                    >
                      <option value="Open">Open</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allRequests.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <AlertCircle size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">No employee requests found in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;