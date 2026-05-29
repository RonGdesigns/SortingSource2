"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Crosshair, Terminal, Search, ShieldAlert, Cpu, Send, Server } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/navigation";

// --- DATA: 4-STEP ENGINE ---
const steps = [
  {
    id: "hunter",
    title: "1. The Hunter",
    subtitle: "Target Acquisition",
    description: "Input your niche and city parameters. Our proprietary Google Maps API integration strips the web of dozens of relevant local businesses in seconds.",
    icon: <Search className="w-6 h-6 text-black" />,
    terminalCode: "> PROTOCOL: HUNTER\n> ACQUIRING TARGETS...\n> 47 ENTITIES FOUND."
  },
  {
    id: "auditor",
    title: "2. The Extractor",
    subtitle: "Deep Data Mining",
    description: "The Extractor runs asynchronous protocols on your targets' websites to pull direct emails and social handles (IG, FB, X, TikTok) that are usually hidden from public view.",
    icon: <ShieldAlert className="w-6 h-6 text-black" />,
    terminalCode: "> INITIATING EXTRACTION...\n> TARGET: detroitplumbing.com\n> EMAILS FOUND: 2\n> SOCIAL LINKS: INSTAGRAM, FACEBOOK"
  },
  {
    id: "pitcher",
    title: "3. The Pitcher",
    subtitle: "Custom Pitch Writer",
    description: "Stop blasting generic templates. SortingSource injects technical audit parameters directly into your drafts, generating high-conviction emails that highlight specific website vulnerabilities to capture attention immediately.",
    icon: <Cpu className="w-6 h-6 text-black" />,
    terminalCode: "> INITIALIZING DRAFT ENGINE...\n> INJECTING AUDIT PARAMETERS...\n> WRITING PITCH PAYLOAD...\n> DRAFT GENERATED."
  },
  {
    id: "dispatcher",
    title: "4. The Dispatcher",
    subtitle: "Automated Inbox Delivery",
    description: "Execute your campaign directly from the dashboard. Connect via SMTP/IMAP to bulk-send. Our 'Anti-Spam Jitter' protocol injects randomized delays to protect your domain reputation.",
    icon: <Send className="w-6 h-6 text-black" />,
    terminalCode: "> CONNECTING SMTP GATES...\n> ENGAGING ANTI-SPAM JITTER...\n> DEPLOYING MESSAGE 1/47...\n> DELIVERED."
  }
];

