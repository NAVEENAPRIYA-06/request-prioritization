import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // For entrance animation
  const [formData, setFormData] = useState({ 
    fullName: '', email: '', password: '', role: 'employee' 
  });
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true); // Trigger animation on mount
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      toast.success("Account created! Welcome to the team.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#8e4585] p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className={`flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
        
        {/* Left Side: Brand Panel */}
        <div className="md:w-5/12 bg-[#0f172a] p-12 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 border border-white/20 font-black text-3xl italic">SS</div>
          <h1 className="text-2xl font-black tracking-[0.2em] uppercase italic">SmartService</h1>
          <p className="text-slate-400 mt-6 text-sm leading-relaxed font-medium">Join our enterprise network to manage tasks and priorities with ease.</p>
        </div>

        {/* Right Side: Form Panel */}
        <div className="md:w-7/12 p-12">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">Create Account</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Employee Enrollment Portal</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8e4585] transition-colors" size={18} />
                <input 
                  type="text" required placeholder="Enter name"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-[#8e4585] outline-none transition-all font-bold text-slate-700"
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8e4585] transition-colors" size={18} />
                <input 
                  type="email" required placeholder="name@company.com"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-[#8e4585] outline-none transition-all font-bold text-slate-700"
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8e4585] transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} required placeholder="Enter password"
                  className="w-full pl-14 pr-14 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-[#8e4585] outline-none transition-all font-bold text-slate-700"
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-slate-500">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            

            <button type="submit" className="w-full py-5 bg-[#8e4585] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-purple-100 hover:bg-[#72376a] transition-all transform hover:scale-[1.01] flex items-center justify-center group mt-4">
              <span>Create Account</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Already have an account? <Link to="/login" className="text-[#8e4585] hover:underline ml-1">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;