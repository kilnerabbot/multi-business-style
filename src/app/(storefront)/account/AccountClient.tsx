"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Order, Profile, CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  Package, User, LogOut, Pencil, X, Check, Loader2,
  ShoppingBag, ChevronDown, ChevronUp, MapPin, Calendar,
  Phone, Mail, TrendingUp, Home,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ── helpers ─────────────────────────────────────────────────────────────── */
const STATUS_COLORS: Record<string, { pill: string; dot: string }> = {
  pending:    { pill: "bg-yellow-100 text-yellow-700",  dot: "bg-yellow-400" },
  paid:       { pill: "bg-blue-100 text-blue-700",      dot: "bg-blue-400" },
  processing: { pill: "bg-purple-100 text-purple-700",  dot: "bg-purple-400" },
  shipped:    { pill: "bg-orange-100 text-orange-700",  dot: "bg-orange-400" },
  delivered:  { pill: "bg-green-100 text-green-700",    dot: "bg-green-500" },
  cancelled:  { pill: "bg-red-100 text-red-500",        dot: "bg-red-400" },
};

function initials(name?: string | null, email?: string) {
  if (name?.trim()) return name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (email?.[0] ?? "?").toUpperCase();
}

const inputCls = "w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#7A5230] transition-colors bg-[#FAF8F3]";
const labelCls = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5";

const SA_PROVINCES = [
  "Eastern Cape","Free State","Gauteng","KwaZulu-Natal",
  "Limpopo","Mpumalanga","North West","Northern Cape","Western Cape",
];

