"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Terminal, ArrowRight, ShieldAlert, Loader2, Chrome } from "lucide-react";

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

const ADMIN_EMAILS = ["er6798@gmail.com", "rongdesigns313@gmail.com"];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError("Both fields are required to authenticate.");
    setIsLoading(true);
    setError("");
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      const isAdmin = ADMIN_EMAILS.includes(user.email || "");
      if (!isAdmin) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            subscriptionStatus: "inactive",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.code === "auth/user-not-found" || err.code === "auth/wrong-password"
        ? "Invalid email or password."
        : err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      
      const isAdmin = ADMIN_EMAILS.includes(user.email || "");
      if (!isAdmin) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            subscriptionStatus: "inactive",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }

      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/unauthorized-domain") {
        setError("Firebase Auth: This domain is not authorized. Go to Firebase Console -> Authentication -> Settings -> Authorized Domains and add this deployment domain.");
      } else {
        setError(err.message || "Failed to authenticate with Google.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ fontFamily: "var(--font-body)" }}>

      {/* ── LEFT SIDEBAR — Teal field 40% ── */}
      <div
        className="field-teal w-full lg:w-[40%] border-b-[5px] lg:border-b-0 lg:border-r-[5px] border-[color:var(--color-night)]"
        style={{
          padding: "clamp(32px, 5vw, 72px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
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
            System<br />
            <span style={{ fontStyle: "italic", color: "var(--color-amber)" }}>Access.</span>
          </h1>
          <p
            className="metro-label"
            style={{ color: "rgba(237,232,220,0.6)", lineHeight: 1.7, maxWidth: 280 }}
          >
            Authorize your node to enter the outbound database and deploy cold outreach campaigns.
          </p>
        </div>

        {/* Bottom: system notice */}
        <div
          className="metro-label"
          style={{ color: "rgba(237,232,220,0.4)" }}
        >
          Secure Connection // Port 443
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
              Authorization
            </div>
            <h2
              className="metro-display"
              style={{ fontSize: "2rem", color: "var(--color-night)" }}
            >
              Provide Your Credentials
            </h2>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 8 }}>
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="operator@sortingsource.com"
                style={{ ...fieldStyle(), textTransform: "none", letterSpacing: "0", fontWeight: 400, fontFamily: "var(--font-body)" }}
                onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")}
                onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")}
              />
            </div>

            <div>
              <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 8 }}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ ...fieldStyle(), textTransform: "none", letterSpacing: "0.15em", fontWeight: 400, fontFamily: "var(--font-body)" }}
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
                <span className="metro-label" style={{ letterSpacing: "0.05em", textTransform: "none" }}>{error}</span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading || googleLoading}
                className="metro-btn-primary"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", opacity: (isLoading || googleLoading) ? 0.6 : 1 }}
              >
                {isLoading ? <><Loader2 className="animate-spin" size={16} /> Authenticating...</> : <>Authorize Node <ArrowRight size={16} /></>}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: "var(--color-night)", opacity: 0.2 }} />
                <span className="metro-label" style={{ color: "rgba(26,26,31,0.4)" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "var(--color-night)", opacity: 0.2 }} />
              </div>

              <button
                id="login-google"
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || googleLoading}
                className="metro-btn-ghost"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", opacity: (isLoading || googleLoading) ? 0.6 : 1 }}
              >
                {googleLoading ? <><Loader2 className="animate-spin" size={16} /> Connecting...</> : <><Chrome size={16} /> Continue with Google</>}
              </button>
            </div>
          </form>

          <div style={{ marginTop: 40, borderTop: "2px solid rgba(26,26,31,0.15)", paddingTop: 24, display: "flex", justifyContent: "space-between" }}>
            <Link href="/signup" className="metro-label" style={{ color: "var(--color-transit-red)", textDecoration: "none", letterSpacing: "0.2em" }}>
              Create Account →
            </Link>
            <Link href="/reset-password" className="metro-label" style={{ color: "rgba(26,26,31,0.4)", textDecoration: "none" }}>
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
