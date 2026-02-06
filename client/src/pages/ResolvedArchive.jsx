import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Archive, ArrowLeft, CheckCircle, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResolvedArchive = () => {
  const [archives, setArchives] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/requests/admin/all')
      .then(res => setArchives(res.data.filter(req => req.status === 'Resolved')))
      .catch(() => toast.error("Error loading archives"));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-10">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate('/admin-panel')} className="flex items-center text-slate-400 hover:text-[#0077be] mb-8 font-bold text-xs uppercase tracking-widest transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Control Center
        </button>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter italic">Resolved Archives</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Completed Task History</p>
          </div>
          <Archive size={40} className="text-[#0077be] opacity-20" />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Service Title</th>
                <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Completion Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {archives.map(req => (
                <tr key={req.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-8 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0077be] flex items-center justify-center font-bold text-xs uppercase">{req.employee_name?.charAt(0)}</div>
                    <span className="font-bold text-slate-700">{req.employee_name}</span>
                  </td>
                  <td className="p-8 font-black text-slate-600 italic">{req.title}</td>
                  <td className="p-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                      <CheckCircle size={14} />
                      <span className="text-xs font-bold uppercase tracking-tighter">Verified Resolved</span>
                    </div>
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

export default ResolvedArchive;