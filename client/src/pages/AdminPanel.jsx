import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, ArrowLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [allRequests, setAllRequests] = useState([]);
  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests/admin/all');
      
      const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
      const sortedData = res.data.sort((a, b) => {
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.created_at) - new Date(a.created_at);
      });
      
      setAllRequests(sortedData);
    } catch (err) {
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  const handleStatusChange = async (id, newStatus, employeeName) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/update-status/${id}`, { status: newStatus });
      
      // Professional Feedback: Notify which employee's request was updated
      toast.success(
        (t) => (
          <span>
            <b>{employeeName}'s</b> request is now <b>{newStatus}</b>
          </span>
        ),
        { icon: '🚀', duration: 4000 }
      );
      
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
    return `px-3 py-1 rounded-full text-[10px] font-black uppercase border ${styles[priority] || styles.Low}`;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full shadow-sm border hover:bg-gray-50 transition">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Control Center</h2>
              <p className="text-gray-500 text-sm">Managing company-wide requests by business priority</p>
            </div>
          </div>
          <Shield size={40} className="text-blue-500 opacity-20" />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-400">
              <tr>
                <th className="p-5 text-xs font-bold uppercase tracking-widest">Employee</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest">Title</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest">Priority</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest">Current Status</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                        {req.employee_name?.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-700">{req.employee_name}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="font-medium text-gray-800 leading-none mb-1">{req.title}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{req.category}</p>
                  </td>
                  <td className="p-5"><span className={getPriorityBadge(req.priority)}>{req.priority}</span></td>
                  <td className="p-5">
                    <div className="flex items-center space-x-2">
                       {req.status === 'Resolved' ? (
                         <CheckCircle size={16} className="text-green-500" />
                       ) : (
                         <Clock size={16} className={req.status === 'In Progress' ? 'text-blue-500' : 'text-yellow-500'} />
                       )}
                       <span className="text-sm font-semibold text-gray-600">{req.status}</span>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <select 
                      value={req.status} 
                      onChange={(e) => handleStatusChange(req.id, e.target.value, req.employee_name)}
                      className="bg-white border-2 border-gray-100 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer hover:border-gray-200"
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
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;