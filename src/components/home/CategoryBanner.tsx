"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    label: "Men",
    href: "/shop/men",
    bg: "from-[#1a2f45] to-[#0D1B2A]",
    accent: "#2ECC71",
    desc: "Sharp. Bold. Effortless.",
  },
  {
    label: "Women",
    href: "/shop/women",
    bg: "from-[#1f1a2e] to-[#0D1B2A]",
    accent: "#a78bfa",
    desc: "Elegant. Expressive. Iconic.",
  },
  {
    label: "Kids",
    href: "/shop/kids",
    bg: "from-[#1a2e2a] to-[#0D1B2A]",
    accent: "#34d399",
    desc: "Fun. Colourful. Durable.",
  },
  {
    label: "Accessories",
    href: "/shop/accessories",
    bg: "from-[#2e2a1a] to-[#0D1B2A]",
    accent: "#fbbf24",
    desc: "The finishing touch.",
  },
];

export default function CategoryBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1B2A]">Shop by Category</h2>
        <p className="text-gray-400 mt-2">Find exactly what you're looking for</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              href={cat.href}
              className={`group relative block rounded-2xl overflow-hidden bg-gradient-to-br ${cat.bg} h-52 sm:h-64`}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-xl"
                style={{ background: cat.accent }}
              />
              {/* Border shimmer */}
              <div
                className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-opacity-30 transition-all duration-300"
                style={{ borderColor: `${cat.accent}30` }}
              />

              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <p className="text-xs font-medium mb-1" style={{ color: cat.accent }}>
                  {cat.desc}
                </p>
                <h3 className="text-white text-2xl font-extrabold">{cat.label}</h3>
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  style={{ color: cat.accent }}
                >
                  Shop now <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
