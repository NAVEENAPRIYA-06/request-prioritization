import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, ArrowLeft, Save, BadgeCheck, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const parsed = JSON.parse(loggedInUser);
      setUser(parsed);
      setNewName(parsed.name);
    }
  }, []);

  const handleUpdate = () => {
    if (newName.trim().length < 3) {
      return toast.error("Display name must be at least 3 characters.");
    }
    
    const updatedUser = { ...user, name: newName };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success("Profile updated successfully!");
  };

  if (!user) return null;

  // DYNAMIC COLOR PROFILE
  const isAdmin = user.role === 'admin';
  const themeColor = isAdmin ? 'bg-[#0077be]' : 'bg-[#8e4585]'; // Azure vs Plum
  const textColor = isAdmin ? 'text-[#0077be]' : 'text-[#8e4585]';
  const lightBg = isAdmin ? 'bg-blue-50' : 'bg-purple-50';

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center text-slate-400 hover:text-slate-800 transition mb-10 group font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className={`h-40 ${themeColor} relative`}>
            <div className="absolute -bottom-16 left-10">
              <div className="w-32 h-32 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center border-[6px] border-white">
                <User size={56} className={textColor} />
              </div>
            </div>
          </div>

          <div className="pt-20 p-10">
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 border-b border-slate-50 pb-10">
              <div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">{user.name}</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    isAdmin ? 'bg-blue-100 text-[#0077be]' : 'bg-purple-100 text-[#8e4585]'
                  }`}>
                    {user.role} Account
                  </span>
                  <div className="flex items-center text-slate-400 text-sm font-medium">
                    <Mail size={14} className="mr-2" /> {user.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Display Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all font-bold text-slate-700"
                    />
                    <BadgeCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200" size={20} />
                  </div>
                </div>

                <button 
                  onClick={handleUpdate}
                  className={`w-full py-4 ${themeColor} text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-3`}
                >
                  <Save size={18} />
                  <span>Save Profile</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className={`${lightBg} p-6 rounded-[2rem] border border-transparent transition-colors`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <Fingerprint className={textColor} size={22} />
                    <p className={`text-sm font-black uppercase tracking-wider ${textColor}`}>Security Protocol</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Profile roles are fixed to the employee database. Please contact your manager to update administrative permissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;