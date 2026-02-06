import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Left Side - Brand (Same as Login for consistency) */}
        <div className="md:w-5/12 bg-[#1e2330] p-10 flex flex-col justify-center items-center text-white">
          <div className="mb-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-[#1e2330] font-bold text-2xl">
              RH
            </div>
            <h1 className="text-2xl font-bold tracking-widest text-center">RequestHub</h1>
          </div>
          <p className="text-gray-400 text-center text-sm">
            Join our platform to streamline tasks and manage priorities effectively.
          </p>
        </div>

        {/* Right Side - Registration Form */}
        <div className="md:w-7/12 p-10">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-500 mb-6">Register now, it's free!</p>

            <form className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 outline-none" />
              <input type="email" placeholder="Email Address" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 outline-none" />
              
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 outline-none"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Role Selection */}
              <select className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 outline-none bg-white text-gray-500">
                <option value="employee">Join as Employee</option>
                <option value="admin">Join as Admin (Manager)</option>
              </select>

              <button className="w-full py-4 bg-[#d16b7a] text-white font-bold rounded-xl shadow-lg hover:bg-[#b05a68] transition-transform hover:scale-[1.02] mt-4">
                Get Started
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already a member? <Link to="/login" className="text-pink-600 font-bold hover:underline cursor-pointer">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;