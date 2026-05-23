"use client";

import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Link from "next/link";
import { KeyRound, Terminal, ArrowRight, ShieldAlert, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return setError("Please specify the operator email address.");
    }
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to transmit recovery email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-black flex flex-col md:flex-row border-8 border-black font-sans selection:bg-black selection:text-white">
      {/* Left 40% - Asymmetrical Branding Sidebar */}
      <div className="w-full md:w-[40%] bg-black text-white p-8 md:p-16 flex flex-col justify-between border-b-8 md:border-b-0 md:border-r-8 border-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-700 bg-neutral-900 rounded-lg text-xs font-mono tracking-widest text-neutral-400 uppercase">
            <Terminal size={12} className="text-white" />
            SortingSource // Gateway
          </Link>
        </div>

        <div className="my-12 md:my-0 relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif leading-none tracking-tight mb-6">
            Node <br />
            <span className="italic bg-white text-black px-2 py-0.5 select-none font-bold">Recovery.</span>
          </h1>
          <p className="font-mono text-xs text-neutral-400 max-w-xs leading-relaxed uppercase tracking-wider">
            Initiate security clearance protocol to recover access keys for your operator dashboard.
          </p>
        </div>

        <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest relative z-10">
          RECOVERY SYSTEM ENGAGED
        </div>
      </div>

      {/* Right 60% - Recovery Form Container */}
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
                <KeyRound className="w-6 h-6 shrink-0" /> Key Reset
              </h2>
              <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider mt-1">Recover operator credentials</p>
            </div>

            {success ? (
              <div className="space-y-6">
                <div className="text-green-600 text-sm bg-green-50 border-2 border-green-300 p-6 rounded-xl flex flex-col gap-3 font-mono">
                  <div className="flex items-center gap-2 font-bold uppercase">
                    <CheckCircle size={18} className="shrink-0" />
                    <span>Protocol Executed</span>
                  </div>
                  <p className="text-xs leading-relaxed normal-case text-neutral-700">
                    A password reset vector has been dispatched to <strong className="text-black">{email}</strong>. Check your inbox and follow the link to establish new access keys.
                  </p>
                </div>
                <Link 
                  href="/login"
                  className="w-full py-4 bg-black text-white hover:bg-neutral-900 font-mono font-bold uppercase tracking-widest text-xs border-2 border-black flex items-center justify-center gap-2 transition-all active:translate-y-0.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:shadow-none"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
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

                {error && (
                  <div className="text-red-600 text-xs bg-red-50 border-2 border-red-300 p-4 rounded-xl flex items-start gap-2 font-mono uppercase font-bold">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-4 bg-black text-white hover:bg-neutral-900 font-mono font-bold uppercase tracking-widest text-xs border-2 border-black flex items-center justify-center gap-2 transition-all active:translate-y-0.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:shadow-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Dispatched...
                      </>
                    ) : (
                      <>
                        Transmit Recovery Link <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {!success && (
              <div className="mt-8 border-t-2 border-neutral-200 pt-6 text-center text-xs font-mono">
                <Link href="/login" className="text-black hover:underline uppercase font-bold">
                  Return to Login
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
