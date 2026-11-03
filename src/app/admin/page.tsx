import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: productCount },
    { count: orderCount },
    { count: customerCount },
    { data: recentOrders },
    { data: revenue },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("total").in("status", ["paid", "processing", "shipped", "delivered"]),
  ]);

  const totalRevenue = (revenue ?? []).reduce((s: number, o: { total: number }) => s + o.total, 0);

  const stats = [
    { label: "Active Products", value: productCount ?? 0,         icon: Package,   color: "bg-blue-50 text-blue-600" },
    { label: "Total Orders",    value: orderCount ?? 0,           icon: ShoppingBag, color: "bg-green-50 text-green-600" },
    { label: "Revenue",         value: formatPrice(totalRevenue), icon: TrendingUp, color: "bg-yellow-50 text-yellow-600" },
    { label: "Customers",       value: customerCount ?? 0,        icon: Users,     color: "bg-purple-50 text-purple-600" },
  ];

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700",
    shipped: "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0D1B2A] mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-extrabold text-[#0D1B2A]">{value}</p>
            <p className="text-sm text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#0D1B2A] mb-5">Recent Orders</h2>
        {!recentOrders?.length ? (
          <p className="text-gray-400 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-mono text-xs text-[#0D1B2A]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 text-gray-500">{order.guest_email ?? "Account"}</td>
                    <td className="py-3 font-semibold text-[#0D1B2A]">{formatPrice(order.total)}</td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("en-ZA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
