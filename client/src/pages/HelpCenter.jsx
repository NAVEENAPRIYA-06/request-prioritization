import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, MessageCircle, HelpCircle, ChevronDown, ChevronUp, Users, LifeBuoy } from 'lucide-react';
import GuideModal from '../components/GuideModal';

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showCommunity, setShowCommunity] = useState(false);
// This line automatically picks the right URL
const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://request-prioritization-production.up.railway.app";
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/help/guides`);
        setGuides(res.data);
      } catch (err) {
        console.error("Error fetching guides:", err);
      }
    };
    fetchGuides();
  }, []);

  const faqs = [
    { id: 1, category: "Account", question: "How do I change my profile information?", answer: "Navigate to the 'Settings' tab in your sidebar. From there, you can update your display name or browse your gallery to update your avatar." },
    { id: 2, category: "Requests", question: "What does 'Critical Priority' mean?", answer: "Critical priority is for urgent issues that require immediate admin attention. These requests trigger high-priority alerts for the management team." },
    { id: 3, category: "Status", question: "How can I track my request progress?", answer: "Go to 'My Requests' to see a list of your submissions. Statuses like 'Working' or 'In Progress' indicate that an admin is actively reviewing your ticket." }
  ];

  // FIX: Comprehensive Filter Logic
  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGuides = guides.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div className="mb-12">
        <h2 className="text-5xl font-black text-[#8e4585] tracking-tighter italic uppercase underline decoration-slate-100">Help Center</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Find answers and platform guides</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8e4585] transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search for a solution..." 
          className="w-full pl-16 pr-8 py-5 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/40 border-none outline-none font-bold text-slate-600 transition-all focus:ring-8 focus:ring-[#8e4585]/5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categorized Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {filteredGuides.map((guide) => (
          <div key={guide.id} onClick={() => setSelectedGuide(guide)}>
            <SupportCard 
              icon={<BookOpen />} 
              title={guide.title} 
              desc={`View ${guide.tag} documentation`} 
            />
          </div>
        ))}

        {/* Community Button */}
        <div onClick={() => setShowCommunity(true)}>
          <SupportCard icon={<MessageCircle />} title="Community" desc="Connect with members" />
        </div>

        {/* Direct Support Button - Redirects to New Request */}
        <div onClick={() => navigate('/new-request')}>
          <SupportCard icon={<HelpCircle />} title="Direct Support" desc="Open a priority help ticket" />
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Frequently Asked Questions</h3>
        {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
            <button 
              onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
              className="w-full p-8 flex justify-between items-center text-left"
            >
              <div>
                <span className="text-[9px] font-black text-[#8e4585] uppercase tracking-widest block mb-1">{faq.category}</span>
                <span className="font-bold text-slate-700">{faq.question}</span>
              </div>
              {activeFaq === faq.id ? <ChevronUp className="text-slate-300" /> : <ChevronDown className="text-slate-300" />}
            </button>
            {activeFaq === faq.id && (
              <div className="px-8 pb-8 animate-in slide-in-from-top-2">
                <p className="text-sm font-medium text-slate-500 leading-relaxed italic">{faq.answer}</p>
              </div>
            )}
          </div>
        )) : (
          <p className="text-center py-12 text-slate-300 font-black italic uppercase text-xs tracking-widest">No matching solutions found</p>
        )}
      </div>

      {/* Guide Modal */}
      {selectedGuide && <GuideModal guide={selectedGuide} onClose={() => setSelectedGuide(null)} />}

      {/* Community Overlay */}
      {showCommunity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6" onClick={() => setShowCommunity(false)}>
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-lg w-full text-center animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <Users size={48} className="mx-auto text-[#8e4585] mb-6" />
            <h3 className="text-2xl font-black text-slate-800 italic uppercase mb-4 tracking-tighter">Community Hub</h3>
            <p className="text-sm font-bold text-slate-500 mb-8 italic">You are part of a network of {guides.length * 5} active users. Join the internal Slack or Teams channel for real-time collaboration.</p>
            <button onClick={() => setShowCommunity(false)} className="px-12 py-4 bg-[#8e4585] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-lg">Back to Center</button>
          </div>
        </div>
      )}
    </div>
  );
};

const SupportCard = ({ icon, title, desc }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-200/20 text-center group hover:-translate-y-2 transition-all cursor-pointer h-full flex flex-col items-center justify-center">
    <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-[#8e4585] group-hover:bg-[#8e4585] group-hover:text-white transition-all shadow-inner">
      {icon}
    </div>
    <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">{title}</h4>
    <p className="text-[10px] font-bold text-slate-400 mt-2 italic leading-relaxed">{desc}</p>
  </div>
);

export default HelpCenter;