"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";

export default function WishlistButton({
  productId,
  className,
  size = 16,
}: {
  productId: string;
  className?: string;
  size?: number;
}) {
  const { ids, add, remove } = useWishlistStore();
  // Saved state lives in browser storage, so only show it once mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const saved = mounted && ids.includes(productId);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) remove(productId); else add(productId);

    // Logged-in customers also save to their account
    const { data: { session } } = await createClient().auth.getSession();
    if (!session) return;
    const headers = { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" };
    try {
      if (saved) await fetch(`/api/wishlist?product_id=${productId}`, { method: "DELETE", headers });
      else await fetch("/api/wishlist", { method: "POST", headers, body: JSON.stringify({ product_id: productId }) });
    } catch { /* the local list still holds the change */ }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={cn("transition-colors", className)}
    >
      <motion.span
        key={String(saved)}
        initial={{ scale: saved ? 0.5 : 1 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 600, damping: 12 }}
        className="flex"
      >
        <Heart size={size} className={saved ? "fill-black text-black" : ""} />
      </motion.span>
    </button>
  );
}
