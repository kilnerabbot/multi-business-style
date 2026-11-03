"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const PANELS = [
  {
    id: "men",
    label: "Men",
    sub: "New Collection",
    href: "/shop/men",
    img: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=900&h=1200&fit=crop&crop=top",
    accent: "#2ECC71",
    span: "row-span-2", // tall left panel
  },
  {
    id: "women",
    label: "Women",
    sub: "Fresh Arrivals",
    href: "/shop/women",
    img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=900&h=700&fit=crop&crop=top",
    accent: "#a78bfa",
    span: "row-span-1",
  },
  {
    id: "kids",
    label: "Kids",
    sub: "Bright Styles",
    href: "/shop/kids",
    img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=900&h=700&fit=crop&crop=top",
    accent: "#34d399",
    span: "row-span-1",
  },
];

export default function HeroSection() {
  return (
    <section className="w-full bg-[#0D1B2A]">
      {/* Top banner strip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-white/10"
      >
        <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium hidden sm:block">
          New Season — 2026
        </p>
        <h2 className="text-white font-extrabold text-sm sm:text-base tracking-widest uppercase">
          Your Style, <span className="text-[#2ECC71]">Your Way.</span>
        </h2>
        <Link
          href="/shop"
          className="flex items-center gap-1 text-xs font-semibold text-[#2ECC71] hover:text-white transition-colors uppercase tracking-widest"
        >
          Shop All <ArrowUpRight size={12} />
        </Link>
      </motion.div>

      {/* Editorial grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-[auto] sm:grid-rows-2 h-[85vh] sm:h-[88vh] min-h-[520px]">

        {/* Left — Men (tall, spans 2 rows) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative sm:row-span-2 overflow-hidden group cursor-pointer"
          style={{ minHeight: "320px" }}
        >
          <Link href="/shop/men" className="block w-full h-full">
            <Image
              src={PANELS[0].img}
              alt="Men's Collection"
              fill
              priority
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Dark gradient at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.25em] mb-1">
                  {PANELS[0].sub}
                </p>
                <h3 className="text-white font-extrabold text-4xl sm:text-5xl uppercase leading-none tracking-tight">
                  {PANELS[0].label}
                </h3>
                <div className="mt-4 inline-flex items-center gap-2 border border-white/30 hover:border-[#2ECC71] hover:bg-[#2ECC71] hover:text-[#0D1B2A] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 transition-all duration-300 group/btn">
                  Shop Now
                  <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            </div>

            {/* Accent line on hover */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom"
              style={{ backgroundColor: PANELS[0].accent }}
            />
          </Link>
        </motion.div>

        {/* Top-right — Women */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="relative overflow-hidden group cursor-pointer border-l border-white/5"
          style={{ minHeight: "260px" }}
        >
          <Link href="/shop/women" className="block w-full h-full">
            <Image
              src={PANELS[1].img}
              alt="Women's Collection"
              fill
              priority
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 p-5 sm:p-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.25em] mb-1">
                  {PANELS[1].sub}
                </p>
                <h3 className="text-white font-extrabold text-3xl sm:text-4xl uppercase leading-none tracking-tight">
                  {PANELS[1].label}
                </h3>
              </motion.div>
            </div>

            <div
              className="absolute left-0 top-0 bottom-0 w-1 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom"
              style={{ backgroundColor: PANELS[1].accent }}
            />
          </Link>
        </motion.div>

        {/* Bottom-right — Kids */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative overflow-hidden group cursor-pointer border-l border-white/5 border-t border-t-white/5"
          style={{ minHeight: "260px" }}
        >
          <Link href="/shop/kids" className="block w-full h-full">
            <Image
              src={PANELS[2].img}
              alt="Kids' Collection"
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 p-5 sm:p-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.25em] mb-1">
                  {PANELS[2].sub}
                </p>
                <h3 className="text-white font-extrabold text-3xl sm:text-4xl uppercase leading-none tracking-tight">
                  {PANELS[2].label}
                </h3>
              </motion.div>
            </div>

            {/* Bottom-right: sale badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="absolute top-5 right-5"
            >
              <Link
                href="/shop/sale"
                className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-[#2ECC71] text-[#0D1B2A] font-extrabold text-xs uppercase tracking-tight leading-tight hover:scale-110 transition-transform text-center"
              >
                <span>Up to</span>
                <span className="text-base leading-none">40%</span>
                <span>off</span>
              </Link>
            </motion.div>

            <div
              className="absolute left-0 top-0 bottom-0 w-1 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom"
              style={{ backgroundColor: PANELS[2].accent }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
