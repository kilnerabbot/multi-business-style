"use client";

import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();
  const total = subtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 cart-overlay z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#111111]" />
                <h2 className="text-base font-semibold text-[#111111]">Your Cart</h2>
                {items.length > 0 && (
                  <span className="bg-[#111111] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-[#111111] transition-colors p-1"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-gray-200" />
                  <div>
                    <p className="text-[#111111] font-medium">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-1">Add some items to get started</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-2 text-sm text-[#7A5230] font-semibold hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      {/* Image */}
                      <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#F4F0E6]" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111111] line-clamp-2 leading-snug">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {[item.size, item.color].filter((v) => v && v !== "Default").join(" · ")}
                        </p>
                        <p className="text-sm font-semibold text-[#111111] mt-1">
                          {formatPrice(item.product.sale_price ?? item.product.price)}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          {/* Qty */}
                          <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                              className="p-1.5 text-gray-400 hover:text-[#111111] transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                              className="p-1.5 text-gray-400 hover:text-[#111111] transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.product.id, item.size, item.color)}
                            className="text-gray-300 hover:text-red-400 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-5 space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#111111]">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-gray-400">
                  Delivery calculated at checkout based on your location.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-[#111111] hover:bg-[#3a2c1f] text-white font-semibold text-sm text-center py-3.5 rounded-xl transition-colors"
                >
                  Checkout · {formatPrice(total)}
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full text-center text-sm text-[#111111] hover:text-[#7A5230] font-medium transition-colors"
                >
                  View Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
