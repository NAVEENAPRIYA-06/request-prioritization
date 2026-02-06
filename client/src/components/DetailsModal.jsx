import React from 'react';
import { X, Calendar, Tag, AlertCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DetailsModal = ({ request, onClose, onRefresh }) => {
  if (!request) return null;

  const handleDelete = async () => {
    // Using a simple confirm, but we'll make it a toast later if you like
    if (window.confirm("Are you sure you want to cancel this request?")) {
      try {
        await axios.delete(`http://localhost:5000/api/requests/delete/${request.id}`);
        toast.success("Request cancelled successfully");
        onRefresh(); 
        onClose();   
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition">
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex items-center space-x-2 text-pink-500 mb-2">
            <AlertCircle size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">{request.priority} Priority</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-6">{request.title}</h3>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm mb-4">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Description</p>
              {request.description || "No description provided."}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Category</p>
                <p className="text-gray-700 font-medium">{request.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Status</p>
                <p className="text-gray-700 font-medium">{request.status}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex space-x-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
            >
              Close
            </button>
            
            {/* Show cancel button only for 'Pending' or 'Open' */}
            {(request.status === 'Pending' || request.status === 'Open') && (
              <button 
                onClick={handleDelete}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition border border-red-100"
              >
                <Trash2 size={18} />
                <span>Cancel Request</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;