"use client";

import React, { useState, useEffect } from "react";
import { Check, Crosshair, Terminal, Search, ShieldAlert, Cpu, Send, Server, Zap } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/navigation";

// --- DATA: 4-STEP ENGINE ---
const steps = [
  {
    id: "hunter",
    num: "01",
    title: "The Hunter",
    subtitle: "Target Acquisition",
    description: "Input your niche and city parameters. Proprietary Google Maps API integration strips the web of dozens of relevant local businesses in seconds.",
    terminalCode: "> PROTOCOL: HUNTER\n> ACQUIRING TARGETS...\n> 47 ENTITIES FOUND."
  },
  {
    id: "extractor",
    num: "02",
    title: "The Extractor",
    subtitle: "Deep Data Mining",
    description: "Asynchronous protocols run on target websites to pull direct emails and social handles — IG, FB, X, TikTok — usually hidden from public view.",
    terminalCode: "> INITIATING EXTRACTION...\n> TARGET: detroitplumbing.com\n> EMAILS FOUND: 2\n> SOCIAL LINKS: INSTAGRAM, FACEBOOK"
  },
  {
    id: "pitcher",
    num: "03",
    title: "The Pitcher",
    subtitle: "Custom Pitch Writer",
    description: "Stop blasting generic templates. Technical audit parameters inject directly into your drafts — generating high-conviction emails that highlight specific website vulnerabilities.",
    terminalCode: "> INITIALIZING DRAFT ENGINE...\n> INJECTING AUDIT PARAMETERS...\n> WRITING PITCH PAYLOAD...\n> DRAFT GENERATED."
  },
  {
    id: "dispatcher",
    num: "04",
    title: "The Dispatcher",
    subtitle: "Automated Inbox Delivery",
    description: "Execute campaigns directly from the dashboard via SMTP/IMAP. Anti-Spam Jitter protocol injects randomized delays to protect your domain reputation.",
    terminalCode: "> CONNECTING SMTP GATES...\n> ENGAGING ANTI-SPAM JITTER...\n> DEPLOYING MESSAGE 1/47...\n> DELIVERED."
  }
];

