"use client";

import React from "react";
import { BookOpen, ShieldAlert, Cpu, Mail, HardDrive, Key } from "lucide-react";

export default function InstructionsPage() {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-neutral-100 text-black p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-12 pb-24">
        
        {/* Header */}
        <div className="border-b-4 border-black pb-8">
          <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter mb-4 flex items-center gap-4">
            <BookOpen size={40} className="hidden lg:block" />
            Operator's Manual
          </h1>
          <p className="text-lg lg:text-xl font-mono">Pitch Engine v2.1</p>
        </div>

        {/* Section 1 */}
        <section className="bg-white p-6 lg:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl lg:text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b-2 border-black pb-2">
            <HardDrive size={24} className="hidden lg:block" />
            1. The BYOK (Bring Your Own Key) Infrastructure
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed">
            <p>SortingSource is a standalone, local-first lead generation and outreach architecture. Unlike traditional SaaS, you own the engine.</p>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Accountability:</strong> By downloading and entering your API keys, you accept full responsibility for your outreach actions. You are solely accountable for compliance with anti-spam laws (CAN-SPAM, TCPA) and the terms of service of your API providers.</li>
              <li><strong>System Longevity & Self-Updating:</strong> SortingSource is engineered to be future-proof. You do not need to wait for manual software updates to deploy the latest language models. By using the <strong>Model Override</strong> section in the sidebar, you can manually input new model strings (e.g., <code>gemini-2.5-pro</code> or <code>gpt-4o-mini</code>, or <code>specific Hugging Face paths</code>) as they are released by providers.</li>
              <li><strong>Factory Defaults:</strong> If the Model Override fields are left blank, the engine automatically reverts to factory-tested "Compatible Models" (<code>gemini-2.5-flash</code>, <code>gpt-4o-mini</code> and <code>Qwen 2.5 72B Instruct</code>) to ensure your operation never goes offline.</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 lg:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl lg:text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b-2 border-black pb-2">
            <Key size={24} className="hidden lg:block" />
            2. Setup: Obtaining Your API Keys
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed">
            <p>To fuel the engine, you must link your own provider accounts:</p>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Google Places API:</strong> Used for the "Hunter" module. <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-blue-600 underline font-bold hover:text-blue-800">Create Key Here</a>.</li>
              <li><strong>Gemini API (Google):</strong> Primary text generation engine. <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-600 underline font-bold hover:text-blue-800">Create Key Here</a>.</li>
              <li><strong>OpenAI (ChatGPT):</strong> Secondary synthesis option. <a href="https://platform.openai.com/api-keys" target="_blank" className="text-blue-600 underline font-bold hover:text-blue-800">Create Key Here</a>.</li>
              <li><strong>Hugging Face:</strong> Open-source synthesis engine. <a href="https://huggingface.co/settings/tokens" target="_blank" className="text-blue-600 underline font-bold hover:text-blue-800">Obtain your Inference API Token Here</a>.</li>
              <li><strong>Gmail SMTP:</strong> To send emails, you <strong>must</strong> use a <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-blue-600 underline font-bold hover:text-blue-800">Google App Password</a>.</li>
              <li><strong>Twilio:</strong> Sign up at <a href="https://www.twilio.com/" target="_blank" className="text-blue-600 underline font-bold hover:text-blue-800">Twilio.com</a> for the SMS Gateway (Account SID, Auth Token, and Twilio Number). On your Console Dashboard, locate your <strong>Account SID</strong> and <strong>Auth Token</strong>.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 lg:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl lg:text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b-2 border-black pb-2">
            <Cpu size={24} className="hidden lg:block" />
            3. The Search Dashboard (Target Hunter)
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed">
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Power Search:</strong> Scrapes Google Places + Business Websites. Note: Deep verification may delay results by 5–10 seconds; this is necessary to bypass bot detection.</li>
              <li><strong>Accumulate & Skip Known:</strong> Use these together. <strong>Accumulate</strong> grows your list across multiple searches, while <strong>Skip Known</strong> ensures you never pull (or pay for) a lead you already have in your database.</li>
              <li><strong>Tech Audit:</strong> Scans for missing SSL certificates, mobile optimization issues, and missing tracking pixels.</li>
              <li><strong>Remember Keys:</strong> Toggling this encrypts and saves your Google API keys to your local machine so you don't have to re-enter them upon restart.</li>
            </ul>
            
            <div className="mt-8 p-4 bg-yellow-100 border-2 border-black">
              <h3 className="font-bold uppercase text-lg mb-2">Best Practice: The "Rule of 60"</h3>
              <p className="mb-2">While the engine can handle larger batches, we recommend running searches in increments of <strong>60 leads at a time</strong>.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Why?</strong> Smaller, frequent batches maintain higher data integrity and prevent API timeouts.</li>
                <li><strong>The Strategy:</strong> Use <strong>Accumulate</strong> and <strong>Skip Known</strong> together. Run 60 leads for one niche, then change the city or niche and run another 60. The table will grow into a clean, massive outreach list without any duplicates.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 lg:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl lg:text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b-2 border-black pb-2">
            <Mail size={24} className="hidden lg:block" />
            4. The Pitch Engine: Crafting the Message
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed">
            <p>This is where your persona is built. The engine drafts your emails and texts based <em>entirely</em> on the context you provide here.</p>
            
            <h3 className="font-bold uppercase mt-6 mb-2 text-lg">Input Fields & Impact</h3>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Your Name & Role:</strong> Be specific. Instead of "Marketing Guy," use "Growth Consultant for HVAC Companies."</li>
              <li><strong>Credibility (The Hook):</strong> This is the most important field. Mention specific wins, such as "Helping 5 local firms double their bookings last quarter."</li>
              <li><strong>Core Offer:</strong> Be direct. "Photographer" or "Google Maps Optimization."</li>
              <li><strong>Writing Tone:</strong> Choose a style that matches your brand. "Punchy & Short" works best for SMS, while "Consultative" is better for high-ticket Email.</li>
            </ul>
            
            <div className="mt-6 p-4 bg-black text-white border-2 border-black">
              <strong>PRO-TIP:</strong> Better thoughts lead to better emails. If you provide vague inputs, the engine will produce vague emails. Spend 5 minutes deeply defining your offer and credibility; it will result in thousands of high-converting drafts.
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-white p-6 lg:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl lg:text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b-2 border-black pb-2">
            <ShieldAlert size={24} className="hidden lg:block" />
            5. Security, Network & Dispatch
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed">
            
            <h3 className="font-bold uppercase mt-6 mb-2 text-lg">Jitter Delay: The Anti-Spam Shield</h3>
            <p>The <strong>Jitter Delay</strong> (adjustable slider) adds a random wait time between each message sent.</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>The Purpose:</strong> This is your shield. It injects randomized pauses (e.g., 30–90 seconds) between messages. Without this, your email domain or Twilio number will be flagged as spam within minutes.</li>
              <li><strong>Recommendation:</strong> Set this between <strong>30–60 seconds</strong>. This mimics human typing speeds and keeps your sender reputation healthy.</li>
            </ul>

            <h3 className="font-bold uppercase mt-6 mb-2 text-lg">Email & SMS Settings</h3>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>SMTP Server:</strong> For Gmail, use <code>smtp.gmail.com</code> and port <code>587</code>. You <strong>must</strong> use a "Google App Password," not your regular login password.</li>
              <li><strong>SMS Mode:</strong> When toggled, the engine swaps to the Twilio gateway. The engine will automatically shorten its output to remain compatible with standard text message limits.</li>
            </ul>

            <h3 className="font-bold uppercase mt-6 mb-2 text-lg">The Local Vault (Sensitive Data Storage):</h3>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Clicking <strong>Save to Vault</strong> (the yellow floppy disk icon) encrypts and stores your <strong>API Keys, SMTP/IMAP credentials, and Sender Email</strong> to your local machine.</li>
              <li><strong>Note on Storage:</strong> This data is written to your local hardware (localStorage). It is persistent across restarts but remains strictly on your device; no sensitive keys are ever sent to a third-party cloud.</li>
            </ul>

            <h3 className="font-bold uppercase mt-6 mb-2 text-lg">IMAP & SMTP Reference (Inbound/Outbound):</h3>
            <p>To ensure the engine can both send pitches and detect replies, use the following server configurations in the "Security & Provider" tab:</p>
            
            <div className="overflow-x-auto my-6">
              <table className="w-full text-left border-collapse border-4 border-black min-w-[500px]">
                <thead>
                  <tr className="bg-black text-white uppercase">
                    <th className="p-3 border-b-2 border-black">Provider</th>
                    <th className="p-3 border-b-2 border-black">SMTP Server (Outbound)</th>
                    <th className="p-3 border-b-2 border-black">IMAP Server (Inbound)</th>
                    <th className="p-3 border-b-2 border-black">Port</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b-2 border-black">
                    <td className="p-3 font-bold border-r-2 border-black">Gmail</td>
                    <td className="p-3 border-r-2 border-black">smtp.gmail.com</td>
                    <td className="p-3 border-r-2 border-black">imap.gmail.com</td>
                    <td className="p-3">587</td>
                  </tr>
                  <tr className="border-b-2 border-black">
                    <td className="p-3 font-bold border-r-2 border-black">Outlook / Office 365</td>
                    <td className="p-3 border-r-2 border-black">smtp.office365.com</td>
                    <td className="p-3 border-r-2 border-black">outlook.office365.com</td>
                    <td className="p-3">587</td>
                  </tr>
                  <tr className="border-b-2 border-black">
                    <td className="p-3 font-bold border-r-2 border-black">Yahoo Mail</td>
                    <td className="p-3 border-r-2 border-black">smtp.mail.yahoo.com</td>
                    <td className="p-3 border-r-2 border-black">imap.mail.yahoo.com</td>
                    <td className="p-3">587</td>
                  </tr>
                  <tr className="border-b-2 border-black">
                    <td className="p-3 font-bold border-r-2 border-black">iCloud</td>
                    <td className="p-3 border-r-2 border-black">smtp.mail.me.com</td>
                    <td className="p-3 border-r-2 border-black">imap.mail.me.com</td>
                    <td className="p-3">587</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold border-r-2 border-black">AOL</td>
                    <td className="p-3 border-r-2 border-black">smtp.aol.com</td>
                    <td className="p-3 border-r-2 border-black">imap.aol.com</td>
                    <td className="p-3">587</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="font-bold uppercase mt-8 mb-2 text-lg">Google App Passwords: The Secure Gateway for Automation</h3>
            <p className="mb-4">To ensure your <strong>Pitch Engine</strong> can send emails through your Gmail account, you must use a <strong>Google App Password</strong>. Because the engine is a third-party application, Google’s standard security will block it unless you provide this specific 16-digit authorization code.</p>
            
            <p className="font-bold underline mb-2">How it Works</p>
            <p className="mb-4">A Google App Password is a unique security code that gives a non-Google app permission to access your account without requiring your master password or a 2-Step Verification prompt.</p>
            
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>Purpose:</strong> Standard passwords are often blocked by Google when used in automated scripts for security reasons. The App Password acts as a "key" designed specifically for one device or app.</li>
              <li><strong>Prerequisite:</strong> You <strong>must</strong> have <strong>2-Step Verification</strong> (Two-Factor Authentication) turned on in your Google Account settings before the option to create an App Password will appear.</li>
              <li><strong>Security:</strong> If you ever stop using the engine or suspect your keys are compromised, you can revoke the specific App Password at any time without having to change your main Google password.</li>
            </ul>

            <p className="font-bold underline mb-2">Setup Link</p>
            <p className="mb-4">You can generate and manage your codes directly at the official Google Security portal:<br/>
            <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-blue-600 font-bold hover:text-blue-800 underline block mt-2">Generate Google App Passwords</a></p>

            <p className="font-bold underline mb-2">Steps to Generate</p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Click the link above and sign in to your Google Account.</li>
              <li>Enter a name for the app (e.g., "Pitch Engine").</li>
              <li>Click <strong>Create</strong>.</li>
              <li>Copy the <strong>16-character code</strong> displayed in the yellow bar.<br/>
              <em>○ Note: Google will only show this code once. If you lose it, you must delete it and create a new one.</em></li>
              <li>Paste this code into the <strong>App Password</strong> field in your Pitch Engine "Security & Network" tab.</li>
            </ol>

            <a href="https://support.google.com/accounts/answer/185833?hl=en" target="_blank" className="text-blue-600 font-bold hover:text-blue-800 underline block mb-4">How to Create Google App Passwords for SMTP (Google Support)</a>
            <p>This page provides a step-by-step walkthrough on setting up 2-Step Verification and generating the specific 16-digit code required for SMTP email automation.</p>

          </div>
        </section>

        {/* Section 6 */}
        <section className="bg-white p-6 lg:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl lg:text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b-2 border-black pb-2">
            <Activity size={24} className="hidden lg:block" />
            6. The Dispatch Logs: Tracking Success
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed">
            <p>The <strong>Dispatch Logs</strong> page is your audit trail.</p>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Outbound Logs:</strong> View a "Payload Intercept" of every message sent, including timestamp and target email.</li>
              <li><strong>Inbox Replies (IMAP Sync):</strong> Switch to the <strong>"Inbox Replies"</strong> tab and click <strong>"Sync IMAP"</strong> to stream replies from your leads directly into the app. This uses the credentials saved in your Security Vault to perform a secure handshake with your email provider.</li>
              <li><strong>UI Customization:</strong> Use the <strong>Palette</strong> selector in the header to switch between 15 different color themes (Cyan, Emerald, Amber, Rose, etc.) or the "Default" stealth mode.</li>
              <li><strong>Optimization:</strong> Review your logs to see which "Core Offers" or "Writing Tones" are getting the best response rates. If one campaign is "✅ SENT" and getting replies, save that persona as a template.</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section className="bg-white p-6 lg:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl lg:text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b-2 border-black pb-2">
            <Activity size={24} className="hidden lg:block" />
            7. Maintenance & API Compatibility
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed">
            <p>This is a standalone, local-first program.</p>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Standalone Nature:</strong> There is no "Cloud" component. You own the software and the data.</li>
              <li><strong>Dynamic Model Compatibility:</strong> API models (like Gemini or GPT) change frequently. Unlike other software, you do not need to wait for a patch for model name changes. Simply use the <strong>Model Override</strong> tool in the sidebar to point the engine to the newest version strings provided by Google or OpenAI.</li>
              <li><strong>Patches & Support:</strong> If the app is absolutely not working due to a structural API shift or engine failure, contact the developer at: <strong>ronGdesigns313@gmail.com</strong>.</li>
              <li><strong>The Process:</strong> If a core structural update is required, you will receive a notification to download the updated .exe. Your local database (<code>outbound_crm.db</code>) will remain untouched so you never lose your leads.</li>
            </ul>
          </div>
        </section>

        {/* Section 8 */}
        <section className="bg-red-100 p-6 lg:p-8 border-4 border-red-600 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]">
          <h2 className="text-xl lg:text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b-2 border-red-600 pb-2 text-red-700">
            <ShieldAlert size={24} className="hidden lg:block" />
            8. Final Disclaimer
          </h2>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-red-900">
            <p>This tool is a high-output engine. Misuse (spamming without intent, ignoring opt-outs, or utilizing stolen keys) is strictly prohibited by the terms of service of your API providers. By using this software, you agree to be accountable for your own actions and to respect the communication boundaries of the businesses you contact.</p>
            <p className="font-black text-lg mt-4 uppercase">Systems Online. Happy Hunting.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
