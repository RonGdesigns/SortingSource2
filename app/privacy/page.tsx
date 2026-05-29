"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div style={{ background: "#EDE8DC", color: "#1A1A1F", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "var(--font-body)" }}>
      {/* HEADER SECTION */}
      <header
        className="field-night"
        style={{
          padding: "32px 48px",
          borderBottom: "5px solid var(--color-night)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, background: "var(--color-transit-red)" }} />
          <span className="metro-display" style={{ fontSize: "1.25rem", color: "var(--color-canvas)", letterSpacing: "0.05em" }}>
            SortingSource
          </span>
        </div>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--color-canvas)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ArrowLeft size={14} /> Return to System
        </Link>
      </header>

      {/* HERO HERO TITLE */}
      <section style={{ padding: "48px 48px 24px", borderBottom: "5px solid var(--color-night)" }}>
        <h1 className="metro-display" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", color: "var(--color-night)", lineHeight: 0.9 }}>
          PRIVACY PROTOCOL
        </h1>
        <div className="metro-sub" style={{ fontSize: "0.875rem", color: "var(--color-transit-red)", marginTop: 12, letterSpacing: "0.3em" }}>
          SYSTEM POLICY // VERSION 2.1
        </div>
      </section>

      {/* CORE CLAUSES */}
      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
        {/* Clause 1 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] border-b-5 border-[var(--color-night)]">
          <div className="field-teal" style={{ padding: "32px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="metro-display" style={{ fontSize: "2rem", color: "var(--color-canvas)" }}>01</span>
            <span className="metro-sub" style={{ fontSize: "0.75rem", color: "var(--color-amber)", letterSpacing: "0.2em" }}>LOCAL VAULT</span>
          </div>
          <div style={{ padding: "48px" }} className="md:border-l-5 md:border-[var(--color-night)]">
            <h2 className="metro-display" style={{ fontSize: "1.5rem", marginBottom: 16 }}>The Local-First Vault Architecture</h2>
            <p style={{ lineHeight: 1.8, fontSize: "1rem", maxWidth: 680, color: "rgba(26,26,31,0.85)" }}>
              SortingSource operates strictly as a local-first software engine. We do not harbor, transmit, or observe your generated leads, email copy, or reply logs on centralized servers. All data is written exclusively to your local hardware via the <code className="field-night" style={{ padding: "2px 6px", fontSize: "0.875rem" }}>outbound_crm.db</code> database and client-side <code className="field-night" style={{ padding: "2px 6px", fontSize: "0.875rem" }}>localStorage</code>. Your data remains strictly on your device.
            </p>
          </div>
        </div>

        {/* Clause 2 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] border-b-5 border-[var(--color-night)]">
          <div className="field-red" style={{ padding: "32px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="metro-display" style={{ fontSize: "2rem", color: "var(--color-canvas)" }}>02</span>
            <span className="metro-sub" style={{ fontSize: "0.75rem", color: "var(--color-canvas)", letterSpacing: "0.2em" }}>API SHUTTLE</span>
          </div>
          <div style={{ padding: "48px" }} className="md:border-l-5 md:border-[var(--color-night)]">
            <h2 className="metro-display" style={{ fontSize: "1.5rem", marginBottom: 16 }}>API Key Transmission</h2>
            <p style={{ lineHeight: 1.8, fontSize: "1rem", maxWidth: 680, color: "rgba(26,26,31,0.85)" }}>
              For standard accounts, only your custom AI credentials (OpenAI and Hugging Face) are processed locally through your Local Vault to communicate directly with third-party providers. In full Enterprise Custom Deployments (the complete BYOK model), all integrated credentials (including Google Places, Gemini, Twilio, and SMTP details) are similarly sandboxed locally on your dedicated instance and are never logged, stored, or processed by SortingSource master servers.
            </p>
          </div>
        </div>

        {/* Clause 3 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] border-b-5 border-[var(--color-night)]">
          <div className="field-night" style={{ padding: "32px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="metro-display" style={{ fontSize: "2rem", color: "var(--color-canvas)" }}>03</span>
            <span className="metro-sub" style={{ fontSize: "0.75rem", color: "var(--color-amber)", letterSpacing: "0.2em" }}>TRACKING</span>
          </div>
          <div style={{ padding: "48px" }} className="md:border-l-5 md:border-[var(--color-night)]">
            <h2 className="metro-display" style={{ fontSize: "1.5rem", marginBottom: 16 }}>Cookies & Client Storage</h2>
            <p style={{ lineHeight: 1.8, fontSize: "1rem", maxWidth: 680, color: "rgba(26,26,31,0.85)" }}>
              We only store persistent tokens (like presets, layout parameters, and encrypted sessions) inside local storage to ensure configuration states are preserved. We do not use third-party tracking pixels (such as Meta pixels or Google Analytics) to spy on your outbound activities. Your telemetry remains your own.
            </p>
          </div>
        </div>

        {/* Clause 4 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] border-b-5 border-[var(--color-night)]">
          <div className="field-teal" style={{ padding: "32px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="metro-display" style={{ fontSize: "2rem", color: "var(--color-canvas)" }}>04</span>
            <span className="metro-sub" style={{ fontSize: "0.75rem", color: "var(--color-canvas)", letterSpacing: "0.2em" }}>PRO OUTREACH</span>
          </div>
          <div style={{ padding: "48px" }} className="md:border-l-5 md:border-[var(--color-night)]">
            <h2 className="metro-display" style={{ fontSize: "1.5rem", marginBottom: 16 }}>Professional Demographics</h2>
            <p style={{ lineHeight: 1.8, fontSize: "1rem", maxWidth: 680, color: "rgba(26,26,31,0.85)" }}>
              Our system is designed for professional business-to-business cold outreach. We do not knowingly collect personal data from minors. In the event that minor data is scraped by automated website crawl triggers, it is deleted automatically or manually by database purging commands.
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="field-night"
        style={{
          padding: "32px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span className="metro-display" style={{ fontSize: "1rem", color: "var(--color-canvas)" }}>
          SortingSource
        </span>
        <span className="metro-label" style={{ color: "rgba(237,232,220,0.45)", letterSpacing: "0.3em" }}>
          © 2026 Sorting Source LLC // ALL SYSTEMS OPERATIONAL
        </span>
      </footer>
    </div>
  );
}
