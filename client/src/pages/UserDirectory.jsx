import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, UserPlus, Mail, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const UserDirectory = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/users');
        setUsers(res.data);
      } catch (err) {
        toast.error("Failed to fetch directory");
      } finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">User Directory</h2>
        <button className="bg-[#0077be] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">Add Personnel</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map(u => (
          <div key={u.id} className="bg-white p-8 rounded-[3rem] shadow-xl border border-white hover:shadow-2xl transition-all">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 uppercase">{u.name.charAt(0)}</div>
              <div>
                <h4 className="font-black text-slate-800 italic uppercase">{u.name}</h4>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{u.role}</span>
              </div>
            </div>
            <div className="space-y-2 opacity-60">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase"><Mail size={12}/> <span>{u.email}</span></div>
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase"><Shield size={12}/> <span>ID: {u.id}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDirectory;