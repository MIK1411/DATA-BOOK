import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";
import { app } from "../lib/firebase";
import { LogIn, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

export default function Auth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onAuthenticated();
    } catch (error) {
      console.error("Authentication failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-6 text-[#F2F2F2] font-sans">
      <div className="max-w-md w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
        <div className="space-y-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#EBEBEB]">
            India Census <span className="italic text-[#A68B5C] ml-2">Digitalis</span>
          </h1>
          <p className="text-[#666666] text-[11px] uppercase tracking-[0.2em] font-semibold">
            National Demographic Portal
          </p>
        </div>

        <div className="space-y-8 bg-[#141414] p-10 border border-[#1F1F1F]">
          <div className="space-y-2 text-center mb-6">
            <h2 className="text-[10px] uppercase tracking-widest text-[#666666] font-medium">
              Administrator Access Required
            </h2>
            <p className="text-xs text-[#888888]">Sign in securely with your Google account to access the real-time workspace.</p>
          </div>

          <button
            onClick={handleJoin}
            disabled={loading}
            className={cn(
              "w-full flex items-center justify-center space-x-3 py-4 bg-black border border-[#A68B5C] text-[#A68B5C] text-[11px] tracking-[0.2em] uppercase font-bold transition-colors",
              "hover:bg-[#A68B5C] hover:text-black active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>Sign In With Google</span>
                <LogIn size={18} strokeWidth={2} />
              </>
            )}
          </button>
        </div>
        
        <div className="text-center">
           <span className="text-[9px] text-[#444444] uppercase tracking-[0.2em]">Synchronized via Azure Cloud Vault</span>
        </div>
      </div>
    </div>
  );
}
