"use client";

import React from "react";
import { BookOpen, ShieldAlert, Cpu, Mail, HardDrive, Key, Activity } from "lucide-react";

export default function InstructionsPage() {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[var(--color-canvas)] text-[var(--color-night)] p-4 lg:p-8" style={{ fontFamily: "var(--font-body)" }}>
      <div className="max-w-4xl mx-auto space-y-12 pb-24">
        
        {/* Header */}
        <header className="border-b-5 border-black pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="metro-label" style={{ color: "var(--color-transit-red)", marginBottom: 6 }}>Global Engine v3.0</div>
            <h1 className="metro-display text-4xl lg:text-6xl text-[var(--color-night)] flex items-center gap-4">
              <BookOpen size={40} className="hidden lg:block text-[var(--color-transit-red)]" />
              Operator's Manual
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border-3 border-black bg-black">
            <Activity className="text-[var(--color-teal)] animate-pulse" size={16} />
            <span className="metro-label text-xs font-bold text-[var(--color-teal)]">Manual Active</span>
          </div>
        </header>

        {/* Section 1 */}
        <section className="bg-[var(--color-canvas)] p-6 lg:p-8 border-4 border-black">
          <h2 className="metro-display text-xl lg:text-2xl mb-6 flex items-center gap-3 border-b-2 border-black pb-2 text-[var(--color-night)]">
            <HardDrive size={24} className="hidden lg:block text-[var(--color-teal)]" />
            1. Bring Your Own Key (BYOK) Infrastructure for Agencies
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-[var(--color-night)]/80">
            <p>SortingSource is a standalone, local-first lead acquisition and outreach architecture. Unlike traditional SaaS platforms, you own the compute engine.</p>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Agency Operations:</strong> The BYOK model is designed specifically for Agencies to run large-scale outbound operations. By supplying your own Google Places and LLM keys, you preserve 100% of your profit margins, bypassing third-party platform markups.</li>
              <li><strong>Accountability:</strong> By integrating your API credentials, you accept full responsibility for your outreach volumes. You are solely accountable for compliance with regional anti-spam laws (CAN-SPAM, TCPA) and the terms of service of your compute providers.</li>
              <li><strong>Model Overrides:</strong> SortingSource is engineered to be future-proof. You do not need to wait for manual software patches to deploy new text generation engines. By using the <strong>Model Override</strong> section in the sidebar, you can manually input new model strings (e.g., <code>gemini-2.5-pro</code> or <code>gpt-4o-mini</code>) as they are released.</li>
              <li><strong>Factory Defaults:</strong> If the Model Override fields are left blank, the system automatically reverts to tested "Compatible Models" (<code>gemini-2.5-flash</code>, <code>gpt-4o-mini</code>) to keep your pipeline online.</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-[var(--color-canvas)] p-6 lg:p-8 border-4 border-black">
          <h2 className="metro-display text-xl lg:text-2xl mb-6 flex items-center gap-3 border-b-2 border-black pb-2 text-[var(--color-night)]">
            <Key size={24} className="hidden lg:block text-[var(--color-teal)]" />
            2. Setup: Obtaining Your Compute Keys
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-[var(--color-night)]/80">
            <p>To power the synthesis engine, you must link your provider accounts:</p>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Google Places API:</strong> Powers target query extraction. <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-[var(--color-teal)] underline font-bold">Create Key Here</a>.</li>
              <li><strong>Gemini API (Google):</strong> Primary synthesis and drafting engine. <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-[var(--color-teal)] underline font-bold">Create Key Here</a>.</li>
              <li><strong>OpenAI (ChatGPT):</strong> Secondary synthesis engine. <a href="https://platform.openai.com/api-keys" target="_blank" className="text-[var(--color-teal)] underline font-bold">Create Key Here</a>.</li>
              <li><strong>Hugging Face:</strong> Open-source synthesis engine. <a href="https://huggingface.co/settings/tokens" target="_blank" className="text-[var(--color-teal)] underline font-bold">Obtain Token Here</a>.</li>
              <li><strong>Gmail SMTP:</strong> To send emails, you <strong>must</strong> use a <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-[var(--color-teal)] underline font-bold">Google App Password</a>.</li>
              <li><strong>Twilio:</strong> Sign up at <a href="https://www.twilio.com/" target="_blank" className="text-[var(--color-teal)] underline font-bold">Twilio.com</a> for SMS gateway delivery (Account SID, Auth Token, and Twilio Number).</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-[var(--color-canvas)] p-6 lg:p-8 border-4 border-black">
          <h2 className="metro-display text-xl lg:text-2xl mb-6 flex items-center gap-3 border-b-2 border-black pb-2 text-[var(--color-night)]">
            <Cpu size={24} className="hidden lg:block text-[var(--color-teal)]" />
            3. The Search Dashboard (Target Hunter)
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-[var(--color-night)]/80">
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Search Parameters:</strong> Queries Google Places + Business Websites. Deep verification runs synchronously, taking 5–10 seconds to bypass bot protection flags.</li>
              <li><strong>Accumulate & Skip Known:</strong> Use these together. <strong>Accumulate</strong> grows your active queue across multiple searches, while <strong>Skip Known</strong> ensures you never pull (or pay for) a duplicate lead.</li>
              <li><strong>Technical Audit:</strong> Scans for missing SSL certificates, mobile viewport optimization, and tracking pixels.</li>
              <li><strong>Remember Keys:</strong> Toggling this encrypts and saves your Google API keys to your local machine so you don't have to re-enter them upon restart.</li>
            </ul>
            
            <div className="mt-8 p-6 bg-[var(--color-canvas)] border-3 border-black">
              <h3 className="metro-display text-lg mb-2">Best Practice: The "Rule of 60"</h3>
              <p className="mb-2">While the engine handles larger batches, we recommend running search sequences in increments of <strong>60 targets at a time</strong>.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Why?</strong> Smaller, frequent batches maintain higher data integrity and prevent API timeouts.</li>
                <li><strong>The Strategy:</strong> Enable <strong>Accumulate</strong> and <strong>Skip Known</strong>. Run 60 targets for one niche, then change the city or niche and run another 60. The table will grow into a clean, massive outreach database.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-[var(--color-canvas)] p-6 lg:p-8 border-4 border-black">
          <h2 className="metro-display text-xl lg:text-2xl mb-6 flex items-center gap-3 border-b-2 border-black pb-2 text-[var(--color-night)]">
            <Mail size={24} className="hidden lg:block text-[var(--color-teal)]" />
            4. The Pitch Engine: Synthesizing the Message
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-[var(--color-night)]/80">
            <p>This is where your campaign sender persona is defined. The synthesis engine crafts emails and texts based <em>entirely</em> on the context parameters provided here.</p>
            
            <h3 className="metro-display text-base mt-6 mb-2">Input Fields & Impact</h3>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Your Name & Role:</strong> Be specific. Instead of "Marketing," use "Growth Consultant for HVAC Companies."</li>
              <li><strong>Credibility Hook:</strong> The most critical field. Mention specific metrics, such as "Helping 5 local firms double their bookings last quarter."</li>
              <li><strong>Core Offer:</strong> Be direct and clear. For example, "Google Maps Optimization" or "Mobile Layout Repair."</li>
              <li><strong>Writing Tone:</strong> Choose a style that matches your campaign profile. "Punchy & Short" works best for SMS, while "Consultative" is better for high-ticket Email.</li>
            </ul>
            
            <div className="mt-6 p-4 bg-black text-[var(--color-canvas)]">
              <strong>OPERATOR NOTE:</strong> Higher-quality parameters yield higher-converting drafts. If you provide vague inputs, the engine will produce generic outputs. Spend time defining your offer and credibility metrics for optimal synthesis.
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-[var(--color-canvas)] p-6 lg:p-8 border-4 border-black">
          <h2 className="metro-display text-xl lg:text-2xl mb-6 flex items-center gap-3 border-b-2 border-black pb-2 text-[var(--color-night)]">
            <ShieldAlert size={24} className="hidden lg:block text-[var(--color-teal)]" />
            5. Security, Network & Dispatch
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-[var(--color-night)]/80">
            
            <h3 className="metro-display text-base mt-6 mb-2">Jitter Delay: Anti-Spam Shield</h3>
            <p>The <strong>Jitter Delay</strong> slider adds a random wait duration between each outbound transmission.</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>The Purpose:</strong> This is your delivery shield. It injects randomized pauses (e.g., 30–90 seconds) between messages. Without this, your sender domain or Twilio number will be flagged as spam within minutes.</li>
              <li><strong>Recommendation:</strong> Set this between <strong>30–60 seconds</strong>. This mimics human typing speeds and keeps your sender reputation healthy.</li>
            </ul>

            <h3 className="metro-display text-base mt-6 mb-2">Email & SMS Gateways</h3>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>SMTP Server:</strong> For Gmail, use <code>smtp.gmail.com</code> and port <code>587</code>. You <strong>must</strong> use a "Google App Password" (not your master account password).</li>
              <li><strong>SMS Mode:</strong> When enabled, the engine swaps to the Twilio gateway. The synthesis engine automatically shortens outputs to comply with standard text message limits.</li>
            </ul>

            <h3 className="metro-display text-base mt-6 mb-2">The Local Vault</h3>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Clicking <strong>Save Credentials</strong> encrypts and stores your <strong>API Keys, SMTP/IMAP credentials, and Sender Email</strong> locally on your machine.</li>
              <li><strong>Data Privacy:</strong> This data remains strictly in your local storage (localStorage). It is persistent across restarts but is never sent to external servers; your sensitive keys remain on your hardware.</li>
            </ul>

            <h3 className="metro-display text-base mt-6 mb-2">IMAP & SMTP Configurations</h3>
            <p>Use the following reference settings to enable outbound sending and inbound reply checking:</p>
            
            <div className="overflow-x-auto my-6">
              <table className="metro-table" style={{ background: "var(--color-canvas)" }}>
                <thead>
                  <tr className="bg-black text-[var(--color-canvas)] uppercase">
                    <th className="p-3 border-b-2 border-black">Provider</th>
                    <th className="p-3 border-b-2 border-black">SMTP Server (Outbound)</th>
                    <th className="p-3 border-b-2 border-black">IMAP Server (Inbound)</th>
                    <th className="p-3 border-b-2 border-black">Port</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-2 border-black">
                    <td className="p-3 font-bold">Gmail</td>
                    <td className="p-3">smtp.gmail.com</td>
                    <td className="p-3">imap.gmail.com</td>
                    <td className="p-3">587</td>
                  </tr>
                  <tr className="border-b-2 border-black">
                    <td className="p-3 font-bold">Outlook / Office 365</td>
                    <td className="p-3">smtp.office365.com</td>
                    <td className="p-3">outlook.office365.com</td>
                    <td className="p-3">587</td>
                  </tr>
                  <tr className="border-b-2 border-black">
                    <td className="p-3 font-bold">Yahoo Mail</td>
                    <td className="p-3">smtp.mail.yahoo.com</td>
                    <td className="p-3">imap.mail.yahoo.com</td>
                    <td className="p-3">587</td>
                  </tr>
                  <tr className="border-b-2 border-black">
                    <td className="p-3 font-bold">iCloud</td>
                    <td className="p-3">smtp.mail.me.com</td>
                    <td className="p-3">imap.mail.me.com</td>
                    <td className="p-3">587</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">AOL</td>
                    <td className="p-3">smtp.aol.com</td>
                    <td className="p-3">imap.aol.com</td>
                    <td className="p-3">587</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="metro-display text-base mt-8 mb-2">Google App Passwords Setup</h3>
            <p className="mb-4">To ensure your engine can dispatch emails through your Gmail account, you must generate a 16-digit <strong>Google App Password</strong>. Google's default security rules block automated logins unless this specific bypass key is used.</p>
            
            <p className="font-bold underline mb-2">How to Generate</p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Sign in to your Google Account and navigate to Security.</li>
              <li>Ensure <strong>2-Step Verification</strong> is enabled (required by Google before generating app passwords).</li>
              <li>Navigate to <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-[var(--color-teal)] font-bold underline">Google App Passwords</a>.</li>
              <li>Select App type and choose "Other (Custom Name)", name it (e.g., "Pitch Engine"), then click <strong>Create</strong>.</li>
              <li>Copy the 16-character code displayed in the highlighted bar.</li>
              <li>Paste this code into the <strong>App Password</strong> field in your credentials tab.</li>
            </ol>
          </div>
        </section>

        {/* Section 6 */}
        <section className="bg-[var(--color-canvas)] p-6 lg:p-8 border-4 border-black">
          <h2 className="metro-display text-xl lg:text-2xl mb-6 flex items-center gap-3 border-b-2 border-black pb-2 text-[var(--color-night)]">
            <Activity size={24} className="hidden lg:block text-[var(--color-teal)]" />
            6. The Dispatch Logs: Tracking Success
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-[var(--color-night)]/80">
            <p>The <strong>Dispatch Logs</strong> page tracks your active campaigns:</p>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Outbound Logs:</strong> View a detailed transmission log of every message sent, including timestamps and destination emails.</li>
              <li><strong>Inbox Replies (IMAP Sync):</strong> Switch to the <strong>"Inbox Replies"</strong> tab and click <strong>"Sync IMAP"</strong> to stream replies from your targets directly into the app. This performs a secure handshake using your saved local credentials.</li>
              <li><strong>Optimization:</strong> Analyze log response rates. When a specific campaign tone and credibility combination yields replies, save that profile configuration as a repeatable template.</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section className="bg-[var(--color-canvas)] p-6 lg:p-8 border-4 border-red-600">
          <h2 className="metro-display text-xl lg:text-2xl mb-6 flex items-center gap-3 border-b-2 border-red-600 pb-2 text-[var(--color-transit-red)]">
            <ShieldAlert size={24} className="hidden lg:block text-[var(--color-transit-red)]" />
            7. Final Disclaimer
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-[var(--color-transit-red)]/95">
            <p>This tool is a high-output outbound engine. Misuse (mass transmission without verification, ignoring opt-out requests, or utilizing stolen API keys) violates provider guidelines and regional anti-spam regulations. By deploying this software, you agree to remain accountable for your campaign volumes and to respect target communication preferences.</p>
            <p className="metro-display text-lg mt-4 uppercase">Compute Nodes Online. Happy Hunting.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
