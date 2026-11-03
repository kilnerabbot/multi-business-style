"use client";

import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const total = subtotal();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
        <h1 className="text-2xl font-display font-medium text-[#111111] mb-2">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Browse our collections and add some items</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#111111] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#3a2c1f] transition-colors"
        >
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-display font-medium text-[#111111] mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-[#F4F0E6] flex-shrink-0">
                {item.product.images?.[0] ? (
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#F4F0E6]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="text-sm font-semibold text-[#111111] hover:text-[#7A5230] transition-colors line-clamp-2"
                >
                  {item.product.name}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">{[item.size, item.color].filter((v) => v && v !== "Default").join(" · ")}</p>
                <p className="text-base font-bold text-[#111111] mt-1">
                  {formatPrice(item.product.sale_price ?? item.product.price)}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                      className="p-2 text-gray-400 hover:text-[#111111] transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-3 text-sm font-semibold text-[#111111]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                      className="p-2 text-gray-400 hover:text-[#111111] transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="hidden sm:block text-right flex-shrink-0">
                <p className="text-sm font-bold text-[#111111]">
                  {formatPrice((item.product.sale_price ?? item.product.price) * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#F4F0E6] rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-display font-medium text-[#111111] mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium text-[#111111]">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span className="text-[#7A5230] font-medium">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-[#111111] text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full bg-[#111111] hover:bg-[#3a2c1f] text-white font-bold text-center py-3.5 rounded-xl transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="mt-3 block w-full text-center text-sm text-[#111111] hover:text-[#7A5230] font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
