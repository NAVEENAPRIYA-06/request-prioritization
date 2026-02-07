import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Archive, Calendar, Search, CheckCircle2, Hash, Clock 
} from 'lucide-react';
import toast from 'react-hot-toast';
import DetailsModal from '../components/DetailsModal';

const ResolvedArchive = () => {
  const [archives, setArchives] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArchive, setSelectedArchive] = useState(null);
  const navigate = useNavigate();

  const fetchArchives = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests/admin/all');
      setArchives(res.data.filter(req => req.status === 'Resolved'));
    } catch (err) {
      toast.error("Could not load archives");
    }
  };

  useEffect(() => { fetchArchives(); }, []);

  const filteredArchives = archives.filter(req => 
    req.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `REQ-${req.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 bg-[#f8fafc]">
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-white/50 px-10 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => navigate('/admin-panel')} 
              className="p-4 bg-white rounded-[1.5rem] border border-slate-100 text-[#0077be] hover:bg-[#0077be] hover:text-white transition-all shadow-xl shadow-blue-900/5"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="flex items-center space-x-2 text-[#0077be] mb-1">
                <Archive size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Vault History</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Resolved Archives</h2>
            </div>
          </div>

          <div className="relative group w-full max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0077be] transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search historical records..."
              className="w-full pl-16 pr-8 py-5 rounded-[2.5rem] border-2 border-slate-50 bg-white shadow-xl shadow-slate-200/40 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all font-bold text-slate-700 italic"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-10 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArchives.map((req) => (
            <div 
              key={req.id} 
              onClick={() => setSelectedArchive(req)}
              className="group bg-white/80 backdrop-blur-md rounded-[3.5rem] p-10 border border-white shadow-2xl shadow-slate-300/30 hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer relative"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm uppercase shadow-xl shadow-slate-900/20">
                  {req.employee_name?.charAt(0)}
                </div>
                <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center space-x-2 text-emerald-600">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Archived</span>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center space-x-2 text-[#0077be] mb-3">
                  <Hash size={16} strokeWidth={3} />
                  <span className="font-mono text-sm font-black tracking-tighter text-slate-400 group-hover:text-[#0077be] transition-colors">REQ-{req.id}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic group-hover:text-[#0077be] transition-colors">
                  {req.title}
                </h3>
              </div>

              <div className="pt-8 border-t border-slate-100 flex flex-col space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} />
                    <span>Finished: {new Date(req.updated_at || req.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedArchive && (
        <DetailsModal 
          request={selectedArchive} 
          onClose={() => setSelectedArchive(null)} 
        />
      )}
    </div>
  );
};

export default ResolvedArchive;