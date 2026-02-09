import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, Camera, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  const themeColor = isAdmin ? 'text-[#0077be]' : 'text-[#8e4585]';
  const bgColor = isAdmin ? 'bg-[#0077be]' : 'bg-[#8e4585]';

  // State for form fields
  const [name, setName] = useState(user.name);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleUpdateName = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/auth/update-profile/${user.id}`, { name });
      const updatedUser = { ...user, name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success("Name updated! Please refresh to see changes.");
    } catch (err) {
      toast.error("Failed to update name");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error("Passwords do not match");
    try {
      await axios.put(`http://localhost:5000/api/auth/change-password/${user.id}`, {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success("Password changed successfully");
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error changing password");
    }
  };

  return (
    <div className="p-12 animate-in fade-in duration-700 max-w-4xl">
      <div className="mb-12">
        <h2 className={`text-4xl font-black ${themeColor} tracking-tighter italic uppercase underline decoration-slate-200`}>Settings</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Manage your identity and security</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-8 mb-10 border-b border-slate-100">
        <button onClick={() => setActiveTab('profile')} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? `${themeColor} border-b-2 border-current` : 'text-slate-300'}`}>Profile Info</button>
        <button onClick={() => setActiveTab('security')} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? `${themeColor} border-b-2 border-current` : 'text-slate-300'}`}>Security</button>
      </div>

      {activeTab === 'profile' ? (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-white space-y-8">
          <div className="flex items-center space-x-8 mb-10">
            <div className={`w-24 h-24 rounded-[2.5rem] ${bgColor} flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-current/20`}>{user.name.charAt(0)}</div>
            <button className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"><Camera size={14}/> <span>Change Photo</span></button>
          </div>
          
          <form onSubmit={handleUpdateName} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Display Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-100 transition-all" />
            </div>
            <button type="submit" className={`w-full py-4 ${bgColor} text-white rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-lg hover:opacity-90 transition-all`}>Save Changes</button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-white">
          <form onSubmit={handleChangePassword} className="space-y-6">
            <InputField label="Current Password" type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} />
            <InputField label="New Password" type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
            <InputField label="Confirm New Password" type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} />
            <button type="submit" className={`w-full py-4 ${bgColor} text-white rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-lg hover:opacity-90 transition-all`}>Update Security</button>
          </form>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, type, value, onChange }) => (
  <div>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">{label}</label>
    <input type={type} value={value} onChange={onChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-100 transition-all" />
  </div>
);

export default Settings;