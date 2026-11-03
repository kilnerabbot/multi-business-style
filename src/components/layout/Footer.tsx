import Link from "next/link";
import { Lock } from "lucide-react";
import NewsletterForm from "./NewsletterForm";
import FooterSocialLinks from "./FooterSocialLinks";

// Footer is a server component — social links are loaded client-side so they
// always reflect the latest admin settings without needing a redeploy.
export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand + social */}
          <div>
            <div className="mb-4">
              <span className="text-white font-bold text-xl tracking-tight">
                Multi<span className="text-[#7A5230]">Business</span>
                <span className="block text-xs font-light text-white/50 tracking-widest uppercase mt-0.5">
                  Style
                </span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              South Africa&apos;s fashion destination — for men, women and kids. Your style, your way.
            </p>
            {/* Fetches live from /api/settings on every page load */}
            <FooterSocialLinks />
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-5">Shop</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {["Men", "Women", "Kids", "Accessories", "Sale"].map((item) => (
                <li key={item}>
                  <Link href={`/shop/${item.toLowerCase()}`} className="hover:text-[#7A5230] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-5">Help</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {[
                { label: "Track Order",         href: "/track-order" },
                { label: "Returns & Exchanges",  href: "/returns" },
                { label: "Delivery Info",        href: "/delivery" },
                { label: "Size Guide",           href: "/size-guide" },
                { label: "Contact Us",           href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#7A5230] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-5">
              Stay in the loop
            </h4>
            <p className="text-sm text-white/50 mb-4">
              New drops, exclusive offers, and style inspiration — straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Multi Business Style. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="/admin-login" aria-label="Admin" className="text-white/10 hover:text-white/30 transition-colors duration-300">
              <Lock size={11} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
