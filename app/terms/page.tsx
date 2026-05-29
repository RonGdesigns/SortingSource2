"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          TERMS OF ENGAGEMENT
        </h1>
        <div className="metro-sub" style={{ fontSize: "0.875rem", color: "var(--color-transit-red)", marginTop: 12, letterSpacing: "0.3em" }}>
          REGULATORY TERMS // VERSION 2.1
        </div>
      </section>

      {/* CORE CLAUSES */}
      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
        {/* Clause 1 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] border-b-5 border-[var(--color-night)]">
          <div className="field-red" style={{ padding: "32px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="metro-display" style={{ fontSize: "2rem", color: "var(--color-canvas)" }}>01</span>
            <span className="metro-sub" style={{ fontSize: "0.75rem", color: "var(--color-canvas)", letterSpacing: "0.2em" }}>KEYS</span>
          </div>
          <div style={{ padding: "48px" }} className="md:border-l-5 md:border-[var(--color-night)]">
            <h2 className="metro-display" style={{ fontSize: "1.5rem", marginBottom: 16 }}>API Key & Hosted Hybrid Model</h2>
            <p style={{ lineHeight: 1.8, fontSize: "1rem", maxWidth: 680, color: "rgba(26,26,31,0.85)" }}>
              By default, SortingSource operates as a hosted hybrid platform. Users only need to supply their own API keys for custom AI generation (OpenAI and Hugging Face). Full BYOK (Bring Your Own Key) architecture—allowing the integration of custom limits for Google Places, Gemini, Twilio, and SMTP gateways—is exclusively supported and configured under the Enterprise Custom Deployment plan.
            </p>
          </div>
        </div>

        {/* Clause 2 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] border-b-5 border-[var(--color-night)]">
          <div className="field-teal" style={{ padding: "32px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="metro-display" style={{ fontSize: "2rem", color: "var(--color-canvas)" }}>02</span>
            <span className="metro-sub" style={{ fontSize: "0.75rem", color: "var(--color-amber)", letterSpacing: "0.2em" }}>LIABILITY</span>
          </div>
          <div style={{ padding: "48px" }} className="md:border-l-5 md:border-[var(--color-night)]">
            <h2 className="metro-display" style={{ fontSize: "1.5rem", marginBottom: 16 }}>Legal Accountability & Compliance</h2>
            <p style={{ lineHeight: 1.8, fontSize: "1rem", maxWidth: 680, color: "rgba(26,26,31,0.85)" }}>
              By executing the Pitch Engine and outreach triggers, you accept full legal responsibility for your outbound messaging activity. SortingSource LLC is not liable for domain blacklisting, SMTP throttling, IP blocks, or violations of CAN-SPAM, TCPA, GDPR, or third-party API Terms of Service. Misuse of the engine (e.g. ignoring opt-outs, harassment, spamming) is strictly prohibited.
            </p>
          </div>
        </div>

        {/* Clause 3 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] border-b-5 border-[var(--color-night)]">
          <div className="field-night" style={{ padding: "32px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="metro-display" style={{ fontSize: "2rem", color: "var(--color-canvas)" }}>03</span>
            <span className="metro-sub" style={{ fontSize: "0.75rem", color: "var(--color-amber)", letterSpacing: "0.2em" }}>LICENSE</span>
          </div>
          <div style={{ padding: "48px" }} className="md:border-l-5 md:border-[var(--color-night)]">
            <h2 className="metro-display" style={{ fontSize: "1.5rem", marginBottom: 16 }}>Software Licensing</h2>
            <p style={{ lineHeight: 1.8, fontSize: "1rem", maxWidth: 680, color: "rgba(26,26,31,0.85)" }}>
              SortingSource grants a single-seat or seat-limited, non-exclusive, non-transferable license based on tier verification. Reverse-engineering, repackaging, or unauthorized sub-licensing of the local binary is strictly prohibited and locks access hashes.
            </p>
          </div>
        </div>

        {/* Clause 4 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] border-b-5 border-[var(--color-night)]">
          <div className="field-red" style={{ padding: "32px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="metro-display" style={{ fontSize: "2rem", color: "var(--color-canvas)" }}>04</span>
            <span className="metro-sub" style={{ fontSize: "0.75rem", color: "var(--color-canvas)", letterSpacing: "0.2em" }}>WARRANTIES</span>
          </div>
          <div style={{ padding: "48px" }} className="md:border-l-5 md:border-[var(--color-night)]">
            <h2 className="metro-display" style={{ fontSize: "1.5rem", marginBottom: 16 }}>Operational Warranties</h2>
            <p style={{ lineHeight: 1.8, fontSize: "1rem", maxWidth: 680, color: "rgba(26,26,31,0.85)" }}>
              Outbound outreach is subject to delivery rates, domain reputation, and lead quality. SortingSource does not guarantee replies, booking rates, conversion, or revenue placement. All software components are provided "as-is" without warranty of any kind, express or implied.
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
