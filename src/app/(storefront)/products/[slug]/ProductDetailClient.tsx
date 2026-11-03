"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Truck, RotateCcw, Minus, Plus } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { FREE_DELIVERY_ABOVE } from "@/lib/delivery";
import { useCartStore } from "@/store/cart";
import ProductCard from "@/components/ui/ProductCard";
import WishlistButton from "@/components/ui/WishlistButton";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [tried, setTried] = useState(false);
  const { addItem } = useCartStore();

  const hasSizes = (product.sizes?.length ?? 0) > 0;
  const hasColors = (product.colors?.length ?? 0) > 0;
  const soldOut = product.stock === 0;
  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : null;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) { setTried(true); return; }
    addItem(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
      <nav className="text-xs text-neutral-500 mb-7">
        <Link href="/" className="hover:text-black">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/shop" className="hover:text-black">Shop</Link>
        {product.category?.name && (
          <>
            <span className="mx-1.5">/</span>
            <Link href={`/shop/${product.category.slug}`} className="hover:text-black">{product.category.name}</Link>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start">
        {/* Gallery */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-start gap-3 lg:sticky lg:top-28">
          {product.images?.length > 1 && (
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} aria-label={`Show image ${i + 1}`}
                  className={cn("relative flex-shrink-0 w-16 h-20 overflow-hidden border transition-colors",
                    selectedImage === i ? "border-black" : "border-transparent opacity-70 hover:opacity-100")}>
                  <Image src={img} alt={`${product.name}, view ${i + 1}`} fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="relative flex-1 min-w-0 w-full aspect-[4/5] overflow-hidden bg-[#F4F0E6]">
            {product.images?.[selectedImage] ? (
              <Image src={product.images[selectedImage]} alt={product.name} fill priority
                sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag size={56} className="text-[#CDBFA6]" />
              </div>
            )}
            {discount && (
              <span className="absolute top-4 left-4 bg-black text-white text-xs font-medium px-3 py-1.5">-{discount}%</span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:pt-2 max-w-lg">
          <p className="font-label text-[0.72rem] text-neutral-500 mb-3 uppercase tracking-wider">
            {product.category?.name ?? product.gender}
          </p>
          <h1 className="font-display text-[2rem] sm:text-[2.5rem] text-black leading-[1.1]">{product.name}</h1>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-2xl text-black">{formatPrice(product.sale_price ?? product.price)}</span>
            {product.sale_price && (
              <span className="text-base text-neutral-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className={cn("text-sm mt-2", soldOut ? "text-[#9B3B2A]" : "text-neutral-600")}>
            {soldOut ? "Out of stock" : product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
          </p>

          {product.description && (
            <p className="text-neutral-700 mt-6 leading-[1.75] max-w-prose whitespace-pre-line">{product.description}</p>
          )}

          {hasColors && (
            <div className="mt-8">
              <p className="text-sm text-black mb-3">
                Colour <span className="text-neutral-500 capitalize">· {selectedColor}</span>
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {product.colors.map((color) => (
                  <button key={color} onClick={() => setSelectedColor(color)} title={color} aria-label={color}
                    className={cn("w-8 h-8 rounded-full border transition-all ring-offset-2",
                      selectedColor === color ? "ring-2 ring-black border-white" : "border-neutral-300 hover:ring-1 hover:ring-neutral-400")}
                    style={{ background: color.toLowerCase() }} />
                ))}
              </div>
            </div>
          )}

          {hasSizes && (
            <div className="mt-7">
              <div className="flex items-baseline justify-between mb-3 max-w-sm">
                <p className="text-sm text-black">Size</p>
                <Link href="/size-guide" className="text-xs text-neutral-500 underline underline-offset-4 hover:text-black">Size guide</Link>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={cn("min-w-[3rem] px-4 py-2.5 text-sm border transition-colors",
                      selectedSize === size ? "bg-black text-white border-black" : "border-[#D9D1BF] text-neutral-800 hover:border-black")}>
                    {size}
                  </button>
                ))}
              </div>
              {tried && !selectedSize && <p className="text-xs text-[#9B3B2A] mt-2">Choose a size to add this to your bag.</p>}
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center border border-[#D9D1BF] bg-[#F4F0E6]">
              <button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-neutral-600 hover:text-black"><Minus size={14} /></button>
              <span className="px-3 text-sm min-w-[2.2rem] text-center">{quantity}</span>
              <button aria-label="Increase quantity" onClick={() => setQuantity(Math.min(Math.max(product.stock, 1), quantity + 1))}
                className="p-3 text-neutral-600 hover:text-black"><Plus size={14} /></button>
            </div>
            <button onClick={handleAddToCart} disabled={soldOut}
              className={cn("btn-ink flex-1", soldOut && "!bg-neutral-200 !text-neutral-500 cursor-not-allowed", added && "!bg-[#3a2c1f]")}>
              <ShoppingBag size={16} />
              {soldOut ? "Out of stock" : added ? "Added to bag" : "Add to bag"}
            </button>
            <WishlistButton
              productId={product.id}
              size={18}
              className="p-3.5 border border-[#D9D1BF] text-neutral-500 hover:text-black hover:border-black"
            />
          </div>

          <ul className="mt-9 space-y-3 border-t border-[#EFEAE0] pt-6 text-sm text-neutral-700">
            <li className="flex items-center gap-3"><Truck size={16} className="text-[#7A5230]" /> Free delivery on orders over {formatPrice(FREE_DELIVERY_ABOVE)}</li>
            <li className="flex items-center gap-3"><RotateCcw size={16} className="text-[#7A5230]" /> 30-day returns</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24 pt-14 border-t border-[#EFEAE0]">
          <p className="font-label text-[0.74rem] text-neutral-500 mb-2 uppercase tracking-wider">More to explore</p>
          <h2 className="font-display text-3xl sm:text-[2.2rem] text-black mb-9">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
