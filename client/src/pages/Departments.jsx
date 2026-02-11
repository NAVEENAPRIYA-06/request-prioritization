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

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName) return;
    try {
      await axios.post('http://localhost:5000/api/admin/departments', { 
        name: newName, 
        manager_name: "Unassigned Lead" 
      });
      setNewName("");
      fetchDepts();
      toast.success("Department Registered");
    } catch (err) {
      toast.error("Failed to add department");
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

  const handleDelete = async (id) => {
    if (!window.confirm("Decommission this department? All history will be archived.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/departments/${id}`);
      toast.success("Department removed");
      fetchDepts();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  useEffect(() => { 
    fetchDepts(); 
  }, []);

  return (
    <div className="p-12 animate-in fade-in duration-700 max-w-[1400px] mx-auto text-left">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-slate-100">Departments</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Manage Service Categories & Live Workload</p>
        </div>
        
        <form onSubmit={handleAdd} className="flex space-x-4 w-full md:w-auto">
          <input 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New Department Name..." 
            className="px-6 py-4 rounded-2xl bg-white shadow-xl shadow-slate-200/40 border-none outline-none font-bold text-xs flex-1 md:w-64"
          />
          <button type="submit" className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-[#0077be] transition-all shadow-xl shadow-slate-200">
            <Plus size={24} />
          </button>
        </form>
      </div>

      {/* DEPARTMENT GRID & CONDITIONAL RENDERING */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {depts.length > 0 ? (
          depts.map((dept) => (
            <div key={dept.id} className="bg-white p-8 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-white group relative overflow-hidden transition-all hover:scale-[1.02]">
              
              <div className="absolute -right-4 -top-4 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <FolderTree size={120} />
              </div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-14 h-14 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-500 transition-all duration-500 group-hover:bg-[#0077be] group-hover:text-white">
                  <FolderTree size={24} />
                </div>
                <button 
                  onClick={() => handleDelete(dept.id)} 
                  className="p-3 text-slate-200 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h4 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight mb-4 relative z-10">
                {dept.name}
              </h4>

              <div className="space-y-4 relative z-10">
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

                <div className="flex items-center space-x-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Activity size={14} className="text-orange-400" />
                  <span>Live Workload: <span className="text-slate-900 ml-1">{dept.active_count || 0} Active Tasks</span></span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Live Intelligence</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-50">
            <AlertCircle size={48} className="mx-auto text-slate-100 mb-4" />
            <p className="text-xs font-black text-slate-300 uppercase tracking-[0.5em]">No Departments Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;