import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [allRequests, setAllRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    axios.get('http://localhost:5000/api/requests/admin/all')
      .then(res => setAllRequests(res.data))
      .catch(err => console.log(err));
  };

  const updateStatus = (id, newStatus) => {
    axios.put(`http://localhost:5000/api/requests/update-status/${id}`, { status: newStatus })
      .then(() => {
        alert("Status Updated");
        fetchRequests(); // Refresh table
      });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Admin Control Center</h2>
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Title</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {allRequests.map(req => (
              <tr key={req.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold">{req.employee_name}</td>
                <td className="p-4">{req.title}</td>
                <td className="p-4">
                   <span className={`px-2 py-1 rounded text-xs font-bold ${req.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                    {req.priority}
                   </span>
                </td>
                <td className="p-4">{req.status}</td>
                <td className="p-4">
                  <select 
                    className="border rounded p-1 text-sm outline-none"
                    onChange={(e) => updateStatus(req.id, e.target.value)}
                    value={req.status}
                  >
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
  );
};

export default AdminPanel;