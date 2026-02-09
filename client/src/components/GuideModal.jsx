import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

const GuideModal = ({ guide, onClose }) => {
  if (!guide) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-[#8e4585]/5">
          <div>
            <span className="text-[10px] font-black text-[#8e4585] uppercase tracking-widest">{guide.tag}</span>
            <h3 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">{guide.title}</h3>
          </div>
          <button onClick={onClose} className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-rose-500 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-10 space-y-6">
          {guide.steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4 group">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-[#8e4585] group-hover:text-white transition-all">
                {index + 1}
              </div>
              <p className="flex-1 text-sm font-bold text-slate-600 italic leading-relaxed pt-1">
                {step}
              </p>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-50 flex justify-center">
          <button onClick={onClose} className="px-12 py-4 bg-[#8e4585] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-lg shadow-[#8e4585]/20">
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;