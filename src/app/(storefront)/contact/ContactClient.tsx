"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteSettings } from "@/lib/settings";

/* ── Social SVG icons ────────────────────────────────────────────────── */
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}
function TwitterXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.17a8.16 8.16 0 004.77 1.52V7.25a4.85 4.85 0 01-1-.56z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const SUBJECTS = [
  "Order enquiry","Returns & exchanges","Delivery question",
  "Product question","Sizing help","Wholesale enquiry","Other",
];

const SOCIAL_LINKS = [
  { key: "facebook_url",  icon: <FacebookIcon />,  label: "Facebook",    color: "text-blue-600  hover:bg-blue-50" },
  { key: "instagram_url", icon: <InstagramIcon />, label: "Instagram",   color: "text-pink-500  hover:bg-pink-50" },
  { key: "twitter_url",   icon: <TwitterXIcon />,  label: "Twitter / X", color: "text-sky-500   hover:bg-sky-50" },
  { key: "youtube_url",   icon: <YouTubeIcon />,   label: "YouTube",     color: "text-red-500   hover:bg-red-50" },
  { key: "tiktok_url",    icon: <TikTokIcon />,    label: "TikTok",      color: "text-gray-800  hover:bg-gray-50" },
  { key: "whatsapp_url",  icon: <WhatsAppIcon />,  label: "WhatsApp",    color: "text-green-500 hover:bg-green-50" },
];

export default function ContactClient({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (f: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  const contactCards = [
    {
      icon: Mail,
      label: "Email us",
      value: settings.email,
      sub: "We reply within 1 business day",
      href: `mailto:${settings.email}`,
    },
    {
      icon: Phone,
      label: "Call us",
      value: settings.phone,
      sub: "Mon–Fri, 8am–5pm SAST",
      href: `tel:${settings.phone.replace(/\s/g, "")}`,
    },
    {
      icon: MapPin,
      label: "Visit us",
      value: settings.address,
      sub: "South Africa",
      href: null,
    },
    {
      icon: Clock,
      label: "Business hours",
      value: settings.business_hours,
      sub: settings.business_hours_sub,
      href: null,
    },
  ];

  // Social links that have a URL set
  const s = settings as unknown as Record<string, string>;
  const activeSocials = SOCIAL_LINKS.filter(({ key }) => !!s[key]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <motion.div {...fadeUp()} className="mb-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#7A5230]/10 border border-[#7A5230]/30 rounded-full px-4 py-1.5 mb-5">
          <Mail size={14} className="text-[#7A5230]" />
          <span className="text-[#7A5230] text-xs font-semibold tracking-widest uppercase">Get in touch</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-medium text-[#111111] leading-tight">Contact Us</h1>
        <p className="mt-4 text-gray-500 text-lg leading-relaxed">
          We&apos;d love to hear from you. Whether it&apos;s an order question, sizing help, or just a hello — we&apos;re here.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left — contact info + social */}
        <motion.div {...fadeUp(0.1)} className="lg:col-span-1 space-y-4">

          {contactCards.map(({ icon: Icon, label, value, sub, href }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-sm bg-[#7A5230]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={16} className="text-[#7A5230]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                  {href ? (
                    <a href={href} className="font-semibold text-[#111111] hover:text-[#7A5230] transition-colors text-sm mt-0.5 block">
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold text-[#111111] text-sm mt-0.5">{value}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Social links card */}
          {activeSocials.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Follow Us</p>
              <div className="flex flex-wrap gap-2">
                {activeSocials.map(({ key, label, color, icon }) => (
                  <a
                    key={key}
                    href={s[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-2 rounded-sm border border-gray-100 text-sm font-semibold transition-all ${color}`}
                  >
                    {icon}
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Right — form */}
        <motion.div {...fadeUp(0.15)} className="lg:col-span-2">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 bg-white border border-gray-100 rounded-sm shadow-sm px-8">
              <div className="w-16 h-16 bg-[#7A5230]/15 rounded-full flex items-center justify-center mb-5">
                <CheckCircle size={32} className="text-[#7A5230]" />
              </div>
              <h2 className="text-2xl font-display font-medium text-[#111111] mb-2">Message sent!</h2>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                Thanks for reaching out. We&apos;ll get back to you at <strong>{form.email}</strong> within 1 business day.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-7 text-sm text-[#7A5230] font-semibold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-100 rounded-sm shadow-sm p-8 space-y-5"
            >
              <h2 className="text-xl font-display font-medium text-[#111111] mb-2">Send us a message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Your name</label>
                  <input required value={form.name} onChange={update("name")} className={inputCls} placeholder="Thabo Nkosi" />
                </div>
                <div>
                  <label className={labelCls}>Email address</label>
                  <input required type="email" value={form.email} onChange={update("email")} className={inputCls} placeholder="thabo@email.com" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Subject</label>
                <select required value={form.subject} onChange={update("subject")} className={inputCls}>
                  <option value="">Select a subject…</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Message</label>
                <textarea
                  required rows={6} value={form.message} onChange={update("message")}
                  className={cn(inputCls, "resize-none")} placeholder="Tell us how we can help…"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className={cn(
                  "w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-sm transition-all",
                  loading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#111111] hover:bg-[#3a2c1f] text-white hover:shadow-lg hover:shadow-[#7A5230]/25"
                )}
              >
                <Send size={16} />
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";
const inputCls = "w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#7A5230] transition-colors bg-[#FAF8F3]";
