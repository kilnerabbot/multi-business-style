import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Order } from "@/types";
import OrdersClient from "./OrdersClient";

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const STATUS_COUNTS = (orders ?? []).reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const PILLS = [
    { label: "All",        count: orders?.length ?? 0,          color: "bg-gray-100 text-gray-600" },
    { label: "Pending",    count: STATUS_COUNTS.pending    ?? 0, color: "bg-yellow-100 text-yellow-700" },
    { label: "Paid",       count: STATUS_COUNTS.paid       ?? 0, color: "bg-blue-100 text-blue-700" },
    { label: "Processing", count: STATUS_COUNTS.processing ?? 0, color: "bg-purple-100 text-purple-700" },
    { label: "Shipped",    count: STATUS_COUNTS.shipped    ?? 0, color: "bg-orange-100 text-orange-700" },
    { label: "Delivered",  count: STATUS_COUNTS.delivered  ?? 0, color: "bg-green-100 text-green-700" },
    { label: "Cancelled",  count: STATUS_COUNTS.cancelled  ?? 0, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#0D1B2A]">Orders</h1>
        <p className="text-sm text-gray-400">{orders?.length ?? 0} total</p>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PILLS.filter((p) => p.count > 0).map((p) => (
          <span key={p.label} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${p.color}`}>
            {p.label} · {p.count}
          </span>
        ))}
      </div>

      {/* Column headers (visible on wider screens) */}
      <div className="hidden md:grid grid-cols-[6rem_1fr_8rem_5rem_7rem_5rem_1rem] gap-4 px-5 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <span>Order</span>
        <span>Customer</span>
        <span>Province</span>
        <span className="text-right">Total</span>
        <span className="text-center">Status</span>
        <span className="text-right">Date</span>
        <span />
      </div>

      <OrdersClient orders={(orders as Order[]) ?? []} />
    </div>
  );
}