// --- SVG: CONSTRUCTIVIST DOWNTOWN SKYLINE ---
function DowntownSkylineSVG() {
  return (
    <svg
      viewBox="0 0 180 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 180, height: "auto" }}
      aria-hidden="true"
    >
      {/* Background/Backdrop building elements (Teal) */}
      <rect x="5" y="140" width="60" height="230" fill="#2E7E82" />
      <rect x="115" y="90" width="55" height="280" fill="#2E7E82" opacity="0.65" />

      {/* Amber speed lines behind foreground buildings */}
      <rect x="75" y="0" width="6" height="380" fill="#F0A500" />
      <line x1="10" y1="330" x2="170" y2="170" stroke="#F0A500" strokeWidth="4" />

      {/* Foreground Building 1 - Tall Night */}
      <rect x="40" y="60" width="55" height="310" fill="#1A1A1F" />
      {/* Window grid for Building 1 */}
      <g fill="#EDE8DC" opacity="0.85">
        <rect x="48" y="80" width="8" height="12" rx="1" />
        <rect x="60" y="80" width="8" height="12" rx="1" />
        <rect x="72" y="80" width="8" height="12" rx="1" />
        <rect x="84" y="80" width="8" height="12" rx="1" />

        <rect x="48" y="110" width="8" height="12" rx="1" />
        <rect x="60" y="110" width="8" height="12" rx="1" />
        <rect x="72" y="110" width="8" height="12" rx="1" />
        <rect x="84" y="110" width="8" height="12" rx="1" />

        <rect x="48" y="140" width="8" height="12" rx="1" />
        <rect x="60" y="140" width="8" height="12" rx="1" />
        <rect x="72" y="140" width="8" height="12" rx="1" />
        <rect x="84" y="140" width="8" height="12" rx="1" />

        <rect x="48" y="170" width="8" height="12" rx="1" />
        <rect x="60" y="170" width="8" height="12" rx="1" />
        <rect x="72" y="170" width="8" height="12" rx="1" />
        <rect x="84" y="170" width="8" height="12" rx="1" />

        <rect x="48" y="200" width="8" height="12" rx="1" />
        <rect x="60" y="200" width="8" height="12" rx="1" />
        <rect x="72" y="200" width="8" height="12" rx="1" />
        <rect x="84" y="200" width="8" height="12" rx="1" />

        <rect x="48" y="230" width="8" height="12" rx="1" />
        <rect x="60" y="230" width="8" height="12" rx="1" />
        <rect x="72" y="230" width="8" height="12" rx="1" />
        <rect x="84" y="230" width="8" height="12" rx="1" />
      </g>

      {/* Foreground Building 2 - Shorter Red */}
      <rect x="90" y="150" width="65" height="220" fill="#D42B1E" />
      <g fill="#EDE8DC" opacity="0.85">
        <rect x="98" y="170" width="10" height="16" rx="1" />
        <rect x="113" y="170" width="10" height="16" rx="1" />
        <rect x="128" y="170" width="10" height="16" rx="1" />
        <rect x="143" y="170" width="10" height="16" rx="1" />

        <rect x="98" y="200" width="10" height="16" rx="1" />
        <rect x="113" y="200" width="10" height="16" rx="1" />
        <rect x="128" y="200" width="10" height="16" rx="1" />
        <rect x="143" y="200" width="10" height="16" rx="1" />

        <rect x="98" y="230" width="10" height="16" rx="1" />
        <rect x="113" y="230" width="10" height="16" rx="1" />
        <rect x="128" y="230" width="10" height="16" rx="1" />
        <rect x="143" y="230" width="10" height="16" rx="1" />
      </g>

      {/* Tallest background needle (Night) */}
      <rect x="100" y="40" width="12" height="110" fill="#1A1A1F" />
      
      {/* Diagonal cuts / speed lines on buildings */}
      <line x1="85" y1="60" x2="40" y2="105" stroke="#F0A500" strokeWidth="4" />
    </svg>
  );
}

