import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fonts are bundled with the site so builds never depend on Google Fonts being reachable.
const inter = localFont({ src: "./fonts/inter-latin-wght-normal.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });
const playfair = localFont({ src: "./fonts/playfair-display-latin-wght-normal.woff2", variable: "--font-playfair", weight: "400 900", display: "swap" });
const mono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono-label",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Multi Business Style | South African Fashion",
  description: "Shop the latest fashion trends for men, women and kids. Multi Business Style — your style, your way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${mono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
