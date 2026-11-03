"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/types";
import OrderStatusUpdate from "./OrderStatusUpdate";
import {
  ChevronDown, ChevronUp, MapPin, Package, User, Phone, Mail, Hash,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  paid:       "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped:    "bg-orange-100 text-orange-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  if (!orders.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
        No orders yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const addr = order.shipping_address ?? {};
        const isOpen = expanded === order.id;
        const items: Order["items"] = Array.isArray(order.items) ? order.items : [];

        return (
          <div
            key={order.id}
            className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 overflow-hidden ${
              isOpen ? "border-[#2ECC71]/40 shadow-md" : "border-gray-100"
            }`}
          >
            {/* ── Summary row ─────────────────────────────────────── */}
            <button
              onClick={() => toggle(order.id)}
              className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition-colors"
            >
              {/* Order ID */}
              <span className="font-mono text-xs font-bold text-[#0D1B2A] w-24 flex-shrink-0">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>

              {/* Customer */}
              <span className="text-sm text-gray-500 flex-1 truncate min-w-0">
                {order.guest_email ?? "Account user"}
              </span>

              {/* Province */}
              <span className="hidden sm:block text-xs text-gray-400 w-32 flex-shrink-0 truncate">
                {order.province}
              </span>

              {/* Total */}
              <span className="text-sm font-bold text-[#0D1B2A] w-20 flex-shrink-0 text-right">
                {formatPrice(order.total)}
              </span>

              {/* Status badge */}
              <span className={`hidden md:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                {order.status}
              </span>

              {/* Date */}
              <span className="hidden lg:block text-xs text-gray-400 w-20 flex-shrink-0 text-right">
                {new Date(order.created_at).toLocaleDateString("en-ZA")}
              </span>

              {/* Chevron */}
              <span className="text-gray-400 ml-2 flex-shrink-0">
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>

            {/* ── Expanded detail panel ────────────────────────────── */}
            {isOpen && (
              <div className="border-t border-gray-100 px-5 py-5 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* ── Order items ─────────────────────────────────── */}
                  <div className="lg:col-span-2 space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Package size={13} /> Order Items
                    </h3>

                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#F9FAFB] text-xs text-gray-400 font-semibold uppercase tracking-wide border-b border-gray-100">
                            <th className="px-4 py-2.5 text-left">Product</th>
                            <th className="px-4 py-2.5 text-left">Size</th>
                            <th className="px-4 py-2.5 text-left">Colour</th>
                            <th className="px-4 py-2.5 text-center">Qty</th>
                            <th className="px-4 py-2.5 text-right">Price</th>
                            <th className="px-4 py-2.5 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {items.map((item, i) => {
                            const unitPrice = item.product?.sale_price ?? item.product?.price ?? 0;
                            return (
                              <tr key={i} className="hover:bg-gray-50/50">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                      {item.product?.images?.[0] ? (
                                        <Image
                                          src={item.product.images[0]}
                                          alt={item.product.name}
                                          width={40} height={40}
                                          className="object-cover w-full h-full"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gray-100" />
                                      )}
                                    </div>
                                    <span className="font-medium text-[#0D1B2A] text-xs leading-tight line-clamp-2">
                                      {item.product?.name ?? "—"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500">{item.size || "—"}</td>
                                <td className="px-4 py-3">
                                  <span className="text-xs text-gray-500 capitalize">{item.color || "—"}</span>
                                </td>
                                <td className="px-4 py-3 text-center text-xs font-semibold text-[#0D1B2A]">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-3 text-right text-xs text-gray-500">
                                  {formatPrice(unitPrice)}
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-bold text-[#0D1B2A]">
                                  {formatPrice(unitPrice * item.quantity)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Order totals */}
                    <div className="flex flex-col items-end gap-1.5 pt-1 pr-1 text-sm">
                      <div className="flex gap-8 text-gray-500">
                        <span>Subtotal</span>
                        <span className="font-medium text-[#0D1B2A] w-24 text-right">{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex gap-8 text-gray-500">
                        <span>Delivery</span>
                        <span className="font-medium text-[#0D1B2A] w-24 text-right">{formatPrice(order.delivery_fee)}</span>
                      </div>
                      <div className="flex gap-8 font-bold text-[#0D1B2A] border-t border-gray-100 pt-1.5 mt-0.5">
                        <span>Total</span>
                        <span className="w-24 text-right">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Right column: address + meta ─────────────────── */}
                  <div className="space-y-4">

                    {/* Shipping address */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-3">
                        <MapPin size={13} /> Shipping Address
                      </h3>
                      <div className="bg-[#F9FAFB] rounded-xl p-4 space-y-2 text-sm">
                        {(addr.first_name || addr.last_name) && (
                          <div className="flex items-center gap-2 text-[#0D1B2A] font-semibold">
                            <User size={13} className="text-gray-400 flex-shrink-0" />
                            {addr.first_name} {addr.last_name}
                          </div>
                        )}
                        {addr.email && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Mail size={13} className="text-gray-400 flex-shrink-0" />
                            {addr.email}
                          </div>
                        )}
                        {addr.phone && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Phone size={13} className="text-gray-400 flex-shrink-0" />
                            {addr.phone}
                          </div>
                        )}
                        <div className="pt-1 border-t border-gray-200 text-gray-600 leading-relaxed">
                          <p>{addr.address_line1}</p>
                          {addr.address_line2 && <p>{addr.address_line2}</p>}
                          <p>{addr.suburb}{addr.suburb && addr.city ? ", " : ""}{addr.city}</p>
                          <p>{addr.province} {addr.postal_code}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order meta */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-3">
                        <Hash size={13} /> Order Info
                      </h3>
                      <div className="bg-[#F9FAFB] rounded-xl p-4 space-y-2 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Order ID</span>
                          <span className="font-mono text-[#0D1B2A] font-bold">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date</span>
                          <span className="text-[#0D1B2A]">
                            {new Date(order.created_at).toLocaleString("en-ZA", {
                              day: "numeric", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Items</span>
                          <span className="text-[#0D1B2A] font-semibold">{items.length}</span>
                        </div>
                        {order.payfast_payment_id && (
                          <div className="flex justify-between">
                            <span>Payment ref</span>
                            <span className="font-mono text-[#0D1B2A] text-[10px]">
                              {order.payfast_payment_id}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status update */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                        Update Status
                      </h3>
                      <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