export default function SortingSourceLanding() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserStatus(userDoc.data()?.subscriptionStatus || "inactive");
          } else {
            setUserStatus("inactive");
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentUser(null);
        setUserStatus(null);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const handleCheckout = async (priceId: string) => {
    if (!currentUser) {
      router.push("/signup");
      return;
    }

    if (userStatus === "active") {
      router.push("/dashboard");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          userId: currentUser.uid,
          userEmail: currentUser.email
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout Error:", data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-black font-sans selection:bg-black selection:text-white pb-20 relative">

      {/* NAVIGATION BAR */}
      <nav className="border-b-8 border-black bg-white py-4 px-6 md:px-12 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(200,200,200,1)]">
            <Server size={18} />
          </div>
          <span className="font-serif font-black tracking-tight text-xl uppercase leading-none">SortingSource</span>
        </div>
        <div className="flex gap-4 font-mono text-xs">
          {!authChecked ? (
            <div className="animate-pulse bg-neutral-200 h-8 w-20 border-2 border-black" />
          ) : currentUser ? (
            <button 
              onClick={() => {
                if (userStatus === "active") router.push("/dashboard");
                else router.push("/paywall");
              }}
              className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-bold uppercase tracking-wider transition-all"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button 
                onClick={() => router.push("/login")}
                className="px-4 py-2 border-2 border-transparent hover:border-black font-bold uppercase tracking-wider transition-all"
              >
                Log In
              </button>
              <button 
                onClick={() => router.push("/signup")}
                className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(200,200,200,1)] hover:shadow-none"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 1. HERO SECTION (Asymmetrical & Brutalist) */}
      <header className="relative z-10 flex flex-col md:flex-row min-h-[85vh] border-b-8 border-black">
        {/* Left 60% */}
        <div className="w-full md:w-[60%] flex flex-col justify-center px-8 md:px-16 py-20 border-b-8 md:border-b-0 md:border-r-8 border-black bg-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-8 border-2 border-black bg-yellow-400 w-max shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Terminal size={14} className="text-black font-bold" />
            <span className="text-xs tracking-widest text-black uppercase font-mono font-bold">
              Infrastructure Online // v3.0
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="max-w-4xl mb-8 text-5xl md:text-7xl font-serif leading-[1.1] tracking-tight text-black"
          >
            Industrial-Grade <br />
            <span className="bg-black text-white px-2 italic">Outbound.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="max-w-xl mb-12 text-lg font-mono leading-relaxed text-neutral-800"
          >
            Build a direct, self-owned outbound pipeline. No credit markup, no middleman databases, no generic AI templates. Just raw data extraction and cold outreach that actually lands in the inbox.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            {!authChecked ? (
              <div className="animate-pulse bg-neutral-200 h-14 w-48 border-4 border-black" />
            ) : currentUser ? (
              <>
                <button
                  onClick={() => {
                    if (userStatus === "active") {
                      router.push("/dashboard");
                    } else {
                      router.push("/paywall");
                    }
                  }}
                  className="px-8 py-4 font-bold text-white transition-transform transform hover:-translate-y-1 bg-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(200,200,200,1)] flex items-center justify-center gap-3 font-mono uppercase tracking-widest text-sm"
                >
                  <Crosshair size={18} />
                  {userStatus === "active" ? "Go to Dashboard" : "Resolve Paywall"}
                </button>
                <button
                  onClick={() => scrollTo('engine')}
                  className="px-8 py-4 font-bold transition-transform transform hover:-translate-y-1 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black font-mono uppercase tracking-widest text-sm"
                >
                  Examine The Engine
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/signup")}
                  className="px-8 py-4 font-bold text-white transition-transform transform hover:-translate-y-1 bg-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(200,200,200,1)] flex items-center justify-center gap-3 font-mono uppercase tracking-widest text-sm"
                >
                  <Crosshair size={18} />
                  Sign Up & Start Outbound
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="px-8 py-4 font-bold transition-transform transform hover:-translate-y-1 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black font-mono uppercase tracking-widest text-sm"
                >
                  Log In
                </button>
              </>
            )}
          </motion.div>
        </div>

        {/* Right 40% - Graphic/Texture */}
        <div className="w-full md:w-[40%] bg-neutral-200 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent" style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)' }}></div>
          <div className="flex-1 p-10 flex flex-col justify-end">
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono text-sm leading-loose">
              <span className="text-neutral-400">01</span> SYS.INIT(true);<br />
              <span className="text-neutral-400">02</span> SCRAPING_PROTOCOLS = ENGAGED;<br />
              <span className="text-neutral-400">03</span> <span className="bg-yellow-400 text-black px-1 font-bold">READY TO FIRE.</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. ENGINE SECTION (Asymmetrical 30/70 Split) */}
      <section id="engine" className="border-b-8 border-black bg-white">
        <div className="flex flex-col lg:flex-row">

          {/* Left 30% Sticky Title */}
          <div className="w-full lg:w-[35%] p-10 md:p-16 border-b-8 lg:border-b-0 lg:border-r-8 border-black bg-[#F4F4F0]">
            <div className="sticky top-20">
              <h2 className="mb-6 text-5xl font-serif text-black uppercase leading-tight">The <br /> 4-Step <br /> Engine.</h2>
              <p className="text-sm text-neutral-600 font-mono tracking-widest border-t-2 border-black pt-4">Fully automated. Zero human intervention required once engaged.</p>
            </div>
          </div>

          {/* Right 65% Steps */}
          <div className="w-full lg:w-[65%] p-10 md:p-16 flex flex-col gap-16">
            {steps.map((step, index) => (
              <div key={step.id} className="border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transition-all duration-300 hover:translate-x-2 hover:-translate-y-2">
                <div className="absolute -top-6 -left-6 bg-yellow-400 border-4 border-black w-12 h-12 flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {index + 1}
                </div>
                <div className="flex items-center gap-4 mb-6 mt-2">
                  <div className="p-3 bg-neutral-100 border-2 border-black">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase font-mono">{step.title}</h3>
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{step.subtitle}</p>
                  </div>
                </div>
                <p className="text-neutral-800 text-lg leading-relaxed font-sans mb-6">
                  {step.description}
                </p>
                <div className="bg-black text-green-400 p-4 font-mono text-xs leading-loose">
                  {step.terminalCode}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRICING SECTION (SaaS Focused) */}
      <section id="arsenal" className="p-10 md:p-16">
        <div className="mb-16 max-w-2xl">
          <h2 className="mb-4 text-5xl font-serif text-black uppercase">Infrastructure Plans</h2>
          <p className="text-neutral-600 font-mono text-sm tracking-widest border-t-2 border-black pt-4">Select your monthly compute allocation.</p>
        </div>

        <motion.div
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-2 max-w-5xl"
        >
          {/* TIER 1 */}
          <div className="flex flex-col border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-2 relative">
            <div className="p-8 border-b-4 border-black bg-neutral-100">
              <h3 className="text-3xl font-black uppercase font-mono mb-2">The Mercenary</h3>
              <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6">Solo Operators</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-serif">$99</span>
                <span className="text-lg font-bold text-neutral-600">/ mo</span>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <ul className="flex flex-col gap-4 mb-10 flex-grow font-mono text-sm">
                <li className="flex items-start gap-3"><Check size={18} className="text-black shrink-0" /> <span>1,000 Leads Generated / month</span></li>
                <li className="flex items-start gap-3"><Check size={18} className="text-black shrink-0" /> <span>Full Automation Suite</span></li>
                <li className="flex items-start gap-3"><Check size={18} className="text-black shrink-0" /> <span>Cloud Dashboard Access</span></li>
                <li className="flex items-start gap-3"><Check size={18} className="text-black shrink-0" /> <span>Standard Support</span></li>
              </ul>
              <button onClick={() => handleCheckout('price_1Ta4cMLCpB0Zbo9scr4JyLzE')} className="w-full py-4 border-4 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                <Terminal size={18} /> Initialize Plan
              </button>
            </div>
          </div>

          {/* TIER 2 */}
          <div className="flex flex-col border-4 border-black bg-black text-white shadow-[12px_12px_0px_0px_rgba(234,179,8,1)] transition-transform hover:-translate-y-2 relative">
            <div className="absolute -top-5 right-5 bg-yellow-400 text-black px-4 py-1 border-2 border-black font-bold text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Most Deployed
            </div>
            <div className="p-8 border-b-4 border-neutral-800 bg-neutral-900">
              <h3 className="text-3xl font-black uppercase font-mono mb-2 text-white">The Taskforce</h3>
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Agency Scale</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-serif text-white">$249</span>
                <span className="text-lg font-bold text-neutral-500">/ mo</span>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <ul className="flex flex-col gap-4 mb-10 flex-grow font-mono text-sm text-neutral-300">
                <li className="flex items-start gap-3"><Check size={18} className="text-yellow-400 shrink-0" /> <span className="text-white">5,000 Leads Generated / month</span></li>
                <li className="flex items-start gap-3"><Check size={18} className="text-yellow-400 shrink-0" /> <span className="text-white">Full Automation Suite</span></li>
                <li className="flex items-start gap-3"><Check size={18} className="text-yellow-400 shrink-0" /> <span className="text-white">Priority API Queues</span></li>
                <li className="flex items-start gap-3"><Check size={18} className="text-yellow-400 shrink-0" /> <span className="text-white">Priority Support</span></li>
              </ul>
              <button onClick={() => handleCheckout('price_1Ta4clLCpB0Zbo9s8UvxaGrq')} className="w-full py-4 border-4 border-white bg-white text-black hover:bg-yellow-400 hover:border-yellow-400 transition-colors font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                <Terminal size={18} /> Initialize Plan
              </button>
            </div>
          </div>
        </motion.div>

        {/* Custom Tier */}
        <div className="mt-16 border-4 border-black bg-[#F4F4F0] p-8 md:p-12 max-w-5xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold text-black mb-2">Custom Deployment Required?</h3>
            <p className="text-neutral-700 font-mono text-sm max-w-lg leading-relaxed">
              For teams requiring more than 5,000 leads or Bring-Your-Own-Key (BYOK) architecture to preserve margins, contact our engineering lead.
            </p>
          </div>
          <a
            href="mailto:er6798@gmail.com?subject=Enterprise%20SaaS%20Inquiry"
            className="shrink-0 px-8 py-4 bg-black text-white font-bold uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors flex items-center gap-2"
          >
            <Send size={18} />
            Contact Architect
          </a>
        </div>
      </section>
    </div>
  );
}