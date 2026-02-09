import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, History, LayoutGrid, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DetailsModal from '../components/DetailsModal';

const AdminPanel = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests/admin/all');
      // Filter out both Resolved and Rejected from the active Control Center view
      setAllRequests(res.data.filter(req => req.status !== 'Resolved' && req.status !== 'Rejected'));
    } catch (err) {
      toast.error("Failed to sync live queue");
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/update-status/${id}`, { status: newStatus });
      toast.success(`Priority updated to ${newStatus}`);
      // Remove from view if Resolved or Rejected
      if (newStatus === 'Resolved' || newStatus === 'Rejected') {
        setAllRequests(prev => prev.filter(req => req.id !== id));
      } else {
        fetchAllData();
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const filteredRequests = allRequests.filter(req => 
    req.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `REQ-${req.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700">
      {/* Search and Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-[#0077be]/20">Control Center</h2>
          <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
            <LayoutGrid size={12} /> <span>Active Priority Queue</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0077be] transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search priorities..."
              className="w-full pl-14 pr-6 py-4 rounded-3xl border-none bg-white shadow-xl shadow-slate-200/40 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all font-bold text-slate-600 italic"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => navigate('/archives')} className="p-4 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-[#0077be] shadow-md hover:shadow-lg transition-all">
            <History size={22} />
          </button>
        </div>
      </div>

      {/* Floating Table Card */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-300/20 border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
              <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Service Title</th>
              <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
              <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-blue-50/40 transition-all group cursor-pointer">
                <td className="p-8" onClick={() => setSelectedRequest(req)}>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#0077be] flex items-center justify-center font-black text-sm uppercase shadow-inner">{req.employee_name?.charAt(0)}</div>
                    <span className="font-bold text-slate-700">{req.employee_name}</span>
                  </div>
                </td>
                <td className="p-8" onClick={() => setSelectedRequest(req)}>
                  <p className="font-black text-slate-800 text-lg tracking-tight group-hover:text-[#0077be] transition-colors italic">{req.title}</p>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[9px] font-black uppercase">REQ-{req.id}</span>
                </td>
                <td className="p-8" onClick={() => setSelectedRequest(req)}>
                  <div className={`inline-flex items-center px-4 py-2 rounded-2xl border transition-all duration-300 shadow-sm ${
                    req.priority === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500'
                  }`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{req.priority}</span>
                  </div>
                </td>
                <td className="p-8 text-center">
                  <select 
                    value={req.status} 
                    onClick={(e) => e.stopPropagation()} 
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                    className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 cursor-pointer shadow-sm hover:shadow-md transition-all"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">Working</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRequests.length === 0 && (
          <div className="p-32 text-center">
            <CheckCircle size={48} className="mx-auto text-emerald-100 mb-4" />
            <p className="text-slate-300 font-black uppercase text-sm tracking-widest italic">All Business Priorities Resolved</p>
          </div>
        )}
      </div>
      {selectedRequest && <DetailsModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
    </div>
  );
};

export default AdminPanel;