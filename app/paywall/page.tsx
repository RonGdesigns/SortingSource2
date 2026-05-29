"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Terminal, LogOut, Cpu } from "lucide-react";

const ADMIN_EMAILS = ["er6798@gmail.com", "rongdesigns313@gmail.com"];

export default function PaywallPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      if (!usr) {
        router.push("/login");
      } else {
        const isAdmin = ADMIN_EMAILS.includes(usr.email || "");
        if (isAdmin) {
          router.push("/dashboard");
        } else {
          setUser(usr);
          setIsLoading(false);
        }
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
        body: JSON.stringify({ priceId, userId: user.uid, userEmail: user.email }),
      });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
      else setError(data.error || "Failed to create checkout session.");
    } catch (err: any) {
      setError("Failed to connect to the checkout API.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="field-canvas" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-transit-red)" />
        <p className="metro-label" style={{ color: "rgba(26,26,31,0.5)" }}>Verifying Clearance Level...</p>
      </div>
    );
  }

  const tiers = [
    {
      id: "price_1Ta4cMLCpB0Zbo9scr4JyLzE",
      name: "The Mercenary",
      sub: "Solo Operator Tier",
      price: "$99",
      badge: null,
      bg: "var(--color-teal)",
      features: [
        "1,000 leads generated per month",
        "Full targeting & scraping suite",
        "Audit-driven pitch generation",
        "SMTP/IMAP automated delivery",
      ],
    },
    {
      id: "price_1Ta4clLCpB0Zbo9s8UvxaGrq",
      name: "The Taskforce",
      sub: "Agency Scale Tier",
      price: "$249",
      badge: "Most Deployed",
      bg: "var(--color-transit-red)",
      features: [
        "5,000 leads generated per month",
        "Full automation & scheduling suite",
        "Priority API processing queues",
        "Priority developer support",
      ],
    },
  ];

  return (
    <div
      className="field-canvas"
      style={{ minHeight: "100vh", fontFamily: "var(--font-body)", display: "flex", flexDirection: "column" }}
    >
      {/* ── Header bar ── */}
      <header
        style={{
          borderBottom: "5px solid var(--color-night)",
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 4 }}>
            Access Restricted
          </div>
          <h1
            className="metro-display"
            style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)", color: "var(--color-night)" }}
          >
            System Locked — Select a Plan
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            className="field-night"
            style={{ padding: "8px 16px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.2em" }}
          >
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="metro-btn-ghost"
            style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, fontSize: "0.625rem" }}
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </header>

      {/* ── Error ── */}
      {error && (
        <div
          className="field-red"
          style={{ padding: "12px 48px", display: "flex", alignItems: "center", gap: 8 }}
        >
          <ShieldAlert size={14} />
          <span className="metro-label" style={{ letterSpacing: "0.05em" }}>{error}</span>
        </div>
      )}

      {/* ── Pricing grid ── */}
      <main style={{ flex: 1, padding: "clamp(32px, 6vw, 80px) clamp(24px, 6vw, 80px)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 0,
            maxWidth: 860,
            border: "5px solid var(--color-night)",
            marginBottom: 48,
          }}
        >
          {tiers.map((tier, i) => (
            <div
              key={tier.id}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRight: i === 0 ? "5px solid var(--color-night)" : undefined,
                position: "relative",
              }}
            >
              {tier.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 24,
                    background: "var(--color-amber)",
                    color: "var(--color-night)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "0.625rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.3em",
                    padding: "5px 12px",
                    borderBottom: "5px solid var(--color-night)",
                    borderLeft: "5px solid var(--color-night)",
                    borderRight: "5px solid var(--color-night)",
                  }}
                >
                  {tier.badge}
                </div>
              )}

              {/* Color header */}
              <div
                style={{
                  background: tier.bg,
                  padding: tier.badge ? "48px 40px 32px" : "32px 40px",
                  borderBottom: "5px solid var(--color-night)",
                }}
              >
                <div className="metro-label" style={{ color: "var(--color-amber)", marginBottom: 8 }}>{tier.sub}</div>
                <h2
                  className="metro-display"
                  style={{ fontSize: "2rem", color: "var(--color-canvas)", marginBottom: 20 }}
                >
                  {tier.name}
                </h2>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span className="metro-display" style={{ fontSize: "3.5rem", color: "var(--color-canvas)" }}>{tier.price}</span>
                  <span style={{ fontFamily: "var(--font-body)", color: "rgba(237,232,220,0.7)", fontSize: "0.875rem" }}>/ month</span>
                </div>
              </div>

              {/* Features */}
              <div style={{ padding: "32px 40px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 6, height: 6, background: i === 0 ? "var(--color-teal)" : "var(--color-transit-red)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ padding: "0 40px 40px" }}>
                <button
                  id={`paywall-${i === 0 ? "mercenary" : "taskforce"}`}
                  onClick={() => handleCheckout(tier.id)}
                  disabled={checkoutLoading !== null}
                  className="metro-btn-primary"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "var(--color-night)",
                    borderColor: "var(--color-night)",
                    opacity: checkoutLoading ? 0.6 : 1,
                  }}
                >
                  {checkoutLoading === tier.id
                    ? <><Loader2 className="animate-spin" size={14} /> Provisioning...</>
                    : <><Cpu size={14} /> Initialize {tier.name.split(" ").pop()}</>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BYOK notice for Agencies */}
        <div
          style={{
            maxWidth: 860,
            borderTop: "3px solid var(--color-night)",
            paddingTop: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 6 }}>
              Bring-Your-Own-Key (BYOK) Architecture for Agencies
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "rgba(26,26,31,0.6)", maxWidth: 520, lineHeight: 1.6 }}>
              Agencies can supply their own Google Places and LLM API keys to run large-scale outbound operations, preserving full margins without platform markup.
            </p>
          </div>
          <div
            className="field-night"
            style={{ padding: "8px 20px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.3em" }}
          >
            Secure Encryption Detected
          </div>
        </div>
      </main>
    </div>
  );
}
