"use client";

import React, { useState, useEffect } from "react";
import {
  Settings2, ShieldAlert, CheckSquare, Cpu, Send,
  Save, Trash2, Activity, Zap, Globe, ArrowUpDown, Palette, AlertTriangle
} from "lucide-react";

export default function PitchPage() {
  const TONE_OPTIONS = [
    "Direct & Professional", "Consultative & Helpful", "Punchy & Short",
    "Aggressive & Bold", "Friend-to-Friend", "Witty & Humorous",
    "Relaxed & Conversational", "Type Custom Tone..."
  ];

  const [aiProvider, setAiProvider] = useState("gemini");
  const [yourName, setYourName] = useState("");
  const [profession, setProfession] = useState("");
  const [credibility, setCredibility] = useState("");
  const [coreOffer, setCoreOffer] = useState("");
  const [easyCta, setEasyCta] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [toneSelection, setToneSelection] = useState(TONE_OPTIONS[0]);
  const [customTone, setCustomTone] = useState("");
  const [useCustomMode, setUseCustomMode] = useState(false);
  const [customDirectives, setCustomDirectives] = useState("");
  const [maxWords, setMaxWords] = useState(70);

  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [huggingfaceKey, setHuggingfaceKey] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [jitterDelay, setJitterDelay] = useState("45");
  const [rememberKeys, setRememberKeys] = useState(false);
  const [smtpServer, setSmtpServer] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [imapServer, setImapServer] = useState("imap.gmail.com");

  const [outboundChannel, setOutboundChannel] = useState("email");
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioToken, setTwilioToken] = useState("");
  const [twilioNumber, setTwilioNumber] = useState("");

  const [leads, setLeads] = useState<any[]>([]);
  const [campaignName, setCampaignName] = useState("Default Campaign");
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(["System Online. Awaiting targets..."]);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [validationError, setValidationError] = useState("");

  const [editingLead, setEditingLead] = useState<any>(null);
  const [editBody, setEditBody] = useState("");
  const [confirmDispatch, setConfirmDispatch] = useState(false);
  const [confirmGenerate, setConfirmGenerate] = useState(false);
  const [activeDraftingLead, setActiveDraftingLead] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const addLog = (msg: string) => setTerminalLogs((prev) => [...prev.slice(-50), `> ${msg}`]);

  const fetchLeadsDirect = async (targetCampaign: string) => {
    try {
      const res = await fetch(`${API_URL}/api/leads/${encodeURIComponent(targetCampaign)}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
      }
    } catch (e) { addLog("ERROR: Engine connection refused."); }
  };

  const fetchLeads = () => fetchLeadsDirect(campaignName);

  useEffect(() => {
    let activeCampaign = "Default Campaign";
    const savedSearch = localStorage.getItem("ss_search_preset");
    if (savedSearch) {
      const parsedSearch = JSON.parse(savedSearch);
      if (parsedSearch.campaignName) {
        setCampaignName(parsedSearch.campaignName);
        activeCampaign = parsedSearch.campaignName;
      }
    } else {
      setCampaignName("Default Campaign");
    }

    const saved = localStorage.getItem("ss_pitch_vault");
    if (saved) {
      const parsed = JSON.parse(saved);
      setGeminiKey(parsed.geminiKey || "");
      setOpenaiKey(parsed.openaiKey || "");
      setHuggingfaceKey(parsed.huggingfaceKey || "");
      setSenderEmail(parsed.senderEmail || "");
      setAppPassword(parsed.appPassword || "");
      setSmtpServer(parsed.smtpServer || "smtp.gmail.com");
      setSmtpPort(parsed.smtpPort || "587");
      setImapServer(parsed.imapServer || "imap.gmail.com");
      setTwilioSid(parsed.twilioSid || "");
      setTwilioToken(parsed.twilioToken || "");
      setTwilioNumber(parsed.twilioNumber || "");
      setRememberKeys(true);
    }

    const savedPersona = localStorage.getItem("ss_persona_config");
    if (savedPersona) {
      const parsed = JSON.parse(savedPersona);
      if (parsed.yourName) setYourName(parsed.yourName);
      if (parsed.profession) setProfession(parsed.profession);
      if (parsed.credibility) setCredibility(parsed.credibility);
      if (parsed.coreOffer) setCoreOffer(parsed.coreOffer);
      if (parsed.easyCta) setEasyCta(parsed.easyCta);
      if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
      if (parsed.toneSelection) setToneSelection(parsed.toneSelection);
      if (parsed.customTone) setCustomTone(parsed.customTone);
      if (parsed.customDirectives) setCustomDirectives(parsed.customDirectives);
      if (parsed.maxWords) setMaxWords(parsed.maxWords);
      if (parsed.useCustomMode !== undefined) setUseCustomMode(parsed.useCustomMode);
    }

    fetchLeadsDirect(activeCampaign);
  }, []);

  const saveToVault = () => {
    if (rememberKeys) {
      localStorage.setItem("ss_pitch_vault", JSON.stringify({ geminiKey, openaiKey, huggingfaceKey, senderEmail, appPassword, smtpServer, smtpPort, imapServer, twilioSid, twilioToken, twilioNumber }));
      addLog("SUCCESS: Vault Updated.");
    } else {
      localStorage.removeItem("ss_pitch_vault");
      addLog("INFO: Vault Cleared.");
    }
  };

  const savePersonaConfig = () => {
    localStorage.setItem("ss_persona_config", JSON.stringify({ yourName, profession, credibility, coreOffer, easyCta, phoneNumber, toneSelection, customTone, customDirectives, maxWords, useCustomMode }));
    addLog("SUCCESS: Persona Configuration Saved.");
  };

  const toggleOne = (name: string) => {
    const next = new Set(selectedTargets);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelectedTargets(next);
  };

  const toggleAll = () => {
    const validLeads = leads.filter(l => l.Name);
    if (validLeads.length === 0) return;
    const allValidAreSelected = validLeads.every(l => selectedTargets.has(l.Name));
    if (allValidAreSelected) {
      setSelectedTargets(new Set());
      addLog("INFO: Selection cleared.");
    } else {
      setSelectedTargets(new Set(validLeads.map(l => l.Name)));
      addLog(`INFO: Selected all ${validLeads.length} valid targets.`);
    }
  };

  const handleGenerate = async () => {
    if ((aiProvider === 'gemini' && !geminiKey) || (aiProvider === 'openai' && !openaiKey) || (aiProvider === 'huggingface' && !huggingfaceKey)) {
      setValidationError(`Please provide a valid API Key for ${aiProvider.toUpperCase()}.`);
      return;
    }
    setIsProcessing(true);
    addLog(`INITIATING COLD OUTBOUND PITCH SYNTHESIS...`);

    const targets = leads.filter(l => selectedTargets.has(l.Name) && l.Name);
    if (targets.length === 0) {
      addLog("ERROR: No valid targets selected for synthesis.");
      setIsProcessing(false);
      return;
    }
    setConfirmGenerate(true);
  };

  const executeGenerate = async () => {
    setConfirmGenerate(false);
    const targets = leads.filter(l => selectedTargets.has(l.Name) && l.Name);

    for (const lead of targets) {
      setActiveDraftingLead(lead.Name);
      addLog(`Synthesizing payload for ${lead.Name}...`);
      try {
        const res = await fetch(`${API_URL}/api/generate-pitch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_name: lead.Name, lead_email: lead.Email, your_name: yourName,
            profession: profession, credibility: credibility, core_offer: coreOffer,
            easy_cta: easyCta, number: phoneNumber, tone: toneSelection === "Type Custom Tone..." ? customTone : toneSelection,
            ai_provider: aiProvider, gemini_key: geminiKey, openai_key: openaiKey,
            campaign_name: campaignName, use_custom_mode: useCustomMode,
            custom_directives: customDirectives, huggingface_key: huggingfaceKey,
            huggingface_model: (localStorage.getItem('huggingface_version') || "Qwen/Qwen2.5-72B-Instruct"),
            gemini_model: localStorage.getItem('gemini_version') || "",
            openai_model: localStorage.getItem('openai_version') || "", max_words: maxWords,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setLeads(prevLeads => prevLeads.map(item => item.Name === lead.Name ? { ...item, Drafted_Email: data.pitch } : item));
          addLog(`LIVE: Synthesis draft ready for ${lead.Name}.`);
        } else {
          const err = await res.json();
          addLog(`ERROR: Synthesis failed for ${lead.Name}: ${err.detail || 'Unknown Engine Error'}`);
        }
      } catch (e) {
        addLog(`ERROR: Connection timeout for ${lead.Name}. Engine may be offline.`);
      }
    }
    setActiveDraftingLead(null);
    setIsProcessing(false);
    addLog("PITCH PAYLOAD SYNTHESIS COMPLETE.");
  };

  const generateSingleDraft = async (lead: any) => {
    if ((aiProvider === 'gemini' && !geminiKey) || (aiProvider === 'openai' && !openaiKey) || (aiProvider === 'huggingface' && !huggingfaceKey)) {
      setValidationError(`Please provide a valid API Key for ${aiProvider.toUpperCase()}.`);
      return;
    }
    setActiveDraftingLead(lead.Name);
    addLog(`Synthesizing payload for ${lead.Name}...`);
    try {
      const res = await fetch(`${API_URL}/api/generate-pitch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: lead.Name, lead_email: lead.Email, your_name: yourName,
          profession: profession, credibility: credibility, core_offer: coreOffer,
          easy_cta: easyCta, number: phoneNumber, tone: toneSelection === "Type Custom Tone..." ? customTone : toneSelection,
          ai_provider: aiProvider, gemini_key: geminiKey, openai_key: openaiKey,
          campaign_name: campaignName, use_custom_mode: useCustomMode,
          custom_directives: customDirectives, huggingface_key: huggingfaceKey,
          huggingface_model: (localStorage.getItem('huggingface_version') || "Qwen/Qwen2.5-72B-Instruct"),
          gemini_model: localStorage.getItem('gemini_version') || "",
          openai_model: localStorage.getItem('openai_version') || "", max_words: maxWords,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLeads(prevLeads => prevLeads.map(item => item.Name === lead.Name ? { ...item, Drafted_Email: data.pitch } : item));
        addLog(`LIVE: Synthesis draft ready for ${lead.Name}.`);
      } else {
        const err = await res.json();
        addLog(`ERROR: Synthesis failed for ${lead.Name}: ${err.detail || 'Unknown Engine Error'}`);
      }
    } catch (e) {
      addLog(`ERROR: Connection timeout for ${lead.Name}. Engine may be offline.`);
    } finally {
      setActiveDraftingLead(null);
    }
  };

  const saveEditedDraft = async () => {
    if (!editingLead) return;
    try {
      const res = await fetch(`${API_URL}/api/update-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_name: campaignName,
          lead_name: editingLead.Name,
          draft_body: editBody
        })
      });
      if (res.ok) {
        setLeads(prev => prev.map(item => item.Name === editingLead.Name ? { ...item, Drafted_Email: editBody } : item));
        addLog(`SUCCESS: Saved draft override for ${editingLead.Name}.`);
        setEditingLead(null);
      } else {
        addLog(`ERROR: Failed to save draft for ${editingLead.Name}.`);
      }
    } catch (e) {
      addLog(`ERROR: Connection failed saving draft for ${editingLead.Name}.`);
    }
  };

  const handleDispatch = async () => {
    if (outboundChannel === "email" && (!senderEmail || !appPassword)) return addLog("ERROR: Email credentials missing.");
    const twilioVersion = localStorage.getItem('twilio_version') || "2010-04-01";
    setIsProcessing(true);
    addLog(`INITIATING ${outboundChannel.toUpperCase()} DISPATCH SEQUENCE...`);

    const targets = leads.filter(l => selectedTargets.has(l.Name) && l.Drafted_Email && (outboundChannel === "email" ? (l.Email && l.Email !== "N/A") : (l.Phone && l.Phone !== "N/A")));
    if (targets.length === 0) {
      addLog("ERROR: No valid targets selected or drafts are empty.");
      setIsProcessing(false);
      return;
    }
    setConfirmDispatch(true);
  };

  const executeDispatch = async () => {
    setConfirmDispatch(false);
    const targets = leads.filter(l => selectedTargets.has(l.Name) && l.Drafted_Email && (outboundChannel === "email" ? (l.Email && l.Email !== "N/A") : (l.Phone && l.Phone !== "N/A")));

    try {
      for (let i = 0; i < targets.length; i++) {
        const lead = targets[i];
        const endpoint = outboundChannel === "email" ? "/api/send-email" : "/api/send-sms";
        const payload = outboundChannel === "email" ? {
          target_email: lead.Email, target_name: lead.Name, subject: `Question for ${lead.Name}`, body: lead.Drafted_Email, sender_email: senderEmail, app_password: appPassword, smtp_server: smtpServer || "smtp.gmail.com", smtp_port: parseInt(smtpPort) || 587, campaign_name: campaignName
        } : {
          target_phone: lead.Phone, body: lead.Drafted_Email, twilio_sid: twilioSid, twilio_token: twilioToken, from_number: twilioNumber, campaign_name: campaignName, twilio_version: twilioVersion
        };

        addLog(`PROCESSING: Connecting to Gateway for ${lead.Name}...`);
        const res = await fetch(`${API_URL}${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (res.ok) {
          addLog(`SUCCESS: ${outboundChannel.toUpperCase()} delivered to ${lead.Name}.`);
          setLeads(prev => prev.map(item => item.Email === lead.Email ? { ...item, Drafted_Email: "✅ SENT" } : item));
        } else {
          const errData = await res.json();
          addLog(`ERROR: Gateway rejected ${lead.Name}. Reason: ${errData.detail || "Unknown"}`);
        }
        if (i < targets.length - 1) await new Promise(r => setTimeout(r, parseInt(jitterDelay) * 1000));
      }
      addLog("SUCCESS: Full batch dispatch complete.");
    } catch (e) {
      addLog(`ERROR: Critical System Failure during Dispatch.`);
    } finally {
      setIsProcessing(false);
      setSelectedTargets(new Set());
      fetchLeads();
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: "2px solid var(--color-night)",
    padding: "8px 0",
    outline: "none",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: "0.875rem",
    color: "var(--color-night)",
    width: "100%",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    transition: "border-color 0.2s",
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-night)] p-4 lg:p-8" style={{ fontFamily: "var(--font-body)" }}>
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="border-4 border-black bg-[var(--color-canvas)] p-8 max-w-sm w-full">
            <h3 className="metro-display text-xl mb-4 text-[var(--color-night)] flex items-center gap-2">
              <AlertTriangle className="text-[var(--color-amber)]" size={20} /> Action Required
            </h3>
            <p className="text-sm font-mono text-[var(--color-night)]/70 mb-8">{validationError}</p>
            <button onClick={() => setValidationError("")} className="w-full metro-btn-primary">
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {confirmGenerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="border-4 border-black bg-[var(--color-canvas)] p-8 max-w-md w-full">
            <h3 className="metro-display text-xl mb-4 text-[var(--color-night)] flex items-center gap-2">
              <Cpu className="text-[var(--color-teal)]" size={20} /> Confirm Synthesis
            </h3>
            <p className="text-sm text-[var(--color-night)]/70 mb-8" style={{ lineHeight: 1.6 }}>
              You are about to run Mass Draft Generation. This will draw compute tokens from your linked providers. Continue?
            </p>
            <div className="flex gap-4">
              <button onClick={executeGenerate} className="flex-1 metro-btn-primary">
                Yes, Synthesize
              </button>
              <button onClick={() => { setConfirmGenerate(false); setIsProcessing(false); }} className="flex-1 metro-btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="border-4 border-black bg-[var(--color-canvas)] p-8 max-w-md w-full">
            <h3 className="metro-display text-xl mb-4 text-[var(--color-night)] flex items-center gap-2">
              <Send className="text-[var(--color-transit-red)]" size={20} /> Confirm Dispatch
            </h3>
            <p className="text-sm text-[var(--color-night)]/70 mb-8" style={{ lineHeight: 1.6 }}>
              You are about to initiate live transmissions. This action cannot be reversed. Are you ready to dispatch?
            </p>
            <div className="flex gap-4">
              <button onClick={executeDispatch} className="flex-1 metro-btn-primary">
                Yes, Dispatch
              </button>
              <button onClick={() => { setConfirmDispatch(false); setIsProcessing(false); }} className="flex-1 metro-btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="border-b-5 border-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 6 }}>Global Engine v3.0</div>
          <h1 className="metro-display text-5xl md:text-6xl text-[var(--color-night)]">Pitch Engine</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border-3 border-black bg-black">
          <Activity size={16} className="text-[var(--color-teal)] animate-pulse" />
          <span className="metro-label text-xs font-bold text-[var(--color-teal)]">Engine Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column — Config panels (4/12) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Persona Profile Card */}
          <section className="bg-[var(--color-canvas)] border-4 border-black p-6" style={{ borderRadius: 0 }}>
            <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-black">
              <h2 className="metro-display text-lg text-[var(--color-night)] flex items-center gap-2">Persona Configuration</h2>
              <button onClick={savePersonaConfig} className="text-xs font-bold uppercase hover:underline flex items-center gap-1"><Save size={14} /> Save</button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 2 }}>Your Name</label>
                  <input value={yourName} onChange={e => setYourName(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
                </div>
                <div>
                  <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 2 }}>Profession</label>
                  <input value={profession} onChange={e => setProfession(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
                </div>
              </div>

              <div>
                <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 2 }}>Credibility Hook</label>
                <input value={credibility} onChange={e => setCredibility(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
              </div>
              <div>
                <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 2 }}>Core Offer</label>
                <input value={coreOffer} onChange={e => setCoreOffer(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
              </div>
              <div>
                <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 2 }}>Easy Call-To-Action</label>
                <input value={easyCta} onChange={e => setEasyCta(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-black">
                <div>
                  <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 2 }}>Phone Link</label>
                  <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
                </div>
                <div>
                  <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 2 }}>Word Limit</label>
                  <input type="number" value={maxWords} onChange={e => setMaxWords(parseInt(e.target.value) || 0)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
                </div>
              </div>

              <div>
                <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 2 }}>Writing Tone</label>
                <select value={toneSelection} onChange={e => setToneSelection(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono text-sm" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                  {TONE_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-[var(--color-canvas)] text-[var(--color-night)]">{opt}</option>)}
                </select>
              </div>

              {toneSelection === "Type Custom Tone..." && (
                <div>
                  <label className="metro-label" style={{ color: "rgba(26,26,31,0.5)", display: "block", marginBottom: 2 }}>Custom Directives</label>
                  <input value={customTone} onChange={e => setCustomTone(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
                </div>
              )}
            </div>
          </section>

          {/* Credentials & Providers Card */}
          <section className="bg-[var(--color-canvas)] border-4 border-black p-6" style={{ borderRadius: 0 }}>
            <h2 className="metro-display text-lg text-[var(--color-night)] mb-6 border-b-2 border-black pb-2">Credentials & Providers</h2>
            
            <div className="flex border-2 border-black mb-4 p-1">
              {['gemini', 'openai', 'huggingface'].map(prov => (
                <button key={prov} onClick={() => setAiProvider(prov)} className={`flex-1 py-1.5 text-xs font-bold uppercase transition-colors ${aiProvider === prov ? 'bg-black text-white' : 'hover:bg-black/5 text-[var(--color-night)]'}`}>{prov}</button>
              ))}
            </div>

            <div className="mb-6">
              {aiProvider === 'gemini' ? (
                <div className="w-full bg-black text-[var(--color-canvas)] p-2 text-xs font-mono text-center font-bold uppercase">
                  Defaulting to SaaS Server Credentials
                </div>
              ) : (
                <input 
                  type="password" 
                  placeholder={`${aiProvider.toUpperCase()} API KEY`} 
                  value={aiProvider === 'openai' ? openaiKey : huggingfaceKey} 
                  onChange={e => aiProvider === 'openai' ? setOpenaiKey(e.target.value) : setHuggingfaceKey(e.target.value)} 
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")}
                  onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="metro-label text-[9px]" style={{ color: "rgba(26,26,31,0.5)" }}>Sender Email</label>
                  <input placeholder="email@address.com" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} style={{ ...inputStyle, textTransform: "none" }} />
                </div>
                <div>
                  <label className="metro-label text-[9px]" style={{ color: "rgba(26,26,31,0.5)" }}>App Password</label>
                  <input type="password" placeholder="App Password" value={appPassword} onChange={e => setAppPassword(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-4 border-t-2 border-black">
                <div>
                  <label className="metro-label text-[8px]" style={{ color: "rgba(26,26,31,0.4)" }}>SMTP Server</label>
                  <input value={smtpServer} onChange={e => setSmtpServer(e.target.value)} style={{ ...inputStyle, fontSize: "0.75rem", textTransform: "none" }} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
                </div>
                <div>
                  <label className="metro-label text-[8px]" style={{ color: "rgba(26,26,31,0.4)" }}>SMTP Port</label>
                  <input value={smtpPort} onChange={e => setSmtpPort(e.target.value)} style={{ ...inputStyle, fontSize: "0.75rem" }} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
                </div>
                <div>
                  <label className="metro-label text-[8px]" style={{ color: "rgba(26,26,31,0.4)" }}>IMAP Server</label>
                  <input value={imapServer} onChange={e => setImapServer(e.target.value)} style={{ ...inputStyle, fontSize: "0.75rem", textTransform: "none" }} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
                </div>
              </div>

              <div className="pt-4 border-t-2 border-black">
                <label className="metro-label text-[9px]" style={{ color: "rgba(26,26,31,0.5)" }}>Twilio SMS Config</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Account SID" value={twilioSid} onChange={e => setTwilioSid(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
                  <input type="password" placeholder="Auth Token" value={twilioToken} onChange={e => setTwilioToken(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
                </div>
                <input placeholder="Twilio Phone Number" value={twilioNumber} onChange={e => setTwilioNumber(e.target.value)} style={{ ...inputStyle, marginTop: 12 }} onFocus={e => (e.target.style.borderBottomColor = "var(--color-transit-red)")} onBlur={e => (e.target.style.borderBottomColor = "var(--color-night)")} />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-black/10">
                <label className="flex items-center gap-2 metro-label cursor-pointer text-[10px] select-none" style={{ color: "var(--color-night)" }}>
                  <div className={`w-4 h-4 border-2 border-black flex items-center justify-center ${rememberKeys ? 'bg-black' : 'bg-transparent'}`}>
                    {rememberKeys && <div className="w-2 h-2 bg-[var(--color-canvas)]" />}
                  </div>
                  Store Credentials
                  <input type="checkbox" className="hidden" checked={rememberKeys} onChange={e => setRememberKeys(e.target.checked)} />
                </label>
                <button onClick={saveToVault} className="text-xs font-bold uppercase hover:underline flex items-center gap-1"><Save size={14} /> Update</button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column — Target Queue & Dispatch (8/12) */}
        <div className="col-span-12 lg:col-span-8">
          <div className="border-4 border-black bg-[var(--color-canvas)] flex flex-col min-h-[600px]">
            {/* Header Control */}
            <div className="p-4 border-b-4 border-black bg-black text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="metro-display text-lg text-[var(--color-canvas)] flex items-center gap-2">
                <CheckSquare size={20} /> Target Queue
              </h2>
              <div className="flex gap-4 w-full sm:w-auto">
                <button onClick={handleGenerate} disabled={isProcessing} className="flex-1 sm:flex-none px-4 py-2 border-2 border-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2">
                  <Cpu size={14} /> Pitch Synthesis
                </button>
                <button onClick={handleDispatch} disabled={isProcessing} className="flex-1 sm:flex-none px-4 py-2 bg-white text-black font-bold uppercase text-xs hover:bg-transparent hover:text-white border-2 border-white transition-colors flex items-center justify-center gap-2">
                  <Send size={14} /> Dispatch
                </button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="flex-1 overflow-x-auto">
              <table className="metro-table min-w-[600px]" style={{ background: "var(--color-canvas)" }}>
                <thead>
                  <tr style={{ background: "rgba(26,26,31,0.04)" }}>
                    <th className="p-4 w-12 text-center">
                      <input type="checkbox" onChange={toggleAll} checked={leads.length > 0 && leads.every(l => selectedTargets.has(l.Name))} className="accent-black" />
                    </th>
                    <th className="p-4">Target Business</th>
                    <th className="p-4">Outbound Vector</th>
                    <th className="p-4">Payload Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-neutral-200">
                  {leads.map((l, idx) => (
                    <tr key={idx} className="hover:bg-black/5">
                      <td className="p-4 text-center">
                        <input type="checkbox" checked={selectedTargets.has(l.Name)} onChange={() => toggleOne(l.Name)} className="accent-black" />
                      </td>
                      <td className="p-4">
                        <div className="metro-display text-sm text-[var(--color-night)]">{l.Name}</div>
                      </td>
                      <td className="p-4 font-mono text-xs">{l.Email !== "N/A" ? l.Email : l.Phone}</td>
                      <td className="p-4">
                        {l.Drafted_Email ? (
                          l.Drafted_Email === "✅ SENT" ? (
                            <span className="text-green-600 font-bold metro-label" style={{ letterSpacing: "0.1em" }}>✅ DELIVERED</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-600 font-bold metro-label" style={{ letterSpacing: "0.1em" }}>READY</span>
                              <button onClick={() => { setEditingLead(l); setEditBody(l.Drafted_Email); }} className="text-[10px] font-bold uppercase bg-transparent text-black hover:bg-black hover:text-white px-2 py-0.5 border border-black transition-all">Edit</button>
                            </div>
                          )
                        ) : (
                          <div className="flex items-center gap-2">
                            {activeDraftingLead === l.Name ? (
                              <span className="text-blue-600 mr-2 animate-pulse font-mono text-xs uppercase font-bold">● SYNTHESIZING...</span>
                            ) : (
                              <span className="text-neutral-400 mr-2 font-mono text-xs uppercase">PENDING</span>
                            )}
                            <button onClick={() => generateSingleDraft(l)} className="text-[10px] font-bold uppercase bg-black text-white hover:bg-neutral-800 px-2 py-0.5 transition-all disabled:opacity-50" disabled={activeDraftingLead === l.Name}>Synthesize</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-neutral-500 uppercase font-bold text-sm font-mono">
                        No targets loaded. Select another campaign or run a new search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Terminal Feed logs */}
            <div className="h-48 border-t-4 border-black bg-black p-4 overflow-y-auto font-mono text-xs text-green-400">
              {terminalLogs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
 
      {editingLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[var(--color-canvas)] border-4 border-black w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
              <h3 className="metro-display text-lg tracking-wide uppercase">Edit Payload: {editingLead.Name}</h3>
              <button onClick={() => setEditingLead(null)} className="hover:text-red-500 font-bold uppercase text-xs">Close</button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <textarea 
                className="w-full h-[250px] md:h-[400px] bg-white border-2 border-black p-4 font-mono text-sm outline-none focus:border-red-600 transition-colors resize-none"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
              />
            </div>
            <div className="p-4 border-t-4 border-black bg-[var(--color-canvas)] flex justify-end gap-4">
              <button onClick={() => setEditingLead(null)} className="px-6 py-2 border-2 border-black font-bold uppercase text-xs hover:bg-black/5">Cancel</button>
              <button onClick={saveEditedDraft} className="px-6 py-2 bg-black text-white font-bold uppercase text-xs border-2 border-black hover:bg-transparent hover:text-black transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}