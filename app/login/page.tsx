"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Key, Terminal, ArrowRight, ShieldAlert, Loader2, Chrome } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return setError("Both fields are required to authenticate.");
    }
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Failed to log in.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Ensure Firestore user document exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          subscriptionStatus: "inactive",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to authenticate with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-black flex flex-col md:flex-row border-8 border-black font-sans selection:bg-black selection:text-white">
      {/* Left 40% - Asymmetrical Branding Sidebar */}
      <div className="w-full md:w-[40%] bg-black text-white p-8 md:p-16 flex flex-col justify-between border-b-8 md:border-b-0 md:border-r-8 border-black relative overflow-hidden">
        {/* Decorative Grid Line Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-700 bg-neutral-900 rounded-lg text-xs font-mono tracking-widest text-neutral-400 uppercase">
            <Terminal size={12} className="text-white" />
            SortingSource // Gateway
          </Link>
        </div>

        <div className="my-12 md:my-0 relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif leading-none tracking-tight mb-6">
            System <br />
            <span className="italic bg-white text-black px-2 py-0.5 select-none font-bold">Access.</span>
          </h1>
          <p className="font-mono text-xs text-neutral-400 max-w-xs leading-relaxed uppercase tracking-wider">
            Authorize your node to enter the outbound CRM database and deploy cold outreach campaigns.
          </p>
        </div>

        <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest relative z-10">
          SECURE CONNECTION REQUIRED // PORT 443
        </div>
      </div>

      {/* Right 60% - Login Form Container */}
      <div className="w-full md:w-[60%] flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          {/* Asymmetric offsets and irregular border radius */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[24px_8px_24px_8px]"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tight font-mono flex items-center gap-2">
                <Key className="w-6 h-6 shrink-0" /> Authorization
              </h2>
              <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider mt-1">Provide your access credentials</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase font-mono tracking-widest text-neutral-600 block mb-2">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@sortingsource.com"
                  className="w-full px-4 py-3 bg-neutral-50 border-2 border-neutral-300 focus:border-black rounded-xl text-black font-mono text-sm outline-none transition-all placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase font-mono tracking-widest text-neutral-600 block mb-2">PASSWORD</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 bg-neutral-50 border-2 border-neutral-300 focus:border-black rounded-xl text-black font-mono text-sm outline-none transition-all placeholder:text-neutral-400"
                />
              </div>

              {error && (
                <div className="text-red-600 text-xs bg-red-50 border-2 border-red-300 p-4 rounded-xl flex items-start gap-2 font-mono uppercase font-bold">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 space-y-3">
                <button 
                  type="submit" 
                  disabled={isLoading || googleLoading}
                  className="w-full py-4 bg-black text-white hover:bg-neutral-900 font-mono font-bold uppercase tracking-widest text-xs border-2 border-black flex items-center justify-center gap-2 transition-all active:translate-y-0.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Authenticating...
                    </>
                  ) : (
                    <>
                      Authorize Node <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="flex items-center my-4">
                  <div className="flex-grow border-t-2 border-neutral-200"></div>
                  <span className="px-3 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">or</span>
                  <div className="flex-grow border-t-2 border-neutral-200"></div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading || googleLoading}
                  className="w-full py-4 bg-white text-black hover:bg-neutral-50 font-mono font-bold uppercase tracking-widest text-xs border-2 border-black flex items-center justify-center gap-2 transition-all active:translate-y-0.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Connecting...
                    </>
                  ) : (
                    <>
                      <Chrome size={16} /> Continue with Google
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 border-t-2 border-neutral-200 pt-6 flex flex-col sm:flex-row justify-between text-xs font-mono gap-3">
              <Link href="/signup" className="text-neutral-600 hover:text-black hover:underline uppercase font-bold">
                Create Account
              </Link>
              <Link href="/reset-password" className="text-neutral-500 hover:text-black hover:underline uppercase">
                Forgot Password?
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
