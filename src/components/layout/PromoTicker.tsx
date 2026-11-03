"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

type TickerProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  images: string[];
};

export default function PromoTicker() {
  const [products, setProducts] = useState<TickerProduct[]>([]);

  useEffect(() => {
    fetch("/api/products/ticker")
      .then((r) => r.json())
      .then((d) => {
        if (d.products?.length) setProducts(d.products);
      })
      .catch(() => {});
  }, []);

  // Show a slim dark bar while loading or if no products
  if (!products.length) {
    return <div className="h-11 bg-[#0a1520] border-b border-white/10" />;
  }

  // Duplicate for seamless infinite loop
  const items = [...products, ...products];

  return (
    <div className="relative bg-[#0a1520] border-b border-white/10 overflow-hidden h-11 flex items-center">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a1520] to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a1520] to-transparent z-10 pointer-events-none" />

      <div className="ticker-track flex items-center gap-0">
        {items.map((item, i) => (
          <Link
            key={`${item.id}-${i}`}
            href={`/products/${item.slug}`}
            className="flex items-center gap-2.5 px-6 flex-shrink-0 group"
          >
            {/* Product image */}
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-white/20 group-hover:border-[#2ECC71]/60 transition-colors bg-white/5">
              {item.images?.[0] ? (
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={28}
                  height={28}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}
            </div>

            {/* Product name */}
            <span className="text-white/70 text-xs font-medium whitespace-nowrap group-hover:text-white transition-colors">
              {item.name}
            </span>

            {/* Price */}
            <span className="flex items-center gap-1.5">
              {item.sale_price ? (
                <>
                  <span className="text-[#2ECC71] text-xs font-bold">{formatPrice(item.sale_price)}</span>
                  <span className="text-white/30 text-xs line-through">{formatPrice(item.price)}</span>
                </>
              ) : (
                <span className="text-[#2ECC71] text-xs font-bold">{formatPrice(item.price)}</span>
              )}
            </span>

            {/* Divider dot */}
            <span className="text-white/20 text-xs ml-2">•</span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 40s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
