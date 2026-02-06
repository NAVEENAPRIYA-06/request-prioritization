import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewRequest = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    priority: 'Medium'
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/requests/create', {
        ...formData,
        userId: user.id
      });
      alert("Request Submitted!");
      navigate('/dashboard');
    } catch (err) {
      alert("Failed to submit request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Submit New Request</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Title</label>
            <input 
              type="text" 
              required
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level Level</label>
            <div className="flex space-x-4">
              {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`px-4 py-2 rounded-lg border transition ${formData.priority === p ? 'bg-pink-500 text-white' : 'bg-gray-100'}`}
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
              className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none transition"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
          <button type="submit" className="w-full py-4 bg-[#d16b7a] text-white font-bold rounded-xl shadow-lg hover:bg-[#b05a68] transition">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;