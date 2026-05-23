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
  const [campaignName, setCampaignName] = useState("campaignName");
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
    addLog(`INITIATING AI SYNTHESIS...`);

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
      addLog(`Drafting for ${lead.Name}...`);
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
          addLog(`LIVE: Draft ready for ${lead.Name}.`);
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
    addLog("SYNTHESIS COMPLETE.");
  };

  const generateSingleDraft = async (lead: any) => {
    if ((aiProvider === 'gemini' && !geminiKey) || (aiProvider === 'openai' && !openaiKey) || (aiProvider === 'huggingface' && !huggingfaceKey)) {
      setValidationError(`Please provide a valid API Key for ${aiProvider.toUpperCase()}.`);
      return;
    }
    setActiveDraftingLead(lead.Name);
    addLog(`Drafting for ${lead.Name}...`);
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
        addLog(`LIVE: Draft ready for ${lead.Name}.`);
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
      setSelectedEmails(new Set());
      fetchLeads();
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-black p-8 selection:bg-black selection:text-white">
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="border-4 border-white bg-black p-8 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h3 className="text-xl font-black uppercase mb-4 text-white flex items-center gap-2"><AlertTriangle className="text-yellow-500" /> System Error</h3>
            <p className="text-sm font-mono text-white/70 mb-8">{validationError}</p>
            <button onClick={() => setValidationError("")} className="w-full py-3 bg-white text-black font-bold uppercase hover:bg-neutral-300 transition-all">
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {confirmGenerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="border-4 border-white bg-black p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h3 className="text-xl font-black uppercase mb-4 text-white flex items-center gap-2"><Cpu className="text-blue-500" /> Confirm Synthesis</h3>
            <p className="text-sm font-mono text-white/70 mb-8">You are about to run Mass Draft Creation. This will cost AI provider credits. Continue?</p>
            <div className="flex gap-4">
              <button onClick={executeGenerate} className="flex-1 py-3 bg-white text-black font-bold uppercase hover:bg-neutral-300 transition-colors">
                Yes, Start
              </button>
              <button onClick={() => { setConfirmGenerate(false); setIsProcessing(false); }} className="flex-1 py-3 bg-red-600 text-white font-bold uppercase hover:bg-red-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="border-4 border-white bg-black p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h3 className="text-xl font-black uppercase mb-4 text-white flex items-center gap-2"><Send className="text-green-500" /> Confirm Dispatch</h3>
            <p className="text-sm font-mono text-white/70 mb-8">You are about to send live communications. This action CANNOT be undone. Are you sure you want to proceed?</p>
            <div className="flex gap-4">
              <button onClick={executeDispatch} className="flex-1 py-3 bg-red-600 text-white font-bold uppercase hover:bg-red-700 transition-colors">
                Yes, Dispatch
              </button>
              <button onClick={() => { setConfirmDispatch(false); setIsProcessing(false); }} className="flex-1 py-3 bg-white text-black font-bold uppercase hover:bg-neutral-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="border-b-4 border-black pb-6 flex justify-between items-end mb-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-2 font-serif">Pitch Engine</h1>
          <p className="text-sm font-mono text-neutral-600 uppercase tracking-widest font-bold">Global Engine v3.0</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border-2 border-green-500 bg-black">
          <Activity size={16} className="text-green-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-green-500 uppercase">Engine Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Persona Settings */}
          <section className="bg-white text-black p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-black">
              <h2 className="font-black uppercase flex items-center gap-2">Persona Profile</h2>
              <button onClick={savePersonaConfig} className="text-xs font-bold uppercase hover:underline flex items-center gap-1"><Save size={14} /> Save</button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Your Name</label>
                  <input value={yourName} onChange={e => setYourName(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Profession</label>
                  <input value={profession} onChange={e => setProfession(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono text-sm" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-1">Credibility</label>
                <input value={credibility} onChange={e => setCredibility(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase block mb-1">Core Offer</label>
                <input value={coreOffer} onChange={e => setCoreOffer(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase block mb-1">Easy CTA</label>
                <input value={easyCta} onChange={e => setEasyCta(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono text-sm" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-black">
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Phone</label>
                  <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Max Words</label>
                  <input type="number" value={maxWords} onChange={e => setMaxWords(parseInt(e.target.value) || 0)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono text-sm" />
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold uppercase block mb-1">AI Tone</label>
                <select value={toneSelection} onChange={e => setToneSelection(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono text-sm">
                  {TONE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
                {toneSelection === "Type Custom Tone..." && (
              <div className="pt-4 border-t-2 border-black">
                <label className="text-xs font-bold uppercase block mb-2">Campaign Name</label>
                <input value={campaignName} onChange={e => setCampaignName(e.target.value)} className="w-full bg-transparent border-b-2 border-black p-2 outline-none font-mono focus:bg-black/5 transition-colors" />
              </div>
                )}
              </div>
            </div>
          </section>

          {/* Security & Credentials */}
          <section className="bg-white text-black p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(200,200,200,1)]">
            <h2 className="font-black uppercase flex items-center gap-2 mb-6 border-b-2 border-black pb-2">Credentials & Providers</h2>
            
            <div className="flex border-2 border-black mb-4 p-1">
              {['gemini', 'openai', 'huggingface'].map(prov => (
                <button key={prov} onClick={() => setAiProvider(prov)} className={`flex-1 py-1.5 text-xs font-bold uppercase transition-colors ${aiProvider === prov ? 'bg-black text-white' : 'hover:bg-neutral-100'}`}>{prov}</button>
              ))}
            </div>

            <div className="mb-6">
              {aiProvider === 'gemini' ? (
                <div className="w-full bg-black text-white p-2 text-xs font-mono text-center font-bold uppercase">
                  Defaulting to SaaS Server Credentials
                </div>
              ) : (
                <input 
                  type="password" 
                  placeholder={`${aiProvider.toUpperCase()} API KEY`} 
                  value={aiProvider === 'openai' ? openaiKey : huggingfaceKey} 
                  onChange={e => aiProvider === 'openai' ? setOpenaiKey(e.target.value) : setHuggingfaceKey(e.target.value)} 
                  className="w-full bg-transparent border-b-2 border-black p-2 text-sm font-mono outline-none transition-colors focus:bg-yellow-100" 
                />
              )}
            </div>

            <div className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Sender Email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} className="w-full bg-transparent border-b-2 border-neutral-300 focus:border-black p-2 text-sm font-mono outline-none transition-colors" />
                <input type="password" placeholder="App Password" value={appPassword} onChange={e => setAppPassword(e.target.value)} className="w-full bg-transparent border-b-2 border-neutral-300 focus:border-black p-2 text-sm font-mono outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-4 border-t-2 border-black">
                <input placeholder="SMTP Server" value={smtpServer} onChange={e => setSmtpServer(e.target.value)} className="w-full bg-transparent border-b-2 border-neutral-300 focus:border-black p-2 text-[10px] font-mono outline-none transition-colors" />
                <input placeholder="SMTP Port" value={smtpPort} onChange={e => setSmtpPort(e.target.value)} className="w-full bg-transparent border-b-2 border-neutral-300 focus:border-black p-2 text-[10px] font-mono outline-none transition-colors" />
                <input placeholder="IMAP Server" value={imapServer} onChange={e => setImapServer(e.target.value)} className="w-full bg-transparent border-b-2 border-neutral-300 focus:border-black p-2 text-[10px] font-mono outline-none transition-colors" />
              </div>

              {/* TWILIO CONFIG */}
              <div className="pt-4 border-t-2 border-black">
                <label className="text-xs font-bold uppercase block mb-2 text-neutral-500">Twilio SMS Configuration</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <input placeholder="Twilio Account SID" value={twilioSid} onChange={e => setTwilioSid(e.target.value)} className="w-full bg-transparent border-b-2 border-neutral-300 focus:border-black p-2 text-xs font-mono outline-none transition-colors" />
                  <input type="password" placeholder="Twilio Auth Token" value={twilioToken} onChange={e => setTwilioToken(e.target.value)} className="w-full bg-transparent border-b-2 border-neutral-300 focus:border-black p-2 text-xs font-mono outline-none transition-colors" />
                </div>
                <input placeholder="Twilio Phone Number (e.g. +1234567890)" value={twilioNumber} onChange={e => setTwilioNumber(e.target.value)} className="w-full bg-transparent border-b-2 border-neutral-300 focus:border-black p-2 text-xs font-mono outline-none transition-colors" />
              </div>

              <div className="flex justify-between items-center pt-4">
                <label className="flex items-center gap-2 text-xs font-mono uppercase cursor-pointer">
                  <div className={`w-4 h-4 border-2 border-black flex items-center justify-center transition-colors ${rememberKeys ? 'bg-black' : 'bg-transparent'}`}>
                    {rememberKeys && <div className="w-2 h-2 bg-white" />}
                  </div>
                  Store Locally
                  <input type="checkbox" className="hidden" checked={rememberKeys} onChange={e => setRememberKeys(e.target.checked)} />
                </label>
                <button onClick={saveToVault} className="text-xs font-bold uppercase hover:underline"><Save size={14} /></button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Side Control */}
        <div className="col-span-12 lg:col-span-8">
          <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(200,200,200,1)] flex flex-col min-h-[600px]">
            <div className="p-4 border-b-4 border-black bg-black text-white flex justify-between items-center">
              <h2 className="font-black uppercase flex items-center gap-2 text-lg">
                <CheckSquare size={20} /> Target Queue
              </h2>
              <div className="flex gap-4">
                <button onClick={handleGenerate} disabled={isProcessing} className="px-4 py-2 border-2 border-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors flex items-center gap-2">
                  <Cpu size={14} /> Mass Draft Creation
                </button>
                <button onClick={handleDispatch} disabled={isProcessing} className="px-4 py-2 bg-white text-black font-bold uppercase text-xs hover:bg-transparent hover:text-white border-2 border-white transition-colors flex items-center gap-2">
                  <Send size={14} /> Dispatch
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-white text-neutral-500 font-mono text-xs uppercase border-b-2 border-black font-bold">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <input type="checkbox" onChange={toggleAll} checked={leads.length > 0 && leads.every(l => selectedTargets.has(l.Name))} className="accent-black" />
                    </th>
                    <th className="p-4">Target</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Draft Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-neutral-200 font-mono text-sm text-black">
                  {leads.map((l, idx) => (
                    <tr key={idx} className="hover:bg-neutral-100">
                      <td className="p-4 text-center">
                        <input type="checkbox" checked={selectedTargets.has(l.Name)} onChange={() => toggleOne(l.Name)} className="accent-black" />
                      </td>
                      <td className="p-4 font-bold uppercase truncate max-w-[200px]">{l.Name}</td>
                      <td className="p-4 truncate max-w-[200px] font-bold">{l.Email}</td>
                      <td className="p-4 flex items-center gap-2">
                        {l.Drafted_Email ? (
                          l.Drafted_Email === "✅ SENT" ? (
                            <span className="text-green-600 font-bold">✅ DELIVERED</span>
                          ) : (
                            <>
                              <span className="text-yellow-600 font-bold mr-2">READY</span>
                              <button onClick={() => { setEditingLead(l); setEditBody(l.Drafted_Email); }} className="text-[10px] font-bold uppercase bg-neutral-200 text-black hover:bg-black hover:text-white px-2 py-1 transition-colors border border-black">Edit</button>
                            </>
                          )
                        ) : (
                          <>
                            {activeDraftingLead === l.Name ? (
                              <span className="text-blue-600 mr-2 animate-pulse font-bold">● WRITING...</span>
                            ) : (
                              <span className="text-neutral-400 mr-2">PENDING</span>
                            )}
                            <button onClick={() => generateSingleDraft(l)} className="text-[10px] font-bold uppercase bg-black text-white hover:bg-neutral-800 px-2 py-1 transition-colors disabled:opacity-50" disabled={activeDraftingLead === l.Name}>Create Draft</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-neutral-500 uppercase font-bold text-sm">No targets acquired for campaign.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Terminal Feed */}
            <div className="h-48 border-t-4 border-black bg-neutral-900 p-4 overflow-y-auto font-mono text-xs text-green-400">
              {terminalLogs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editingLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#F4F4F0] border-4 border-black w-full max-w-2xl flex flex-col shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
            <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
              <h3 className="font-black uppercase tracking-widest">Edit Draft: {editingLead.Name}</h3>
              <button onClick={() => setEditingLead(null)} className="hover:text-red-500 font-bold uppercase">Close</button>
            </div>
            <div className="p-4 flex-1">
              <textarea 
                className="w-full h-[400px] bg-white border-2 border-black p-4 font-mono text-sm outline-none focus:border-blue-600 transition-colors"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
              />
            </div>
            <div className="p-4 border-t-4 border-black bg-white flex justify-end gap-4">
              <button onClick={() => setEditingLead(null)} className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-neutral-100 transition-all text-black">Cancel</button>
              <button onClick={saveEditedDraft} className="px-6 py-2 bg-black text-white font-bold uppercase border-2 border-black hover:bg-transparent hover:text-black transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}