"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryHeroProps {
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  accent: string;
  tag?: string;
  cta?: { label: string; href: string };
}

export default function CategoryHero({
  title,
  subtitle,
  description,
  gradient,
  accent,
  tag,
  cta,
}: CategoryHeroProps) {
  return (
    <section className={`relative overflow-hidden ${gradient} py-20 sm:py-28`}>
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
      {/* Glow blob */}
      <div
        className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
        style={{ background: accent }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          {tag && (
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5 border"
              style={{ color: accent, borderColor: `${accent}40`, background: `${accent}15` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
              {tag}
            </span>
          )}
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: accent }}>
            {subtitle}
          </p>
          <h1 className="text-5xl sm:text-6xl font-display font-medium text-white leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-white/60 text-lg leading-relaxed">{description}</p>
          {cta && (
            <Link
              href={cta.href}
              className="group mt-7 inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg"
              style={{ background: accent, color: "#111111" }}
            >
              {cta.label}
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
