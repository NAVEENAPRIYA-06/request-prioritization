import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, Search, Trash2, Eye, History } from 'lucide-react';
import toast from 'react-hot-toast';
import DetailsModal from '../components/DetailsModal';
import ConfirmModal from '../components/ConfirmModal'; // Import the new modal

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestToCancel, setRequestToCancel] = useState(null); // Track which request is being cancelled
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/requests/user/${user.id}`);
      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to sync history");
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const confirmCancel = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/requests/delete/${requestToCancel.id}`);
      toast.success("Request removed from queue");
      setRequestToCancel(null);
      fetchRequests();
    } catch (err) {
      toast.error("Cancellation failed");
    }
  };

  // UPDATED SEARCH LOGIC: Filters by Title OR Reference ID
  const filteredRequests = requests.filter(req => 
    req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `REQ-${req.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Floating Header */}
      <div className="sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <button onClick={() => navigate('/dashboard')} className="p-4 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-[#8e4585] shadow-sm transition-all"><ArrowLeft size={22} /></button>
            <div>
              <div className="flex items-center space-x-2 text-[#8e4585] mb-1">
                <History size={14} /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">Activity Log</span>
              </div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">My Requests</h2>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" placeholder="Search ID or Title..."
              className="w-full md:w-80 pl-14 pr-6 py-4 rounded-2xl border border-white bg-white/40 focus:bg-white focus:ring-8 focus:ring-purple-500/5 outline-none transition-all font-bold text-slate-600 shadow-inner"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white/80 backdrop-blur-md rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-10 text-[11px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                <th className="p-10 text-[11px] font-black text-slate-400 uppercase tracking-widest">Service Details</th>
                <th className="p-10 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-10 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover-lift transition-all group cursor-pointer">
                  <td className="p-10" onClick={() => setSelectedRequest(req)}><span className="font-mono text-xs font-black text-slate-300 group-hover:text-slate-400">#REQ-{req.id}</span></td>
                  <td className="p-10" onClick={() => setSelectedRequest(req)}>
                    <p className="font-black text-slate-800 text-xl tracking-tight group-hover:text-[#8e4585] transition-colors">{req.title}</p>
                    <span className="px-2 py-0.5 bg-slate-100/80 text-slate-500 rounded text-[9px] font-black uppercase tracking-tighter">{req.category}</span>
                  </td>
                  <td className="p-10" onClick={() => setSelectedRequest(req)}>
                    <div className="flex items-center space-x-3 bg-white w-fit px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                      {req.status === 'Resolved' ? <CheckCircle size={18} className="text-emerald-500" /> : <Clock size={18} className="text-amber-500" />}
                      <span className="text-sm font-black text-slate-600 uppercase tracking-tighter">{req.status}</span>
                    </div>
                  </td>
                  <td className="p-10">
                    <div className="flex items-center justify-center space-x-3">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }} className="p-3 bg-white text-slate-300 rounded-2xl border border-slate-100 hover:bg-[#8e4585] hover:text-white transition-all shadow-sm"><Eye size={20} /></button>
                      {req.status === 'Open' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setRequestToCancel(req); }} 
                          className="p-3 bg-white text-rose-300 rounded-2xl border border-slate-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && <DetailsModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />}

      {/* New Confirm Modal for Cancellation */}
      <ConfirmModal 
        isOpen={!!requestToCancel} 
        onClose={() => setRequestToCancel(null)} 
        onConfirm={confirmCancel} 
        title={requestToCancel?.title} 
      />
    </div>
  );
};

export default MyRequests;