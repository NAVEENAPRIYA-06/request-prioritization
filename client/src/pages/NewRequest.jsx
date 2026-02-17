import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const NewRequest = () => {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    category: 'Technical', 
    priority: 'Medium' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
// This line automatically picks the right URL
const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://request-prioritization-production.up.railway.app";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.description.length < 10) {
      return toast.error("Please provide a more detailed description.");
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/requests/create`, { ...formData, userId: user.id });
      toast.success("Request submitted to the priority queue.");
      navigate('/dashboard');
    } catch (err) {
      toast.error("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-10 relative border border-slate-100">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="absolute left-8 top-10 p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-all"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">New Service Request</h2>
          <p className="text-slate-400 mt-2 text-[10px] font-black uppercase tracking-[0.2em]">Queue Submission</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Request Title</label>
              <input 
                type="text" 
                required 
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-[#8e4585] outline-none transition-all font-bold text-slate-700"
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Category</label>
              <select 
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white outline-none appearance-none font-bold text-slate-700" 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Technical</option>
                <option>Hardware</option>
                <option>Software</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Priority Level</label>
            <div className="grid grid-cols-4 gap-3">
              {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                <button 
                  key={p} 
                  type="button" 
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                    formData.priority === p 
                    ? 'bg-[#8e4585] text-white border-[#8e4585] shadow-lg shadow-purple-100 transform scale-105' 
                    : 'bg-white text-slate-400 hover:border-purple-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Full Description</label>
            <textarea 
              rows="4" 
              required
              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-[#8e4585] outline-none transition-all resize-none font-medium text-slate-600"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-5 ${loading ? 'bg-slate-300' : 'bg-[#8e4585] hover:bg-[#72376a]'} text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-purple-100 transition-all transform hover:scale-[1.01] flex items-center justify-center space-x-3`}
          >
            <Send size={18} />
            <span>{loading ? 'Processing...' : 'Submit'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;