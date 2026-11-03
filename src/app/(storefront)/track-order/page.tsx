"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, CheckCircle, Truck, Clock, XCircle, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/types";
import Link from "next/link";

const STATUS_STEPS = [
  { key: "pending",    label: "Order Placed",  icon: Clock },
  { key: "paid",       label: "Payment Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing",    icon: Package },
  { key: "shipped",    label: "Shipped",       icon: Truck },
  { key: "delivered",  label: "Delivered",     icon: CheckCircle },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0, paid: 1, processing: 2, shipped: 3, delivered: 4, cancelled: -1,
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("*")
        .or(`id.eq.${orderId},order_number.ilike.%${orderId}%`)
        .eq("guest_email", email.toLowerCase())
        .single();

      if (!data) {
        setError("No order found with that order number and email. Please check and try again.");
      } else {
        setOrder(data as Order);
      }
    } catch {
      setError("No order found with that order number and email. Please check and try again.");
    }

    setLoading(false);
  };

  const stepIndex = order ? STATUS_INDEX[order.status] ?? 0 : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-[#7A5230]/10 border border-[#7A5230]/30 rounded-full px-4 py-1.5 mb-5">
          <Package size={14} className="text-[#7A5230]" />
          <span className="text-[#7A5230] text-xs font-semibold tracking-widest uppercase">Order Tracking</span>
        </div>
        <h1 className="text-4xl font-display font-medium text-[#111111]">Track Your Order</h1>
        <p className="mt-3 text-gray-400 leading-relaxed">
          Enter your order number and email address to check your delivery status.
        </p>
      </motion.div>

      {/* Search form */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSearch}
        className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm mb-8 space-y-4"
      >
        <div>
          <label className={labelCls}>Order Number</label>
          <input
            required value={orderId} onChange={(e) => setOrderId(e.target.value)}
            className={inputCls} placeholder="e.g. MBS-A1B2C3D4 or paste your order ID"
          />
          <p className="text-xs text-gray-400 mt-1">Find this in your confirmation email.</p>
        </div>
        <div>
          <label className={labelCls}>Email Address</label>
          <input
            required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className={inputCls} placeholder="The email you used at checkout"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-sm px-4 py-3 text-sm text-red-600">
            <XCircle size={15} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#3a2c1f] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 rounded-sm transition-all"
        >
          <Search size={16} />
          {loading ? "Searching…" : "Track Order"}
        </button>
      </motion.form>

      {/* Order result */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          {/* Order header */}
          <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Order reference</p>
                <p className="font-bold text-[#111111] text-lg mt-0.5">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${
                isCancelled
                  ? "bg-red-100 text-red-600"
                  : order.status === "delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {order.status}
              </span>
            </div>

            {/* Progress tracker */}
            {!isCancelled ? (
              <div className="relative">
                {/* Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 z-0" />
                <div
                  className="absolute top-4 left-4 h-0.5 bg-[#7A5230] z-0 transition-all duration-700"
                  style={{ width: `${stepIndex > 0 ? (stepIndex / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
                />
                <div className="relative z-10 flex justify-between">
                  {STATUS_STEPS.map(({ key, label, icon: Icon }, idx) => {
                    const done = idx <= stepIndex;
                    const active = idx === stepIndex;
                    return (
                      <div key={key} className="flex flex-col items-center gap-2 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          done
                            ? "bg-[#111111] border-[#7A5230] text-white"
                            : "bg-white border-gray-200 text-gray-300"
                        } ${active ? "ring-4 ring-[#7A5230]/20 scale-110" : ""}`}>
                          <Icon size={13} />
                        </div>
                        <p className={`text-xs text-center leading-tight max-w-[60px] ${done ? "font-semibold text-[#111111]" : "text-gray-400"}`}>
                          {label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-red-50 rounded-sm px-4 py-3 text-sm text-red-600">
                <XCircle size={16} className="flex-shrink-0" />
                This order was cancelled. If you paid, a refund will be processed within 5–7 business days.
              </div>
            )}
          </div>

          {/* Delivery address */}
          <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
            <h3 className="font-bold text-[#111111] mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-[#7A5230]" /> Delivery Address
            </h3>
            {(() => {
              const addr = order.shipping_address as unknown as Record<string, string>;
              return (
                <address className="not-italic text-sm text-gray-600 leading-relaxed space-y-0.5">
                  <p className="font-medium text-[#111111]">{addr.first_name} {addr.last_name}</p>
                  <p>{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}</p>
                  <p>{addr.suburb}, {addr.city}</p>
                  <p>{addr.province}, {addr.postal_code}</p>
                </address>
              );
            })()}
          </div>

          {/* Order summary */}
          <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
            <h3 className="font-bold text-[#111111] mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span>{order.delivery_fee === 0 ? "Free" : formatPrice(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#111111] pt-2 border-t border-gray-100">
                <span>Total paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Help CTA */}
          <div className="text-center text-sm text-gray-400">
            Questions about your order?{" "}
            <Link href="/contact" className="text-[#7A5230] font-semibold hover:underline">
              Contact us
            </Link>
          </div>
        </motion.div>
      )}

      {/* Signed-in tip */}
      <p className="text-center text-sm text-gray-400 mt-8">
        Have an account?{" "}
        <Link href="/account" className="text-[#7A5230] font-semibold hover:underline">
          View all your orders
        </Link>{" "}
        from your dashboard.
      </p>
    </div>
  );
}

const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";
const inputCls = "w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#7A5230] transition-colors bg-[#FAF8F3]";
