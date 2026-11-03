"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useWishlistStore } from "@/store/wishlist";

// When a customer logs in: merge the saved-on-this-device list into their account,
// then load the combined list back.
export default function WishlistSync() {
  useEffect(() => {
    const supabase = createClient();
    let lastUser: string | null = null;

    const sync = async (token: string, userId: string) => {
      if (lastUser === userId) return;
      lastUser = userId;
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      try {
        const local = useWishlistStore.getState().ids;
        if (local.length) {
          await fetch("/api/wishlist", { method: "POST", headers, body: JSON.stringify({ product_ids: local }) });
        }
        const res = await fetch("/api/wishlist", { headers });
        if (res.ok) {
          const { ids } = await res.json();
          useWishlistStore.getState().setIds(ids);
        }
      } catch { /* keep the local list */ }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) sync(session.access_token, session.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) sync(session.access_token, session.user.id);
      else lastUser = null;
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return null;
}
