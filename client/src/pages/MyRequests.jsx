import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get(`http://localhost:5000/api/requests/user/${user.id}`)
      .then(res => setRequests(res.data))
      .catch(err => console.log(err));
  }, [user.id]);

  const getStatusStyle = (status) => {
    if (status === 'Resolved') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Request History</h2>
        
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Title</th>
                <th className="p-4 font-semibold text-gray-600">Category</th>
                <th className="p-4 font-semibold text-gray-600">Priority</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{req.title}</td>
                  <td className="p-4 text-gray-600">{req.category}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.priority === 'Critical' ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-100'}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-md text-xs border font-medium ${getStatusStyle(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="p-20 text-center text-gray-400">No requests found. Start by creating one!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequests;