import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp, query } from 'firebase/firestore';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { app, db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { LogOut, Globe, Menu, X } from 'lucide-react';
import { useAppStore } from '../store';

interface PresenceData {
  uid: string;
  name: string;
  lastActive: any;
  selectedState?: string;
  currentPath?: string;
}

export default function Layout({ onLogout }: { onLogout: () => void }) {
  const auth = getAuth(app);
  const currentUser = auth.currentUser;
  const location = useLocation();
  const { language, setLanguage } = useAppStore();
  
  const [activeUsers, setActiveUsers] = useState<PresenceData[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  // Real-time Presence
  useEffect(() => {
    if (!currentUser) return;
    const presenceRef = doc(db, 'presence', currentUser.uid);
    
    const setPresence = async () => {
      await setDoc(presenceRef, {
        uid: currentUser.uid,
        name: currentUser.displayName || 'Anonymous',
        lastActive: serverTimestamp(),
        currentPath: location.pathname,
      }, { merge: true });
    };
    
    setPresence();
    const ping = setInterval(setPresence, 30000);

    const q = query(collection(db, 'presence'));
    const unsub = onSnapshot(q, (snapshot) => {
      const users: PresenceData[] = [];
      snapshot.forEach(doc => {
        users.push(doc.data() as PresenceData);
      });
      const now = Date.now();
      const active = users.filter(u => {
        if (!u.lastActive) return true;
        return (now - u.lastActive.toMillis()) < 60000;
      });
      setActiveUsers(active);
    });

    const handleBeforeUnload = () => {
      deleteDoc(presenceRef);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(ping);
      unsub();
      deleteDoc(presenceRef);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser, location.pathname]);

  const handleSignOut = async () => {
    await auth.signOut();
    onLogout();
  };

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Self Enumeration", path: "/enumerate" },
    { name: "Survey", path: "/survey" },
    { name: "AI Assistant", path: "/chat" },
    { name: "Info & Privacy", path: "/info" }
  ];

  const languages = [
    "English", "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi", 
    "Kannada", "Kashmiri", "Konkani", "Maithili", "Malayalam", "Manipuri", 
    "Marathi", "Nepali", "Odia", "Punjabi", "Sanskrit", "Santali", "Sindhi", 
    "Tamil", "Telugu", "Urdu"
  ];

  const languageCodes: Record<string, string> = {
    "English": "en",
    "Assamese": "as",
    "Bengali": "bn",
    "Bodo": "bho", 
    "Dogri": "doi",
    "Gujarati": "gu",
    "Hindi": "hi",
    "Kannada": "kn",
    "Kashmiri": "ks",
    "Konkani": "gom",
    "Maithili": "mai",
    "Malayalam": "ml",
    "Manipuri": "mni-Mtei",
    "Marathi": "mr",
    "Nepali": "ne",
    "Odia": "or",
    "Punjabi": "pa",
    "Sanskrit": "sa",
    "Santali": "sat",
    "Sindhi": "sd",
    "Tamil": "ta",
    "Telugu": "te",
    "Urdu": "ur"
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    
    // Attempt to trigger Google Translate
    const gtCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (gtCombo) {
      gtCombo.value = languageCodes[lang] || 'en';
      gtCombo.dispatchEvent(new Event('change'));
    } else {
      // Fallback if widget hasn't fully loaded yet but they clicked quickly
      setTimeout(() => {
        const retryCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (retryCombo) {
          retryCombo.value = languageCodes[lang] || 'en';
          retryCombo.dispatchEvent(new Event('change'));
        }
      }, 500);
    }
  };

  return (
    <div className="h-full flex flex-col font-sans bg-[#0D0D0D] text-[#F2F2F2] overflow-hidden">
      {/* Header */}
      <header className="flex-none px-4 md:px-8 lg:px-10 py-4 lg:py-6 flex items-center justify-between border-b border-[#262626] bg-[#0D0D0D] sticky top-0 z-50">
        
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 -ml-2 text-[#A68B5C] hover:bg-[#1A1A1A] transition-colors rounded"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex flex-col flex-1 lg:flex-none lg:items-start items-center ml-2 lg:ml-0">
          <span className="hidden sm:block text-[#A68B5C] text-[8px] md:text-[10px] tracking-[0.3em] uppercase mb-1 md:mb-2 font-semibold text-center lg:text-left">
            National Demographic Portal
          </span>
          <div className="flex items-center space-x-6 md:space-x-12">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#EBEBEB]">
              INDIA DATA<span className="italic text-[#A68B5C] text-xl sm:text-2xl md:text-3xl ml-1 md:ml-2">BOOK</span>
            </h1>
            
            {/* Desktop Nav Menu */}
            <nav className="hidden lg:flex items-center space-x-1 border-l border-[#262626] pl-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 text-[10px] uppercase tracking-widest font-semibold transition-colors duration-300",
                    location.pathname === link.path 
                      ? "text-[#A68B5C] bg-[#1A1A1A] border border-[#262626]" 
                      : "text-[#666666] hover:text-[#EBEBEB] hover:bg-[#111111]"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Active Users */}
            <div className="hidden xl:flex items-center space-x-6 border-l border-[#262626] pl-6">
              <div className="flex -space-x-2">
                {activeUsers.map(u => (
                  <div 
                    key={u.uid} 
                    title={`${u.name} (Viewing: ${u.currentPath || 'Unknown'})`}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 border-[#0D0D0D] flex items-center justify-center text-[10px] font-bold shadow-sm transition-transform hover:-translate-y-1",
                      u.uid === currentUser?.uid ? "bg-[#A68B5C] text-black" : "bg-[#2A2A2A] text-white"
                    )}
                  >
                    {getInitials(u.name)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative group">
            <div className="flex items-center space-x-1 md:space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest text-[#AAAAAA] cursor-pointer hover:text-[#EBEBEB] transition-colors py-2">
              <Globe size={14} className="w-3 h-3 md:w-4 md:h-4" />
              <span>{language}</span>
            </div>
            <div className="absolute right-0 top-full mt-2 w-32 bg-[#111111] border border-[#262626] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-64 overflow-y-auto no-scrollbar">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors",
                    language === lang ? "text-[#A68B5C]" : "text-[#AAAAAA]"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="text-[10px] sm:text-[11px] uppercase tracking-widest border border-[#A68B5C] text-[#A68B5C] px-3 sm:px-6 py-2 hover:bg-[#A68B5C] hover:text-black transition-colors duration-300 flex items-center space-x-2"
          >
            <span className="hidden sm:inline">Exit</span>
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[73px] sm:top-[85px] inset-x-0 bg-[#0D0D0D] z-40 border-b border-[#262626] shadow-2xl animate-in slide-in-from-top-4">
          <nav className="flex flex-col p-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "px-6 py-4 text-xs uppercase tracking-widest font-semibold transition-colors duration-300 border-b border-[#1A1A1A] last:border-0",
                  location.pathname === link.path 
                    ? "text-[#A68B5C] bg-[#111111]" 
                    : "text-[#AAAAAA] hover:text-[#EBEBEB] hover:bg-[#111111]"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
         <Outlet context={{ activeUsers }} />
      </main>
    </div>
  );
}
