"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { FREE_DELIVERY_ABOVE } from "@/lib/delivery";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, ArrowLeft, Check } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  // The bag is read from browser storage, so wait for the client before rendering it
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const total = mounted ? subtotal() : 0;
  const count = mounted ? items.reduce((s, i) => s + i.quantity, 0) : 0;

  if (mounted && items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28 text-center">
        <ShoppingBag size={52} className="mx-auto text-[#CDBFA6] mb-6" />
        <h1 className="font-display text-4xl text-black mb-3">Your bag is empty</h1>
        <p className="text-neutral-500 mb-9">Browse the collection and add something you like.</p>
        <Link href="/shop" className="btn-ink">Start shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-[#EFEAE0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-7 flex items-end justify-between">
          <div>
            <nav className="text-xs text-neutral-500 mb-3">
              <Link href="/" className="hover:text-black">Home</Link>
              <span className="mx-1.5">/</span>
              <span className="text-black">Bag</span>
            </nav>
            <h1 className="font-display text-4xl sm:text-[2.6rem] text-black">Your bag</h1>
          </div>
          <p className="text-sm text-neutral-500">{count} {count === 1 ? "item" : "items"}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-10 lg:gap-14 items-start">
        {/* Items */}
        <div>
          <ul className="space-y-4">
            {mounted && items.map((item) => {
              const unit = item.product.sale_price ?? item.product.price;
              const detail = [item.size, item.color].filter((v) => v && v !== "Default");
              return (
                <li key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-5 bg-[#FAF8F3] border border-[#E7E1D4] p-4">
                  <div className="relative w-28 h-36 bg-[#F4F0E6] flex-shrink-0 overflow-hidden">
                    {item.product.images?.[0] && (
                      <Image src={item.product.images[0]} alt={item.product.name} fill sizes="112px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <Link href={`/products/${item.product.slug}`}
                          className="font-display text-lg text-black hover:text-[#7A5230] transition-colors line-clamp-2">
                          {item.product.name}
                        </Link>
                        {detail.length > 0 && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {item.color && item.color !== "Default" && <>Colour: {item.color}</>}
                            {item.color && item.color !== "Default" && item.size && " · "}
                            {item.size && <>Size: {item.size}</>}
                          </p>
                        )}
                      </div>
                      <p className="text-base text-black whitespace-nowrap">{formatPrice(unit * item.quantity)}</p>
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#D9D1BF] bg-[#F4F0E6]">
                        <button aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                          className="p-2.5 text-neutral-600 hover:text-black"><Minus size={13} /></button>
                        <span className="px-3 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                        <button aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                          className="p-2.5 text-neutral-600 hover:text-black"><Plus size={13} /></button>
                      </div>
                      <button onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="text-sm text-neutral-500 underline underline-offset-4 hover:text-black">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <Link href="/shop" className="mt-7 inline-flex items-center gap-2 text-sm text-black hover:text-[#7A5230]">
            <ArrowLeft size={15} /> Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="bg-[#F4F0E6] border border-[#E7E1D4] p-7 lg:sticky lg:top-28">
          <h2 className="font-label text-[0.74rem] uppercase tracking-wider text-neutral-600 mb-6">Order summary</h2>
          <dl className="space-y-4 text-[0.95rem]">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between text-neutral-500">
              <dt>Delivery</dt>
              <dd className="text-right">{total >= FREE_DELIVERY_ABOVE ? "Free" : "Calculated at checkout"}</dd>
            </div>
            <div className="flex justify-between pt-5 border-t border-[#DDD5C4] text-base font-medium">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          {total < FREE_DELIVERY_ABOVE && total > 0 && (
            <p className="mt-4 text-xs text-[#7A5230]">
              Add {formatPrice(FREE_DELIVERY_ABOVE - total)} more for free delivery.
            </p>
          )}
          <Link href="/checkout" className="btn-ink w-full mt-7">Proceed to checkout</Link>
          <ul className="mt-5 space-y-2 text-xs text-neutral-600">
            <li className="flex items-center gap-2"><Check size={13} /> Easy returns</li>
            <li className="flex items-center gap-2"><Check size={13} /> Secure checkout</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
