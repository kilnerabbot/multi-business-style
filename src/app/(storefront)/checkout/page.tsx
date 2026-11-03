"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import {
  SA_PROVINCES, isJohannesburgOrder,
  JHB_DELIVERY_RATE, DEFAULT_DELIVERY_RATES, FREE_DELIVERY_ABOVE,
} from "@/lib/delivery";
import { ShippingAddress, CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ChevronLeft, Truck, MessageCircle } from "lucide-react";

/* ── WhatsApp helpers ────────────────────────────────────────────── */
function sanitiseWaNumber(raw: string): string {
  // Accept full wa.me URLs, +27 numbers, or plain digits
  const urlMatch = raw.match(/wa\.me\/(\d+)/);
  if (urlMatch) return urlMatch[1];
  const digits = raw.replace(/\D/g, "");
  // Convert SA local (0xx) to international
  if (digits.startsWith("0") && digits.length === 10) return "27" + digits.slice(1);
  return digits;
}

function buildWhatsAppMessage(
  orderNumber: string,
  items: CartItem[],
  address: ShippingAddress,
  subtotal: number,
  deliveryFee: number,
  total: number,
): string {
  const lines = items.map((item) => {
    const price  = item.product.sale_price ?? item.product.price;
    const detail = [item.size, item.color].filter(Boolean).join(", ");
    return `• ${item.product.name}${detail ? ` (${detail})` : ""} × ${item.quantity} – ${formatPrice(price * item.quantity)}`;
  });

  const addr = [
    address.address_line1,
    address.address_line2,
    `${address.suburb}, ${address.city}`,
    `${address.province} ${address.postal_code}`,
  ].filter(Boolean).join("\n");

  return [
    `🛍️ *ORDER REQUEST – ${orderNumber}*`,
    "",
    `👤 *Customer*`,
    `${address.first_name} ${address.last_name}`,
    `${address.email}`,
    `${address.phone}`,
    "",
    `📦 *Items*`,
    ...lines,
    "",
    `💰 *Order Total: ${formatPrice(total)}*`,
    `   Subtotal: ${formatPrice(subtotal)}`,
    `   Delivery: ${deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}`,
    "",
    `📍 *Deliver to*`,
    addr,
    "",
    "Please confirm and send payment details. Thank you! 🙏",
  ].join("\n");
}

