import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const NewRequest = () => {
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Technical', priority: 'Medium' });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/requests/create', { ...formData, userId: user.id });
      toast.success("Request submitted!");
      navigate('/dashboard');
    } catch (err) {
      toast.error("Failed to submit request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-10 relative">
        {/* Floating Back Arrow */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="absolute left-6 top-8 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Submit New Request</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Title</label>
            <input 
              type="text" 
              required 
              placeholder="e.g., Software update needed"
              className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none transition"
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              className="w-full px-5 py-3 rounded-xl border outline-none bg-white" 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option>Technical</option>
              <option>Hardware</option>
              <option>Software</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
            <div className="flex space-x-4">
              {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                <button 
                  key={p} 
                  type="button" 
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`flex-1 py-2 rounded-lg border transition font-medium ${formData.priority === p ? 'bg-pink-500 text-white border-pink-500' : 'bg-gray-50 text-gray-500'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              rows="4" 
              placeholder="Describe the issue in detail..."
              className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none transition"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-[#d16b7a] text-white font-bold rounded-xl shadow-lg hover:bg-[#b05a68] transition transform hover:scale-[1.01]"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;