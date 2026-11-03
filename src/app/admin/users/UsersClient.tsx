"use client";

import { useState, useMemo } from "react";
import {
  Search, ChevronDown, ChevronUp, Shield, User,
  Mail, Phone, MapPin, Calendar, ShoppingBag,
  TrendingUp, Trash2, Loader2, RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string | null;
  provider: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  address_line1: string | null;
  address_line2: string | null;
  suburb: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  order_count: number;
  total_spend: number;
}

function initials(name?: string | null, email?: string) {
  if (name?.trim())
    return name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (email?.[0] ?? "?").toUpperCase();
}

function ProviderBadge({ provider }: { provider: string }) {
  const label = provider === "google" ? "Google" : "Email";
  const cls   = provider === "google"
    ? "bg-blue-50 text-blue-600"
    : "bg-gray-100 text-gray-500";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  return role === "admin" ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ECC71]/10 text-[#27AE60]">
      <Shield size={9} /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
      <User size={9} /> Customer
    </span>
  );
}

export default function UsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers]         = useState<AdminUser[]>(initialUsers);
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "admin">("all");
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [roleSaving, setRoleSaving] = useState<string | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  /* ── filtered list ─────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch =
        !q ||
        u.email.toLowerCase().includes(q) ||
        (u.full_name ?? "").toLowerCase().includes(q) ||
        (u.phone ?? "").includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  /* ── actions ───────────────────────────────────────────────────── */
  const handleRoleToggle = async (user: AdminUser) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    setRoleSaving(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch {
      alert("Failed to update role. Please try again.");
    } finally {
      setRoleSaving(null);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (
      !confirm(
        `Permanently delete ${user.full_name || user.email}?\n\nThis will remove their account and cannot be undone.`
      )
    ) return;

    setDeleting(user.id);
    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (expanded === user.id) setExpanded(null);
    } catch {
      alert("Failed to delete user. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch { /* silent */ }
    finally { setRefreshing(false); }
  };

  /* ── counts ────────────────────────────────────────────────────── */
  const customerCount = users.filter((u) => u.role === "customer").length;
  const adminCount    = users.filter((u) => u.role === "admin").length;

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0D1B2A]">Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {users.length} total · {customerCount} customers · {adminCount} admins
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0D1B2A] border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Summary tiles ───────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users",  value: users.length,    color: "bg-blue-50 text-blue-600" },
          { label: "Customers",    value: customerCount,   color: "bg-purple-50 text-purple-600" },
          { label: "Admins",       value: adminCount,      color: "bg-[#2ECC71]/10 text-[#27AE60]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-2xl font-extrabold text-[#0D1B2A]">{value}</p>
            <p className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${color}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2ECC71] bg-[#F9FAFB]"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["all", "customer", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                roleFilter === r
                  ? "bg-white text-[#0D1B2A] shadow-sm"
                  : "text-gray-500 hover:text-[#0D1B2A]"
              }`}
            >
              {r === "all" ? "All" : r === "admin" ? "Admins" : "Customers"}
            </button>
          ))}
        </div>
      </div>

      {/* ── User list ───────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-400 text-sm">No users match your search.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((user) => {
            const isOpen  = expanded === user.id;
            const isDeleting = deleting === user.id;
            const hasAddress = !!(user.address_line1 || user.suburb || user.city);

            return (
              <div
                key={user.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-[#2ECC71]/30 shadow-md" : "border-gray-100 shadow-sm"
                }`}
              >
                {/* Row */}
                <button
                  className="w-full text-left px-5 py-4 hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : user.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D1B2A] to-[#1a2f45] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-black">
                        {initials(user.full_name, user.email)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#0D1B2A] truncate">
                          {user.full_name || user.email}
                        </span>
                        <RoleBadge role={user.role} />
                        <ProviderBadge provider={user.provider} />
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-6 text-right flex-shrink-0">
                      <div>
                        <p className="text-xs text-gray-400">Orders</p>
                        <p className="text-sm font-bold text-[#0D1B2A]">{user.order_count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Spent</p>
                        <p className="text-sm font-bold text-[#0D1B2A]">{formatPrice(user.total_spend)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Joined</p>
                        <p className="text-sm font-medium text-[#0D1B2A]">
                          {new Date(user.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    {isOpen
                      ? <ChevronUp size={15} className="text-gray-300 flex-shrink-0 ml-2" />
                      : <ChevronDown size={15} className="text-gray-300 flex-shrink-0 ml-2" />
                    }
                  </div>
                </button>

                {/* Expanded panel */}
                {isOpen && (
                  <div className="border-t border-gray-100 bg-[#FAFAFA] px-5 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                      {/* Left — contact details */}
                      <div className="md:col-span-2 space-y-4">

                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Contact Details</p>
                          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                            {[
                              { icon: User,     label: "Name",  value: user.full_name || "Not set" },
                              { icon: Mail,     label: "Email", value: user.email },
                              { icon: Phone,    label: "Phone", value: user.phone || "Not set" },
                              { icon: Calendar, label: "Last sign-in", value: user.last_sign_in
                                  ? new Date(user.last_sign_in).toLocaleDateString("en-ZA", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })
                                  : "Never" },
                            ].map(({ icon: Icon, label, value }) => (
                              <div key={label} className="flex items-center gap-3 px-4 py-3">
                                <Icon size={14} className="text-gray-400 flex-shrink-0" />
                                <span className="text-xs text-gray-400 w-24 flex-shrink-0">{label}</span>
                                <span className="text-sm font-medium text-[#0D1B2A] truncate">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping address */}
                        {hasAddress && (
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                              <MapPin size={11} /> Saved Address
                            </p>
                            <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                              <p className="text-sm text-[#0D1B2A] leading-relaxed">
                                {[
                                  user.address_line1,
                                  user.address_line2,
                                  user.suburb,
                                  user.city,
                                  user.province,
                                  user.postal_code,
                                ].filter(Boolean).join(", ")}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right — stats + actions */}
                      <div className="space-y-3">

                        {/* Order / spend stats */}
                        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Activity</p>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                              <ShoppingBag size={14} className="text-blue-500" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Total Orders</p>
                              <p className="text-sm font-bold text-[#0D1B2A]">{user.order_count}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                              <TrendingUp size={14} className="text-green-500" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Total Spend</p>
                              <p className="text-sm font-bold text-[#0D1B2A]">{formatPrice(user.total_spend)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Role management */}
                        <div className="bg-white rounded-xl border border-gray-100 p-4">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Role</p>
                          <div className="flex items-center justify-between mb-3">
                            <RoleBadge role={user.role} />
                            <span className="text-xs text-gray-400">via {user.provider}</span>
                          </div>
                          <button
                            onClick={() => handleRoleToggle(user)}
                            disabled={roleSaving === user.id}
                            className={`w-full flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-lg transition-all ${
                              user.role === "admin"
                                ? "bg-gray-100 hover:bg-gray-200 text-gray-600"
                                : "bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 text-[#27AE60]"
                            } disabled:opacity-50`}
                          >
                            {roleSaving === user.id
                              ? <Loader2 size={12} className="animate-spin" />
                              : <Shield size={12} />
                            }
                            {roleSaving === user.id
                              ? "Saving…"
                              : user.role === "admin"
                              ? "Demote to Customer"
                              : "Promote to Admin"
                            }
                          </button>
                        </div>

                        {/* Danger zone */}
                        <div className="bg-white rounded-xl border border-red-50 p-4">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Danger Zone</p>
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={isDeleting}
                            className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-all disabled:opacity-50"
                          >
                            {isDeleting
                              ? <Loader2 size={12} className="animate-spin" />
                              : <Trash2 size={12} />
                            }
                            {isDeleting ? "Deleting…" : "Delete User"}
                          </button>
                          <p className="text-[10px] text-gray-400 mt-2 text-center">Removes account permanently.</p>
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
  );
}