/* ── Checkout page ───────────────────────────────────────────────── */
const EMPTY_ADDRESS: ShippingAddress = {
  first_name: "", last_name: "", email: "", phone: "",
  address_line1: "", address_line2: "", suburb: "", city: "",
  province: "", postal_code: "",
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const router = useRouter();

  const [address,  setAddress]  = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [waNumber, setWaNumber] = useState("");

  // Prefill the form from the logged-in customer's saved profile
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name, phone, address_line1, address_line2, suburb, city, province, postal_code")
        .eq("id", user.id)
        .single();
      const [first = "", ...rest] = (p?.full_name ?? "").trim().split(/\s+/);
      const saved: Partial<ShippingAddress> = {
        first_name: first,
        last_name: rest.join(" "),
        email: user.email ?? "",
        phone: p?.phone ?? "",
        address_line1: p?.address_line1 ?? "",
        address_line2: p?.address_line2 ?? "",
        suburb: p?.suburb ?? "",
        city: p?.city ?? "",
        province: p?.province ?? "",
        postal_code: p?.postal_code ?? "",
      };
      // Only fill fields the customer hasn't typed into yet
      setAddress((prev) => {
        const next = { ...prev };
        (Object.keys(saved) as (keyof ShippingAddress)[]).forEach((k) => {
          if (!prev[k] && saved[k]) next[k] = saved[k] as string;
        });
        return next;
      });
    })().catch(() => {});
  }, []);

  // Fetch the WhatsApp order number from site settings
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(({ settings }) => {
        if (!settings) return;
        const num =
          settings.order_whatsapp ||
          settings.whatsapp_url   ||
          settings.phone          ||
          "";
        setWaNumber(num);
      })
      .catch(() => {});
  }, []);

  const total       = subtotal();
  const isJhb       = isJohannesburgOrder(address.province, address.suburb);
  const baseRate    = isJhb
    ? JHB_DELIVERY_RATE
    : address.province
    ? DEFAULT_DELIVERY_RATES[address.province] ?? 120
    : 0;
  const deliveryFee = total >= FREE_DELIVERY_ABOVE ? 0 : baseRate;
  const orderTotal  = total + deliveryFee;

  const update = (field: keyof ShippingAddress) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!address.province) { setError("Please select a province."); return; }
    if (!address.suburb)   { setError("Please enter your suburb."); return; }
    if (!waNumber)         { setError("WhatsApp order number not configured. Please contact us directly."); return; }

    setLoading(true);
    try {
      // 1. Save order to database
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address,
          subtotal: total,
          deliveryFee,
          total: orderTotal,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create order");

      const orderNumber = data.orderNumber ?? `MBS-${data.orderId.slice(0, 8).toUpperCase()}`;
      const phone       = sanitiseWaNumber(waNumber);

      // 2. Build WhatsApp message
      const message = buildWhatsAppMessage(
        orderNumber, items, address, total, deliveryFee, orderTotal,
      );
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      // 3. Open WhatsApp in a new tab
      window.open(waUrl, "_blank");

      // 4. Clear cart and redirect to success page
      clearCart();
      router.push(
        `/checkout/success?order=${data.orderId}&phone=${phone}&ref=${encodeURIComponent(orderNumber)}`,
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-xl font-bold text-[#0D1B2A] mb-4">Your cart is empty</p>
        <Link href="/shop" className="text-[#2ECC71] font-semibold hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0D1B2A] mb-6 transition-colors"
      >
        <ChevronLeft size={16} /> Back to cart
      </Link>

      <h1 className="text-3xl font-extrabold text-[#0D1B2A] mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Left — Delivery form ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0D1B2A] mb-5">Delivery Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name" required>
                <input required value={address.first_name} onChange={update("first_name")} className={inputCls} placeholder="Thabo" />
              </Field>
              <Field label="Last Name" required>
                <input required value={address.last_name} onChange={update("last_name")} className={inputCls} placeholder="Nkosi" />
              </Field>
              <Field label="Email Address" required>
                <input required type="email" value={address.email} onChange={update("email")} className={inputCls} placeholder="thabo@email.com" />
              </Field>
              <Field label="Phone Number" required>
                <input required value={address.phone} onChange={update("phone")} className={inputCls} placeholder="071 234 5678" />
              </Field>
              <Field label="Street Address" required className="sm:col-span-2">
                <input required value={address.address_line1} onChange={update("address_line1")} className={inputCls} placeholder="12 Main Street" />
              </Field>
              <Field label="Apartment / Unit (optional)" className="sm:col-span-2">
                <input value={address.address_line2} onChange={update("address_line2")} className={inputCls} placeholder="Apt 4B" />
              </Field>
              <Field label="Suburb" required>
                <input required value={address.suburb} onChange={update("suburb")} className={inputCls} placeholder="Sandton" />
              </Field>
              <Field label="City" required>
                <input required value={address.city} onChange={update("city")} className={inputCls} placeholder="Johannesburg" />
              </Field>
              <Field label="Province" required>
                <select required value={address.province} onChange={update("province")} className={inputCls}>
                  <option value="">Select province…</option>
                  {SA_PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Postal Code" required>
                <input required value={address.postal_code} onChange={update("postal_code")} className={inputCls} placeholder="2196" />
              </Field>
            </div>

            {address.province && (
              <div className="mt-4 flex items-start gap-3 bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-xl p-3.5">
                <Truck size={16} className="text-[#2ECC71] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#0D1B2A]">
                  {isJhb
                    ? "Your order qualifies for our own Johannesburg delivery service."
                    : `Courier delivery to ${address.province}.`}{" "}
                  {deliveryFee === 0
                    ? <strong className="text-[#2ECC71]">Free delivery on this order!</strong>
                    : <span>Delivery fee: <strong>{formatPrice(deliveryFee)}</strong></span>
                  }
                </p>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#0D1B2A] mb-4 flex items-center gap-2">
              <MessageCircle size={16} className="text-[#25D366]" />
              How ordering works
            </h2>
            <ol className="space-y-3">
              {[
                "Fill in your delivery details above and click the button below.",
                "WhatsApp will open with your order details pre-filled — just hit Send.",
                "We'll confirm your order and send you payment details via WhatsApp.",
                "Once payment is confirmed, we'll dispatch your order.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-[#25D366]/15 text-[#25D366] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Right — Order summary ─────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-[#F4F6F8] rounded-2xl p-6 sticky top-24 space-y-4">
            <h2 className="text-lg font-bold text-[#0D1B2A]">Order Summary</h2>

            <ul className="space-y-3">
              {items.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600 line-clamp-1 flex-1 pr-2">
                    {item.product.name}{" "}
                    <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-[#0D1B2A] flex-shrink-0">
                    {formatPrice((item.product.sale_price ?? item.product.price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? "text-[#2ECC71] font-semibold" : ""}>
                  {address.province ? (deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)) : "—"}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#0D1B2A] text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all",
                loading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#25D366] hover:bg-[#20b858] text-white hover:shadow-lg hover:shadow-[#25D366]/25"
              )}
            >
              {loading ? (
                "Placing order…"
              ) : (
                <>
                  <MessageCircle size={18} />
                  Order via WhatsApp · {formatPrice(orderTotal)}
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Your order details will be sent to us on WhatsApp
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#2ECC71] transition-colors bg-[#F9FAFB]";

function Field({ label, children, required, className }: {
  label: string; children: React.ReactNode; required?: boolean; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
