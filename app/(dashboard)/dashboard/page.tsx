"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Loader2, Activity, Download, ArrowUpDown, Trash2, Target, Zap, Save, AlertTriangle
} from "lucide-react";

function MetroToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontFamily: "var(--font-display)",
        fontWeight: 900,
        fontSize: "0.625rem",
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: active ? "var(--color-night)" : "rgba(26,26,31,0.45)",
        transition: "color 0.15s",
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          border: `2px solid ${active ? "var(--color-transit-red)" : "var(--color-night)"}`,
          background: active ? "var(--color-transit-red)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
          flexShrink: 0,
        }}
      >
        {active && <div style={{ width: 5, height: 5, background: "var(--color-canvas)" }} />}
      </div>
      {label}
    </button>
  );
}

function Modal({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(26,26,31,0.88)",
        padding: 16,
      }}
    >
      <div
        className="field-canvas"
        style={{
          maxWidth: 420, width: "100%",
          border: "5px solid var(--color-night)",
          padding: 40,
        }}
      >
        <h3 className="metro-display" style={{ fontSize: "1.5rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          {icon}{title}
        </h3>
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [resetKey, setResetKey] = useState(0);
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [intlPostal, setIntlPostal] = useState("");
  const [country, setCountry] = useState("");
  const [maxResults, setMaxResults] = useState("10");
  const [campaignName, setCampaignName] = useState("Default Campaign");
  const [apiKey, setApiKey] = useState("");

  const [international, setInternational] = useState(false);
  const [keepExisting, setKeepExisting] = useState(true);
  const [useBlacklist, setUseBlacklist] = useState(true);
  const [rememberKeys, setRememberKeys] = useState(false);
  const [powerSearch, setPowerSearch] = useState(false);
  const [useLocalEngine, setUseLocalEngine] = useState(false);
  const [localEngineStatus, setLocalEngineStatus] = useState<"unknown" | "online" | "offline">("unknown");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("System idle. Ready to hunt.");
  const [leads, setLeads] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<any>(null);

  const CLOUD_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://sorting-source-backend.onrender.com";
  const API_URL = useLocalEngine ? "http://localhost:8000" : CLOUD_API_URL;

  const checkLocalEngine = async (): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8000/health", { signal: AbortSignal.timeout(2000) });
      if (res.ok) { setLocalEngineStatus("online"); return true; }
    } catch {
      // fall through
    }
    setLocalEngineStatus("offline");
    return false;
  };

  const handleLocalEngineToggle = async () => {
    const next = !useLocalEngine;
    if (next) {
      setStatusMessage("Pinging local engine...");
      const alive = await checkLocalEngine();
      if (!alive) {
        setStatusMessage("⚠ Local Engine offline. Run install_local_engine.bat on your PC first, or keep this OFF to use the cloud.");
        return; // Don't switch on if offline
      }
    } else {
      setLocalEngineStatus("unknown");
    }
    setUseLocalEngine(next);
  };

  useEffect(() => {
    let activeCampaign = campaignName;
    const savedConfig = localStorage.getItem("ss_search_preset");
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed.niche) setNiche(parsed.niche);
      if (parsed.city) setCity(parsed.city);
      if (parsed.region) setRegion(parsed.region);
      if (parsed.zipCode) setZipCode(parsed.zipCode);
      if (parsed.intlPostal) setIntlPostal(parsed.intlPostal);
      if (parsed.country) setCountry(parsed.country);
      if (parsed.maxResults) setMaxResults(parsed.maxResults);
      if (parsed.international !== undefined) setInternational(parsed.international);
      if (parsed.keepExisting !== undefined) setKeepExisting(parsed.keepExisting);
      if (parsed.useBlacklist !== undefined) setUseBlacklist(parsed.useBlacklist);
      if (parsed.powerSearch !== undefined) setPowerSearch(parsed.powerSearch);
      if (parsed.useLocalEngine !== undefined) setUseLocalEngine(parsed.useLocalEngine);
      if (parsed.campaignName) { setCampaignName(parsed.campaignName); activeCampaign = parsed.campaignName; }
    }
    fetch(`${API_URL}/api/config/api-key`)
      .then(r => r.json())
      .then(d => { if (d.api_key) { setApiKey(d.api_key); setRememberKeys(true); } })
      .catch(() => {});
    fetchLeadsDirect(activeCampaign);
  }, [API_URL]);

  const fetchLeadsDirect = async (targetCampaign: string) => {
    try {
      const response = await fetch(`${API_URL}/api/leads/${encodeURIComponent(targetCampaign)}`);
      if (response.ok) { const data = await response.json(); setLeads(data.leads); }
    } catch { setStatusMessage("ERROR: Engine offline."); }
  };

  const fetchLeads = () => fetchLeadsDirect(campaignName);

  const wipeCampaign = async () => {
    try {
      setIsLoading(true); setShowDeleteConfirm(false); setStatusMessage("Wiping database records...");
      const res = await fetch(`${API_URL}/api/wipe`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ campaign_name: campaignName }) });
      if (res.ok) { setLeads([]); setResetKey(p => p + 1); setStatusMessage("Table wiped clean."); }
    } catch { setStatusMessage("Wipe failed."); } finally { setIsLoading(false); }
  };

  const executeHunt = async () => {
    if (!niche) { setValidationError("Missing Niche keyword for the hunt."); return; }
    setIsLoading(true); setStatusMessage("Acquiring targets...");
    const placesVersion = localStorage.getItem("places_version") || "v1";
    try {
      const response = await fetch(`${API_URL}/api/hunt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, city, region, country, zip_code: zipCode, intl_postal: intlPostal, max_results: parseInt(maxResults), api_key: apiKey, campaign_name: campaignName, clear_table: !keepExisting, use_blacklist: useBlacklist, international, save_key: rememberKeys, places_model_override: placesVersion }),
      });
      if (response.ok) { setStatusMessage("Hunt successful."); await fetchLeads(); }
      else { const e = await response.json().catch(() => ({})); setStatusMessage(`API Error: ${e.detail || "Unknown Engine Failure"}`); }
    } catch (error: any) {
      setStatusMessage(`Critical Engine Failure: ${error.message}`);
    } finally { setIsLoading(false); }
  };

  const deleteLead = async () => {
    if (!leadToDelete) return;
    try {
      const r = await fetch(`${API_URL}/api/delete-lead`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ campaign_name: campaignName, lead_name: leadToDelete.Name }) });
      if (r.ok) { setStatusMessage(`Deleted ${leadToDelete.Name}.`); await fetchLeads(); }
      else setStatusMessage("Failed to delete lead.");
    } catch { setStatusMessage("Engine connection refused."); } finally { setLeadToDelete(null); }
  };

  const exportToCSV = () => {
    if (leads.length === 0) { setValidationError("No data to export."); return; }
    const headers = Object.keys(leads[0]).join(",");
    const rows = leads.map(l => Object.values(l).map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${campaignName}_Leads.csv`);
    link.click();
  };

  const saveSearchPreset = () => {
    localStorage.setItem("ss_search_preset", JSON.stringify({ niche, city, region, zipCode, intlPostal, country, maxResults, campaignName, international, keepExisting, useBlacklist, powerSearch, useLocalEngine }));
    setStatusMessage("Search configuration saved.");
  };

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedLeads = useMemo(() => {
    let s = [...leads];
    if (sortConfig) {
      s.sort((a, b) => {
        let aV = a[sortConfig.key]; let bV = b[sortConfig.key];
        if (sortConfig.key === "Rating") { aV = parseFloat(aV) || 0; bV = parseFloat(bV) || 0; }
        if (aV < bV) return sortConfig.direction === "asc" ? -1 : 1;
        if (aV > bV) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return s;
  }, [leads, sortConfig]);

  const inputStyle: React.CSSProperties = {
    background: "transparent", border: "none", borderBottom: "2px solid var(--color-night)",
    padding: "8px 0", outline: "none", fontFamily: "var(--font-display)", fontWeight: 600,
    fontSize: "0.875rem", color: "var(--color-night)", width: "100%", textTransform: "uppercase",
    letterSpacing: "0.05em", transition: "border-color 0.2s",
  };

  return (
    <div key={resetKey} style={{ padding: "clamp(24px, 4vw, 48px)", fontFamily: "var(--font-body)" }}>

      {/* Modals */}
      {validationError && (
        <Modal title="Action Required" icon={<AlertTriangle size={20} color="var(--color-amber)" />}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "rgba(26,26,31,0.7)", marginBottom: 24, lineHeight: 1.6 }}>{validationError}</p>
          <button onClick={() => setValidationError("")} className="metro-btn-primary" style={{ width: "100%" }}>Acknowledge</button>
        </Modal>
      )}
      {leadToDelete && (
        <Modal title="Confirm Deletion" icon={<Trash2 size={20} color="var(--color-transit-red)" />}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "rgba(26,26,31,0.7)", marginBottom: 24, lineHeight: 1.6 }}>
            Delete <strong>{leadToDelete.Name}</strong> from this campaign?
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={deleteLead} className="metro-btn-primary" style={{ flex: 1, justifyContent: "center" }}>Yes, Delete</button>
            <button onClick={() => setLeadToDelete(null)} className="metro-btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          </div>
        </Modal>
      )}
      {showDeleteConfirm && (
        <Modal title="Wipe Campaign" icon={<Trash2 size={20} color="var(--color-transit-red)" />}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "rgba(26,26,31,0.7)", marginBottom: 24, lineHeight: 1.6 }}>
            Wipe all records for <strong>{campaignName}</strong>?
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={wipeCampaign} className="metro-btn-primary" style={{ flex: 1, justifyContent: "center" }}>Yes, Wipe</button>
            <button onClick={() => setShowDeleteConfirm(false)} className="metro-btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b-[5px] border-[var(--color-night)] pb-6 mb-10">
        <div>
          <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 6 }}>Global Engine v3.0</div>
          <h1 className="metro-display" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--color-night)", lineHeight: 1 }}>Target Hunter</h1>
        </div>
        <div
          className="field-night self-start sm:self-auto"
          style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Activity size={14}
            color={useLocalEngine ? (localEngineStatus === "online" ? "#22c55e" : "var(--color-transit-red)") : "var(--color-teal)"}
            style={{ animation: "pulse 2s infinite" }}
          />
          <span className="metro-label" style={{ color: useLocalEngine ? (localEngineStatus === "online" ? "#22c55e" : "var(--color-transit-red)") : "var(--color-teal)" }}>
            {useLocalEngine ? (localEngineStatus === "online" ? "Local Engine Online" : "Local Engine Offline") : "Cloud Engine Online"}
          </span>
        </div>
      </header>

      {/* Controls */}
      <section
        className="field-canvas border-[5px] border-[var(--color-night)] p-6 md:p-10 mb-10"
      >
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 border-b-3 border-[var(--color-night)] pb-4">
          <div className="flex items-center gap-2">
            <div style={{ width: 6, height: 24, background: "var(--color-transit-red)" }} />
            <h2 className="metro-display" style={{ fontSize: "1.25rem", color: "var(--color-night)", display: "flex", alignItems: "center", gap: 8 }}>
              <Target size={18} /> Engine Parameters
            </h2>
          </div>
          <div
            className="field-night self-start md:self-auto text-xs"
            style={{ padding: "6px 14px", fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-amber)", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {`> ${statusMessage}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Niche + limit */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
            <div>
              <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 8 }}>Niche / Keyword</label>
              <input id="hunt-niche" style={inputStyle} placeholder="Luxury Rooftop Bars..." value={niche} onChange={e => setNiche(e.target.value)}
                onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")}
                onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
            </div>
            <div>
              <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 8 }}>Limit (Max 60)</label>
              <input id="hunt-limit" type="number" min="1" max="60" style={inputStyle} value={maxResults} onChange={e => {
                if (parseInt(e.target.value) > 60) setMaxResults("60");
                else setMaxResults(e.target.value);
              }}
                onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")}
                onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
            </div>
          </div>

          {/* City / Region / Postal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "hunt-city", label: "City", val: city, set: setCity },
              { id: "hunt-region", label: "State / Country / Province", val: region, set: setRegion },
              { id: "hunt-postal", label: "Postal", val: zipCode, set: setZipCode },
            ].map(f => (
              <div key={f.id}>
                <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 8 }}>{f.label}</label>
                <input id={f.id} style={inputStyle} value={f.val} onChange={e => f.set(e.target.value)}
                  onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")}
                  onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
              </div>
            ))}
          </div>

          {/* Toggles */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            <MetroToggle label="Power Search" active={powerSearch} onClick={() => setPowerSearch(!powerSearch)} />
            <MetroToggle label="International" active={international} onClick={() => setInternational(!international)} />
            <MetroToggle label="Accumulate" active={keepExisting} onClick={() => setKeepExisting(!keepExisting)} />
            <MetroToggle label="Skip Known" active={useBlacklist} onClick={() => setUseBlacklist(!useBlacklist)} />
            <MetroToggle label="Save Key" active={rememberKeys} onClick={() => setRememberKeys(!rememberKeys)} />
            <MetroToggle label="Local Engine" active={useLocalEngine} onClick={handleLocalEngineToggle} />
          </div>

          {/* Campaign + actions */}
          <div className="border-t-3 border-[var(--color-night)] pt-6 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div className="w-full md:max-w-[320px]">
              <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 8 }}>Campaign Name</label>
              <input id="hunt-campaign" style={inputStyle} value={campaignName} onChange={e => setCampaignName(e.target.value)}
                onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")}
                onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
            </div>
            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={saveSearchPreset}
                className="w-auto"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "0.625rem",
                  textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(26,26,31,0.45)",
                  display: "flex", alignItems: "center", gap: 6, padding: "10px 0",
                }}
              >
                <Save size={14} /> Save Preset
              </button>
              <div className="flex gap-3 items-center ml-auto md:ml-0">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    border: "3px solid var(--color-night)", background: "transparent",
                    color: "var(--color-night)", padding: "10px 14px", cursor: "pointer",
                    display: "flex", alignItems: "center", transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-night)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-canvas)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-night)"; }}
                >
                  <Trash2 size={16} />
                </button>
                <button
                  id="hunt-execute"
                  onClick={executeHunt}
                  disabled={isLoading}
                  className="metro-btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: 8, opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? <><Loader2 className="animate-spin" size={16} /> Executing...</> : <><Zap size={16} /> Initialize Hunt</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results table */}
      <section style={{ border: "5px solid var(--color-night)", overflow: "hidden" }}>
        {/* Table header */}
        <div
          className="field-night"
          style={{ padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <h3
            className="metro-display"
            style={{ fontSize: "1rem", color: "var(--color-canvas)", display: "flex", alignItems: "center", gap: 10 }}
          >
            Acquisition Logs
            <span
              style={{
                background: "var(--color-transit-red)", color: "var(--color-canvas)",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.625rem",
                padding: "2px 8px", letterSpacing: "0.1em",
              }}
            >
              {leads.length}
            </span>
          </h3>
          <button
            onClick={exportToCSV}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.625rem",
              textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-canvas)",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="metro-table" style={{ minWidth: 1000, background: "var(--color-canvas)" }}>
            <thead>
              <tr style={{ background: "rgba(26,26,31,0.04)" }}>
                {[["Name", "Target"], ["Website", "Website"], ["Rating", "Rating"], ["Email", "Contact"]].map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => requestSort(key)}
                    style={{ cursor: "pointer" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {label}
                      <ArrowUpDown size={10} style={{ opacity: sortConfig?.key === key ? 1 : 0.3 }} />
                      {sortConfig?.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : ""}
                    </span>
                  </th>
                ))}
                <th>Socials</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeads.map((l, i) => (
                <tr key={i}>
                  <td>
                    <div
                      className="metro-display"
                      style={{ fontSize: "0.875rem", color: "var(--color-night)", marginBottom: 2 }}
                    >
                      {l.Name}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "rgba(26,26,31,0.5)" }}>{l.Address}</div>
                    {l.Maps_Link && (
                      <a
                        href={l.Maps_Link}
                        target="_blank"
                        className="metro-label"
                        style={{ color: "var(--color-teal)", display: "block", marginTop: 4, textDecoration: "none" }}
                      >
                        ↗ Google Profile
                      </a>
                    )}
                  </td>
                  <td>
                    <a
                      href={l.Website}
                      target="_blank"
                      style={{
                        fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8rem",
                        color: "var(--color-night)", textDecoration: "none", maxWidth: 200,
                        display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        textTransform: "none",
                      }}
                    >
                      {l.Website}
                    </a>
                  </td>
                  <td>
                    <div className="metro-display" style={{ fontSize: "0.875rem" }}>
                      {l.Rating !== "N/A" ? l.Rating : "—"}
                      {l.Reviews > 0 && <span style={{ fontSize: "0.65rem", color: "rgba(26,26,31,0.5)", marginLeft: 4 }}>({l.Reviews})</span>}
                    </div>
                  </td>
                  <td>
                    {l.Email !== "N/A" ? (
                      <div className="metro-display" style={{ fontSize: "0.8rem", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.Email}</div>
                    ) : null}
                    
                    {l.Phone !== "N/A" ? (
                      <a href={`tel:${l.Phone}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-teal)", textDecoration: "none", display: "block", marginTop: l.Email !== "N/A" ? 4 : 0 }}>
                        {l.Phone}
                      </a>
                    ) : null}

                    {l.Email === "N/A" && l.Phone === "N/A" && (
                      <span className="metro-label" style={{ color: "rgba(26,26,31,0.3)" }}>No Contact Info</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                      {l.Instagram && l.Instagram !== "N/A" && <a href={l.Instagram} target="_blank" className="field-night metro-label" style={{ padding: "3px 8px", textDecoration: "none", fontSize: "0.55rem" }}>IG</a>}
                      {l.Facebook && l.Facebook !== "N/A" && <a href={l.Facebook} target="_blank" style={{ background: "#1877F2", color: "var(--color-canvas)", padding: "3px 8px", textDecoration: "none" }} className="metro-label" >FB</a>}
                      {l.Twitter && l.Twitter !== "N/A" && <a href={l.Twitter} target="_blank" style={{ background: "#1DA1F2", color: "var(--color-canvas)", padding: "3px 8px", textDecoration: "none" }} className="metro-label">X</a>}
                      {l.TikTok && l.TikTok !== "N/A" && <a href={l.TikTok} target="_blank" className="field-night metro-label" style={{ padding: "3px 8px", textDecoration: "none", fontSize: "0.55rem" }}>TK</a>}
                      {(!l.Instagram || l.Instagram === "N/A") && (!l.Facebook || l.Facebook === "N/A") && (!l.Twitter || l.Twitter === "N/A") && (!l.TikTok || l.TikTok === "N/A") && (
                        <span className="metro-label" style={{ color: "rgba(26,26,31,0.3)" }}>N/A</span>
                      )}
                      <button
                        onClick={() => setLeadToDelete(l)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(26,26,31,0.25)", padding: "3px 4px", transition: "color 0.15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--color-transit-red)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(26,26,31,0.25)"; }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedLeads.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "48px 16px", color: "rgba(26,26,31,0.3)" }}>
                    <span className="metro-label">No targets acquired. Initialize a hunt.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}