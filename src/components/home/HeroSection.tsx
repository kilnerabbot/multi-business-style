"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  items: { image: string; slug: string; name: string }[];
}

export default function HeroSection({ items }: HeroProps) {

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E9DCC8] via-[#DCC8AB] to-[#CDB591]">
      {/* soft window-light shapes */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-[18%] w-[34rem] h-[48rem] bg-white/20 rotate-[14deg] blur-2xl" />
        <div className="absolute top-10 right-[6%] w-40 h-[40rem] bg-white/15 rotate-[14deg] blur-xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-[1.1fr_1fr] items-center min-h-[34rem] lg:min-h-[41rem] py-14 lg:py-0">
        <motion.div className="max-w-xl" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
          <motion.p variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }} className="font-label text-[0.78rem] text-[#6B4A2B] mb-6">New season</motion.p>
          <motion.h1 variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }} className="font-display text-[2.9rem] sm:text-[4rem] lg:text-[4.6rem] leading-[1.04] text-black">
            Dressed for the day
            <span className="block text-[#7A5230]">you&apos;re having.</span>
          </motion.h1>
          <motion.p variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }} className="mt-7 text-[1.02rem] leading-relaxed text-neutral-800 max-w-md">
            Everyday clothing and accessories for men, women and kids, chosen to wear hard and look good doing it.
          </motion.p>
          <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }} className="mt-9 flex flex-wrap items-center gap-6">
            <Link href="/shop" className="btn-ink">Shop the edit</Link>
            <Link href="/shop/sale" className="text-[0.95rem] text-black underline underline-offset-4 decoration-black/30 hover:decoration-black">
              See what&apos;s on sale
            </Link>
          </motion.div>
        </motion.div>

        {/* Product pair, or quiet placeholder panels until images exist */}
        <div className="hidden lg:flex justify-end gap-5 items-end h-full pt-12">
          {[items[0], items[1]].map((it, i) => {
            const cls = `relative w-[17rem] overflow-hidden rounded-3xl bg-[#F4EBDC] ${i === 0 ? "h-[27rem]" : "h-[31rem]"}`;
            const img = it && (
              <Image src={it.image} alt={it.name} fill priority={i === 0} sizes="272px" className="object-cover" />
            );
            return it ? (
              <motion.div
                key={i}
                className={i === 1 ? "mb-10" : ""}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
              >
                <Link href={`/products/${it.slug}`} className={cls}>{img}</Link>
              </motion.div>
            ) : (
              <div key={i} className={`${cls} ${i === 1 ? "mb-10" : ""}`} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
