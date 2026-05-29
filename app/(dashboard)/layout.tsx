"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Crosshair, Mailbox, History, Server, BookOpen, ChevronDown, Rocket, Key, ExternalLink, Cpu, Loader2, Menu, X
} from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

const NAV_LINKS = [
  { href: "/dashboard", label: "Target Hunter", Icon: Crosshair },
  { href: "/pitch",     label: "Pitch Engine",  Icon: Mailbox },
  { href: "/logs",      label: "Audit Logs",    Icon: History },
];

const ADMIN_EMAILS = ["er6798@gmail.com", "rongdesigns313@gmail.com"];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showDocs, setShowDocs] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        const isAdmin = ADMIN_EMAILS.includes(usr.email || "");
        if (isAdmin) {
          setIsAuthLoading(false);
        } else {
          try {
            const userDoc = await getDoc(doc(db, "users", usr.uid));
            if (userDoc.exists() && userDoc.data()?.subscriptionStatus === "active") {
              setIsAuthLoading(false);
            } else {
              router.push("/paywall");
            }
          } catch {
            router.push("/paywall");
          }
        }
      }
    });

    setGeminiOverride(localStorage.getItem("gemini_version") || "");
    setOpenaiOverride(localStorage.getItem("openai_version") || "");
    setHfOverride(localStorage.getItem("huggingface_version") || "");
    setPlacesOverride(localStorage.getItem("places_version") || "");

    return () => unsubscribe();
  }, [router]);

  const handleSaveModels = () => {
    if (geminiOverride.trim()) localStorage.setItem("gemini_version", geminiOverride.trim()); else localStorage.removeItem("gemini_version");
    if (openaiOverride.trim()) localStorage.setItem("openai_version", openaiOverride.trim()); else localStorage.removeItem("openai_version");
    if (hfOverride.trim()) localStorage.setItem("huggingface_version", hfOverride.trim()); else localStorage.removeItem("huggingface_version");
    if (placesOverride.trim()) localStorage.setItem("places_version", placesOverride.trim()); else localStorage.removeItem("places_version");
    if (twilioOverride.trim()) localStorage.setItem("twilio_version", twilioOverride.trim()); else localStorage.removeItem("twilio_version");
    setSaveStatus("SAVED!");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const sidebar: React.CSSProperties = {
    width: 260,
    minWidth: 260,
    height: "100vh",
    flexDirection: "column",
    borderRight: "5px solid var(--color-night)",
    background: "var(--color-canvas)",
    flexShrink: 0,
    overflowY: "auto",
    position: "sticky",
    top: 0,
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: "var(--color-canvas)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── MOBILE HEADER ── */}
      <header className="flex lg:hidden fixed top-0 left-0 right-0 h-[64px] bg-[var(--color-canvas)] border-b-[5px] border-[var(--color-night)] z-30 items-center justify-between px-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 border-2 border-[var(--color-night)] bg-[var(--color-canvas)] hover:bg-[rgba(26,26,31,0.06)] active:bg-[var(--color-transit-red)] active:text-white transition-colors"
          style={{ borderRadius: 0 }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="bg-[var(--color-night)] p-1.5 flex items-center justify-center">
            <Server size={14} color="var(--color-canvas)" />
          </div>
          <div>
            <div className="metro-display text-sm text-[var(--color-night)] leading-none font-bold uppercase tracking-wider">
              SortingSource
            </div>
          </div>
        </Link>
        
        <div className="w-[36px] h-[36px]" />
      </header>

      {/* ── MOBILE SLIDING DRAWER ── */}
      <div className={`fixed inset-0 z-40 lg:hidden ${isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sidebar Panel */}
        <aside
          className={`absolute top-0 bottom-0 left-0 w-[280px] bg-[var(--color-canvas)] border-r-[5px] border-[var(--color-night)] flex flex-col transition-transform duration-300 ease-out metro-scroll ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ height: "100%" }}
        >
          {/* Logo */}
          <div
            className="field-teal"
            style={{ padding: "20px 24px", borderBottom: "5px solid var(--color-night)", flexShrink: 0 }}
          >
            <div className="flex items-center justify-between">
              <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }} onClick={() => setIsMobileMenuOpen(false)}>
                <div
                  className="field-night"
                  style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <Server size={16} color="var(--color-canvas)" />
                </div>
                <div>
                  <div
                    className="metro-display"
                    style={{ fontSize: "1rem", color: "var(--color-canvas)", lineHeight: 1 }}
                  >
                    SortingSource
                  </div>
                  <div
                    className="metro-label"
                    style={{ color: "var(--color-amber)", letterSpacing: "0.25em", marginTop: 2 }}
                  >
                    Enterprise v3.0
                  </div>
                </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 border-2 border-[var(--color-canvas)] text-[var(--color-canvas)] hover:bg-white/10"
                style={{ borderRadius: 0 }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 0", gap: 0, overflowY: "auto" }} className="metro-scroll">
            {/* Navigation */}
            <nav style={{ padding: "0 12px", marginBottom: 8 }}>
              {NAV_LINKS.map(({ href, label, Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "11px 12px",
                      marginBottom: 4,
                      textDecoration: "none",
                      fontFamily: "var(--font-display)",
                      fontWeight: active ? 900 : 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: active ? "var(--color-canvas)" : "var(--color-night)",
                      background: active ? "var(--color-transit-red)" : "transparent",
                      borderLeft: active ? "4px solid var(--color-amber)" : "4px solid transparent",
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div style={{ height: 3, background: "var(--color-night)", margin: "4px 0" }} />

            {/* Directives */}
            <div style={{ padding: "0 12px", marginTop: 8 }}>
              <button
                onClick={() => setShowDocs(!showDocs)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "transparent",
                  border: "none",
                  borderBottom: "2px solid var(--color-night)",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "0.625rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.3em",
                  color: "var(--color-night)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <BookOpen size={12} /> Directives
                </span>
                <ChevronDown size={12} style={{ transform: showDocs ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
              </button>

              <div
                style={{
                  maxHeight: showDocs ? 400 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {/* Workflow */}
                <div style={{ paddingTop: 16, paddingBottom: 8 }}>
                  <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                    <Rocket size={10} /> Workflow
                  </div>
                  <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      ["1. Hunt:", "Use Target Hunter."],
                      ["2. Extract:", "Pull emails & socials."],
                      ["3. Pitch:", "Custom Pitch Writer."],
                      ["4. Logs:", "Track replies."],
                    ].map(([strong, text]) => (
                      <li key={strong} style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "rgba(26,26,31,0.65)" }}>
                        <strong style={{ color: "var(--color-night)", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.1em" }}>{strong}</strong> {text}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Connections */}
                <div style={{ paddingTop: 8, paddingBottom: 8 }}>
                  <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                    <Key size={10} /> Connections
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {["Places API Key", "Gemini API Key", "Gmail App Password", "OpenAI API Key", "Twilio Console", "Hugging Face Token"].map(link => (
                      <a
                        key={link}
                        href="#"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 8px",
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                          fontSize: "0.6rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.15em",
                          color: "rgba(26,26,31,0.55)",
                          textDecoration: "none",
                          borderLeft: "2px solid transparent",
                          transition: "border-color 0.15s, color 0.15s",
                        }}
                      >
                        {link}
                        <ExternalLink size={9} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 3, background: "var(--color-night)", margin: "4px 0" }} />

            {/* Overrides */}
            <div style={{ padding: "12px 24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div className="metro-label" style={{ color: "var(--color-night)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Cpu size={10} /> Overrides
                </div>
                <button
                  onClick={handleSaveModels}
                  className="metro-label"
                  style={{
                    background: saveStatus ? "var(--color-teal)" : "var(--color-night)",
                    color: "var(--color-canvas)",
                    border: "none",
                    padding: "4px 10px",
                    cursor: "pointer",
                    letterSpacing: "0.2em",
                    transition: "background 0.2s",
                  }}
                >
                  {saveStatus || "SAVE"}
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Gemini", val: geminiOverride, set: setGeminiOverride, placeholder: "gemini-2.5-flash" },
                  { label: "OpenAI", val: openaiOverride, set: setOpenaiOverride, placeholder: "gpt-4o-mini" },
                  { label: "Hugging Face", val: hfOverride, set: setHfOverride, placeholder: "Qwen2.5-72B" },
                ].map(item => (
                  <div key={item.label}>
                    <label className="metro-label" style={{ color: "rgba(26,26,31,0.4)", display: "block", marginBottom: 4 }}>{item.label}</label>
                    <input
                      value={item.val}
                      onChange={e => item.set(e.target.value)}
                      placeholder={`{Default} ${item.placeholder}`}
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid rgba(26,26,31,0.2)",
                        padding: "4px 0",
                        outline: "none",
                        fontFamily: "var(--font-display)",
                        fontWeight: 400,
                        fontSize: "0.625rem",
                        color: "var(--color-night)",
                        width: "100%",
                        letterSpacing: "0.05em",
                      }}
                      onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")}
                      onBlur={e => (e.target.style.borderBottomColor = "rgba(26,26,31,0.2)")}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Full Instructions link */}
            <div style={{ padding: "0 12px", marginTop: 4 }}>
              <Link
                href="/instructions"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  textDecoration: "none",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.625rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "rgba(26,26,31,0.5)",
                  borderLeft: "4px solid transparent",
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                <BookOpen size={12} /> Full Instructions
              </Link>
            </div>
          </div>

          {/* Profile footer */}
          <div
            style={{
              borderTop: "5px solid var(--color-night)",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div
              className="field-night"
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.75rem",
                color: "var(--color-canvas)",
                flexShrink: 0,
              }}
            >
              {user?.email ? user.email.substring(0, 2).toUpperCase() : "OP"}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div
                className="metro-label"
                style={{ color: "var(--color-night)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                title={user?.email || "Operator"}
              >
                {user?.email?.split("@")[0] || "Operator"}
              </div>
              <button
                onClick={async () => { await signOut(auth); router.push("/login"); }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "0.55rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "rgba(26,26,31,0.4)",
                  padding: 0,
                  transition: "color 0.15s",
                }}
              >
                Disconnect Node
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ── SIDEBAR ── */}
      <aside style={sidebar} className="hidden lg:flex metro-scroll">

        {/* Logo */}
        <div
          className="field-teal"
          style={{ padding: "20px 24px", borderBottom: "5px solid var(--color-night)", flexShrink: 0 }}
        >
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div
              className="field-night"
              style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <Server size={16} color="var(--color-canvas)" />
            </div>
            <div>
              <div
                className="metro-display"
                style={{ fontSize: "1rem", color: "var(--color-canvas)", lineHeight: 1 }}
              >
                SortingSource
              </div>
              <div
                className="metro-label"
                style={{ color: "var(--color-amber)", letterSpacing: "0.25em", marginTop: 2 }}
              >
                Enterprise v3.0
              </div>
            </div>
          </Link>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 0", gap: 0, overflowY: "auto" }} className="metro-scroll">

          {/* Navigation */}
          <nav style={{ padding: "0 12px", marginBottom: 8 }}>
            {NAV_LINKS.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 12px",
                    marginBottom: 4,
                    textDecoration: "none",
                    fontFamily: "var(--font-display)",
                    fontWeight: active ? 900 : 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: active ? "var(--color-canvas)" : "var(--color-night)",
                    background: active ? "var(--color-transit-red)" : "transparent",
                    borderLeft: active ? "4px solid var(--color-amber)" : "4px solid transparent",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(26,26,31,0.06)"; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; } }}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div style={{ height: 3, background: "var(--color-night)", margin: "4px 0" }} />

          {/* Directives */}
          <div style={{ padding: "0 12px", marginTop: 8 }}>
            <button
              onClick={() => setShowDocs(!showDocs)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                background: "transparent",
                border: "none",
                borderBottom: "2px solid var(--color-night)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.625rem",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                color: "var(--color-night)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <BookOpen size={12} /> Directives
              </span>
              <ChevronDown size={12} style={{ transform: showDocs ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
            </button>

            <div
              style={{
                maxHeight: showDocs ? 400 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Workflow */}
              <div style={{ paddingTop: 16, paddingBottom: 8 }}>
                <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                  <Rocket size={10} /> Workflow
                </div>
                <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    ["1. Hunt:", "Use Target Hunter."],
                    ["2. Extract:", "Pull emails & socials."],
                    ["3. Pitch:", "Custom Pitch Writer."],
                    ["4. Logs:", "Track replies."],
                  ].map(([strong, text]) => (
                    <li key={strong} style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "rgba(26,26,31,0.65)" }}>
                      <strong style={{ color: "var(--color-night)", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.1em" }}>{strong}</strong> {text}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Connections */}
              <div style={{ paddingTop: 8, paddingBottom: 8 }}>
                <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                  <Key size={10} /> Connections
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {["Places API Key", "Gemini API Key", "Gmail App Password", "OpenAI API Key", "Twilio Console", "Hugging Face Token"].map(link => (
                    <a
                      key={link}
                      href="#"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "6px 8px",
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        fontSize: "0.6rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "rgba(26,26,31,0.55)",
                        textDecoration: "none",
                        borderLeft: "2px solid transparent",
                        transition: "border-color 0.15s, color 0.15s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderLeftColor = "var(--color-amber)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-night)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderLeftColor = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(26,26,31,0.55)"; }}
                    >
                      {link}
                      <ExternalLink size={9} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 3, background: "var(--color-night)", margin: "4px 0" }} />

          {/* Overrides */}
          <div style={{ padding: "12px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div className="metro-label" style={{ color: "var(--color-night)", display: "flex", alignItems: "center", gap: 4 }}>
                <Cpu size={10} /> Overrides
              </div>
              <button
                onClick={handleSaveModels}
                className="metro-label"
                style={{
                  background: saveStatus ? "var(--color-teal)" : "var(--color-night)",
                  color: "var(--color-canvas)",
                  border: "none",
                  padding: "4px 10px",
                  cursor: "pointer",
                  letterSpacing: "0.2em",
                  transition: "background 0.2s",
                }}
              >
                {saveStatus || "SAVE"}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Gemini", val: geminiOverride, set: setGeminiOverride, placeholder: "gemini-2.5-flash" },
                { label: "OpenAI", val: openaiOverride, set: setOpenaiOverride, placeholder: "gpt-4o-mini" },
                { label: "Hugging Face", val: hfOverride, set: setHfOverride, placeholder: "Qwen2.5-72B" },
              ].map(item => (
                <div key={item.label}>
                  <label className="metro-label" style={{ color: "rgba(26,26,31,0.4)", display: "block", marginBottom: 4 }}>{item.label}</label>
                  <input
                    value={item.val}
                    onChange={e => item.set(e.target.value)}
                    placeholder={`{Default} ${item.placeholder}`}
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(26,26,31,0.2)",
                      padding: "4px 0",
                      outline: "none",
                      fontFamily: "var(--font-display)",
                      fontWeight: 400,
                      fontSize: "0.625rem",
                      color: "var(--color-night)",
                      width: "100%",
                      letterSpacing: "0.05em",
                    }}
                    onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")}
                    onBlur={e => (e.target.style.borderBottomColor = "rgba(26,26,31,0.2)")}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Full Instructions link */}
          <div style={{ padding: "0 12px", marginTop: 4 }}>
            <Link
              href="/instructions"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                textDecoration: "none",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.625rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(26,26,31,0.5)",
                borderLeft: "4px solid transparent",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = "var(--color-night)"; a.style.borderLeftColor = "var(--color-amber)"; }}
              onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = "rgba(26,26,31,0.5)"; a.style.borderLeftColor = "transparent"; }}
            >
              <BookOpen size={12} /> Full Instructions
            </Link>
          </div>
        </div>

        {/* Profile footer */}
        <div
          style={{
            borderTop: "5px solid var(--color-night)",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            className="field-night"
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "0.75rem",
              color: "var(--color-canvas)",
              flexShrink: 0,
            }}
          >
            {user?.email ? user.email.substring(0, 2).toUpperCase() : "OP"}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div
              className="metro-label"
              style={{ color: "var(--color-night)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              title={user?.email || "Operator"}
            >
              {user?.email?.split("@")[0] || "Operator"}
            </div>
            <button
              onClick={async () => { await signOut(auth); router.push("/login"); }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "0.55rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(26,26,31,0.4)",
                padding: 0,
                transition: "color 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--color-transit-red)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(26,26,31,0.4)"; }}
            >
              Disconnect Node
            </button>
          </div>
        </div>
      </aside>

      {/* ── CONTENT AREA ── */}
      <div
        style={{
          flex: 1,
          height: "100vh",
          overflowY: "auto",
          background: "var(--color-canvas)",
        }}
        className="metro-scroll pt-[64px] lg:pt-0"
      >
        {isAuthLoading ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Loader2 className="animate-spin" size={28} color="var(--color-transit-red)" />
            <p className="metro-label" style={{ color: "rgba(26,26,31,0.4)" }}>Syncing Operator Node...</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
