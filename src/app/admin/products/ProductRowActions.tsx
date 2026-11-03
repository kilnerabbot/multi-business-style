"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react";

export default function ProductRowActions({
  id,
  name,
  active,
}: {
  id: string;
  name: string;
  active: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", id, active: !active }),
    });
    setBusy(false);
    if (!res.ok) { window.alert("Could not update the product."); return; }
    router.refresh();
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${name}" permanently? This cannot be undone. To keep it, use Hide instead.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) { window.alert("Could not delete the product."); return; }
    router.refresh();
  };

  const btn = "inline-flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-50";
  return (
    <div className="flex items-center gap-3">
      <Link href={`/admin/products/${id}`} className={`${btn} text-[#0D1B2A] hover:text-[#2ECC71]`}>
        <Pencil size={13} /> Edit
      </Link>
      <button onClick={toggle} disabled={busy} className={`${btn} text-gray-500 hover:text-[#0D1B2A]`}>
        {active ? <><EyeOff size={13} /> Hide</> : <><Eye size={13} /> Activate</>}
      </button>
      <button onClick={remove} disabled={busy} className={`${btn} text-gray-400 hover:text-red-500`}>
        <Trash2 size={13} /> Delete
      </button>
    </div>
  );
}
