import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Clock, User, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      // Ensure this URL is exactly /api/admin/audit-logs
      const res = await axios.get('http://localhost:5000/api/admin/audit-logs');
      setLogs(res.data);
      setLoading(false);
    } catch (err) {
      // This is what is triggering your "Audit sync failed" toast
      console.error("Connection Error:", err);
      toast.error("Audit sync failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);
  return (
    <div className="p-12 animate-in fade-in duration-700 max-w-[1400px] mx-auto text-left">
      <div className="mb-12">
        <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
          <ShieldCheck size={12} /> <span>System Security</span>
        </div>
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-slate-100">Audit Intelligence</h2>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Live Chronological System Logs</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Timestamp</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Admin</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Action</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length > 0 ? logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <Clock size={14} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-500 italic">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 font-black text-[10px]">
                        {log.admin_name.charAt(0)}
                      </div>
                      <span className="text-xs font-black text-slate-800 uppercase italic tracking-tight">{log.admin_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      {log.action_type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <p className="text-xs font-medium text-slate-500 italic leading-relaxed">{log.details}</p>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center opacity-20">
                    <Activity size={48} className="mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">No Intelligence Records Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;