import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FolderTree, Plus, Trash2, User, Activity, AlertCircle, Edit3, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Departments = () => {
  const [depts, setDepts] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchDepts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/departments');
      setDepts(res.data);
    } catch (err) {
      toast.error("Department sync failed");
    }
  };

  const handleUpdateLead = async (id) => {
    if (!editName) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/departments/${id}`, { 
        manager_name: editName 
      });
      setEditingId(null);
      fetchDepts();
      toast.success("Authorized Head Synchronized");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // ... handleAdd and handleDelete remain same ...

  useEffect(() => { fetchDepts(); }, []);

  return (
    <div className="p-12 animate-in fade-in duration-700 max-w-[1400px] mx-auto text-left">
      {/* Header section remains same */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {depts.map((dept) => (
          <div key={dept.id} className="bg-white p-8 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-white group relative overflow-hidden">
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-14 h-14 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-500 transition-all">
                <FolderTree size={24} />
              </div>
              <button onClick={() => handleDelete(dept.id)} className="p-3 text-slate-200 hover:text-rose-500 transition-all">
                <Trash2 size={18} />
              </button>
            </div>

            <h4 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight mb-4 relative z-10">{dept.name}</h4>

            <div className="space-y-4 relative z-10">
              {/* AUTHORIZED HEAD SECTION */}
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <User size={12} className="mr-2 text-blue-400" /> Authorized Head
                  </span>
                  
                  {editingId === dept.id ? (
                    <div className="flex space-x-2">
                      <button onClick={() => handleUpdateLead(dept.id)} className="text-emerald-500 hover:scale-110 transition-transform"><Check size={14}/></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400"><X size={14}/></button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setEditingId(dept.id); setEditName(dept.manager_name); }}
                      className="text-slate-300 hover:text-blue-500 transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                  )}
                </div>

                {editingId === dept.id ? (
                  <input 
                    autoFocus
                    className="w-full bg-white border border-blue-200 rounded-lg outline-none text-xs font-bold text-slate-800 px-3 py-2 mt-2"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  <p className="text-xs font-bold text-slate-700 italic">{dept.manager_name}</p>
                )}
              </div>

              {/* LIVE WORKLOAD SECTION */}
              <div className="flex items-center space-x-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Activity size={14} className="text-orange-400" />
                <span>Live Workload: <span className="text-slate-900 ml-1">{dept.active_count || 0} Active Tasks</span></span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Live Intelligence</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;