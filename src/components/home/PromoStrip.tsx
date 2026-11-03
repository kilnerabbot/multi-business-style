"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const PERKS = [
  { icon: Truck, label: "Free delivery", desc: "On orders over R1,000" },
  { icon: RotateCcw, label: "Easy returns", desc: "30-day return policy" },
  { icon: ShieldCheck, label: "Secure checkout", desc: "PayFast protected" },
  { icon: Headphones, label: "SA support", desc: "Mon–Fri, 8am–5pm" },
];

export default function PromoStrip() {
  return (
    <section className="bg-[#F4F6F8] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {PERKS.map((perk, i) => (
            <motion.div
              key={perk.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#2ECC71]/15 flex items-center justify-center">
                <perk.icon size={18} className="text-[#2ECC71]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0D1B2A]">{perk.label}</p>
                <p className="text-xs text-gray-400">{perk.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
