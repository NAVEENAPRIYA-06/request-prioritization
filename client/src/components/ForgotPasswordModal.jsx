import React, { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleReset = (e) => {
    e.preventDefault();
    toast.success("Reset link sent to your work email!");
    setIsSent(true);
    setTimeout(() => {
      onClose();
      setIsSent(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-300 hover:text-slate-500 transition">
          <X size={24} />
        </button>

        {!isSent ? (
          <>
            <div className="mb-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter mb-2">Reset Password</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Enter your work email to proceed</p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email" required placeholder="name@company.com"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-[#8e4585] outline-none transition-all font-bold text-slate-700"
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-[#8e4585] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-purple-100 hover:bg-[#72376a] transition-all flex items-center justify-center">
                <span>Send Reset Link</span>
                <Send size={16} className="ml-2" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Send size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter mb-2">Email Sent!</h3>
            <p className="text-slate-400 text-sm font-medium">Check your inbox for the recovery link.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;