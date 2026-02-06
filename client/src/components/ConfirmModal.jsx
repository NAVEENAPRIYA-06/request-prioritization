import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl max-w-sm w-full border border-white animate-in zoom-in duration-300">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500">
            <AlertTriangle size={40} />
          </div>
        </div>
        
        <h3 className="text-2xl font-black text-slate-800 tracking-tighter text-center mb-2">Cancel Request?</h3>
        <p className="text-slate-400 text-sm text-center mb-8 font-medium italic">
          Are you sure you want to remove "# {title}"? This action cannot be undone.
        </p>

        <div className="flex flex-col space-y-3">
          <button 
            onClick={onConfirm}
            className="w-full py-4 bg-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all"
          >
            Yes, Cancel It
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
          >
            No, Keep It
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;