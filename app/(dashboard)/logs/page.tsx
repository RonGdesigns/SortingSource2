"use client";

import React, { useState, useEffect } from "react";
import { Activity, Clock, ShieldAlert, Download, Inbox, Send, RefreshCcw } from "lucide-react";

export default function DispatchLogs() {
  const [validationError, setValidationError] = useState("");
  const [activeTab, setActiveTab] = useState<'sent' | 'replies'>('sent');
  const [logs, setLogs] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingReplies, setIsCheckingReplies] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/logs`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch logs");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIMAPReplies = async () => {
    const savedVault = localStorage.getItem("ss_pitch_vault");
    if (!savedVault) {
      setValidationError("No IMAP credentials found. Please save your Email settings in the Pitch Engine's Security Vault first.");
      return;
    }

    const parsedVault = JSON.parse(savedVault);
    const { senderEmail, appPassword, imapServer } = parsedVault;

    if (!senderEmail || !appPassword) {
      setValidationError("Missing Email or App Password in Vault.");
      return;
    }

    setIsCheckingReplies(true);
    try {
      const response = await fetch(`${API_URL}/api/check-replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: senderEmail, password: appPassword, imap_server: imapServer || "imap.gmail.com" })
      });

      if (response.ok) {
        const data = await response.json();
        setReplies(data.replies || []);
      } else {
        setValidationError("Failed to connect to IMAP Server. Please check your credentials.");
      }
    } catch (error) {
      console.error("Failed to fetch replies", error);
    } finally {
      setIsCheckingReplies(false);
    }
  };

  const exportToCSV = () => {
    const dataToExport = activeTab === 'sent' ? logs : replies;
    if (dataToExport.length === 0) {
      setValidationError("No data available to export for this view.");
      return;
    }

    let headers = [];
    let csvRows = [];

    if (activeTab === 'sent') {
      headers = ["Timestamp (UTC)", "Business Name", "Target Email", "Email Body"];
      csvRows = dataToExport.map(log => [`"${log.date_sent}"`, `"${(log.business_name || "").replace(/"/g, '""')}"`, `"${log.email_sent_to}"`, `"${(log.email_body || "").replace(/"/g, '""')}"`].join(","));
    } else {
      headers = ["Date", "From", "Subject", "Message Body"];
      csvRows = dataToExport.map(reply => [`"${reply.date}"`, `"${(reply.sender || "").replace(/"/g, '""')}"`, `"${(reply.subject || "").replace(/"/g, '""')}"`, `"${(reply.body || "").replace(/"/g, '""')}"`].join(","));
    }

    const csvString = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeTab}_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-black p-8 selection:bg-black selection:text-white">
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="border-4 border-white bg-black p-8 max-w-sm w-full">
            <h3 className="text-xl font-black uppercase mb-4 text-white">System Error</h3>
            <p className="text-sm font-mono text-white/70 mb-8">{validationError}</p>
            <button onClick={() => setValidationError("")} className="w-full py-3 bg-white text-black font-bold uppercase border-4 border-transparent hover:bg-black hover:text-white hover:border-white transition-all">
              Acknowledge
            </button>
          </div>
        </div>
      )}

      <header className="border-b-4 border-black pb-6 flex justify-between items-end mb-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-2 font-serif">Audit Logs</h1>
          <p className="text-sm font-mono text-neutral-600 uppercase tracking-widest font-bold">SMTP & IMAP Relay</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border-2 border-green-500 bg-black">
          <Activity size={16} className="text-green-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-green-500 uppercase">Engine Online</span>
        </div>
      </header>

      <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(200,200,200,1)] flex flex-col h-[700px]">
        <div className="flex border-b-4 border-black">
          <button onClick={() => setActiveTab('sent')} className={`flex-1 py-4 font-black uppercase tracking-widest text-sm flex justify-center items-center gap-2 transition-colors border-r-2 border-black ${activeTab === 'sent' ? 'bg-black text-white' : 'hover:bg-neutral-100'}`}>
            <Send size={16} /> Outbound Logs
          </button>
          <button onClick={() => { setActiveTab('replies'); if (replies.length === 0) fetchIMAPReplies(); }} className={`flex-1 py-4 font-black uppercase tracking-widest text-sm flex justify-center items-center gap-2 transition-colors ${activeTab === 'replies' ? 'bg-black text-white' : 'hover:bg-neutral-100'}`}>
            <Inbox size={16} /> Inbox Replies
          </button>
        </div>

        <div className="p-4 border-b-2 border-black flex justify-between items-center bg-black text-white">
          <div className="font-mono text-xs uppercase font-bold flex items-center gap-2">
            <Activity size={14} /> {activeTab === 'sent' ? `${logs.length} Total Dispatches` : `${replies.length} Total Replies`}
          </div>
          <div className="flex gap-4">
            {activeTab === 'replies' && (
              <button onClick={fetchIMAPReplies} disabled={isCheckingReplies} className="text-xs font-bold uppercase hover:underline flex items-center gap-1">
                <RefreshCcw size={14} className={isCheckingReplies ? "animate-spin" : ""} /> Sync IMAP
              </button>
            )}
            <button onClick={exportToCSV} className="text-xs font-bold uppercase hover:underline flex items-center gap-1">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white text-black">
          {isLoading && activeTab === 'sent' || isCheckingReplies && activeTab === 'replies' ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 font-mono text-sm gap-4 uppercase font-bold">
              <RefreshCcw size={32} className="animate-spin text-black" />
              {activeTab === 'sent' ? "Querying database..." : "Establishing IMAP handshake..."}
            </div>
          ) : (
            <table className="w-full text-left whitespace-nowrap min-w-[800px]">
              <thead className="bg-white text-neutral-500 font-mono text-xs uppercase border-b-2 border-black sticky top-0 font-bold">
                {activeTab === 'sent' ? (
                  <tr>
                    <th className="p-4">Timestamp (UTC)</th>
                    <th className="p-4">Target Business</th>
                    <th className="p-4">Email Vector</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="p-4">Date Received</th>
                    <th className="p-4">Sender</th>
                    <th className="p-4">Subject</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y-2 divide-neutral-200 font-mono text-sm">
                {activeTab === 'sent' && logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-neutral-100">
                    <td className="p-4 text-neutral-500 flex items-center gap-2 font-bold"><Clock size={14} /> {log.date_sent}</td>
                    <td className="p-4 font-bold uppercase truncate max-w-[300px]">{log.business_name}</td>
                    <td className="p-4 truncate font-bold">{log.email_sent_to}</td>
                  </tr>
                ))}
                {activeTab === 'sent' && logs.length === 0 && (
                  <tr><td colSpan={3} className="p-12 text-center text-neutral-500 uppercase font-bold">No outbound transmissions found.</td></tr>
                )}
                {activeTab === 'replies' && replies.map((reply, idx) => (
                  <tr key={idx} className="hover:bg-neutral-100">
                    <td className="p-4 text-neutral-500 flex items-center gap-2 font-bold"><Clock size={14} /> {reply.date}</td>
                    <td className="p-4 font-bold uppercase truncate max-w-[300px]">{reply.sender}</td>
                    <td className="p-4 truncate max-w-[400px] font-bold">{reply.subject}</td>
                  </tr>
                ))}
                {activeTab === 'replies' && replies.length === 0 && !isCheckingReplies && (
                  <tr><td colSpan={3} className="p-12 text-center text-neutral-500 uppercase font-bold">No inbound replies detected. Click Sync IMAP.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}