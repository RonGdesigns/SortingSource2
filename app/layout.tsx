import React from "react";
import { Inter, Fira_Code, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fira = Fira_Code({ subsets: ["latin"], variable: "--font-fira" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "SortingSource | Cloud Infrastructure",
  description: "Enterprise data harvesting and outreach infrastructure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${fira.variable} ${playfair.variable} font-sans bg-[#0A0A0A] text-white flex min-h-screen selection:bg-white selection:text-black`}>
        {children}
      </body>
    </html>
  );
}