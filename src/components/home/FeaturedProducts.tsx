"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
  title: string;
  subtitle?: string;
  viewAllHref: string;
}

export default function FeaturedProducts({
  products,
  title,
  subtitle,
  viewAllHref,
}: FeaturedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1B2A]">{title}</h2>
          {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <Link
          href={viewAllHref}
          className="group hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#0D1B2A] hover:text-[#2ECC71] transition-colors"
        >
          View all
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile view all */}
      <div className="sm:hidden mt-8 text-center">
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-2 border border-[#0D1B2A] text-[#0D1B2A] font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-[#0D1B2A] hover:text-white transition-all"
        >
          View all {title} <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
