"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Loader2, Activity, Globe, Download,
  ArrowUpDown, Trash2, Target, Zap, Settings2, Save,
  ShieldAlert, AlertTriangle
} from "lucide-react";

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
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("System idle. Ready to hunt.");
  const [leads, setLeads] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
      if (parsed.campaignName) {
        setCampaignName(parsed.campaignName);
        activeCampaign = parsed.campaignName;
      }
    }

    fetch(`${API_URL}/api/config/api-key`)
      .then(res => res.json())
      .then(data => {
        if (data.api_key) {
          setApiKey(data.api_key);
          setRememberKeys(true);
        }
      }).catch(() => console.log("Engine offline"));

    fetchLeadsDirect(activeCampaign);
  }, [API_URL]);

  const fetchLeadsDirect = async (targetCampaign: string) => {
    try {
      const response = await fetch(`${API_URL}/api/leads/${encodeURIComponent(targetCampaign)}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads);
      }
    } catch (error) { setStatusMessage("ERROR: Engine offline. Check deployment."); }
  };

  const fetchLeads = () => fetchLeadsDirect(campaignName);

  const wipeCampaign = async () => {
    try {
      setIsLoading(true);
      setShowDeleteConfirm(false);
      setStatusMessage("Wiping database records...");

      const res = await fetch(`${API_URL}/api/wipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_name: campaignName })
      });

      if (res.ok) {
        setLeads([]);
        setResetKey(prev => prev + 1);
        setStatusMessage("Table wiped clean.");
      }
    } catch (e) {
      setStatusMessage("Wipe failed. Check engine.");
    } finally {
      setIsLoading(false);
    }
  };

  const executeHunt = async () => {
    if (!niche) {
      setValidationError("Missing Niche keyword for the hunt.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("Acquiring targets...");
    const placesVersion = localStorage.getItem('places_version') || "v1";

    try {
      const response = await fetch(`${API_URL}/api/hunt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche, city, region, country, zip_code: zipCode, intl_postal: intlPostal,
          max_results: parseInt(maxResults), api_key: apiKey,
          campaign_name: campaignName, clear_table: !keepExisting,
          use_blacklist: useBlacklist,
          international: international, save_key: rememberKeys,
          places_model_override: placesVersion
        }),
      });

      if (response.ok) {
        setStatusMessage("Hunt successful.");
        await fetchLeads();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatusMessage(`API Error: ${errorData.detail || "Unknown Engine Failure"}`);
      }
    } catch (error: any) {
      setStatusMessage(`Critical Engine Failure: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLead = async () => {
    if (!leadToDelete) return;
    try {
      const response = await fetch(`${API_URL}/api/delete-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_name: campaignName, lead_name: leadToDelete.Name }),
      });
      if (response.ok) {
        setStatusMessage(`Deleted ${leadToDelete.Name}.`);
        await fetchLeads();
      } else {
        setStatusMessage("Failed to delete lead.");
      }
    } catch (e) {
      setStatusMessage("Engine connection refused during deletion.");
    } finally {
      setLeadToDelete(null);
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      setValidationError("No data available to export.");
      return;
    }
    const headers = Object.keys(leads[0]).join(",");
    const rows = leads.map(lead => Object.values(lead).map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${campaignName}_Leads.csv`);
    link.click();
  };

  const saveSearchPreset = () => {
    const config = { niche, city, region, zipCode, intlPostal, country, maxResults, campaignName, international, keepExisting, useBlacklist, powerSearch };
    localStorage.setItem("ss_search_preset", JSON.stringify(config));
    setStatusMessage("Search configuration saved.");
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedLeads = useMemo(() => {
    let sortable = [...leads];
    if (sortConfig) {
      sortable.sort((a, b) => {
        let aV = a[sortConfig.key];
        let bV = b[sortConfig.key];
        if (sortConfig.key === 'Rating') { aV = parseFloat(aV) || 0; bV = parseFloat(bV) || 0; }
        if (aV < bV) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aV > bV) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [leads, sortConfig]);

  return (
    <div key={resetKey} className="flex min-h-screen bg-[#F4F4F0] text-black p-8 overflow-y-auto selection:bg-black selection:text-white">
      <main className="max-w-6xl mx-auto w-full space-y-12 pb-24">
        
        {/* HEADER */}
        <header className="border-b-4 border-black pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-2 font-serif">Target Hunter</h1>
            <p className="text-sm font-mono text-neutral-600 uppercase tracking-widest font-bold">Global Engine v3.0</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border-2 border-green-500 bg-black">
            <Activity size={16} className="text-green-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-green-500 uppercase">Engine Online</span>
          </div>
        </header>

        {/* CONTROLS */}
        <section className="bg-white text-black p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative">
          <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
            <h2 className="text-xl font-black uppercase flex items-center gap-2">
              <Target size={24} /> Engine Parameters
            </h2>
            <div className="font-mono text-xs bg-black text-white px-3 py-1 font-bold">
              {`> ${statusMessage}`}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-3">
                <label className="text-xs font-bold uppercase block mb-2">Niche / Keyword</label>
                <input placeholder="Luxury Rooftop Bars..." value={niche} onChange={e => setNiche(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono focus:bg-black/5 transition-colors" />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-bold uppercase block mb-2">Limit</label>
                <input type="number" min="1" value={maxResults} onChange={e => setMaxResults(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono focus:bg-black/5 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold uppercase block mb-2">City</label>
                <input value={city} onChange={e => setCity(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase block mb-2">Region</label>
                <input value={region} onChange={e => setRegion(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase block mb-2">Postal</label>
                <input value={zipCode} onChange={e => setZipCode(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 py-4">
              <ToggleSwitch label="Power Search" active={powerSearch} onClick={() => setPowerSearch(!powerSearch)} />
              <ToggleSwitch label="Accumulate" active={keepExisting} onClick={() => setKeepExisting(!keepExisting)} />
              <ToggleSwitch label="Skip Known" active={useBlacklist} onClick={() => setUseBlacklist(!useBlacklist)} />
              <ToggleSwitch label="Save Key" active={rememberKeys} onClick={() => setRememberKeys(!rememberKeys)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-black">
              <div>
                <label className="text-xs font-bold uppercase block mb-2">Campaign Name</label>
                <input value={campaignName} onChange={e => setCampaignName(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono focus:bg-black/5 transition-colors" />
              </div>

              {/* MODALS */}
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="border-4 border-white bg-black p-8 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h3 className="text-xl font-black uppercase mb-4 text-white flex items-center gap-2"><AlertTriangle size={24} className="text-yellow-500" /> Action Required</h3>
            <p className="text-sm font-mono text-white/70 mb-8">{validationError}</p>
            <button onClick={() => setValidationError("")} className="w-full py-3 bg-white text-black font-bold uppercase border-4 border-transparent hover:bg-black hover:text-white hover:border-white transition-all">
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="border-4 border-white bg-black p-8 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h3 className="text-xl font-black uppercase mb-4 text-white flex items-center gap-2"><Trash2 size={24} className="text-red-500" /> Confirm Deletion</h3>
            <p className="text-sm font-mono text-white/70 mb-8">Are you sure you want to delete <strong className="text-white">{leadToDelete.Name}</strong> from this campaign?</p>
            <div className="flex gap-4">
              <button onClick={deleteLead} className="flex-1 py-3 bg-red-600 text-white font-bold uppercase hover:bg-red-700 transition-colors">
                Yes, Delete
              </button>
              <button onClick={() => setLeadToDelete(null)} className="flex-1 py-3 bg-white text-black font-bold uppercase hover:bg-neutral-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="border-4 border-white bg-black p-8 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h3 className="text-xl font-black uppercase mb-4 text-white flex items-center gap-2"><Trash2 size={24} className="text-red-500" /> Wipe Campaign</h3>
            <p className="text-sm font-mono text-white/70 mb-8">Are you sure you want to completely wipe all records for <strong className="text-white">{campaignName}</strong>?</p>
            <div className="flex gap-4">
              <button onClick={wipeCampaign} className="flex-1 py-3 bg-red-600 text-white font-bold uppercase hover:bg-red-700 transition-colors">
                Yes, Wipe
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-white text-black font-bold uppercase hover:bg-neutral-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}            </div>

            <div className="flex justify-between items-center pt-8">
              <button onClick={saveSearchPreset} className="text-xs font-bold uppercase flex items-center gap-2 hover:underline">
                <Save size={16} /> Save Preset
              </button>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteConfirm(true)} className="p-4 border-2 border-black hover:bg-black hover:text-white transition-colors">
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={executeHunt}
                  disabled={isLoading}
                  className="px-12 py-4 bg-black text-white font-black uppercase text-sm border-2 border-black hover:bg-transparent hover:text-black transition-colors flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                  {isLoading ? "Executing..." : "Initialize Hunt"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS TABLE */}
        <section className="border-4 border-black overflow-hidden bg-white mt-16 shadow-[8px_8px_0px_0px_rgba(200,200,200,1)]">
          <div className="p-4 border-b-4 border-black flex justify-between items-center bg-black text-white">
            <h3 className="font-black uppercase flex items-center gap-2">
              Auditor Logs <span className="bg-white text-black px-2 py-1 text-xs font-mono">{leads.length}</span>
            </h3>
            <button onClick={exportToCSV} className="text-xs font-bold uppercase flex items-center gap-2 hover:underline">
              <Download size={16} /> Export CSV
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="font-mono text-xs uppercase text-neutral-500 border-b-2 border-black font-bold">
                <tr>
                  <th className="p-4 cursor-pointer hover:text-black transition-colors" onClick={() => requestSort('Name')}>
                    Target {sortConfig?.key === 'Name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="p-4 cursor-pointer hover:text-black transition-colors" onClick={() => requestSort('Website')}>
                    Website {sortConfig?.key === 'Website' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="p-4 cursor-pointer hover:text-black transition-colors" onClick={() => requestSort('Rating')}>
                    Rating {sortConfig?.key === 'Rating' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="p-4 cursor-pointer hover:text-black transition-colors" onClick={() => requestSort('Email')}>
                    Contact {sortConfig?.key === 'Email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="p-4">Socials</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-neutral-200 font-mono text-sm">
                {sortedLeads.map((l, i) => (
                  <tr key={i} className="hover:bg-neutral-100 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-black uppercase">{l.Name}</div>
                      <div className="text-xs text-neutral-600">{l.Address}</div>
                      {l.Maps_Link && (
                        <a href={l.Maps_Link} target="_blank" className="text-[10px] uppercase font-bold text-blue-600 hover:underline mt-1 block">
                          ↗ Google Profile
                        </a>
                      )}
                    </td>
                    <td className="p-4">
                      <a href={l.Website} target="_blank" className="hover:underline hover:text-green-600 max-w-[200px] truncate block font-bold">
                        {l.Website}
                      </a>
                    </td>
                    <td className="p-4 text-black font-bold">{l.Rating}</td>
                    <td className="p-4">
                      <div className="truncate max-w-[200px] font-bold">{l.Email}</div>
                      <div className="text-xs text-neutral-600">{l.Phone}</div>
                    </td>
                    <td className="p-4 flex gap-2">
                      {l.Instagram && l.Instagram !== "N/A" && <a href={l.Instagram} target="_blank" className="px-2 py-1 bg-black text-white text-[10px] font-bold uppercase hover:bg-neutral-800">IG</a>}
                      {l.Facebook && l.Facebook !== "N/A" && <a href={l.Facebook} target="_blank" className="px-2 py-1 bg-[#1877F2] text-white text-[10px] font-bold uppercase hover:bg-blue-700">FB</a>}
                      {l.Twitter && l.Twitter !== "N/A" && <a href={l.Twitter} target="_blank" className="px-2 py-1 bg-[#1DA1F2] text-white text-[10px] font-bold uppercase hover:bg-blue-400">X</a>}
                      {l.TikTok && l.TikTok !== "N/A" && <a href={l.TikTok} target="_blank" className="px-2 py-1 bg-black text-white text-[10px] font-bold uppercase hover:bg-neutral-800">TK</a>}
                      {(!l.Instagram || l.Instagram === "N/A") && (!l.Facebook || l.Facebook === "N/A") && (!l.Twitter || l.Twitter === "N/A") && (!l.TikTok || l.TikTok === "N/A") && <span className="text-xs text-neutral-400">N/A</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}

function ToggleSwitch({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 font-mono text-xs uppercase font-bold group">
      <div className={`w-4 h-4 border-2 border-black flex items-center justify-center transition-colors ${active ? 'bg-black' : 'bg-transparent'}`}>
        {active && <div className="w-2 h-2 bg-white" />}
      </div>
      {label}
    </button>
  );
}