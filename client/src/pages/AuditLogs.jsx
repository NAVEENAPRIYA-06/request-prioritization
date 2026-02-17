import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Clock, User, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
const API_BASE_URL = "https://request-prioritization-production.up.railway.app";
  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/audit-logs`);
      setLogs(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Audit sync failed");
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchLogs(); 
  }, []);

  return (
    <div className="p-12 animate-in fade-in duration-700 max-w-[1400px] mx-auto text-left">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <ShieldCheck size={14} className="text-blue-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Security</span>
          </div>
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter italic uppercase">
            Audit <span className="text-blue-600">Intelligence</span>
          </h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Live Chronological System Logs</p>
        </div>
        
        <button onClick={fetchLogs} className="p-4 bg-white shadow-xl shadow-slate-200/50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all">
          <RefreshCw size={20} />
        </button>
      </div>
      
        
      {/* AUDIT TABLE CONTAINER */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
        {loading ? (
          <div className="py-24 text-center animate-pulse">
            <RefreshCw className="mx-auto text-slate-200 mb-4 animate-spin" size={40} />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Retrieving Logs...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length > 0 ? logs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-10 py-6 flex items-center space-x-3 text-xs font-bold text-slate-400 italic">
                    <Clock size={14} className="text-slate-300" />
                    {/* FIXED: Robust Date Formatting to prevent "Invalid Date" */}
                    <span>{log.created_at ? new Date(log.created_at).toLocaleString('en-US', { 
                      hour12: true, 
                      year: 'numeric', 
                      month: 'numeric', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : "Pending..."}</span>
                  </td>
                  
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-black text-[10px]">
                        {log.admin_name?.charAt(0) || 'A'}
                      </div>
                      <span className="text-xs font-black italic uppercase text-slate-800">
                        {log.admin_name || 'Admin User'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-10 py-6">
                    {/* FIXED: Vibrant Blue Badge for Action */}
                    <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-600 shadow-lg shadow-blue-100">
                      {log.action || 'SYSTEM'}
                    </span>
                  </td>
                  
                  <td className="px-10 py-6 text-xs font-bold text-slate-600 italic">
                    {log.details}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <AlertCircle size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-xs font-black text-slate-300 uppercase tracking-[0.5em]">No Logs Recorded</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;