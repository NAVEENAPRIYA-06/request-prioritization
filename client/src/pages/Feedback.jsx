import React, { useState } from 'react';
import axios from 'axios';
import { Star, Send, MessageSquareQuote } from 'lucide-react';
import toast from 'react-hot-toast';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current logged-in user details
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      return toast.error("Please provide a star rating before submitting.");
    }

    setIsSubmitting(true);

    try {
      // Send feedback data to the backend
      await axios.post('http://localhost:5000/api/feedback/submit', {
        user_id: user.id,
        rating: rating,
        comment: comment
      });

      toast.success("Thank you! Your feedback has been recorded.");
      
      // Reset form state after successful submission
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Feedback submission error:", err);
      toast.error("Failed to submit feedback. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-12">
        <h2 className="text-5xl font-black text-[#8e4585] tracking-tighter italic uppercase underline decoration-slate-200">
          Feedback
        </h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">
          Rate your resolution experience
        </p>
      </div>

      {/* Feedback Form Card */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-12 rounded-[4rem] shadow-2xl shadow-slate-200/40 border border-white"
      >
        <div className="flex flex-col items-center mb-12 text-center">
          <MessageSquareQuote size={40} className="text-[#8e4585]/20 mb-6" />
          <h3 className="text-xl font-black text-slate-800 italic uppercase mb-2">How did we do?</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Select a star rating below
          </p>
          
          {/* Interactive Star Rating System */}
          <div className="flex space-x-3 mt-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-all duration-300 transform hover:scale-125 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star 
                  size={42} 
                  fill={(hover || rating) >= star ? "#8e4585" : "none"} 
                  className={(hover || rating) >= star ? "text-[#8e4585]" : "text-slate-200"}
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
            Comments (Optional)
          </label>
          <textarea 
            rows="5"
            placeholder="Share details about your experience or suggest improvements..."
            className="w-full bg-slate-50 border-none rounded-[2rem] p-8 font-bold text-slate-700 outline-none focus:ring-8 focus:ring-[#8e4585]/5 transition-all italic placeholder:text-slate-300"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full mt-10 py-6 bg-[#8e4585] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] italic shadow-lg shadow-[#8e4585]/20 hover:brightness-110 transition-all flex items-center justify-center space-x-3 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="animate-pulse">Submitting...</span>
          ) : (
            <>
              <Send size={18} />
              <span>Submit Feedback</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Feedback;