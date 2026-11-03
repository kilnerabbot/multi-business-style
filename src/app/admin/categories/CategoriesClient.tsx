"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

const GENDERS = ["", "men", "women", "kids", "unisex"];

interface Draft { name: string; gender: string; display_order: string }
const EMPTY: Draft = { name: "", gender: "", display_order: "0" };

export default function CategoriesClient({
  initial,
  counts,
}: {
  initial: Category[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const [cats, setCats] = useState<Category[]>(initial);
  const [adding, setAdding] = useState<Draft>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const call = async (method: string, body?: object, query = "") => {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/categories${query}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setError(json.error ?? "Something went wrong."); return null; }
    return json;
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const json = await call("POST", adding);
    if (!json) return;
    setCats((p) => [...p, json.category].sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name)));
    setAdding(EMPTY);
    router.refresh();
  };

  const startEdit = (c: Category) => {
    setEditId(c.id);
    setDraft({ name: c.name, gender: c.gender ?? "", display_order: String(c.display_order ?? 0) });
  };

  const saveEdit = async (id: string) => {
    const json = await call("PATCH", { id, ...draft });
    if (!json) return;
    setCats((p) =>
      p
        .map((c) =>
          c.id === id
            ? { ...c, name: draft.name.trim(), gender: (draft.gender || null) as Category["gender"], display_order: Number(draft.display_order) || 0 }
            : c
        )
        .sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name))
    );
    setEditId(null);
    router.refresh();
  };

  const remove = async (c: Category) => {
    const n = counts[c.id] ?? 0;
    const msg = n
      ? `Delete "${c.name}"? Its ${n} product${n === 1 ? "" : "s"} will stay but have no category.`
      : `Delete "${c.name}"?`;
    if (!window.confirm(msg)) return;
    const json = await call("DELETE", undefined, `?id=${c.id}`);
    if (!json) return;
    setCats((p) => p.filter((x) => x.id !== c.id));
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className={labelCls}>New category</label>
          <input required value={adding.name} onChange={(e) => setAdding((p) => ({ ...p, name: e.target.value }))}
            className={inputCls} placeholder="e.g. Fragrance" />
        </div>
        <div>
          <label className={labelCls}>Gender</label>
          <select value={adding.gender} onChange={(e) => setAdding((p) => ({ ...p, gender: e.target.value }))} className={inputCls}>
            {GENDERS.map((g) => <option key={g} value={g}>{g || "Any"}</option>)}
          </select>
        </div>
        <div className="w-24">
          <label className={labelCls}>Order</label>
          <input type="number" value={adding.display_order}
            onChange={(e) => setAdding((p) => ({ ...p, display_order: e.target.value }))} className={inputCls} />
        </div>
        <button disabled={busy} className="flex items-center gap-2 bg-[#2ECC71] hover:bg-[#27AE60] disabled:bg-gray-200 text-[#0D1B2A] font-bold px-5 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Add
        </button>
      </form>

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100 bg-[#F9FAFB]">
              <th className="px-5 py-3.5 font-semibold">Name</th>
              <th className="px-5 py-3.5 font-semibold">Gender</th>
              <th className="px-5 py-3.5 font-semibold">Order</th>
              <th className="px-5 py-3.5 font-semibold">Products</th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cats.map((c) =>
              editId === c.id ? (
                <tr key={c.id} className="bg-[#F9FAFB]">
                  <td className="px-5 py-2"><input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} className={inputCls} /></td>
                  <td className="px-5 py-2">
                    <select value={draft.gender} onChange={(e) => setDraft((p) => ({ ...p, gender: e.target.value }))} className={inputCls}>
                      {GENDERS.map((g) => <option key={g} value={g}>{g || "Any"}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-2 w-28"><input type="number" value={draft.display_order} onChange={(e) => setDraft((p) => ({ ...p, display_order: e.target.value }))} className={inputCls} /></td>
                  <td className="px-5 py-2 text-gray-500">{counts[c.id] ?? 0}</td>
                  <td className="px-5 py-2 text-right whitespace-nowrap">
                    <button disabled={busy} onClick={() => saveEdit(c.id)} className="p-2 text-[#2ECC71] hover:bg-green-50 rounded-lg" title="Save"><Check size={16} /></button>
                    <button onClick={() => setEditId(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg" title="Cancel"><X size={16} /></button>
                  </td>
                </tr>
              ) : (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-[#0D1B2A]">{c.name}</td>
                  <td className="px-5 py-3 text-gray-500 capitalize">{c.gender ?? "Any"}</td>
                  <td className="px-5 py-3 text-gray-500">{c.display_order}</td>
                  <td className="px-5 py-3 text-gray-500">{counts[c.id] ?? 0}</td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button onClick={() => startEdit(c)} className="p-2 text-gray-400 hover:text-[#0D1B2A] hover:bg-gray-100 rounded-lg" title="Edit"><Pencil size={15} /></button>
                    <button onClick={() => remove(c)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={15} /></button>
                  </td>
                </tr>
              )
            )}
            {!cats.length && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No categories yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";
const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#2ECC71] transition-colors bg-[#F9FAFB]";
