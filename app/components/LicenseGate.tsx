"use client";

import React, { useState, useEffect } from "react";
import { Key, Loader2, ShieldAlert, Lock, ExternalLink } from "lucide-react";

export default function LicenseGate({ children }: { children: React.ReactNode }) {
  const [licenseKey, setLicenseKey] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if we already have a successful hash stored locally
    const savedHash = localStorage.getItem("ss_license_hash");
    if (savedHash) {
      // If a hash exists, we assume they are activated for this session
      // (The Python engine will still block scraping if the license.dat is missing)
      setIsVerified(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleActivation = async () => {
    if (!licenseKey) return setError("Please enter your license key.");
    setIsLoading(true);
    setError("");

    try {
      // 1. Hand the key to our local Python Engine
      const response = await fetch("http://127.0.0.1:8000/api/license/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key: licenseKey }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 2. Python verified it! Save the hardware hash locally
        localStorage.setItem("ss_license_key", licenseKey);
        localStorage.setItem("ss_license_hash", data.local_hash);
        setIsVerified(true);
      } else {
        // 3. Python rejected it (Invalid key or seat limit reached)
        setError(data.detail || "Invalid License Key.");
      }
    } catch (err) {
      setError("Engine Offline. Make sure your Scraper Engine (Python) is running.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500 mb-4" size={40} />
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Handshaking with Core Engine...</p>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0A0A0A] border border-neutral-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="text-center mb-10 relative z-10">
            <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/20 shadow-inner">
              <Lock className="text-cyan-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">System Activation</h1>
            <p className="text-neutral-500 text-sm mt-3 leading-relaxed">Enter your license key to unlock the environment.</p>
          </div>

          <div className="space-y-6 relative z-10">
            <input 
                type="text" 
                placeholder="XXXX-XXXX-XXXX-XXXX" 
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="w-full px-6 py-4 bg-black/40 border border-neutral-800 rounded-2xl text-white font-mono text-sm outline-none focus:border-cyan-500/50 transition-all"
            />
            {error && <div className="text-red-400 text-xs bg-red-400/5 p-3 rounded-xl border border-red-400/10 flex items-center gap-2"><ShieldAlert size={14}/> {error}</div>}
            <button onClick={handleActivation} className="w-full py-4 bg-white text-black hover:bg-cyan-400 hover:text-black font-bold rounded-2xl transition-all shadow-lg active:scale-95">Activate Node</button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}