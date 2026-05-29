"use client";

import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Link from "next/link";
import { KeyRound, Terminal, ArrowRight, ShieldAlert, Loader2, CheckCircle } from "lucide-react";

const fieldStyle = (borderColor = "var(--color-night)") => ({
  background: "transparent",
  border: "none",
  borderBottom: `2px solid ${borderColor}`,
  padding: "10px 4px",
  outline: "none",
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  color: "var(--color-night)",
  fontSize: "0.875rem",
  width: "100%",
  transition: "border-color 0.2s",
});

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
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ fontFamily: "var(--font-body)" }}>
      {/* ── LEFT SIDEBAR — Teal field 40% ── */}
      <div
        className="field-teal w-full lg:w-[40%] min-h-[300px] lg:min-h-screen"
        style={{
          padding: "clamp(32px, 5vw, 72px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "5px solid var(--color-night)",
          borderBottom: "5px solid var(--color-night)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top: logo link */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "var(--color-canvas)",
            textDecoration: "none",
            width: "max-content",
          }}
        >
          <Terminal size={14} color="var(--color-amber)" />
          SortingSource
        </Link>

        {/* Center: headline */}
        <div style={{ margin: "40px 0" }}>
          {/* Amber stripe */}
          <div style={{ width: 6, height: 48, background: "var(--color-amber)", marginBottom: 24 }} />
          <h1
            className="metro-display"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              color: "var(--color-canvas)",
              lineHeight: 0.92,
              marginBottom: 24,
            }}
          >
            Node<br />
            <span style={{ fontStyle: "italic", color: "var(--color-amber)" }}>Recovery.</span>
          </h1>
          <p
            className="metro-label"
            style={{ color: "rgba(237,232,220,0.6)", lineHeight: 1.7, maxWidth: 280 }}
          >
            Initiate security clearance protocol to recover access keys for your operator dashboard.
          </p>
        </div>

        {/* Bottom: system notice */}
        <div className="metro-label" style={{ color: "rgba(237,232,220,0.4)" }}>
          Clearance Vector Engaged
        </div>
      </div>

      {/* ── RIGHT FORM — Canvas 60% ── */}
      <div
        className="field-canvas flex-1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(32px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: 440, width: "100%" }}>
          {/* Form header */}
          <div style={{ borderBottom: "3px solid var(--color-night)", paddingBottom: 24, marginBottom: 40 }}>
            <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 8 }}>
              Recovery Protocol
            </div>
            <h2 className="metro-display" style={{ fontSize: "2rem", color: "var(--color-night)" }}>
              Transmit Recovery Link
            </h2>
          </div>

          {success ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div
                style={{
                  background: "var(--color-teal)",
                  color: "var(--color-canvas)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle size={18} color="var(--color-amber)" />
                  <span className="metro-label" style={{ color: "var(--color-canvas)" }}>Clearance Dispatched</span>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", lineHeight: 1.6, color: "rgba(237,232,220,0.9)" }}>
                  A secure node reset link has been dispatched to <strong>{email}</strong>. Check your inbox and follow the instructions to establish new access keys.
                </p>
              </div>
              <Link
                href="/login"
                className="metro-btn-primary"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div>
                <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 8 }}>
                  Operator Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="operator@sortingsource.com"
                  style={{ ...fieldStyle(), textTransform: "none", letterSpacing: "0", fontWeight: 400, fontFamily: "var(--font-body)" }}
                  onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")}
                  onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")}
                />
              </div>

              {error && (
                <div
                  style={{
                    background: "var(--color-transit-red)",
                    color: "var(--color-canvas)",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span className="metro-label" style={{ letterSpacing: "0.05em" }}>{error}</span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  id="reset-submit"
                  type="submit"
                  disabled={isLoading}
                  className="metro-btn-primary"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", opacity: isLoading ? 0.6 : 1 }}
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin" size={16} /> Dispatched...</>
                  ) : (
                    <>Transmit Recovery Link <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </form>
          )}

          {!success && (
            <div style={{ marginTop: 40, borderTop: "2px solid rgba(26,26,31,0.15)", paddingTop: 24, textAlign: "center" }}>
              <Link href="/login" className="metro-label" style={{ color: "var(--color-transit-red)", textDecoration: "none" }}>
                ← Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
