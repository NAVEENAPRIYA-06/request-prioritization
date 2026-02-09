import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HelpCircle, ChevronDown, BookOpen, LifeBuoy, Search } from 'lucide-react';

const HelpCenter = () => {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFaqs = async () => {
      const res = await axios.get('http://localhost:5000/api/help/faqs');
      setFaqs(res.data);
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-12 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="mb-12">
        <h2 className="text-5xl font-black text-[#8e4585] tracking-tighter italic uppercase underline decoration-slate-200">Help Center</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Common solutions and platform guides</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
        <input 
          type="text" 
          placeholder="Search for a solution..."
          className="w-full pl-16 pr-8 py-5 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/40 border-none outline-none font-bold text-sm italic"
          onChange={(e) => setSearch(search)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <HelpCard icon={<BookOpen size={24}/>} title="Guides" desc="Step-by-step tutorials" />
        <HelpCard icon={<LifeBuoy size={24}/>} title="Support" desc="Direct admin contact" />
        <HelpCard icon={<HelpCircle size={24}/>} title="FAQs" desc="Quick answers" />
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm transition-all">
            <button 
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full p-8 flex justify-between items-center hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black text-[#8e4585] uppercase tracking-widest mb-1">{faq.category}</span>
                <span className="font-black text-slate-700 text-sm italic">{faq.question}</span>
              </div>
              <ChevronDown className={`text-slate-300 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`} />
            </button>
            
            {openId === faq.id && (
              <div className="px-8 pb-8 animate-in slide-in-from-top-2">
                <p className="text-sm font-bold text-slate-500 leading-relaxed italic">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const HelpCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/20 text-center group hover:-translate-y-1 transition-all">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8e4585] group-hover:bg-[#8e4585] group-hover:text-white transition-all">
      {icon}
    </div>
    <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">{title}</h4>
    <p className="text-[10px] font-bold text-slate-400 mt-1 italic">{desc}</p>
  </div>
);

export default HelpCenter;