"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { FREE_DELIVERY_ABOVE } from "@/lib/delivery";
import type { NavCategory } from "./StorefrontLayout";

export default function Navbar({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { toggleCart, itemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const count = itemCount();

  useEffect(() => setMounted(true), []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const links = [
    { label: "Home", href: "/" },
    ...categories.slice(0, 4).map((c) => ({ label: c.name, href: `/shop/${c.slug}` })),
    { label: "Sale", href: "/shop/sale" },
  ];
  const half = Math.ceil(links.length / 2);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  const linkCls = (href: string) =>
    cn("text-[0.95rem] transition-colors", pathname === href ? "text-black font-medium" : "text-neutral-600 hover:text-black");

  return (
    <>
      {/* Promo bar */}
      <div className="bg-[#FCE3E0] text-[#7A2E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-10 flex items-center justify-between text-[0.72rem] font-semibold tracking-wide uppercase">
          <span>Free delivery over {formatPrice(FREE_DELIVERY_ABOVE)} — easy returns</span>
          <span className="hidden sm:block normal-case tracking-normal font-medium">South Africa · ZAR</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-[#EFEAE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-[78px] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left links */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.slice(0, half).map((l) => (
              <Link key={l.href} href={l.href} className={linkCls(l.href)}>{l.label}</Link>
            ))}
          </nav>
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="lg:hidden justify-self-start p-1">
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/" className="justify-self-center text-center leading-none">
            <span className="font-display text-[1.45rem] sm:text-[1.7rem] font-bold tracking-tight text-black">
              Multi Business Style
            </span>
          </Link>

          {/* Right: nav remainder + search + actions */}
          <div className="flex items-center justify-end gap-5">
            <nav className="hidden xl:flex items-center gap-8 mr-2">
              {links.slice(half).map((l) => (
                <Link key={l.href} href={l.href} className={linkCls(l.href)}>{l.label}</Link>
              ))}
            </nav>
            <form onSubmit={search} className="hidden md:flex items-center gap-2 border border-[#E2DCCF] rounded-full px-4 h-10 w-48 focus-within:border-black transition-colors">
              <Search size={16} className="text-neutral-500 flex-shrink-0" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search"
                aria-label="Search products" className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400" />
            </form>
            <button onClick={toggleCart} aria-label="Open bag" className="relative p-1">
              <ShoppingBag size={21} />
              {mounted && count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-black text-white text-[0.62rem] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
            <Link href="/account" aria-label="Account" className="flex items-center gap-1.5 text-[0.95rem]">
              <User size={20} /> <span className="hidden sm:inline">Account</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={cn("lg:hidden fixed inset-0 z-[60] transition-opacity duration-200", mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        <nav className={cn("absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white px-6 pt-5 pb-8 flex flex-col transition-transform duration-300", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex items-center justify-between mb-6">
            <span className="font-display text-xl font-bold">Multi Business Style</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={22} /></button>
          </div>
          <form onSubmit={search} className="flex items-center gap-2 border border-[#E2DCCF] rounded-full px-4 h-11 mb-4">
            <Search size={16} className="text-neutral-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" aria-label="Search products"
              className="w-full bg-transparent text-sm outline-none" />
          </form>
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={cn("py-3.5 text-lg border-b border-[#EFEAE0]", pathname === l.href ? "text-black font-medium" : "text-neutral-600")}>
              {l.label}
            </Link>
          ))}
          <Link href="/account" className="mt-auto flex items-center gap-3 text-neutral-700"><User size={18} /> My account</Link>
        </nav>
      </div>
    </>
  );
}
