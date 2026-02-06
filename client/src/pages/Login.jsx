import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sending login request to backend
      const response = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });
      
      alert(response.data.message);
      
      // Store user data in localStorage to keep them logged in
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Navigate to dashboard (we will create this route next)
      navigate('/dashboard'); 
      
    } catch (err) {
      // Show specific error message from backend or a default one
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500 p-4">
      {/* Main Container */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl min-h-[500px]">
        
        {/* Left Side - Brand Area */}
        <div className="md:w-5/12 bg-[#1e2330] p-10 flex flex-col justify-center items-center text-white relative">
          <div className="mb-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <span className="text-[#1e2330] font-bold text-2xl">RH</span>
            </div>
            <h1 className="text-2xl font-bold tracking-widest text-center uppercase">RequestHub</h1>
          </div>
          <p className="text-gray-400 text-center text-sm leading-relaxed">
            Streamline your workflow. Manage, prioritize, and resolve requests with ease.
          </p>
          <button className="mt-8 px-8 py-2 border border-pink-500 text-pink-500 rounded-full hover:bg-pink-500 hover:text-white transition">
            Learn More
          </button>
          
          <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#d16b7a] rounded-full items-center justify-center border-4 border-white">
             <ArrowLeft size={20} />
          </div>
        </div>

        {/* Right Side - Form Area */}
        <div className="md:w-7/12 p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-500 mb-8">Sign in to continue</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 accent-pink-500" />
                  Remember me
                </label>
                <a href="#" className="text-gray-400 hover:text-gray-600">Forgot Password?</a>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#d16b7a] text-white font-bold rounded-xl shadow-lg hover:bg-[#b05a68] transition-all transform hover:scale-[1.02]"
              >
                Login
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account? <Link to="/register" className="text-pink-600 font-bold hover:underline">Register</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;