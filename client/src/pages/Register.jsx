import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  // We hardcode 'employee' here so it's always the default
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    role: 'employee' 
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      toast.success(response.data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="md:w-5/12 bg-[#1e2330] p-10 flex flex-col justify-center items-center text-white text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-[#1e2330] font-bold text-2xl">RH</div>
            <h1 className="text-2xl font-bold tracking-widest uppercase">RequestHub</h1>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">Join our platform to streamline tasks and manage priorities effectively.</p>
        </div>

        <div className="md:w-7/12 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-400 mb-8 text-sm">Sign up to start submitting and tracking requests.</p>
          
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Full Name</label>
              <input type="text" placeholder="Enter Name" required className="w-full px-5 py-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-pink-400 transition" 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email Address</label>
              <input type="email" placeholder="name@company.com" required className="w-full px-5 py-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-pink-400 transition" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Enter Password" required className="w-full px-5 py-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-pink-400 transition" 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-[#d16b7a] text-white font-bold rounded-xl shadow-lg hover:bg-[#b05a68] transition-all transform hover:scale-[1.01]">
              Get Started
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already a member? <Link to="/login" className="text-pink-600 font-bold hover:underline ml-1">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;