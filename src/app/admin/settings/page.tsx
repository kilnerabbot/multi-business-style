"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Check, Loader2, Save } from "lucide-react";

/* ── Inline SVG social icons ─────────────────────────────────────────── */
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}
function TwitterXIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.17a8.16 8.16 0 004.77 1.52V7.25a4.85 4.85 0 01-1-.56z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

interface Settings {
  email: string;
  phone: string;
  address: string;
  business_hours: string;
  business_hours_sub: string;
  order_whatsapp: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  tiktok_url: string;
  whatsapp_url: string;
  youtube_url: string;
}

const EMPTY: Settings = {
  email: "", phone: "", address: "", business_hours: "", business_hours_sub: "",
  order_whatsapp: "",
  facebook_url: "", instagram_url: "", twitter_url: "",
  tiktok_url: "", whatsapp_url: "", youtube_url: "",
};

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#2ECC71] transition-colors bg-[#F9FAFB]";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

export default function SettingsPage() {
  const [form, setForm]     = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then(({ settings }) => {
        if (settings) setForm({ ...EMPTY, ...settings });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof Settings) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setSaved(false); setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Save failed");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0D1B2A]">Site Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Contact details and social media links shown on the website.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#2ECC71] hover:bg-[#27AE60] disabled:bg-gray-100 disabled:text-gray-400 text-[#0D1B2A] font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          {saving
            ? <Loader2 size={15} className="animate-spin" />
            : saved
            ? <Check size={15} />
            : <Save size={15} />
          }
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* ── Contact details ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <h2 className="text-sm font-bold text-[#0D1B2A] uppercase tracking-wide mb-5 flex items-center gap-2">
          <Mail size={14} className="text-[#2ECC71]" /> Contact Details
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <Mail size={11} className="inline mr-1" /> Email Address
              </label>
              <input
                type="email" value={form.email} onChange={set("email")}
                className={inputCls} placeholder="hello@yourbrand.co.za"
              />
            </div>
            <div>
              <label className={labelCls}>
                <Phone size={11} className="inline mr-1" /> Phone Number
              </label>
              <input
                type="tel" value={form.phone} onChange={set("phone")}
                className={inputCls} placeholder="+27 11 000 0000"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>
              <MapPin size={11} className="inline mr-1" /> Address / Location
            </label>
            <input
              value={form.address} onChange={set("address")}
              className={inputCls} placeholder="Johannesburg, Gauteng"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <Clock size={11} className="inline mr-1" /> Business Hours
              </label>
              <input
                value={form.business_hours} onChange={set("business_hours")}
                className={inputCls} placeholder="Mon–Fri: 8am–5pm"
              />
            </div>
            <div>
              <label className={labelCls}>
                <Clock size={11} className="inline mr-1" /> Hours (secondary line)
              </label>
              <input
                value={form.business_hours_sub} onChange={set("business_hours_sub")}
                className={inputCls} placeholder="Sat: 9am–1pm · Sun: Closed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── WhatsApp orders ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <h2 className="text-sm font-bold text-[#0D1B2A] uppercase tracking-wide mb-1 flex items-center gap-2">
          <span className="text-green-500"><WhatsAppIcon /></span> WhatsApp Orders
        </h2>
        <p className="text-xs text-gray-400 mb-5">
          The number customers&apos; order messages are sent to. Accepts +27 format, local 0xx format, or a full wa.me URL.
        </p>
        <div>
          <label className={labelCls}>Order WhatsApp Number</label>
          <input
            type="tel"
            value={form.order_whatsapp}
            onChange={set("order_whatsapp")}
            className={inputCls}
            placeholder="+27 82 000 0000 or https://wa.me/27820000000"
          />
        </div>
      </div>

      {/* ── Social media ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-bold text-[#0D1B2A] uppercase tracking-wide mb-1 flex items-center gap-2">
          Social Media Links
        </h2>
        <p className="text-xs text-gray-400 mb-5">
          Paste full URLs (e.g. https://instagram.com/yourbrand). Leave blank to hide that icon.
        </p>
        <div className="space-y-4">
          {[
            { key: "facebook_url",  label: "Facebook",    icon: <span className="text-blue-600"><FacebookIcon /></span>,  placeholder: "https://facebook.com/yourbrand" },
            { key: "instagram_url", label: "Instagram",   icon: <span className="text-pink-500"><InstagramIcon /></span>, placeholder: "https://instagram.com/yourbrand" },
            { key: "twitter_url",   label: "Twitter / X", icon: <span className="text-sky-500"><TwitterXIcon /></span>,   placeholder: "https://x.com/yourbrand" },
            { key: "tiktok_url",    label: "TikTok",      icon: <span className="text-gray-800"><TikTokIcon /></span>,    placeholder: "https://tiktok.com/@yourbrand" },
            { key: "whatsapp_url",  label: "WhatsApp",    icon: <span className="text-green-500"><WhatsAppIcon /></span>, placeholder: "https://wa.me/27820000000" },
            { key: "youtube_url",   label: "YouTube",     icon: <span className="text-red-500"><YouTubeIcon /></span>,    placeholder: "https://youtube.com/@yourbrand" },
          ].map(({ key, label, icon, placeholder }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1">
                <label className={labelCls}>{label}</label>
                <input
                  value={form[key as keyof Settings]}
                  onChange={set(key as keyof Settings)}
                  className={inputCls}
                  placeholder={placeholder}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom save button */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#2ECC71] hover:bg-[#27AE60] disabled:bg-gray-100 disabled:text-gray-400 text-[#0D1B2A] font-bold px-6 py-3 rounded-xl transition-colors"
        >
          {saving
            ? <Loader2 size={15} className="animate-spin" />
            : saved
            ? <Check size={15} />
            : <Save size={15} />
          }
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
