"use client";

import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Terminal, ArrowRight, ShieldAlert, Loader2, Chrome } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      return setError("All fields are required.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    setIsLoading(true);
    setError("");

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Initialize Firestore document for subscription status
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        subscriptionStatus: "inactive",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // 3. Redirect to paywall page since new users start as inactive
      router.push("/paywall");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already registered.");
      } else {
        setError(err.message || "Failed to create account.");
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
      router.push("/paywall");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to register with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-black flex flex-col md:flex-row border-8 border-black font-sans selection:bg-black selection:text-white">
      {/* Left 40% - Asymmetrical Branding Sidebar */}
      <div className="w-full md:w-[40%] bg-black text-white p-8 md:p-10 lg:p-16 flex flex-col justify-between border-b-8 md:border-b-0 md:border-r-8 border-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-700 bg-neutral-900 rounded-lg text-xs font-mono tracking-widest text-neutral-400 uppercase">
            <Terminal size={12} className="text-white" />
            SortingSource
          </Link>
        </div>

        <div className="my-12 md:my-0 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-none tracking-tight mb-6">
            Begin <br />
            <span className="italic bg-white text-black px-2 py-0.5 select-none font-bold">Deployment.</span>
          </h1>
          <p className="font-mono text-xs text-neutral-400 max-w-xs leading-relaxed uppercase tracking-wider">
            Establish your user credentials to allocate outbound compute resources and engage search modules.
          </p>
        </div>

        <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest relative z-10">
          INITIALIZING HANDSHAKE PROTOCOLS...
        </div>
      </div>

      {/* Right 60% - Signup Form Container */}
      <div className="w-full md:w-[60%] flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[24px_8px_24px_8px]"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tight font-mono flex items-center gap-2">
                <UserPlus className="w-6 h-6 shrink-0" /> Registration
              </h2>
              <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider mt-1">Deploy new operator node</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
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
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 bg-neutral-50 border-2 border-neutral-300 focus:border-black rounded-xl text-black font-mono text-sm outline-none transition-all placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase font-mono tracking-widest text-neutral-600 block mb-2">CONFIRM PASSWORD</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
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
                      <Loader2 className="animate-spin" size={16} /> Creating Node...
                    </>
                  ) : (
                    <>
                      Register Node <ArrowRight size={16} />
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
                      <Chrome size={16} /> Register with Google
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 border-t-2 border-neutral-200 pt-6 text-center text-xs font-mono">
              <span className="text-neutral-500">Already registered? </span>
              <Link href="/login" className="text-black hover:underline uppercase font-bold">
                Authorize Node
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
