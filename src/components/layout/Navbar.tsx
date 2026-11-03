"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import PromoTicker from "./PromoTicker";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Men", href: "/shop/men" },
  { label: "Women", href: "/shop/women" },
  { label: "Kids", href: "/shop/kids" },
  { label: "Accessories", href: "/shop/accessories" },
  { label: "Sale", href: "/shop/sale" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, itemCount } = useCartStore();
  const count = itemCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0D1B2A] shadow-lg shadow-black/20"
            : "bg-[#0D1B2A]/95 backdrop-blur-sm"
        )}
      >
        <PromoTicker />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="text-white font-bold text-lg tracking-tight leading-none">
                Multi<span className="text-[#2ECC71]">Business</span>
                <span className="block text-xs font-light text-white/70 tracking-widest uppercase">
                  Style
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-link text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-[#2ECC71] active"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                aria-label="Search"
                className="hidden sm:flex text-white/70 hover:text-white transition-colors p-1"
              >
                <Search size={20} />
              </button>

              <Link
                href="/account"
                aria-label="Account"
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <User size={20} />
              </Link>

              <button
                onClick={toggleCart}
                aria-label="Cart"
                className="relative text-white/70 hover:text-white transition-colors p-1"
              >
                <ShoppingBag size={20} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2ECC71] text-[#0D1B2A] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
                className="lg:hidden text-white/70 hover:text-white transition-colors p-1 ml-1"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-all duration-300",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <nav
          className={cn(
            "absolute top-0 left-0 bottom-0 w-72 bg-[#0D1B2A] transition-transform duration-300 pt-20 px-6 pb-8 flex flex-col gap-1",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "py-3 text-base font-medium border-b border-white/10 transition-colors",
                pathname === link.href ? "text-[#2ECC71]" : "text-white/80"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-auto flex flex-col gap-3 pt-6">
            <Link
              href="/account"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
            >
              <User size={18} /> My Account
            </Link>
          </div>
        </nav>
      </div>

      {/* Spacer — ticker (44px) + nav (64px / 72px) */}
      <div className="h-[108px] lg:h-[116px]" />
    </>
  );
}
