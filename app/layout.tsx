import React from "react";
import { Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "900"],
  variable: "--font-display",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "SortingSource | Outbound Infrastructure",
  description: "Industrial-grade lead acquisition, data extraction, and cold outreach infrastructure. Build a direct outbound pipeline.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${barlow.variable}`}>
      <body style={{ background: "#EDE8DC", color: "#1A1A1F" }}>
        {children}
      </body>
    </html>
  );
}