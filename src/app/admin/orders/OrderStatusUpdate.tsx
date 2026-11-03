"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending:    "border-yellow-300 bg-yellow-50  text-yellow-800",
  paid:       "border-blue-300   bg-blue-50    text-blue-800",
  processing: "border-purple-300 bg-purple-50  text-purple-800",
  shipped:    "border-orange-300 bg-orange-50  text-orange-800",
  delivered:  "border-green-300  bg-green-50   text-green-800",
  cancelled:  "border-red-300    bg-red-50     text-red-800",
};

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus]   = useState(currentStatus);
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        className={`flex-1 text-sm border rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#2ECC71]/40 disabled:opacity-60 capitalize transition-colors ${
          STATUS_COLORS[status] ?? "border-gray-200 bg-white text-[#0D1B2A]"
        }`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize bg-white text-[#0D1B2A]">
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      {saving && <Loader2 size={14} className="animate-spin text-gray-400 flex-shrink-0" />}
      {saved  && <span className="text-xs text-green-600 font-semibold flex-shrink-0">Saved</span>}
    </div>
  );
}
