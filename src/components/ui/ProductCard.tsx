"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import WishlistButton from "@/components/ui/WishlistButton";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCartStore();
  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : null;

  // Products with sizes or colours need a choice first, so those go to the product page
  const needsChoice = (product.sizes?.length ?? 0) > 0 || (product.colors?.length ?? 0) > 1;
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, product.sizes?.[0] ?? "", product.colors?.[0] ?? "");
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className={cn("group relative", className)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F4F0E6]">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover product-img-zoom"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag size={36} className="text-[#CDBFA6]" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && (
              <span className="bg-black text-white text-[0.68rem] font-medium px-2.5 py-1">
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="bg-white text-black text-[0.68rem] font-medium px-2.5 py-1">
                Featured
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-[#7A5230] text-white text-[0.68rem] font-medium px-2.5 py-1">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist */}
          <WishlistButton
            productId={product.id}
            className="absolute top-3 right-3 bg-white/95 hover:bg-white text-neutral-700 p-2 rounded-full shadow-sm"
          />
        </div>

        {/* Info */}
        <div className="mt-3 px-0.5">
          <h3 className="font-display text-[1.02rem] text-black line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-black">
              {formatPrice(product.sale_price ?? product.price)}
            </span>
            {product.sale_price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {/* Color dots */}
          {product.colors?.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="w-3.5 h-3.5 rounded-full border border-gray-200"
                  style={{ background: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Add to bag: always visible, so it works on touch screens too */}
      {product.stock === 0 ? (
        <p className="mt-3 text-center text-xs text-neutral-500 py-3 border border-[#E7E1D4] rounded-xl">Sold out</p>
      ) : needsChoice ? (
        <Link
          href={`/products/${product.slug}`}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-black text-black hover:bg-black hover:text-white font-label text-[0.72rem] uppercase tracking-wider py-3 transition-colors"
        >
          Choose options
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            "mt-3 w-full rounded-xl flex items-center justify-center gap-2 font-label text-[0.72rem] uppercase tracking-wider py-3 transition-colors",
            added ? "bg-[#3a2c1f] text-white" : "bg-black hover:bg-[#3a2c1f] text-white"
          )}
        >
          {added ? <><Check size={13} /> Added</> : <><ShoppingBag size={13} /> Add to bag</>}
        </button>
      )}
    </motion.div>
  );
}
