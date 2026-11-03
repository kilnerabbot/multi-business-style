"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeliveryRate } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Pencil, X, Check, Loader2, Database } from "lucide-react";

interface RowState {
  rate: string;
  free_above: string;
}

export default function DeliveryRateForm({ rates }: { rates: DeliveryRate[] }) {
  const router = useRouter();
  const [editing,  setEditing]  = useState<string | null>(null);
  const [rowForm,  setRowForm]  = useState<RowState>({ rate: "", free_above: "" });
  const [saving,   setSaving]   = useState(false);
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [seeding,  setSeeding]  = useState(false);

  /* ── start editing a row ─────────────────────────────────────── */
  const startEdit = (r: DeliveryRate) => {
    setEditing(r.id);
    setRowForm({
      rate:       r.rate?.toString() ?? "",
      free_above: r.free_above?.toString() ?? "",
    });
    setRowError({});
  };

  const cancelEdit = () => { setEditing(null); setRowError({}); };

  /* ── save a single row ───────────────────────────────────────── */
  const saveRow = async (id: string) => {
    setSaving(true);
    setRowError({});

    const res = await fetch("/api/admin/delivery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        rate:       rowForm.rate,
        free_above: rowForm.free_above,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setRowError({ [id]: body.error ?? "Save failed. Please try again." });
    } else {
      setEditing(null);
      router.refresh();
    }
  };

  /* ── seed defaults ───────────────────────────────────────────── */
  const seedDefaults = async () => {
    setSeeding(true);
    const res = await fetch("/api/admin/delivery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed: true }),
    });
    setSeeding(false);
    if (res.ok) router.refresh();
    else {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Seeding failed.");
    }
  };

  /* ── empty state ─────────────────────────────────────────────── */
  if (rates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Database size={24} className="text-gray-300" />
        </div>
        <p className="font-semibold text-[#0D1B2A] mb-1">No delivery rates found</p>
        <p className="text-sm text-gray-400 mb-6">
          The delivery_rates table is empty. Seed the default South African rates to get started.
        </p>
        <button
          onClick={seedDefaults}
          disabled={seeding}
          className="inline-flex items-center gap-2 bg-[#2ECC71] hover:bg-[#27AE60] disabled:bg-gray-100 disabled:text-gray-400 text-[#0D1B2A] font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
        >
          {seeding ? <Loader2 size={15} className="animate-spin" /> : <Database size={15} />}
          {seeding ? "Seeding…" : "Seed Default Rates"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-100 bg-[#F9FAFB]">
            <th className="px-5 py-3.5 font-semibold">Province / Zone</th>
            <th className="px-5 py-3.5 font-semibold">Rate (ZAR)</th>
            <th className="px-5 py-3.5 font-semibold">Free above</th>
            <th className="px-5 py-3.5 font-semibold">Type</th>
            <th className="px-5 py-3.5 font-semibold w-24"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rates.map((r) => {
            const isEditing = editing === r.id;
            const err = rowError[r.id];

            return (
              <tr key={r.id} className={`transition-colors ${isEditing ? "bg-[#f0fdf4]" : "hover:bg-gray-50"}`}>
                {/* Province */}
                <td className="px-5 py-3 font-medium text-[#0D1B2A]">
                  {r.province}
                  <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    r.is_johannesburg ? "bg-[#2ECC71]/15 text-[#27AE60]" : "bg-gray-100 text-gray-500"
                  }`}>
                    {r.is_johannesburg ? "Own" : "Courier"}
                  </span>
                </td>

                {/* Rate */}
                <td className="px-5 py-3">
                  {isEditing ? (
                    <input
                      type="number" step="0.01" min="0"
                      value={rowForm.rate}
                      onChange={(e) => setRowForm((p) => ({ ...p, rate: e.target.value }))}
                      className="w-24 border border-[#2ECC71] rounded-lg px-2 py-1.5 text-sm text-[#0D1B2A] focus:outline-none bg-white"
                      autoFocus
                    />
                  ) : (
                    <span className="text-gray-700">{formatPrice(r.rate)}</span>
                  )}
                </td>

                {/* Free above */}
                <td className="px-5 py-3">
                  {isEditing ? (
                    <input
                      type="number" step="0.01" min="0"
                      value={rowForm.free_above}
                      onChange={(e) => setRowForm((p) => ({ ...p, free_above: e.target.value }))}
                      placeholder="No limit"
                      className="w-28 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#2ECC71] bg-white"
                    />
                  ) : (
                    <span className="text-gray-500">
                      {r.free_above ? formatPrice(r.free_above) : "—"}
                    </span>
                  )}
                </td>

                {/* Type (read only) */}
                <td className="px-5 py-3 text-gray-400 text-xs">
                  {isEditing ? (
                    err ? (
                      <span className="text-red-500 text-[11px]">{err}</span>
                    ) : null
                  ) : null}
                </td>

                {/* Actions */}
                <td className="px-5 py-3">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveRow(r.id)}
                        disabled={saving}
                        className="flex items-center gap-1 bg-[#2ECC71] hover:bg-[#27AE60] disabled:opacity-50 text-[#0D1B2A] font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={saving}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(r)}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#0D1B2A] hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="px-5 py-3 border-t border-gray-100 bg-[#F9FAFB]">
        <p className="text-xs text-gray-400">
          Click <strong>Edit</strong> on any row to update its rate or free delivery threshold.
          Changes take effect immediately for new orders.
        </p>
      </div>
    </div>
  );
}
