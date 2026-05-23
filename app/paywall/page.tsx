"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Check, Terminal, LogOut, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function PaywallPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (!usr) {
        router.push("/login");
      } else {
        setUser(usr);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleCheckout = async (priceId: string) => {
    if (!user) return;
    setCheckoutLoading(priceId);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          userEmail: user.email
        }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create checkout session.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to connect to the checkout API.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-cyan-500 mb-4" size={40} />
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Verifying Clearance Level...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-black font-sans selection:bg-black selection:text-white p-6 md:p-12 border-8 border-black">
      {/* Header bar */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-black pb-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif leading-none tracking-tight uppercase">System Locked</h1>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-2 font-bold">Active subscription required for environment access</p>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="bg-black text-white px-3 py-1.5 uppercase font-bold border-2 border-black">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors uppercase font-bold"
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {error && (
          <div className="mb-8 text-red-600 text-xs bg-red-50 border-2 border-red-300 p-4 rounded-xl flex items-start gap-2 font-mono uppercase font-bold">
            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Asymmetric pricing layout: Solo Operator vs. Agency */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-stretch mb-12">
          {/* TIER 1 - Solo (Occupy 2 columns of 5) */}
          <div className="md:col-span-2 flex flex-col border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[24px_8px_24px_8px] overflow-hidden">
            <div className="p-8 border-b-4 border-black bg-neutral-100">
              <h3 className="text-2xl font-black uppercase font-mono mb-1">The Mercenary</h3>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Solo Operator Tier</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-serif font-black">$99</span>
                <span className="text-xs font-bold text-neutral-600 font-mono">/ mo</span>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow justify-between">
              <ul className="flex flex-col gap-4 mb-10 font-mono text-xs">
                <li className="flex items-start gap-3">
                  <Check size={14} className="text-black shrink-0 mt-0.5" />
                  <span>1,000 leads generated per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={14} className="text-black shrink-0 mt-0.5" />
                  <span>Full targeting & scraping suite</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={14} className="text-black shrink-0 mt-0.5" />
                  <span>AI Pitch generation engine</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={14} className="text-black shrink-0 mt-0.5" />
                  <span>SMTP/IMAP automated inbox delivery</span>
                </li>
              </ul>

              <button
                onClick={() => handleCheckout("price_1Ta4cMLCpB0Zbo9scr4JyLzE")}
                disabled={checkoutLoading !== null}
                className="w-full py-4 bg-white text-black hover:bg-black hover:text-white transition-colors font-mono font-bold uppercase tracking-widest text-xs border-2 border-black flex items-center justify-center gap-2 rounded-xl active:translate-y-0.5"
              >
                {checkoutLoading === "price_1Ta4cMLCpB0Zbo9scr4JyLzE" ? (
                  <>
                    <Loader2 className="animate-spin" size={14} /> Provisioning...
                  </>
                ) : (
                  <>
                    <Cpu size={14} /> Initialize Mercenary
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Spacer / Middle Interstitial or just a 3-col layout */}
          {/* TIER 2 - Enterprise/Agency (Occupy 3 columns of 5) */}
          <div className="md:col-span-3 flex flex-col border-4 border-black bg-black text-white shadow-[12px_12px_0px_0px_rgba(234,179,8,1)] rounded-[8px_24px_8px_24px] overflow-hidden relative">
            <div className="absolute -top-1 right-5 bg-yellow-400 text-black px-4 py-1 border-b-2 border-x-2 border-black font-bold text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Most Deployed
            </div>

            <div className="p-8 border-b-4 border-neutral-800 bg-neutral-900">
              <h3 className="text-2xl font-black uppercase font-mono mb-1 text-white">The Taskforce</h3>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Agency Scale Tier</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-serif font-black text-white">$249</span>
                <span className="text-xs font-bold text-neutral-500 font-mono">/ mo</span>
              </div>
            </div>

            <div className="p-8 flex flex-col flex-grow justify-between">
              <ul className="flex flex-col gap-4 mb-10 font-mono text-xs text-neutral-300">
                <li className="flex items-start gap-3">
                  <Check size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-white">5,000 leads generated per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-white">Full automation & scheduling suite</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-white">Priority API processing queues</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-white">Priority developer support logs</span>
                </li>
              </ul>

              <button
                onClick={() => handleCheckout("price_1Ta4clLCpB0Zbo9s8UvxaGrq")}
                disabled={checkoutLoading !== null}
                className="w-full py-4 bg-white text-black hover:bg-yellow-400 hover:border-yellow-400 transition-colors font-mono font-bold uppercase tracking-widest text-xs border-2 border-white flex items-center justify-center gap-2 rounded-xl active:translate-y-0.5"
              >
                {checkoutLoading === "price_1Ta4clLCpB0Zbo9s8UvxaGrq" ? (
                  <>
                    <Loader2 className="animate-spin" size={14} /> Provisioning...
                  </>
                ) : (
                  <>
                    <Cpu size={14} /> Initialize Taskforce
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bring Your Own Key Interstitial */}
        <div className="border-4 border-black bg-[#F4F4F0] p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="font-mono text-xs uppercase text-neutral-600">
            <span className="font-bold text-black block mb-1">Bring-Your-Own-Key (BYOK) Architecture</span>
            Allows Solo Operators to utilize their own direct Google Places and Gemini API limits.
          </div>
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            SECURE ENCRYPTION DETECTED
          </div>
        </div>
      </div>
    </div>
  );
}
