import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, History, LayoutGrid, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DetailsModal from '../components/DetailsModal';

const AdminPanel = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests/admin/all');
      // Filters out resolved requests to maintain a clean active workspace
      setAllRequests(res.data.filter(req => req.status !== 'Resolved'));
    } catch (err) {
      toast.error("Failed to sync live queue");
    }
  };

  useEffect(() => { 
    fetchAllData(); 
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/update-status/${id}`, { status: newStatus });
      toast.success(`Priority updated to ${newStatus}`);
      
      // Auto-archives the request if marked as Resolved
      if (newStatus === 'Resolved') {
        setAllRequests(prev => prev.filter(req => req.id !== id));
      } else {
        fetchAllData();
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-8 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Azure Themed Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center space-x-5">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="p-3 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-[#0077be] transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">Control Center</h2>
              <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                <LayoutGrid size={12} /> <span>Managing Global Priorities</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/archives')} 
            className="flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-[#0077be] hover:text-white transition-all shadow-md"
          >
            <History size={18} />
            <span>View Archives</span>
          </button>
        </div>

        {/* Floating Table Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-300/20 border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Service Title</th>
                <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allRequests.map((req) => (
                <tr 
                  key={req.id} 
                  className="hover:bg-blue-50/40 transition-all group cursor-pointer"
                >
                  {/* Employee Info */}
                  <td className="p-8" onClick={() => setSelectedRequest(req)}>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#0077be] flex items-center justify-center font-black text-sm uppercase shadow-inner">
                        {req.employee_name?.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{req.employee_name}</span>
                    </div>
                  </td>

                  {/* Title & Category */}
                  <td className="p-8" onClick={() => setSelectedRequest(req)}>
                    <p className="font-black text-slate-800 text-lg tracking-tight group-hover:text-[#0077be] transition-colors italic">
                      {req.title}
                    </p>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[9px] font-black uppercase">
                      {req.category}
                    </span>
                  </td>

                  {/* Premium Priority Badges */}
                  <td className="p-8" onClick={() => setSelectedRequest(req)}>
                    <div className={`inline-flex items-center px-4 py-2 rounded-2xl border transition-all duration-300 shadow-sm ${
                      req.priority === 'Critical' 
                      ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100 animate-pulse' 
                      : req.priority === 'High' 
                      ? 'bg-orange-50 text-orange-600 border-orange-100 shadow-orange-100' 
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className="text-[10px] font-black uppercase tracking-widest">{req.priority}</span>
                    </div>
                  </td>

                  {/* High-Fidelity Status Dropdown */}
                  <td className="p-8 text-center">
                    <div className="relative group inline-block">
                      <select 
                        value={req.status} 
                        onClick={(e) => e.stopPropagation()} 
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className="appearance-none bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 pr-12 text-xs font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0077be] cursor-pointer transition-all shadow-sm hover:shadow-md"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {allRequests.length === 0 && (
            <div className="p-32 text-center">
              <CheckCircle size={48} className="mx-auto text-emerald-100 mb-4" />
              <p className="text-slate-300 font-black uppercase text-sm tracking-widest italic">All Business Priorities Resolved</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Analysis Modal */}
      {selectedRequest && (
        <DetailsModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
        />
      )}
    </div>
  );
};

export default AdminPanel;