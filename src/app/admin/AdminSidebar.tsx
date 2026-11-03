"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Truck, Users, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard",     href: "/admin",           icon: LayoutDashboard },
  { label: "Products",      href: "/admin/products",  icon: Package },
  { label: "Orders",        href: "/admin/orders",    icon: ShoppingBag },
  { label: "Users",         href: "/admin/users",     icon: Users },
  { label: "Delivery Rates",href: "/admin/delivery",  icon: Truck },
  { label: "Settings",      href: "/admin/settings",  icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin-login";
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#0D1B2A] flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <span className="text-white font-bold text-base">
          Multi<span className="text-[#2ECC71]">Business</span>
          <span className="block text-xs font-light text-white/50 tracking-widest uppercase mt-0.5">Admin Panel</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-[#2ECC71] text-[#0D1B2A]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 w-full transition-all"
        >
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
