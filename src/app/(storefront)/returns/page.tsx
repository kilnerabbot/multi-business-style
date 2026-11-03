"use client";

import { motion } from "framer-motion";
import { RotateCcw, CheckCircle, XCircle, Clock, Package, Mail } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <motion.div {...fadeUp()} className="mb-12">
        <div className="inline-flex items-center gap-2 bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-full px-4 py-1.5 mb-5">
          <RotateCcw size={14} className="text-[#2ECC71]" />
          <span className="text-[#2ECC71] text-xs font-semibold tracking-widest uppercase">Returns Policy</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0D1B2A] leading-tight">
          Returns &amp; Exchanges
        </h1>
        <p className="mt-4 text-gray-500 text-lg leading-relaxed max-w-2xl">
          Not quite right? No stress. We offer a simple 30-day return and exchange policy on all eligible items.
        </p>
      </motion.div>

      {/* Key stats */}
      <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: Clock, label: "30 Days", desc: "to return from delivery date", color: "bg-blue-50 text-blue-600" },
          { icon: RotateCcw, label: "Free Exchanges", desc: "on same-value items", color: "bg-green-50 text-green-600" },
          { icon: Package, label: "Easy Process", desc: "drop-off or collection", color: "bg-purple-50 text-purple-600" },
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

      <div className="space-y-8">
        {/* Eligibility */}
        <motion.div {...fadeUp(0.15)} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
          <h2 className="text-xl font-bold text-[#0D1B2A] mb-5">What can be returned?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <CheckCircle size={14} /> Eligible for return
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  "Unworn and unwashed items",
                  "Original tags still attached",
                  "Original packaging intact",
                  "Returned within 30 days of delivery",
                  "Accompanied by proof of purchase",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <XCircle size={14} /> Not eligible
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  "Worn, washed, or altered items",
                  "Items without original tags",
                  "Sale or clearance items",
                  "Underwear and swimwear (hygiene)",
                  "Items returned after 30 days",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* How to return */}
        <motion.div {...fadeUp(0.2)} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
          <h2 className="text-xl font-bold text-[#0D1B2A] mb-6">How to return or exchange</h2>
          <div className="space-y-5">
            {[
              { step: "01", title: "Contact us", desc: "Email returns@multibusinessstyle.co.za with your order number and reason for return. We'll respond within 1 business day." },
              { step: "02", title: "Get your return label", desc: "We'll email you a return authorisation number and drop-off or collection instructions." },
              { step: "03", title: "Package your item", desc: "Securely pack the item in its original packaging with all tags attached. Include your return authorisation number inside." },
              { step: "04", title: "Drop off or schedule collection", desc: "For Johannesburg orders we can arrange a collection. For other provinces, drop off at your nearest courier point." },
              { step: "05", title: "Refund or exchange processed", desc: "Once we receive and inspect the item (2–3 business days), your refund or exchange will be processed within 5–7 business days." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2ECC71]/15 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#2ECC71]">{step}</span>
                </div>
                <div>
                  <p className="font-semibold text-[#0D1B2A]">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Refunds */}
        <motion.div {...fadeUp(0.25)} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
          <h2 className="text-xl font-bold text-[#0D1B2A] mb-4">Refunds</h2>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>Approved refunds are issued to your original payment method via PayFast within <strong className="text-[#0D1B2A]">5–7 business days</strong> of us receiving the returned item.</p>
            <p>If you paid by EFT or credit card, your bank may take an additional 2–3 days to reflect the credit.</p>
            <p>Original delivery fees are <strong className="text-[#0D1B2A]">non-refundable</strong> unless the item was faulty or incorrectly sent.</p>
          </div>
        </motion.div>

        {/* Faulty items */}
        <motion.div {...fadeUp(0.3)} className="bg-[#FFF7ED] border border-orange-100 rounded-2xl p-7">
          <h2 className="text-xl font-bold text-[#0D1B2A] mb-3">Received a faulty or incorrect item?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            If your item arrived damaged, defective, or different from what you ordered, we'll cover all return costs and either replace the item or issue a full refund — your choice.
          </p>
          <a
            href="mailto:returns@multibusinessstyle.co.za"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D1B2A] bg-[#2ECC71] hover:bg-[#27AE60] px-5 py-2.5 rounded-xl transition-colors"
          >
            <Mail size={15} /> Email us immediately
          </a>
        </motion.div>
      </div>
    </div>
  );
}
