"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/types";
import { Plus, X, ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";

interface Props {
  categories: Category[];
  product?: Product;
}

const GENDERS = ["men", "women", "kids", "unisex"];
const SIZES   = ["XS", "S", "M", "L", "XL", "XXL", "6", "7", "8", "9", "10", "One Size"];

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const isEdit = !!product;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name:        product?.name        ?? "",
    description: product?.description ?? "",
    price:       product?.price?.toString()      ?? "",
    sale_price:  product?.sale_price?.toString() ?? "",
    category_id: product?.category_id ?? "",
    gender:      product?.gender      ?? "unisex",
    stock:       product?.stock?.toString() ?? "0",
    featured:    product?.featured    ?? false,
    active:      product?.active      ?? true,
    images:      product?.images      ?? ([] as string[]),
    sizes:       product?.sizes       ?? ([] as string[]),
    colors:      product?.colors      ?? ([] as string[]),
  });

  const [colorInput,    setColorInput]    = useState("");
  const [uploading,     setUploading]     = useState(false);
  const [uploadError,   setUploadError]   = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");

  const update = (f: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [f]: e.target.value }));

  const toggleSize = (size: string) =>
    setForm((p) => ({
      ...p,
      sizes: p.sizes.includes(size) ? p.sizes.filter((s) => s !== size) : [...p.sizes, size],
    }));

  const addColor = () => {
    const val = colorInput.trim();
    if (val && !form.colors.includes(val)) {
      setForm((p) => ({ ...p, colors: [...p.colors, val] }));
      setColorInput("");
    }
  };

  const removeColor = (c: string) =>
    setForm((p) => ({ ...p, colors: p.colors.filter((x) => x !== c) }));

  const removeImage = (i: number) =>
    setForm((p) => ({ ...p, images: p.images.filter((_, j) => j !== i) }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setUploadError("");

    const uploaded: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        uploaded.push(url);
      } else {
        setUploadError("One or more images failed to upload.");
      }
    }

    setForm((p) => ({ ...p, images: [...p.images, ...uploaded] }));
    setUploading(false);
    // reset file input so same file can be re-selected
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price) { setError("Name and price are required."); return; }

    setLoading(true);
    const body = {
      ...form,
      ...(isEdit ? { id: product!.id } : {}),
    };

    const res = await fetch("/api/admin/products", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg ?? "Failed to save product.");
      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">

      {/* ── Product Details ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-[#0D1B2A] mb-2">Product Details</h2>

        <Field label="Product Name *">
          <input required value={form.name} onChange={update("name")} className={inputCls} placeholder="e.g. Classic White Tee" />
        </Field>

        <Field label="Description">
          <textarea value={form.description} onChange={update("description")} rows={3} className={inputCls + " resize-none"} placeholder="Describe the product…" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (ZAR) *">
            <input required type="number" step="0.01" min="0" value={form.price} onChange={update("price")} className={inputCls} placeholder="299.00" />
          </Field>
          <Field label="Sale Price (ZAR)">
            <input type="number" step="0.01" min="0" value={form.sale_price} onChange={update("sale_price")} className={inputCls} placeholder="199.00" />
          </Field>
          <Field label="Category">
            <select value={form.category_id} onChange={update("category_id")} className={inputCls}>
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Gender">
            <select value={form.gender} onChange={update("gender")} className={inputCls}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
              ))}
            </select>
          </Field>
          <Field label="Stock Quantity">
            <input type="number" min="0" value={form.stock} onChange={update("stock")} className={inputCls} />
          </Field>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#0D1B2A]">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} className="accent-[#2ECC71]" />
            Featured product
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#0D1B2A]">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} className="accent-[#2ECC71]" />
            Active (visible in store)
          </label>
        </div>
      </div>

      {/* ── Sizes ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-[#0D1B2A] mb-4">Sizes</h2>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button key={size} type="button" onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                form.sizes.includes(size)
                  ? "border-[#2ECC71] bg-[#2ECC71]/10 text-[#0D1B2A]"
                  : "border-gray-200 text-gray-400 hover:border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* ── Colours ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-[#0D1B2A] mb-4">Colours</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {form.colors.map((color) => (
            <span key={color} className="flex items-center gap-1.5 bg-[#F4F6F8] px-3 py-1 rounded-lg text-sm text-[#0D1B2A]">
              <span className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ background: color }} />
              {color}
              <button type="button" onClick={() => removeColor(color)}>
                <X size={12} className="text-gray-400 hover:text-red-400" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={colorInput} onChange={(e) => setColorInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); }}}
            className={inputCls} placeholder="e.g. white, #2ECC71, navy"
          />
          <button type="button" onClick={addColor}
            className="px-4 py-2 bg-[#2ECC71] text-[#0D1B2A] font-bold rounded-xl hover:bg-[#27AE60] transition-colors">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* ── Images ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-[#0D1B2A] mb-1">Product Images</h2>
        <p className="text-xs text-gray-400 mb-4">Upload multiple images. First image is the main thumbnail.</p>

        {/* Uploaded image grid */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {form.images.map((url, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                <Image src={url} alt={`Product image ${i + 1}`} fill className="object-cover" />
                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-[#2ECC71] text-[#0D1B2A] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    MAIN
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl py-6 cursor-pointer transition-colors ${
            uploading
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-200 hover:border-[#2ECC71] hover:bg-[#2ECC71]/5"
          }`}
        >
          {uploading ? (
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 size={16} className="animate-spin" /> Uploading…
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <ImagePlus size={18} className="text-[#2ECC71]" />
              Click to upload images
              <span className="text-gray-300">· JPG, PNG, WEBP</span>
            </span>
          )}
        </label>

        {uploadError && (
          <p className="text-xs text-red-500 mt-2">{uploadError}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading || uploading}
          className="bg-[#2ECC71] hover:bg-[#27AE60] disabled:bg-gray-200 disabled:text-gray-400 text-[#0D1B2A] font-bold px-8 py-3 rounded-xl transition-colors">
          {loading ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")}
          className="px-6 py-3 border border-gray-200 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#2ECC71] transition-colors bg-[#F9FAFB]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}
