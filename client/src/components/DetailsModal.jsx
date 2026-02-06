import React from 'react';
import { X, Calendar, User, Tag, AlertCircle } from 'lucide-react';

const DetailsModal = ({ request, onClose }) => {
  if (!request) return null;

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
            <div className="flex items-start space-x-3">
              <Tag className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Category</p>
                <p className="text-gray-700">{request.category}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Submitted On</p>
                <p className="text-gray-700">{new Date(request.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Detailed Description</p>
              <div className="bg-gray-50 p-4 rounded-xl text-gray-600 leading-relaxed text-sm max-h-40 overflow-y-auto">
                {request.description || "No description provided."}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;