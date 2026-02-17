import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Search, Mail, UserMinus, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const UserDirectory = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
const [userStats, setUserStats] = useState({ requests: [], rating: 0 });
// This line automatically picks the right URL
const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://request-prioritization-production.up.railway.app";
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/directory`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch directory");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleAccess = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await axios.put(`${API_BASE_URL}/api/auth/admin/toggle-access/${userId}`, { status: newStatus });
      toast.success(`Account ${newStatus} successfully`);
      fetchUsers();
    } catch (err) { toast.error("Failed to update access"); }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-[#0077be] tracking-tighter italic uppercase underline decoration-slate-200">User Directory</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Manage Organization Access</p>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input type="text" placeholder="Search users..." className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white shadow-xl shadow-slate-200/40 border-none outline-none font-bold text-xs" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredUsers.map((u) => (
          <div key={u.id} className={`bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-white transition-all hover:-translate-y-1 ${u.account_status === 'suspended' ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 overflow-hidden flex items-center justify-center text-[#0077be] font-black text-xl shadow-inner border border-blue-100/50">
                {u.profile_pic ? <img src={u.profile_pic} alt={u.name} className="w-full h-full object-cover" /> : u.name.charAt(0)}
              </div>
              <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${u.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{u.role}</span>
            </div>
            <div className="space-y-1 mb-8 px-2">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">{u.name}</h3>
              <div className="flex items-center space-x-2 text-slate-400"><Mail size={12} /><span className="text-xs font-bold">{u.email}</span></div>
            </div>
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Joined {new Date(u.created_at).toLocaleDateString()}</span>
              <button onClick={() => handleToggleAccess(u.id, u.account_status)} className={`p-2 rounded-xl transition-all ${u.account_status === 'suspended' ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100' : 'bg-rose-50 text-rose-400 hover:bg-rose-100'}`}>
                {u.account_status === 'suspended' ? <UserCheck size={16}/> : <UserMinus size={16}/>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDirectory;