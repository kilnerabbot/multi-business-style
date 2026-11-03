"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const size = product.sizes?.[0] ?? "One Size";
    const color = product.colors?.[0] ?? "Default";
    addItem(product, size, color);
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
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F4F6F8]">
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
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && (
              <span className="bg-[#2ECC71] text-[#0D1B2A] text-xs font-bold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="bg-[#0D1B2A] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                Featured
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-400 hover:text-red-400 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
            aria-label="Add to wishlist"
          >
            <Heart size={14} />
          </button>

          {/* Quick Add */}
          {product.stock > 0 && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-3 left-3 right-3 bg-[#0D1B2A] hover:bg-[#2ECC71] text-white hover:text-[#0D1B2A] text-xs font-semibold py-2.5 rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={13} /> Quick Add
            </button>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 px-0.5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">{product.gender}</p>
          <h3 className="text-sm font-semibold text-[#0D1B2A] mt-0.5 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-bold text-[#0D1B2A]">
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
    </motion.div>
  );
}
