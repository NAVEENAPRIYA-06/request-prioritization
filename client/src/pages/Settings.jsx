import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Camera, Award, Target, TrendingUp, Shield, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const fileInputRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  const themeColor = isAdmin ? 'text-[#0077be]' : 'text-[#8e4585]';
  const bgColor = isAdmin ? 'bg-[#0077be]' : 'bg-[#8e4585]';

  const [name, setName] = useState(user.name || "");
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
// This line automatically picks the right URL
const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://request-prioritization-production.up.railway.app";
  useEffect(() => {
    if (!isAdmin) {
      const fetchUserStats = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/requests/user/${user.id}`);
          setStats({
            total: res.data.length,
            resolved: res.data.filter(r => r.status === 'Resolved').length
          });
        } catch (err) {
          console.error("Stats fetch error");
        }
      };
      fetchUserStats();
    }
  }, [user.id, isAdmin]);

  // --- 1. PHOTO UPLOAD LOGIC ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_pic', file);

    try {
      const res = await axios.put(`${API_URL}/api/auth/upload-photo/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const updatedUser = { ...user, profile_pic: res.data.photoUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success("Gallery photo synchronized!");
      setTimeout(() => window.location.reload(), 1000); 
    } catch (err) {
      toast.error("Upload failed. Check server connection.");
    }
  };

  // --- 2. NAME UPDATE LOGIC ---
  const handleSaveName = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/auth/update-profile/${user.id}`, { name });
      const updatedUser = { ...user, name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success("Identity updated successfully");
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  // --- 3. PASSWORD UPDATE LOGIC ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error("Passwords do not match");
    try {
      await axios.put(`${API_BASE_URL}/api/auth/change-password/${user.id}`, {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success("Security key updated");
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification error");
    }
  };

  return (
    <div className="p-12 animate-in fade-in duration-700 max-w-5xl">
      <div className="mb-12">
        <h2 className={`text-5xl font-black ${themeColor} tracking-tighter italic uppercase underline decoration-slate-200`}>Account Settings</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Personalize your Workspace Identity</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-12 mb-10 border-b border-slate-100">
        <button onClick={() => setActiveTab('profile')} className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? `${themeColor} border-b-2 border-current` : 'text-slate-300 hover:text-slate-500'}`}>Profile</button>
        <button onClick={() => setActiveTab('security')} className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? `${themeColor} border-b-2 border-current` : 'text-slate-300 hover:text-slate-500'}`}>Security</button>
        {!isAdmin && <button onClick={() => setActiveTab('performance')} className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'performance' ? `${themeColor} border-b-2 border-current` : 'text-slate-300 hover:text-slate-500'}`}>Performance</button>}
      </div>

      {/* PROFILE SECTION */}
      {activeTab === 'profile' && (
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-white space-y-10 animate-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-10">
            <div className={`w-32 h-32 rounded-[2.5rem] ${bgColor} overflow-hidden flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-current/20 border-4 border-white`}>
              {user.profile_pic ? <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover" /> : user.name.charAt(0)}
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Visual Avatar</p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              <button onClick={() => fileInputRef.current.click()} className="px-8 py-3 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all flex items-center space-x-2 border border-slate-100 shadow-sm">
                <Camera size={14}/> <span>Browse Gallery</span>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSaveName} className="space-y-8">
            <InputField label="Public Display Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <button type="submit" className={`w-full py-5 ${bgColor} text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] italic shadow-lg hover:brightness-110 transition-all`}>Save Changes</button>
          </form>
        </div>
      )}

      {/* SECURITY SECTION */}
      {activeTab === 'security' && (
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-white animate-in slide-in-from-bottom-4 space-y-8">
          <div className="flex items-center space-x-3 text-slate-800 italic">
            <Shield size={20} />
            <h3 className="text-xl font-black uppercase tracking-tight">Security Credentials</h3>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <InputField label="Current Password" type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputField label="New Password" type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
               <InputField label="Confirm Password" type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} />
            </div>
            <button type="submit" className={`w-full py-5 ${bgColor} text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] italic shadow-lg hover:brightness-110 transition-all`}>Update Password</button>
          </form>
        </div>
      )}

      {/* PERFORMANCE SECTION */}
      {activeTab === 'performance' && !isAdmin && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-200/40 border border-white flex justify-between items-center">
            <div className="flex items-center space-x-6">
               <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500"><Award size={28}/></div>
               <div>
                  <h4 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter leading-none">Employee Scorecard</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Analytical Performance Metrics</p>
               </div>
            </div>
            <div className={`text-[10px] font-black text-white ${bgColor} px-8 py-3 rounded-full uppercase tracking-widest shadow-xl shadow-[#8e4585]/20`}>Gold Contributor</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MetricCard title="Requests Raised" value={stats.total} icon={<TrendingUp size={16}/>} label="Volume" />
            <MetricCard title="System Impact" value="High" icon={<Target size={16}/>} label="Value" />
            <MetricCard title="Consistency" value={`${((stats.resolved / (stats.total || 1)) * 100).toFixed(0)}%`} icon={<Shield size={16}/>} label="Success" />
          </div>

          <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
            <UserCircle size={150} className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity" />
            <h5 className="text-xs font-black text-[#8e4585] uppercase tracking-[0.3em] mb-6">Managerial Narrative</h5>
            <p className="text-md font-bold text-slate-300 leading-relaxed italic relative z-10">
              "Your performance indicates a highly proactive approach to system reporting. By logging {stats.total} specific requests, you have provided the administration with critical operational visibility. Your engagement level is exemplary, directly contributing to the organization's maintenance standards."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, type, value, onChange }) => (
  <div>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-1">{label}</label>
    <input type={type} value={value} onChange={onChange} className="w-full bg-slate-50 border-2 border-transparent rounded-[1.2rem] p-5 font-bold text-slate-700 outline-none focus:bg-white focus:border-slate-100 focus:ring-4 focus:ring-slate-50 transition-all" />
  </div>
);

const MetricCard = ({ title, value, icon, label }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-white shadow-lg shadow-slate-200/20 text-center transition-all hover:-translate-y-1">
    <div className="flex items-center justify-center space-x-2 text-slate-300 mb-4">
       {icon} <span className="text-[9px] font-black uppercase tracking-widest">{title}</span>
    </div>
    <div className="text-5xl font-black text-slate-800 tracking-tighter mb-2">{value}</div>
    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{label}</p>
  </div>
);

export default Settings;