"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Crosshair, Mailbox, History, Server, BookOpen, ChevronDown, Rocket, Key, ExternalLink, Cpu, Loader2
} from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showDocs, setShowDocs] = useState(true);

  const [geminiOverride, setGeminiOverride] = useState("");
  const [openaiOverride, setOpenaiOverride] = useState("");
  const [hfOverride, setHfOverride] = useState("");
  const [placesOverride, setPlacesOverride] = useState("");
  const [twilioOverride, setTwilioOverride] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      if (!usr) {
        router.push("/login");
      } else {
        setUser(usr);
        try {
          const userDoc = await getDoc(doc(db, "users", usr.uid));
          if (userDoc.exists() && userDoc.data()?.subscriptionStatus === "active") {
            setIsAuthLoading(false);
          } else {
            router.push("/paywall");
          }
        } catch (err) {
          console.error("Firestore lookup failed:", err);
          router.push("/paywall");
        }
      }
    });

    setGeminiOverride(localStorage.getItem('gemini_version') || "");
    setOpenaiOverride(localStorage.getItem('openai_version') || "");
    setHfOverride(localStorage.getItem('huggingface_version') || "");
    setPlacesOverride(localStorage.getItem('places_version') || "");

    return () => unsubscribe();
  }, [router]);

  const handleSaveModels = () => {
    if (geminiOverride.trim()) localStorage.setItem('gemini_version', geminiOverride.trim());
    else localStorage.removeItem('gemini_version');
    if (openaiOverride.trim()) localStorage.setItem('openai_version', openaiOverride.trim());
    else localStorage.removeItem('openai_version');
    if (hfOverride.trim()) localStorage.setItem('huggingface_version', hfOverride.trim());
    else localStorage.removeItem('huggingface_version');
    if (placesOverride.trim()) localStorage.setItem('places_version', placesOverride.trim());
    else localStorage.removeItem('places_version');
    if (twilioOverride.trim()) localStorage.setItem('twilio_version', twilioOverride.trim());
    else localStorage.removeItem('twilio_version');

    setSaveStatus("SAVED!");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  return (
    <div className="flex w-full h-full min-h-screen overflow-hidden bg-[#F4F4F0] selection:bg-black selection:text-white">
      {/* SIDEBAR */}
      <aside className="w-70 bg-white border-r-4 border-black flex flex-col h-screen shrink-0 transition-all z-20">

        {/* Logo */}
        <div className="p-6 border-b-4 border-black bg-white">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(200,200,200,1)] border-2 border-black">
              <Server size={18} />
            </div>
            <div>
              <h1 className="font-serif font-black tracking-tight text-black leading-tight text-xl uppercase">SortingSource</h1>
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">Enterprise v3.0</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Navigation */}
          <nav className="space-y-2">
            <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 border-2 transition-transform hover:-translate-y-0.5 group font-mono uppercase tracking-widest text-xs font-bold ${pathname === '/dashboard' ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(200,200,200,1)]' : 'bg-transparent text-black border-transparent hover:border-black'}`}>
              <Crosshair size={18} className="group-hover:scale-110 transition-transform" /> Target Hunter
            </Link>
            <Link href="/pitch" className={`flex items-center gap-3 px-4 py-3 border-2 transition-transform hover:-translate-y-0.5 group font-mono uppercase tracking-widest text-xs font-bold ${pathname === '/pitch' ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(200,200,200,1)]' : 'bg-transparent text-black border-transparent hover:border-black'}`}>
              <Mailbox size={18} className="group-hover:scale-110 transition-transform" /> Pitch Engine
            </Link>
            <Link href="/logs" className={`flex items-center gap-3 px-4 py-3 border-2 transition-transform hover:-translate-y-0.5 group font-mono uppercase tracking-widest text-xs font-bold ${pathname === '/logs' ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(200,200,200,1)]' : 'bg-transparent text-black border-transparent hover:border-black'}`}>
              <History size={18} className="group-hover:scale-110 transition-transform" /> Audit Logs
            </Link>
          </nav>

          {/* Docs */}
          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(200,200,200,1)]">
            <button onClick={() => setShowDocs(!showDocs)} className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-100 transition-colors border-b-2 border-black">
              <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
                <BookOpen size={14} className="text-black" /> Directives
              </div>
              <ChevronDown size={14} className={`text-black transition-transform duration-300 ${showDocs ? 'rotate-180' : ''}`} />
            </button>

            <div className={`transition-all duration-500 ease-in-out ${showDocs ? 'max-h-250 opacity-100 p-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="mb-6">
                <h3 className="flex items-center gap-2 text-[10px] font-black text-black mb-3 uppercase tracking-widest border-b-2 border-black pb-1">
                  <Rocket size={12} className="text-black" /> Workflow
                </h3>
                <ol className="space-y-3 text-[11px] text-neutral-600 leading-relaxed font-mono">
                  <li><strong className="text-black">1. Hunt:</strong> Use Target Hunter.</li>
                  <li><strong className="text-black">2. Extract:</strong> Use to extract data.</li>
                  <li><strong className="text-black">3. Pitch:</strong> AI Email Generator.</li>
                  <li><strong className="text-black">4. Logs:</strong> Track replies.</li>
                </ol>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-[10px] font-black text-black mb-3 uppercase tracking-widest border-b-2 border-black pb-1">
                  <Key size={12} className="text-black" /> Connections
                </h3>
                <div className="space-y-2">
                  {['Places API Key', 'Gemini API Key', 'Gmail App Password', 'OpenAI API Key', 'Twilio Console', 'Hugging Face Token'].map(link => (
                    <a key={link} href="#" className="flex items-center justify-between group p-2 bg-neutral-100 border-2 border-transparent hover:border-black transition-all text-left font-mono">
                      <span className="text-[9px] text-neutral-600 group-hover:text-black uppercase tracking-wider font-bold">{link}</span>
                      <ExternalLink size={10} className="text-neutral-400 group-hover:text-black" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Overrides */}
          <div className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(200,200,200,1)]">
            <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-black" />
                <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Overrides</h3>
              </div>
              <button onClick={handleSaveModels} className="text-[9px] font-bold uppercase tracking-widest bg-black text-white hover:bg-transparent hover:text-black border-2 border-black px-2 py-1 transition-all">
                {saveStatus || "SAVE"}
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Gemini', val: geminiOverride, set: setGeminiOverride, placeholder: 'gemini-2.5-flash' },
                { label: 'OpenAI', val: openaiOverride, set: setOpenaiOverride, placeholder: 'gpt-4o-mini' },
                { label: 'Hugging Face', val: hfOverride, set: setHfOverride, placeholder: 'Qwen2.5-72B' }
              ].map(item => (
                <div key={item.label}>
                  <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">{item.label}</label>
                  <input value={item.val} onChange={(e) => item.set(e.target.value)} placeholder={`{Default} ${item.placeholder}`} className="w-full bg-transparent border-b-2 border-neutral-300 p-1 text-[10px] font-mono outline-none focus:border-black text-black placeholder:text-neutral-400" />
                </div>
              ))}
            </div>
          </div>

          <Link href="/instructions" className="flex items-center gap-3 px-4 py-3 mt-4 border-2 transition-transform hover:-translate-y-0.5 group font-mono uppercase tracking-widest text-xs font-bold bg-transparent text-black border-transparent hover:border-black">
            <BookOpen size={18} className="group-hover:scale-110 transition-transform" /> Full Instructions
          </Link>
        </div>

        {/* Profile */}
        <div className="p-4 border-t-4 border-black bg-white">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-neutral-200 border-2 border-black flex items-center justify-center font-bold text-xs uppercase">
              {user?.email ? user.email.substring(0, 2) : "OP"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-black uppercase tracking-widest truncate" title={user?.email || "SaaS Member"}>
                {user?.email?.split('@')[0] || "Operator"}
              </p>
              <button 
                onClick={async () => {
                  await signOut(auth);
                  router.push("/login");
                }}
                className="text-[9px] font-mono font-bold text-neutral-500 hover:text-black uppercase tracking-wider block mt-1 hover:underline"
              >
                Disconnect Node
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 h-screen overflow-auto bg-[#F4F4F0] p-4 lg:p-8">
        {isAuthLoading ? (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-black mb-4" size={32} />
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Syncing Operator Node...</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
