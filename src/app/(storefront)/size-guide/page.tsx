"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const TABS = ["Men's Clothing", "Women's Clothing", "Kids' Clothing", "Footwear"] as const;
type Tab = typeof TABS[number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const MEN_TOPS = [
  { size: "XS", chest: "84–88", waist: "70–74", hip: "86–90" },
  { size: "S",  chest: "88–92", waist: "74–78", hip: "90–94" },
  { size: "M",  chest: "92–96", waist: "78–82", hip: "94–98" },
  { size: "L",  chest: "96–100", waist: "82–86", hip: "98–102" },
  { size: "XL", chest: "100–104", waist: "86–90", hip: "102–106" },
  { size: "XXL",chest: "104–110", waist: "90–96", hip: "106–112" },
];

const MEN_BOTTOMS = [
  { size: "30", waist: "76", hip: "96", inseam: "80" },
  { size: "32", waist: "81", hip: "100", inseam: "81" },
  { size: "34", waist: "86", hip: "104", inseam: "82" },
  { size: "36", waist: "91", hip: "108", inseam: "82" },
  { size: "38", waist: "96", hip: "112", inseam: "83" },
];

const WOMEN_TOPS = [
  { size: "XS", chest: "76–80", waist: "60–64", hip: "82–86" },
  { size: "S",  chest: "80–84", waist: "64–68", hip: "86–90" },
  { size: "M",  chest: "84–88", waist: "68–72", hip: "90–94" },
  { size: "L",  chest: "88–92", waist: "72–76", hip: "94–98" },
  { size: "XL", chest: "92–96", waist: "76–80", hip: "98–102" },
];

const WOMEN_BOTTOMS = [
  { size: "6",  waist: "60–64", hip: "85–89" },
  { size: "8",  waist: "64–68", hip: "89–93" },
  { size: "10", waist: "68–72", hip: "93–97" },
  { size: "12", waist: "72–76", hip: "97–101" },
  { size: "14", waist: "76–80", hip: "101–105" },
];

const KIDS = [
  { size: "3–4Y", height: "98–104", chest: "54–56", waist: "50–52" },
  { size: "5–6Y", height: "110–116", chest: "57–60", waist: "52–54" },
  { size: "7–8Y", height: "122–128", chest: "61–64", waist: "54–57" },
  { size: "9–10Y", height: "134–140", chest: "65–68", waist: "57–60" },
  { size: "11–12Y", height: "146–152", chest: "69–73", waist: "60–64" },
];

const SHOES = [
  { sa: "5", eu: "38", uk: "4", us_m: "5", us_f: "7", cm: "24" },
  { sa: "6", eu: "39", uk: "5", us_m: "6", us_f: "8", cm: "25" },
  { sa: "7", eu: "40", uk: "6", us_m: "7", us_f: "9", cm: "26" },
  { sa: "8", eu: "41", uk: "7", us_m: "8", us_f: "10", cm: "26.5" },
  { sa: "9", eu: "42", uk: "8", us_m: "9", us_f: "11", cm: "27.5" },
  { sa: "10", eu: "43", uk: "9", us_m: "10", us_f: "12", cm: "28" },
  { sa: "11", eu: "44", uk: "10", us_m: "11", us_f: "13", cm: "29" },
  { sa: "12", eu: "45", uk: "11", us_m: "12", us_f: "14", cm: "30" },
];

function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F9FAFB] border-b border-gray-100">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((row, i) => (
            <tr key={i} className={`${i === 0 ? "" : ""} hover:bg-gray-50 transition-colors`}>
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? "font-bold text-[#0D1B2A]" : "text-gray-500"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuidePage() {
  const [tab, setTab] = useState<Tab>("Men's Clothing");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <motion.div {...fadeUp()} className="mb-10">
        <div className="inline-flex items-center gap-2 bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-full px-4 py-1.5 mb-5">
          <span className="text-[#2ECC71] text-xs font-semibold tracking-widest uppercase">📏 Sizing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0D1B2A] leading-tight">Size Guide</h1>
        <p className="mt-4 text-gray-500 text-lg max-w-2xl leading-relaxed">
          All measurements are in centimetres (cm). We recommend measuring yourself and comparing to our size charts for the best fit.
        </p>
      </motion.div>

      {/* How to measure */}
      <motion.div {...fadeUp(0.1)} className="bg-[#F4F6F8] rounded-2xl p-6 mb-10">
        <h2 className="font-bold text-[#0D1B2A] mb-4">How to measure yourself</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
          {[
            { label: "Chest", desc: "Measure around the fullest part of your chest, keeping the tape horizontal." },
            { label: "Waist", desc: "Measure around your natural waistline, the narrowest part of your torso." },
            { label: "Hip", desc: "Measure around the fullest part of your hips and seat." },
            { label: "Inseam", desc: "Measure from your crotch down to your ankle bone along the inside of your leg." },
            { label: "Height", desc: "Stand straight against a wall without shoes and measure from floor to the top of your head." },
            { label: "Foot length", desc: "Place your foot on paper, trace it, and measure from the heel to the tip of your longest toe." },
          ].map(({ label, desc }) => (
            <div key={label}>
              <p className="font-semibold text-[#0D1B2A]">{label}</p>
              <p className="mt-0.5 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div {...fadeUp(0.15)}>
        <div className="flex gap-1 bg-[#F4F6F8] rounded-xl p-1 mb-8 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? "bg-white text-[#0D1B2A] shadow-sm" : "text-gray-400 hover:text-[#0D1B2A]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Men's Clothing" && (
          <div className="space-y-7">
            <div>
              <h3 className="font-bold text-[#0D1B2A] mb-3">Tops & Shirts</h3>
              <Table
                headers={["Size", "Chest (cm)", "Waist (cm)", "Hip (cm)"]}
                rows={MEN_TOPS.map((r) => [r.size, r.chest, r.waist, r.hip])}
              />
            </div>
            <div>
              <h3 className="font-bold text-[#0D1B2A] mb-3">Pants & Shorts (waist size)</h3>
              <Table
                headers={["Size", "Waist (cm)", "Hip (cm)", "Inseam (cm)"]}
                rows={MEN_BOTTOMS.map((r) => [r.size, r.waist, r.hip, r.inseam])}
              />
            </div>
          </div>
        )}

        {tab === "Women's Clothing" && (
          <div className="space-y-7">
            <div>
              <h3 className="font-bold text-[#0D1B2A] mb-3">Tops, Dresses & Jackets</h3>
              <Table
                headers={["Size", "Chest (cm)", "Waist (cm)", "Hip (cm)"]}
                rows={WOMEN_TOPS.map((r) => [r.size, r.chest, r.waist, r.hip])}
              />
            </div>
            <div>
              <h3 className="font-bold text-[#0D1B2A] mb-3">Skirts, Pants & Shorts (SA sizing)</h3>
              <Table
                headers={["SA Size", "Waist (cm)", "Hip (cm)"]}
                rows={WOMEN_BOTTOMS.map((r) => [r.size, r.waist, r.hip])}
              />
            </div>
          </div>
        )}

        {tab === "Kids' Clothing" && (
          <div>
            <h3 className="font-bold text-[#0D1B2A] mb-3">Kids' Clothing (all garments)</h3>
            <Table
              headers={["Age", "Height (cm)", "Chest (cm)", "Waist (cm)"]}
              rows={KIDS.map((r) => [r.size, r.height, r.chest, r.waist])}
            />
            <p className="text-xs text-gray-400 mt-3">Sizes are based on average measurements. If your child is between sizes, size up for growing room.</p>
          </div>
        )}

        {tab === "Footwear" && (
          <div>
            <h3 className="font-bold text-[#0D1B2A] mb-3">Shoe Size Conversion</h3>
            <Table
              headers={["SA / EU equivalent", "EU", "UK", "US Men's", "US Women's", "Length (cm)"]}
              rows={SHOES.map((r) => [r.sa, r.eu, r.uk, r.us_m, r.us_f, r.cm])}
            />
          </div>
        )}
      </motion.div>

      {/* Tip */}
      <motion.div {...fadeUp(0.25)} className="mt-10 bg-[#0D1B2A] rounded-2xl p-7 text-center">
        <p className="text-white font-semibold text-lg">Still not sure about your size?</p>
        <p className="text-white/50 text-sm mt-2 mb-5">Contact us and we'll help you find the perfect fit before you order.</p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 bg-[#2ECC71] hover:bg-[#27AE60] text-[#0D1B2A] font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Get sizing help
        </a>
      </motion.div>
    </div>
  );
}