/* ── props ───────────────────────────────────────────────────────────────── */
interface Props { profile: Profile | null; orders: Order[] }

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function AccountClient({ profile, orders }: Props) {
  const [tab, setTab]           = useState<"orders" | "profile">("orders");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState<"" | "success" | "error">("");
  const [saveError, setSaveError] = useState("");

  const [form, setForm] = useState({
    full_name:     profile?.full_name     ?? "",
    phone:         profile?.phone         ?? "",
    address_line1: profile?.address_line1 ?? "",
    address_line2: profile?.address_line2 ?? "",
    suburb:        profile?.suburb        ?? "",
    city:          profile?.city          ?? "",
    province:      profile?.province      ?? "",
    postal_code:   profile?.postal_code   ?? "",
  });

  /* totals */
  const totalSpent  = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const activeCount = orders.filter((o) => ["paid","processing","shipped"].includes(o.status)).length;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const cancelEdit = () => {
    setForm({
      full_name:     profile?.full_name     ?? "",
      phone:         profile?.phone         ?? "",
      address_line1: profile?.address_line1 ?? "",
      address_line2: profile?.address_line2 ?? "",
      suburb:        profile?.suburb        ?? "",
      city:          profile?.city          ?? "",
      province:      profile?.province      ?? "",
      postal_code:   profile?.postal_code   ?? "",
    });
    setEditing(false);
    setSaveMsg("");
    setSaveError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    setSaveError("");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not signed in — please refresh and try again.");

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error ${res.status}`);
      }

      setSaveMsg("success");
      setEditing(false);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSaveMsg("error");
    } finally {
      setSaving(false);
    }
  };

  const hasAddress = !!(profile?.address_line1 || profile?.suburb || profile?.city);

  return (
    <div className="min-h-screen bg-[#F4F0E6]">

      {/* ── HERO HEADER ─────────────────────────────────────────────────── */}
      <div className="bg-[#111111] pt-10 pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top row: avatar + name + sign out */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-sm bg-gradient-to-br from-[#7A5230] to-[#3a2c1f] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#7A5230]/20">
                <span className="text-[#111111] text-xl font-black">
                  {initials(profile?.full_name, profile?.email)}
                </span>
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">My Account</p>
                <h1 className="text-white text-2xl font-display font-medium leading-tight">
                  {profile?.full_name ? `Hey, ${profile.full_name.split(" ")[0]} 👋` : "Welcome back 👋"}
                </h1>
                <p className="text-white/40 text-sm mt-0.5">{profile?.email}</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-white/30 hover:text-white/70 text-xs font-medium transition-colors mt-1 flex-shrink-0"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: ShoppingBag, label: "Total Orders",  value: orders.length.toString() },
              { icon: TrendingUp,  label: "Total Spent",   value: formatPrice(totalSpent) },
              { icon: Package,     label: "Active Orders", value: activeCount.toString() },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white/5 rounded-sm px-4 py-3 border border-white/[0.08]">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={13} className="text-[#7A5230]" />
                  <p className="text-white/40 text-xs font-medium">{label}</p>
                </div>
                <p className="text-white font-extrabold text-lg leading-none">{value}</p>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="flex gap-1">
            {(["orders", "profile"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-6 py-3 text-sm font-bold capitalize transition-colors rounded-t-xl ${
                  tab === t
                    ? "bg-[#F4F0E6] text-[#111111]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {t === "orders"
                  ? `Orders${orders.length > 0 ? ` (${orders.length})` : ""}`
                  : "Profile"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── ORDERS TAB ──────────────────────────────────────────────── */}
        {tab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-white rounded-sm flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <ShoppingBag size={32} className="text-gray-200" />
                </div>
                <h2 className="text-xl font-display font-medium text-[#111111] mb-2">No orders yet</h2>
                <p className="text-gray-400 mb-6 max-w-xs mx-auto">
                  Your purchase history will appear here once you place your first order.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#111111] text-white font-bold px-7 py-3 rounded-sm hover:bg-[#3a2c1f] transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const items: CartItem[] = Array.isArray(order.items) ? order.items : [];
                  const isOpen = expanded === order.id;
                  const sc = STATUS_COLORS[order.status] ?? { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };
                  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
                  const thumbs = items.slice(0, 3).map((i) => i.product?.images?.[0]).filter(Boolean) as string[];

                  return (
                    <div key={order.id}
                      className={`bg-white rounded-sm border transition-all duration-200 overflow-hidden ${
                        isOpen ? "border-[#7A5230]/30 shadow-md" : "border-gray-100 shadow-sm"
                      }`}
                    >
                      {/* Summary row */}
                      <button
                        className="w-full text-left px-5 py-4 hover:bg-gray-50/50 transition-colors"
                        onClick={() => setExpanded(isOpen ? null : order.id)}
                      >
                        <div className="flex items-center gap-4">
                          {/* Thumbnail stack */}
                          <div className="flex -space-x-2 flex-shrink-0">
                            {thumbs.length > 0 ? thumbs.map((src, i) => (
                              <div key={i} className="w-10 h-10 rounded-sm border-2 border-white overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image src={src} alt="" width={40} height={40} className="object-cover w-full h-full" />
                              </div>
                            )) : (
                              <div className="w-10 h-10 rounded-sm bg-[#F4F0E6] flex items-center justify-center">
                                <Package size={18} className="text-gray-300" />
                              </div>
                            )}
                            {items.length > 3 && (
                              <div className="w-10 h-10 rounded-sm border-2 border-white bg-[#F4F0E6] flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-gray-400">+{items.length - 3}</span>
                              </div>
                            )}
                          </div>

                          {/* Order info */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-[#111111]">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${sc.pill}`}>
                                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${sc.dot}`} />
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(order.created_at).toLocaleDateString("en-ZA", {
                                day: "numeric", month: "short", year: "numeric",
                              })} · {itemCount} item{itemCount !== 1 ? "s" : ""}
                            </p>
                          </div>

                          {/* Total + chevron */}
                          <div className="text-right flex-shrink-0 flex items-center gap-3">
                            <span className="font-extrabold text-[#111111]">{formatPrice(order.total)}</span>
                            {isOpen
                              ? <ChevronUp size={15} className="text-gray-300" />
                              : <ChevronDown size={15} className="text-gray-300" />
                            }
                          </div>
                        </div>
                      </button>

                      {/* Expanded detail */}
                      {isOpen && (
                        <div className="border-t border-gray-100 bg-[#FAFAFA] px-5 py-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                            {/* Items list */}
                            <div className="md:col-span-2 space-y-3">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Items</p>
                              {items.map((item, i) => {
                                const price = item.product?.sale_price ?? item.product?.price ?? 0;
                                return (
                                  <div key={i} className="flex items-center gap-3 bg-white rounded-sm p-3 border border-gray-100">
                                    <div className="w-12 h-12 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0">
                                      {item.product?.images?.[0] ? (
                                        <Image src={item.product.images[0]} alt={item.product.name} width={48} height={48} className="object-cover w-full h-full" />
                                      ) : (
                                        <div className="w-full h-full bg-gray-100" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-[#111111] truncate">{item.product?.name}</p>
                                      <p className="text-xs text-gray-400">{[item.size, item.color].filter(Boolean).join(" · ")}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-sm font-bold text-[#111111]">{formatPrice(price * item.quantity)}</p>
                                      <p className="text-xs text-gray-400">Qty {item.quantity}</p>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Totals */}
                              <div className="bg-white rounded-sm border border-gray-100 p-3 space-y-1.5 text-sm">
                                <div className="flex justify-between text-gray-400">
                                  <span>Subtotal</span><span className="font-medium text-[#111111]">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                  <span>Delivery</span><span className="font-medium text-[#111111]">{formatPrice(order.delivery_fee)}</span>
                                </div>
                                <div className="flex justify-between font-extrabold text-[#111111] border-t border-gray-100 pt-1.5 mt-1">
                                  <span>Total</span><span className="text-[#7A5230]">{formatPrice(order.total)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right column */}
                            <div className="space-y-3">
                              {order.shipping_address && (
                                <div className="bg-white rounded-sm border border-gray-100 p-4">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-3">
                                    <MapPin size={12} /> Shipping To
                                  </p>
                                  <p className="text-sm font-semibold text-[#111111]">
                                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    {order.shipping_address.address_line1}<br />
                                    {order.shipping_address.suburb}, {order.shipping_address.city}<br />
                                    {order.shipping_address.province} {order.shipping_address.postal_code}
                                  </p>
                                </div>
                              )}

                              <div className="bg-white rounded-sm border border-gray-100 p-4 space-y-2 text-xs">
                                <p className="font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                                  <Calendar size={12} /> Order Info
                                </p>
                                <div className="flex justify-between text-gray-400">
                                  <span>Placed</span>
                                  <span className="text-[#111111] font-medium">
                                    {new Date(order.created_at).toLocaleDateString("en-ZA", { day:"numeric", month:"short", year:"numeric" })}
                                  </span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                  <span>Reference</span>
                                  <span className="font-mono text-[#111111] font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                  <span>Status</span>
                                  <span className={`font-semibold capitalize ${STATUS_COLORS[order.status]?.pill.split(" ")[1]}`}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ─────────────────────────────────────────────── */}
        {tab === "profile" && (
          <div className="max-w-2xl space-y-4">

            {/* ── Personal info card ─────────────────────────────────── */}
            <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="bg-gradient-to-r from-[#111111] to-[#1a2f45] px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[#7A5230] to-[#3a2c1f] flex items-center justify-center shadow-lg shadow-[#7A5230]/20">
                    <span className="text-[#111111] text-base font-black">
                      {initials(profile?.full_name, profile?.email)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-bold">{profile?.full_name || "Your Name"}</p>
                    <p className="text-white/40 text-xs">
                      Member since {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString("en-ZA", { month: "long", year: "numeric" })
                        : "—"}
                    </p>
                  </div>
                </div>
                {!editing && (
                  <button
                    onClick={() => { setEditing(true); setSaveMsg(""); setSaveError(""); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#7A5230] hover:text-white transition-colors"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                )}
              </div>

              {/* Card body */}
              <div className="p-6">

                {/* Success banner */}
                {saveMsg === "success" && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-sm rounded-sm px-4 py-2.5 mb-5">
                    <Check size={15} /> Profile updated successfully.
                  </div>
                )}

                {editing ? (
                  /* ── EDIT MODE ─────────────────────────────────────── */
                  <div className="space-y-5">

                    {/* Personal details */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                        <User size={12} /> Personal Details
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Full Name</label>
                          <input
                            value={form.full_name}
                            onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                            className={inputCls} placeholder="Thabo Nkosi"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Phone Number</label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                            className={inputCls} placeholder="+27 82 000 0000"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className={labelCls}>Email Address</label>
                        <input
                          value={profile?.email ?? ""}
                          disabled
                          className={`${inputCls} opacity-50 cursor-not-allowed`}
                        />
                        <p className="text-xs text-gray-400 mt-1">Email address cannot be changed.</p>
                      </div>
                    </div>

                    {/* Shipping address */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                        <Home size={12} /> Default Shipping Address
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className={labelCls}>Street Address</label>
                          <input
                            value={form.address_line1}
                            onChange={(e) => setForm((p) => ({ ...p, address_line1: e.target.value }))}
                            className={inputCls} placeholder="12 Main Street"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Apartment / Suite (optional)</label>
                          <input
                            value={form.address_line2}
                            onChange={(e) => setForm((p) => ({ ...p, address_line2: e.target.value }))}
                            className={inputCls} placeholder="Unit 4B"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Suburb</label>
                            <input
                              value={form.suburb}
                              onChange={(e) => setForm((p) => ({ ...p, suburb: e.target.value }))}
                              className={inputCls} placeholder="Sandton"
                            />
                          </div>
                          <div>
                            <label className={labelCls}>City</label>
                            <input
                              value={form.city}
                              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                              className={inputCls} placeholder="Johannesburg"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Province</label>
                            <select
                              value={form.province}
                              onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
                              className={inputCls}
                            >
                              <option value="">Select province</option>
                              {SA_PROVINCES.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Postal Code</label>
                            <input
                              value={form.postal_code}
                              onChange={(e) => setForm((p) => ({ ...p, postal_code: e.target.value }))}
                              className={inputCls} placeholder="2196"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Error */}
                    {saveMsg === "error" && (
                      <p className="text-sm text-red-500 bg-red-50 rounded-sm px-4 py-2.5">
                        {saveError || "Something went wrong. Please try again."}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#3a2c1f] disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold py-2.5 rounded-sm transition-colors text-sm"
                      >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        {saving ? "Saving…" : "Save Changes"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={saving}
                        className="flex items-center gap-1.5 border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-[#111111] font-semibold py-2.5 px-5 rounded-sm transition-all text-sm"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── VIEW MODE ─────────────────────────────────────── */
                  <div className="space-y-4">

                    {/* Personal details */}
                    <div className="space-y-1">
                      {[
                        { icon: User,     label: "Full Name", value: profile?.full_name || "Not set" },
                        { icon: Mail,     label: "Email",     value: profile?.email ?? "—" },
                        { icon: Phone,    label: "Phone",     value: profile?.phone  || "Not set" },
                        { icon: Calendar, label: "Member Since", value: profile?.created_at
                            ? new Date(profile.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
                            : "—" },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                          <div className="w-8 h-8 bg-[#F4F0E6] rounded-sm flex items-center justify-center flex-shrink-0">
                            <Icon size={14} className="text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                            <p className="text-sm font-semibold text-[#111111] mt-0.5">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping address block */}
                    {hasAddress && (
                      <div className="mt-2 pt-3 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-3">
                          <Home size={12} /> Default Shipping Address
                        </p>
                        <div className="flex items-start gap-4 py-2">
                          <div className="w-8 h-8 bg-[#F4F0E6] rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MapPin size={14} className="text-gray-400" />
                          </div>
                          <p className="text-sm text-[#111111] leading-relaxed">
                            {[
                              profile?.address_line1,
                              profile?.address_line2,
                              profile?.suburb,
                              profile?.city,
                              profile?.province,
                              profile?.postal_code,
                            ].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => { setEditing(true); setSaveMsg(""); setSaveError(""); }}
                      className="w-full mt-1 flex items-center justify-center gap-2 border border-dashed border-gray-200 hover:border-[#7A5230] text-gray-400 hover:text-[#7A5230] font-semibold py-2.5 rounded-sm transition-all text-sm"
                    >
                      <Pencil size={14} /> {hasAddress ? "Edit Profile & Address" : "Edit Profile"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Sign out card ───────────────────────────────────────── */}
            <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#111111]">Sign out of your account</p>
                <p className="text-xs text-gray-400 mt-0.5">You can sign back in anytime.</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 px-4 py-2 rounded-sm transition-all"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
