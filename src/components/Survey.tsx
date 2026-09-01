import { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { app, db } from "../lib/firebase";
import { Loader2, CheckCircle2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function Survey() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    experienceRating: "5",
    platformEase: "5",
    privacyConcerns: "no",
    feedback: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const docId = uuidv4();
      await setDoc(doc(db, "surveys", docId), {
        ...formData,
        uid: user.uid,
        submittedAt: serverTimestamp()
      });

      setSuccess(true);
      setFormData({ experienceRating: "5", platformEase: "5", privacyConcerns: "no", feedback: "" });
    } catch (error) {
      console.error("Error submitting survey:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 rounded-full border-2 border-[#A68B5C] flex items-center justify-center mb-6">
          <CheckCircle2 size={32} className="text-[#A68B5C]" />
        </div>
        <h2 className="font-serif text-3xl text-[#EBEBEB] mb-2">Survey Submitted</h2>
        <p className="text-[#888888] text-sm mb-8 font-mono">Thank you for helping improve the Digitalis platform.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-[11px] uppercase tracking-widest border border-[#262626] text-[#AAAAAA] px-6 py-3 hover:border-[#A68B5C] hover:text-[#A68B5C] transition-colors"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 sm:p-8 lg:p-12 animate-in fade-in duration-700 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="mb-8 lg:mb-12">
          <h2 className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#666666] font-semibold mb-2">Citizen Feedback</h2>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-[#EBEBEB]">
            Digital Census Survey
          </h1>
          <div className="w-16 h-px bg-[#A68B5C] mt-4 lg:mt-6"></div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111111] border border-[#1F1F1F] p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#666666]">How would you rate your overall experience with the Digital Census?</label>
              <select 
                required
                name="experienceRating"
                value={formData.experienceRating}
                onChange={handleChange}
                className="w-full bg-[#0D0D0D] border border-[#262626] p-3 text-sm text-[#F2F2F2] focus:outline-none focus:border-[#A68B5C] transition-colors appearance-none"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Very Poor</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#666666]">Was the platform easy to navigate?</label>
              <select 
                required
                name="platformEase"
                value={formData.platformEase}
                onChange={handleChange}
                className="w-full bg-[#0D0D0D] border border-[#262626] p-3 text-sm text-[#F2F2F2] focus:outline-none focus:border-[#A68B5C] transition-colors appearance-none"
              >
                <option value="5">5 - Very Easy</option>
                <option value="4">4 - Easy</option>
                <option value="3">3 - Neutral</option>
                <option value="2">2 - Difficult</option>
                <option value="1">1 - Very Difficult</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#666666]">Do you have any concerns regarding data privacy?</label>
              <select 
                required
                name="privacyConcerns"
                value={formData.privacyConcerns}
                onChange={handleChange}
                className="w-full bg-[#0D0D0D] border border-[#262626] p-3 text-sm text-[#F2F2F2] focus:outline-none focus:border-[#A68B5C] transition-colors appearance-none"
              >
                <option value="no">No Concerns</option>
                <option value="minor">Minor Concerns</option>
                <option value="major">Major Concerns</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#666666]">Additional Feedback or Suggestions (Optional)</label>
              <textarea 
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#0D0D0D] border border-[#262626] p-3 text-sm text-[#F2F2F2] focus:outline-none focus:border-[#A68B5C] transition-colors resize-none"
                placeholder="Share your thoughts on the digital enumeration process..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black border border-[#A68B5C] text-[#A68B5C] text-[11px] tracking-[0.2em] uppercase font-bold transition-colors hover:bg-[#A68B5C] hover:text-black flex justify-center items-center"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
