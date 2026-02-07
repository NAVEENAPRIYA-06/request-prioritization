import React, { useState } from 'react';
import { X, Calendar, Clock, FileText, CheckCircle, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const DetailsModal = ({ request, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!request) return null;

  const handleCopy = () => {
    const refID = `REQ-${request.id}`;
    navigator.clipboard.writeText(refID);
    setCopied(true);
    toast.success("ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 overflow-hidden relative border border-white animate-in zoom-in duration-300">
        
        {/* Header with Copy Action */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-[10px] font-black text-[#8e4585] uppercase tracking-[0.3em]">Analysis</span>
              <button 
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-2 py-0.5 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 hover:bg-purple-100 hover:text-[#8e4585] transition-all"
              >
                {copied ? <Check size={10} /> : <Copy size={10} />}
                <span>#REQ-{request.id}</span>
              </button>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic">{request.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Description Block */}
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-400 mb-3">
              <FileText size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Description</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">{request.description}</p>
          </div>

          {/* Time Tracking Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-5 rounded-[2.5rem] border border-purple-100 text-[#8e4585]">
              <div className="flex items-center space-x-2 opacity-60 mb-2">
                <Calendar size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Submitted</span>
              </div>
              <p className="text-sm font-bold text-slate-700">{new Date(request.created_at).toLocaleDateString()}</p>
            </div>
            
            <div className={`p-5 rounded-[2.5rem] border transition-all ${request.status === 'Resolved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
              <div className="flex items-center space-x-2 opacity-60 mb-2">
                <CheckCircle size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Resolution</span>
              </div>
              <p className="text-sm font-bold text-slate-700">
                {request.status === 'Resolved' ? new Date(request.updated_at).toLocaleDateString() : 'Active Task'}
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-center space-x-2 border border-slate-100">
            <Clock size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Last Updated {new Date(request.updated_at || request.created_at).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;