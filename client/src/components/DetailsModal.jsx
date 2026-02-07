import React from 'react';
import { X, Calendar, Clock, FileText, CheckCircle } from 'lucide-react';

const DetailsModal = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 overflow-hidden relative border border-white animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-[10px] font-black text-[#8e4585] uppercase tracking-[0.3em]">Archive Analysis</span>
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic mt-1">{request.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-400 mb-3">
              <FileText size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Description</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">{request.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-5 rounded-[2rem] border border-purple-100 text-[#8e4585]">
              <div className="flex items-center space-x-2 opacity-60 mb-2">
                <Calendar size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Submitted</span>
              </div>
              <p className="text-sm font-bold text-slate-700">{new Date(request.created_at).toLocaleDateString()}</p>
            </div>
            
            <div className="bg-emerald-50 p-5 rounded-[2rem] border border-emerald-100 text-emerald-600">
              <div className="flex items-center space-x-2 opacity-60 mb-2">
                <CheckCircle size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Resolved</span>
              </div>
              <p className="text-sm font-bold text-slate-700">
                {new Date(request.updated_at || request.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-center space-x-2 border border-slate-100">
            <Clock size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Completed at {new Date(request.updated_at || request.created_at).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;