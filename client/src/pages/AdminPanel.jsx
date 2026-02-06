import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [allRequests, setAllRequests] = useState([]);

  const fetchAllData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests/admin/all');
      setAllRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/update-status/${id}`, { status: newStatus });
      toast.success(`Request status updated to ${newStatus}`);
      fetchAllData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Admin Control Center</h2>
            <p className="text-gray-500">Manage and prioritize all employee requests</p>
          </div>
          <Shield size={40} className="text-pink-500 opacity-20" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold">Request Title</th>
                <th className="p-4 font-semibold">Priority</th>
                <th className="p-4 font-semibold">Current Status</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {allRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-gray-700">{req.employee_name}</td>
                  <td className="p-4 text-gray-600">{req.title}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.priority === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{req.status}</td>
                  <td className="p-4 text-center">
                    <select value={req.status} onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      className="bg-white border rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-pink-400">
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