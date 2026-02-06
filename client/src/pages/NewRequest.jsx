import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple Validation
    if (formData.description.length < 10) {
      return toast.error("Please provide a more detailed description (min 10 chars).");
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/requests/create', { ...formData, userId: user.id });
      toast.success("Request submitted successfully!");
      navigate('/dashboard');
    } catch (err) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-10 relative border border-gray-100">
        {/* Floating Back Arrow */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="absolute left-6 top-8 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-all border border-transparent hover:border-gray-200"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create New Request</h2>
          <p className="text-gray-400 mt-2 text-sm">Please be as descriptive as possible to help our team prioritize.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Request Title</label>
              <input 
                type="text" 
                required 
                placeholder="Brief summary of the issue"
                className="w-full px-5 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-400 outline-none transition"
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
              <select 
                className="w-full px-5 py-3 rounded-xl border bg-gray-50 focus:bg-white outline-none appearance-none" 
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
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Priority Level</label>
            <div className="grid grid-cols-4 gap-3">
              {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                <button 
                  key={p} 
                  type="button" 
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                    formData.priority === p 
                    ? 'bg-pink-500 text-white border-pink-500 shadow-md transform scale-105' 
                    : 'bg-white text-gray-500 hover:border-pink-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Full Description</label>
              <span className={`text-[10px] font-bold ${formData.description.length < 10 ? 'text-red-400' : 'text-green-400'}`}>
                {formData.description.length} Characters
              </span>
            </div>
            <textarea 
              rows="4" 
              required
              placeholder="Describe the problem, steps to reproduce, and impact..."
              className="w-full px-5 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-400 outline-none transition resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 ${loading ? 'bg-gray-400' : 'bg-[#d16b7a] hover:bg-[#b05a68]'} text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2`}
          >
            {loading ? <span>Processing...</span> : (
              <>
                <Send size={18} />
                <span>Submit</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;