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
      setValidationError("No IMAP credentials found. Save email configuration settings in the Pitch Engine parameters first.");
      return;
    }

    const parsedVault = JSON.parse(savedVault);
    const { senderEmail, appPassword, imapServer } = parsedVault;

    if (!senderEmail || !appPassword) {
      setValidationError("Missing Sender Email or App Password in configuration.");
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
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-night)] p-4 lg:p-8" style={{ fontFamily: "var(--font-body)" }}>
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="border-4 border-black bg-[var(--color-canvas)] p-8 max-w-sm w-full">
            <h3 className="metro-display text-xl mb-4 text-[var(--color-night)] flex items-center gap-2">
              <ShieldAlert className="text-[var(--color-transit-red)]" size={20} /> Action Required
            </h3>
            <p className="text-sm font-mono text-[var(--color-night)]/70 mb-8">{validationError}</p>
            <button onClick={() => setValidationError("")} className="w-full metro-btn-primary">
              Acknowledge
            </button>
          </div>
        </div>
      )}

      <header className="border-b-5 border-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 6 }}>Global Engine v3.0</div>
          <h1 className="metro-display text-5xl md:text-6xl text-[var(--color-night)]">Audit Logs</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border-3 border-black bg-black">
          <Activity className="text-[var(--color-teal)] animate-pulse" size={16} />
          <span className="metro-label text-xs font-bold text-[var(--color-teal)]">Relay Active</span>
        </div>
      </header>

      <div className="border-4 border-black bg-[var(--color-canvas)] flex flex-col h-[700px]">
        {/* Tabs Control */}
        <div className="flex border-b-4 border-black">
          <button 
            onClick={() => setActiveTab('sent')} 
            className={`flex-1 py-3 md:py-4 font-bold uppercase tracking-wider md:tracking-widest text-xs md:text-sm flex justify-center items-center gap-1.5 md:gap-2 border-r-4 border-black transition-colors ${activeTab === 'sent' ? 'bg-black text-[var(--color-canvas)]' : 'hover:bg-black/5 text-[var(--color-night)]'}`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Send size={14} /> Outbound Logs
          </button>
          <button 
            onClick={() => { setActiveTab('replies'); if (replies.length === 0) fetchIMAPReplies(); }} 
            className={`flex-1 py-3 md:py-4 font-bold uppercase tracking-wider md:tracking-widest text-xs md:text-sm flex justify-center items-center gap-1.5 md:gap-2 transition-colors ${activeTab === 'replies' ? 'bg-black text-[var(--color-canvas)]' : 'hover:bg-black/5 text-[var(--color-night)]'}`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Inbox size={14} /> Inbox Replies
          </button>
        </div>

        {/* Tab Sub-Header Actions */}
        <div className="p-4 border-b-2 border-black bg-black text-[var(--color-canvas)] flex justify-between items-center flex-wrap gap-2">
          <div className="metro-label text-xs font-bold flex items-center gap-2">
            <Activity size={14} /> {activeTab === 'sent' ? `${logs.length} Transmissions` : `${replies.length} Replies`}
          </div>
          <div className="flex gap-4">
            {activeTab === 'replies' && (
              <button 
                onClick={fetchIMAPReplies} 
                disabled={isCheckingReplies} 
                className="text-xs font-bold uppercase hover:underline flex items-center gap-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <RefreshCcw size={14} className={isCheckingReplies ? "animate-spin" : ""} /> Sync IMAP
              </button>
            )}
            <button 
              onClick={exportToCSV} 
              className="text-xs font-bold uppercase hover:underline flex items-center gap-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Tab Content Table */}
        <div className="flex-1 overflow-x-auto bg-[var(--color-canvas)] text-[var(--color-night)]">
          {(isLoading && activeTab === 'sent') || (isCheckingReplies && activeTab === 'replies') ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 font-mono text-sm gap-4 uppercase font-bold">
              <RefreshCcw size={32} className="animate-spin text-black" />
              {activeTab === 'sent' ? "Querying database..." : "Establishing IMAP handshake..."}
            </div>
          ) : (
            <table className="metro-table" style={{ minWidth: 800, background: "var(--color-canvas)" }}>
              <thead>
                <tr style={{ background: "rgba(26,26,31,0.04)" }}>
                  {activeTab === 'sent' ? (
                    <>
                      <th className="p-4">Timestamp (UTC)</th>
                      <th className="p-4">Target Business</th>
                      <th className="p-4">Email Vector</th>
                    </>
                  ) : (
                    <>
                      <th className="p-4">Date Received</th>
                      <th className="p-4">Sender</th>
                      <th className="p-4">Subject</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'sent' && logs.map((log, idx) => (
                  <tr key={idx}>
                    <td className="p-4 flex items-center gap-2 font-mono text-xs"><Clock size={14} /> {log.date_sent}</td>
                    <td>
                      <div className="metro-display text-sm">{log.business_name}</div>
                    </td>
                    <td className="p-4 font-mono text-sm">{log.email_sent_to}</td>
                  </tr>
                ))}
                {activeTab === 'sent' && logs.length === 0 && (
                  <tr><td colSpan={3} className="p-12 text-center text-neutral-500 uppercase font-bold text-sm font-mono">No outbound transmissions found.</td></tr>
                )}
                {activeTab === 'replies' && replies.map((reply, idx) => (
                  <tr key={idx}>
                    <td className="p-4 flex items-center gap-2 font-mono text-xs"><Clock size={14} /> {reply.date}</td>
                    <td className="p-4 font-bold">{reply.sender}</td>
                    <td className="p-4 truncate max-w-[400px]">{reply.subject}</td>
                  </tr>
                ))}
                {activeTab === 'replies' && replies.length === 0 && !isCheckingReplies && (
                  <tr><td colSpan={3} className="p-12 text-center text-neutral-500 uppercase font-bold text-sm font-mono">No inbound replies detected. Click Sync IMAP.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}