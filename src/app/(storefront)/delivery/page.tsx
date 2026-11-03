"use client";

import { motion } from "framer-motion";
import { Truck, MapPin, Clock, CheckCircle, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const RATES = [
  { zone: "Johannesburg (own delivery)", type: "Own Delivery", rate: 60, freeAbove: 1000, days: "1–2 business days", highlight: true },
  { zone: "Gauteng (other areas)", type: "Courier", rate: 80, freeAbove: 1000, days: "2–3 business days", highlight: false },
  { zone: "Western Cape", type: "Courier", rate: 130, freeAbove: 1200, days: "3–5 business days", highlight: false },
  { zone: "KwaZulu-Natal", type: "Courier", rate: 110, freeAbove: 1200, days: "3–5 business days", highlight: false },
  { zone: "Eastern Cape", type: "Courier", rate: 120, freeAbove: 1200, days: "4–6 business days", highlight: false },
  { zone: "Free State", type: "Courier", rate: 100, freeAbove: 1000, days: "3–5 business days", highlight: false },
  { zone: "Limpopo", type: "Courier", rate: 130, freeAbove: 1200, days: "4–6 business days", highlight: false },
  { zone: "Mpumalanga", type: "Courier", rate: 120, freeAbove: 1200, days: "3–5 business days", highlight: false },
  { zone: "North West", type: "Courier", rate: 110, freeAbove: 1200, days: "3–5 business days", highlight: false },
  { zone: "Northern Cape", type: "Courier", rate: 150, freeAbove: 1500, days: "5–7 business days", highlight: false },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function DeliveryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <motion.div {...fadeUp()} className="mb-12">
        <div className="inline-flex items-center gap-2 bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-full px-4 py-1.5 mb-5">
          <Truck size={14} className="text-[#2ECC71]" />
          <span className="text-[#2ECC71] text-xs font-semibold tracking-widest uppercase">Delivery Info</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0D1B2A] leading-tight">
          Delivery Information
        </h1>
        <p className="mt-4 text-gray-500 text-lg leading-relaxed max-w-2xl">
          We deliver across all 9 provinces of South Africa. Johannesburg orders are fulfilled by our own delivery team — fast, reliable, and personal.
        </p>
      </motion.div>

      {/* Highlights */}
      <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: Truck, label: "Nationwide delivery", desc: "All 9 SA provinces covered", color: "bg-blue-50 text-blue-600" },
          { icon: CheckCircle, label: "Free delivery", desc: "On qualifying orders", color: "bg-green-50 text-green-600" },
          { icon: Clock, label: "1–7 business days", desc: "Depending on your province", color: "bg-yellow-50 text-yellow-600" },
        ].map(({ icon: Icon, label, desc, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="font-bold text-[#0D1B2A]">{label}</p>
            <p className="text-sm text-gray-400 mt-0.5">{desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Rates table */}
      <motion.div {...fadeUp(0.15)} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100 bg-[#F9FAFB]">
          <h2 className="text-lg font-bold text-[#0D1B2A]">Delivery Rates by Province</h2>
          <p className="text-sm text-gray-400 mt-0.5">All prices include VAT</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="px-6 py-3 font-semibold">Zone / Province</th>
                <th className="px-6 py-3 font-semibold">Rate</th>
                <th className="px-6 py-3 font-semibold">Free above</th>
                <th className="px-6 py-3 font-semibold">Est. delivery</th>
                <th className="px-6 py-3 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RATES.map((r) => (
                <tr
                  key={r.zone}
                  className={r.highlight ? "bg-[#2ECC71]/5" : "hover:bg-gray-50 transition-colors"}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className={r.highlight ? "text-[#2ECC71]" : "text-gray-300"} />
                      <span className={`font-medium ${r.highlight ? "text-[#0D1B2A]" : "text-gray-700"}`}>
                        {r.zone}
                      </span>
                      {r.highlight && (
                        <span className="text-xs font-semibold text-[#2ECC71] bg-[#2ECC71]/15 px-2 py-0.5 rounded-full">
                          Our fleet
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-[#0D1B2A]">{formatPrice(r.rate)}</td>
                  <td className="px-6 py-3.5 text-[#2ECC71] font-medium">{formatPrice(r.freeAbove)}</td>
                  <td className="px-6 py-3.5 text-gray-500">{r.days}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.highlight ? "bg-[#2ECC71]/15 text-[#27AE60]" : "bg-gray-100 text-gray-500"}`}>
                      {r.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div {...fadeUp(0.2)} className="space-y-4">
        <h2 className="text-xl font-bold text-[#0D1B2A] mb-5">Frequently asked questions</h2>
        {[
          {
            q: "When will my order ship?",
            a: "Orders placed before 12:00 PM on business days are processed the same day. Orders placed after 12:00 PM or on weekends are processed the next business day.",
          },
          {
            q: "How do I know if I'm in the Johannesburg delivery zone?",
            a: "At checkout, enter your suburb and select 'Gauteng' as your province. If your suburb is in our JHB delivery zone, it will automatically show our own-delivery rate and faster delivery window.",
          },
          {
            q: "Can I track my order?",
            a: "Yes! Once your order has been dispatched, you'll receive a tracking number by email. You can also check your order status from your account dashboard.",
          },
          {
            q: "What if no one is home at delivery?",
            a: "For our own JHB deliveries, our driver will call ahead. For courier deliveries, the courier will attempt redelivery or leave a collection card at your nearest courier depot.",
          },
          {
            q: "Do you deliver to farms or rural areas?",
            a: "We deliver to all physical addresses. Delivery to farm or rural areas may take 1–2 extra days and may require a surcharge — we'll contact you if this applies.",
          },
        ].map(({ q, a }) => (
          <div key={q} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <p className="font-semibold text-[#0D1B2A] mb-2">{q}</p>
            <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div {...fadeUp(0.25)} className="mt-10 bg-[#0D1B2A] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div>
          <p className="text-white font-bold text-lg">Still have questions?</p>
          <p className="text-white/50 text-sm mt-1">Our team is happy to help with your delivery query.</p>
        </div>
        <a
          href="/contact"
          className="flex-shrink-0 bg-[#2ECC71] hover:bg-[#27AE60] text-[#0D1B2A] font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
        >
          <Package size={16} /> Contact Us
        </a>
      </motion.div>
    </div>
  );
}
