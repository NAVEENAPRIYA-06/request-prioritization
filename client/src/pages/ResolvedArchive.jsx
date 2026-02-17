import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Archive, User, Calendar, CheckCircle2, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';

const ResolvedArchive = () => {
  const [archives, setArchives] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [loading, setLoading] = useState(true);
const API_BASE_URL = "https://request-prioritization-production.up.railway.app";
  const fetchArchives = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/requests/admin/archive-search?term=${searchTerm}&priority=${filterPriority}`);
      setArchives(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Archive access failed");
      setLoading(false);
    }
  };

  // NEW: Handle CSV Data Export
  const handleExport = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/requests/admin/export-data`);
      const data = res.data;

      if (!data || data.length === 0) {
        toast.error("No data available to export");
        return;
      }

      // Create CSV Headers and Rows
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map(row => 
        Object.values(row).map(value => `"${value}"`).join(",")
      ).join("\n");
      
      const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
      
      // Trigger Download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Service_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Intelligence Report Exported");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  useEffect(() => {
    fetchArchives();
  }, [searchTerm, filterPriority]);

  return (
    <div className="p-12 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-slate-200">Resolved Archive</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Audit Resolved Intelligence & History</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
          {/* Search Bar */}
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search user or title..." 
              className="pl-12 pr-6 py-4 rounded-2xl bg-white shadow-xl shadow-slate-200/20 border-none outline-none font-bold text-xs w-full sm:w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Priority Filter */}
          <select 
            className="px-6 py-4 rounded-2xl bg-white shadow-xl shadow-slate-200/20 border-none outline-none font-black text-[10px] uppercase tracking-widest text-slate-500 appearance-none cursor-pointer w-full sm:w-auto"
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* NEW: Export Button */}
          <button 
            onClick={handleExport}
            className="flex items-center justify-center space-x-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0077be] transition-all shadow-xl shadow-slate-200/40 group w-full sm:w-auto"
          >
            <FileDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Archive Grid */}
      {loading ? (
        <div className="text-center py-20 font-black text-slate-200 animate-pulse uppercase tracking-[0.5em]">Syncing Archive...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {archives.length > 0 ? archives.map((req) => (
            <div key={req.id} className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-white hover:scale-[1.01] transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4 text-left">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                    <Archive size={20} />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">{req.title}</h4>
                     <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <User size={10} /> <span>{req.user_name}</span>
                     </div>
                  </div>
                </div>
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${req.priority === 'Critical' ? 'bg-rose-50 text-rose-500 shadow-sm shadow-rose-100' : 'bg-slate-50 text-slate-400'}`}>
                  {req.priority}
                </span>
              </div>
              
              <p className="text-xs font-medium text-slate-500 italic mb-6 leading-relaxed text-left">
                {req.description}
              </p>

              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                 <div className="flex items-center space-x-2 text-slate-300 italic font-bold text-[10px]">
                   <Calendar size={12} />
                   <span>Archived on {new Date(req.updated_at).toLocaleDateString()}</span>
                 </div>
                 <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase italic">
                   <CheckCircle2 size={12} />
                   <span>Verified</span>
                 </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center opacity-20">
              <Archive size={48} className="mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">No matching history found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResolvedArchive;