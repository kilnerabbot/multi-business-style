"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { useWishlistStore } from "@/store/wishlist";
import ProductCard from "@/components/ui/ProductCard";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  const key = ids.join(",");

  useEffect(() => {
    let cancelled = false;
    if (!key) { setProducts([]); setReady(true); return; }
    fetch(`/api/wishlist/products?ids=${key}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setProducts(d.products ?? []); setReady(true); } })
      .catch(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, [key]);

  return (
    <div>
      <div className="border-b border-[#EFEAE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-7 flex items-end justify-between">
          <div>
            <nav className="text-xs text-neutral-500 mb-3">
              <Link href="/" className="hover:text-black">Home</Link>
              <span className="mx-1.5">/</span>
              <span className="text-black">Wishlist</span>
            </nav>
            <h1 className="font-display text-4xl sm:text-[2.6rem] text-black">Your wishlist</h1>
          </div>
          {ready && <p className="text-sm text-neutral-500">{products.length} {products.length === 1 ? "item" : "items"}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        {ready && products.length === 0 ? (
          <div className="py-16 text-center">
            <Heart size={44} className="mx-auto text-[#CDBFA6] mb-6" />
            <h2 className="font-display text-3xl text-black mb-3">Nothing saved yet</h2>
            <p className="text-neutral-500 mb-9">Tap the heart on any product to keep it here.</p>
            <Link href="/shop" className="btn-ink">Browse the shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
