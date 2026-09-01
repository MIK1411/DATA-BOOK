import { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { app, db } from "../lib/firebase";
import { cn } from "../lib/utils";
import { Loader2, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function Enumeration() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    occupation: "",
    state: "",
    city: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const docId = uuidv4();
      await setDoc(doc(db, "enumerations", docId), {
        ...formData,
        age: parseInt(formData.age, 10),
        uid: user.uid,
        submittedAt: serverTimestamp()
      });

      setSuccess(true);
      setStep(1);
      setFormData({ fullName: "", age: "", gender: "", occupation: "", state: "", city: "" });
    } catch (error) {
      console.error("Error submitting enumeration:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 rounded-full border-2 border-[#A68B5C] flex items-center justify-center mb-6">
          <CheckCircle2 size={32} className="text-[#A68B5C]" />
        </div>
        <h2 className="font-serif text-3xl text-[#EBEBEB] mb-2">Record Synchronized</h2>
        <p className="text-[#888888] text-sm mb-8 font-mono">Data successfully appended to the national vault.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-[11px] uppercase tracking-widest border border-[#262626] text-[#AAAAAA] px-6 py-3 hover:border-[#A68B5C] hover:text-[#A68B5C] transition-colors"
        >
          Submit Another Entry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 sm:p-8 lg:p-12 animate-in fade-in duration-700 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="mb-8 lg:mb-12">
          <h2 className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#666666] font-semibold mb-2">Self-Enumeration Module</h2>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-[#EBEBEB]">
            Submit Demographic Data
          </h1>
          <div className="w-16 h-px bg-[#A68B5C] mt-4 lg:mt-6"></div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 mt-6 lg:mt-8">
            <div className={cn("text-[8px] sm:text-[9px] uppercase tracking-widest font-bold", step === 1 ? "text-[#A68B5C]" : "text-[#444444]")}>
              01 / Personal
            </div>
            <div className="w-4 sm:w-8 h-px bg-[#262626]"></div>
            <div className={cn("text-[8px] sm:text-[9px] uppercase tracking-widest font-bold", step === 2 ? "text-[#A68B5C]" : "text-[#444444]")}>
              02 / Regional
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111111] border border-[#1F1F1F] p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 relative overflow-hidden">
          
          <div className={cn("space-y-4 sm:space-y-6 transition-all duration-500", step === 1 ? "block animate-in slide-in-from-left-4" : "hidden")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#666666]">Full Name</label>
                <input 
                  required={step === 1}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#0D0D0D] border border-[#262626] p-3 text-sm text-[#F2F2F2] focus:outline-none focus:border-[#A68B5C] transition-colors"
                  placeholder="Citizen Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#666666]">Age</label>
                <input 
                  required={step === 1}
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  max="120"
                  className="w-full bg-[#0D0D0D] border border-[#262626] p-3 text-sm text-[#F2F2F2] focus:outline-none focus:border-[#A68B5C] transition-colors"
                  placeholder="Years"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#666666]">Gender</label>
                <select 
                  required={step === 1}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-[#0D0D0D] border border-[#262626] p-3 text-sm text-[#F2F2F2] focus:outline-none focus:border-[#A68B5C] transition-colors appearance-none"
                >
                  <option value="" disabled>Select Classification</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#666666]">Occupation</label>
                <input 
                  required={step === 1}
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full bg-[#0D0D0D] border border-[#262626] p-3 text-sm text-[#F2F2F2] focus:outline-none focus:border-[#A68B5C] transition-colors"
                  placeholder="Primary sector"
                />
              </div>
            </div>
          </div>

          <div className={cn("space-y-4 sm:space-y-6 transition-all duration-500", step === 2 ? "block animate-in slide-in-from-right-4" : "hidden")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#666666]">State / UT</label>
                <input 
                  required={step === 2}
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-[#0D0D0D] border border-[#262626] p-3 text-sm text-[#F2F2F2] focus:outline-none focus:border-[#A68B5C] transition-colors"
                  placeholder="Region"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#666666]">City / District</label>
                <input 
                  required={step === 2}
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-[#0D0D0D] border border-[#262626] p-3 text-sm text-[#F2F2F2] focus:outline-none focus:border-[#A68B5C] transition-colors"
                  placeholder="Locality"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#1F1F1F]">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-6 bg-[#0D0D0D] border border-[#262626] text-[#AAAAAA] text-[11px] tracking-[0.2em] uppercase font-bold transition-colors hover:text-[#EBEBEB] flex items-center space-x-2"
              >
                <ArrowLeft size={14} />
                <span>Return</span>
              </button>
            ) : (
              <div></div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-8 bg-[#A68B5C] text-black text-[11px] tracking-[0.2em] uppercase font-bold transition-colors hover:bg-white flex items-center space-x-2 ml-auto"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : step === 1 ? (
                <>
                  <span>Proceed</span>
                  <ArrowRight size={14} />
                </>
              ) : (
                <span>Transmit Record</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