export default function SortingSourceLanding() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const isAdmin = ["er6798@gmail.com", "rongdesigns313@gmail.com"].includes(user.email || "");
        if (isAdmin) {
          setUserStatus("active");
        } else {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              setUserStatus(userDoc.data()?.subscriptionStatus || "inactive");
            } else {
              setUserStatus("inactive");
            }
          } catch (e) {
            console.error(e);
            setUserStatus("inactive");
          }
        }
      } else {
        setCurrentUser(null);
        setUserStatus(null);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const handleCheckout = async (priceId: string) => {
    if (!currentUser) { router.push("/signup"); return; }
    if (userStatus === "active") { router.push("/dashboard"); return; }
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userId: currentUser.uid, userEmail: currentUser.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-canvas)", color: "var(--color-night)", fontFamily: "var(--font-body)" }}
    >

      {/* ===== NAVIGATION ===== */}
      <nav
        className="px-4 lg:px-12"
        style={{
          borderBottom: "5px solid var(--color-night)",
          background: "var(--color-canvas)",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32, height: 32,
              background: "var(--color-transit-red)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Server size={16} color="var(--color-canvas)" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "1.25rem",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "var(--color-night)",
            }}
          >
            SortingSource
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!authChecked ? (
            <div style={{ width: 120, height: 36, background: "rgba(26,26,31,0.1)" }} />
          ) : currentUser ? (
            <button
              onClick={() => { if (userStatus === "active") router.push("/dashboard"); else router.push("/paywall"); }}
              className="metro-btn-primary"
              style={{ padding: "10px 24px", fontSize: "0.75rem" }}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="metro-btn-ghost"
                style={{ padding: "10px 24px", fontSize: "0.75rem" }}
              >
                Log In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="metro-btn-primary"
                style={{ padding: "10px 24px", fontSize: "0.75rem" }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ===== HERO — Teal left / Red right, curve divider ===== */}
      <header
        id="hero"
        className="flex flex-col lg:flex-row"
        style={{
          minHeight: "90vh",
          borderBottom: "5px solid var(--color-night)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left teal field — 58% */}
        <div
          className="field-teal w-full lg:w-[58%]"
          style={{
            padding: "clamp(32px, 5vw, 96px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* System label */}
          <div
            className="metro-label"
            style={{
              color: "var(--color-amber)",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Terminal size={12} />
            Infrastructure Online // v3.0
          </div>

          {/* Mega display headline */}
          <h1
            className="metro-display"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
              color: "var(--color-canvas)",
              marginBottom: 32,
              maxWidth: "100%",
            }}
          >
            Industrial<br />
            Grade<br />
            <span style={{ color: "var(--color-amber)", fontStyle: "italic" }}>Outbound.</span>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.1rem",
              lineHeight: 1.6,
              color: "rgba(237,232,220,0.85)",
              maxWidth: 480,
              marginBottom: 48,
            }}
          >
            Build a direct, self-owned outbound pipeline. No credit markup, no middleman databases. Raw data extraction and cold outreach that actually lands in the inbox.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {!authChecked ? (
              <div style={{ width: 180, height: 52, background: "rgba(237,232,220,0.2)" }} />
            ) : currentUser ? (
              <>
                <button
                  onClick={() => { if (userStatus === "active") router.push("/dashboard"); else router.push("/paywall"); }}
                  style={{
                    background: "var(--color-canvas)",
                    color: "var(--color-night)",
                    border: "3px solid var(--color-canvas)",
                    padding: "14px 32px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-amber)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-canvas)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-night)"; }}
                >
                  <Crosshair size={16} />
                  {userStatus === "active" ? "Go to Dashboard" : "Resolve Paywall"}
                </button>
                <button
                  onClick={() => scrollTo("engine")}
                  style={{
                    background: "transparent",
                    color: "var(--color-canvas)",
                    border: "3px solid var(--color-canvas)",
                    padding: "14px 32px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(237,232,220,0.15)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  Examine The Engine
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/signup")}
                  style={{
                    background: "var(--color-canvas)",
                    color: "var(--color-night)",
                    border: "3px solid var(--color-canvas)",
                    padding: "14px 32px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-amber)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-canvas)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-night)"; }}
                >
                  <Crosshair size={16} />
                  Sign Up & Start Outbound
                </button>
                <button
                  onClick={() => router.push("/login")}
                  style={{
                    background: "transparent",
                    color: "var(--color-canvas)",
                    border: "3px solid var(--color-canvas)",
                    padding: "14px 32px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(237,232,220,0.15)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sweeping curve SVG divider */}
        <svg
          className="hidden lg:block"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            height: "100%",
            width: 120,
            transform: "translateX(-50%)",
            zIndex: 3,
            pointerEvents: "none",
          }}
          preserveAspectRatio="none"
          viewBox="0 0 120 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M60 0 C60 0 80 225 60 450 C40 675 60 900 60 900 L120 900 L120 0 Z" fill="var(--color-transit-red)" />
        </svg>

        {/* Right transit red field — 42% */}
        <div
          className="field-red w-full lg:w-[42%] py-16 lg:py-0 border-t-[5px] lg:border-t-0 border-[color:var(--color-night)]"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          {/* Downtown skyline silhouette */}
          <div
            className="train-enter"
            style={{ width: "65%", maxWidth: 180 }}
          >
            <DowntownSkylineSVG />
          </div>

          {/* System status badge */}
          <div
            className="metro-label"
            style={{
              color: "var(--color-amber)",
              marginTop: 32,
              display: "flex",
              alignItems: "center",
              gap: 8,
              letterSpacing: "0.35em",
            }}
          >
            <div style={{ width: 8, height: 8, background: "var(--color-amber)", animation: "pulse 2s infinite" }} />
            System Online
          </div>
        </div>
      </header>

      {/* ===== ENGINE SECTION — 35/65 split ===== */}
      <section
        id="engine"
        className="flex flex-col lg:flex-row"
        style={{
          borderBottom: "5px solid var(--color-night)",
          minHeight: "60vh",
        }}
      >
        {/* Left 35% — teal sticky label */}
        <div
          className="field-teal w-full lg:w-[35%] border-b-[5px] lg:border-b-0 lg:border-r-[5px] border-[color:var(--color-night)]"
          style={{
            padding: "clamp(32px, 5vw, 80px)",
            position: "relative",
          }}
        >
          <div style={{ position: "sticky", top: 80 }}>
            {/* Amber stripe device */}
            <div
              style={{
                width: 6,
                height: 48,
                background: "var(--color-amber)",
                marginBottom: 24,
              }}
            />
            <h2
              className="metro-display"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 5rem)",
                color: "var(--color-canvas)",
                marginBottom: 24,
                lineHeight: 0.92,
              }}
            >
              The<br />4-Step<br />Engine.
            </h2>
            <p
              className="metro-label"
              style={{ color: "rgba(237,232,220,0.6)" }}
            >
              Fully automated. Zero human intervention once engaged.
            </p>
          </div>
        </div>

        {/* Right 65% — steps */}
        <div
          className="w-full lg:w-[65%]"
          style={{
            padding: "clamp(32px, 5vw, 80px)",
            background: "var(--color-canvas)",
            display: "flex",
            flexDirection: "column",
            gap: 48,
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.id}
              style={{
                borderTop: "3px solid var(--color-night)",
                paddingTop: 32,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Step number + title row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
                <span
                  className="metro-display"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 5rem)",
                    color: "rgba(26,26,31,0.12)",
                    lineHeight: 1,
                    minWidth: 80,
                  }}
                >
                  {step.num}
                </span>
                <div>
                  <div
                    className="metro-label"
                    style={{ color: "var(--color-transit-red)", marginBottom: 4 }}
                  >
                    {step.subtitle}
                  </div>
                  <h3
                    className="metro-display"
                    style={{
                      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                      color: "var(--color-night)",
                    }}
                  >
                    {step.title}
                  </h3>
                </div>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: "rgba(26,26,31,0.75)",
                  maxWidth: 560,
                }}
              >
                {step.description}
              </p>
              {/* Terminal block */}
              <div
                className="field-night"
                style={{
                  padding: "16px 20px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  lineHeight: 1.8,
                  color: "var(--color-amber)",
                  whiteSpace: "pre",
                  overflowX: "auto",
                }}
              >
                {step.terminalCode}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section
        id="arsenal"
        style={{
          padding: "clamp(48px, 8vw, 128px) clamp(24px, 6vw, 96px)",
          background: "var(--color-canvas)",
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: 64, borderBottom: "3px solid var(--color-night)", paddingBottom: 32 }}>
          <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 12 }}>
            Infrastructure Plans
          </div>
          <h2
            className="metro-display"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", color: "var(--color-night)" }}
          >
            Select Your Compute Allocation.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 0,
            maxWidth: 900,
            border: "5px solid var(--color-night)",
          }}
        >
          {/* TIER 1 — MERCENARY */}
          <div
            style={{
              borderRight: "5px solid var(--color-night)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header field */}
            <div
              className="field-teal"
              style={{ padding: "32px 40px", borderBottom: "5px solid var(--color-night)" }}
            >
              <div className="metro-label" style={{ color: "var(--color-amber)", marginBottom: 12 }}>Solo Operators</div>
              <h3
                className="metro-display"
                style={{ fontSize: "2.5rem", color: "var(--color-canvas)", marginBottom: 24 }}
              >
                The Mercenary
              </h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  className="metro-display"
                  style={{ fontSize: "4rem", color: "var(--color-canvas)" }}
                >
                  $99
                </span>
                <span style={{ fontFamily: "var(--font-body)", color: "rgba(237,232,220,0.7)", fontSize: "0.875rem" }}>/ month</span>
              </div>
            </div>
            {/* Features */}
            <div style={{ padding: "32px 40px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {["1,000 Leads Generated / month", "Full Automation Suite", "Cloud Dashboard Access", "Standard Support"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 6, height: 6, background: "var(--color-transit-red)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "0 40px 40px" }}>
              <button
                onClick={() => handleCheckout("price_1Ta4cMLCpB0Zbo9scr4JyLzE")}
                className="metro-btn-primary"
                style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 8 }}
              >
                <Terminal size={16} />
                Initialize Plan
              </button>
            </div>
          </div>

          {/* Amber stripe between tiers */}
          <div className="stripe-amber" style={{ display: "none" }} aria-hidden="true" />

          {/* TIER 2 — TASKFORCE */}
          <div
            style={{ display: "flex", flexDirection: "column", position: "relative" }}
          >
            {/* "Most Deployed" badge */}
            <div
              style={{
                position: "absolute",
                top: -3,
                right: 32,
                background: "var(--color-amber)",
                color: "var(--color-night)",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.625rem",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                padding: "6px 14px",
                borderBottom: "5px solid var(--color-night)",
                borderLeft: "5px solid var(--color-night)",
                borderRight: "5px solid var(--color-night)",
              }}
            >
              Most Deployed
            </div>
            {/* Header field */}
            <div
              className="field-red"
              style={{ padding: "32px 40px", borderBottom: "5px solid var(--color-night)", paddingTop: 56 }}
            >
              <div className="metro-label" style={{ color: "var(--color-amber)", marginBottom: 12 }}>Agency Scale</div>
              <h3
                className="metro-display"
                style={{ fontSize: "2.5rem", color: "var(--color-canvas)", marginBottom: 24 }}
              >
                The Taskforce
              </h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  className="metro-display"
                  style={{ fontSize: "4rem", color: "var(--color-canvas)" }}
                >
                  $249
                </span>
                <span style={{ fontFamily: "var(--font-body)", color: "rgba(237,232,220,0.7)", fontSize: "0.875rem" }}>/ month</span>
              </div>
            </div>
            {/* Features */}
            <div style={{ padding: "32px 40px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {["5,000 Leads Generated / month", "Full Automation Suite", "Priority API Queues", "Priority Support"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 6, height: 6, background: "var(--color-teal)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "0 40px 40px" }}>
              <button
                onClick={() => handleCheckout("price_1Ta4clLCpB0Zbo9s8UvxaGrq")}
                className="metro-btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--color-night)",
                  borderColor: "var(--color-night)",
                }}
              >
                <Terminal size={16} />
                Initialize Plan
              </button>
            </div>
          </div>
        </div>

        {/* Custom tier CTA */}
        <div
          style={{
            marginTop: 48,
            maxWidth: 900,
            borderTop: "3px solid var(--color-night)",
            paddingTop: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <h3
              className="metro-display"
              style={{ fontSize: "1.5rem", marginBottom: 8, color: "var(--color-night)" }}
            >
              Custom Deployment Required?
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "rgba(26,26,31,0.65)",
                maxWidth: 480,
                lineHeight: 1.6,
              }}
            >
              For teams requiring 5,000+ leads or BYOK architecture to preserve margins, contact the engineering lead.
            </p>
          </div>
          <a
            href="mailto:er6798@gmail.com?subject=Enterprise%20SaaS%20Inquiry"
            className="metro-btn-ghost"
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            <Send size={16} />
            Contact Architect
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        className="field-night"
        style={{
          padding: "32px 48px",
          borderTop: "5px solid var(--color-night)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="metro-display"
          style={{ fontSize: "1rem", color: "var(--color-canvas)" }}
        >
          SortingSource
        </span>
        <span
          className="metro-label"
          style={{ color: "rgba(237,232,220,0.45)", letterSpacing: "0.3em" }}
        >
          v3.0 // Enterprise Infrastructure
        </span>
      </footer>
    </div>
  );
}