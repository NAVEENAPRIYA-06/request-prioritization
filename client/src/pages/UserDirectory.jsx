import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Mail, Shield, Search, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const UserDirectory = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Pointing to the new directory route in auth.js
        const res = await axios.get('http://localhost:5000/api/auth/directory');
        setUsers(res.data);
      } catch (err) {
        toast.error("Access Denied: Could not fetch directory");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-[#0077be]/20">User Directory</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Personnel Management</p>
        </div>
        
        <div className="flex items-center space-x-4 w-full max-w-md">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0077be] transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search employees..."
              className="w-full pl-14 pr-6 py-4 rounded-3xl border-none bg-white shadow-xl shadow-slate-200/40 outline-none transition-all font-bold text-slate-600"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/40 border border-white hover:-translate-y-2 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors" />
            
            <div className="flex items-center space-x-5 mb-8 relative z-10">
              <div className="w-16 h-16 rounded-[2rem] bg-blue-50 text-[#0077be] flex items-center justify-center font-black text-xl shadow-inner border border-blue-100/50">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">{user.name}</h3>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    user.role === 'admin' ? 'bg-[#0077be] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10 mb-8">
              <div className="flex items-center space-x-3 text-slate-500">
                <Mail size={14} className="opacity-50" />
                <span className="text-xs font-bold">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-500">
                <Shield size={14} className="opacity-50" />
                <span className="text-xs font-bold uppercase tracking-widest italic">Auth ID: {user.id}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                <button className="text-[9px] font-black text-rose-400 hover:text-rose-600 uppercase tracking-widest">Restrict Access</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDirectory;