"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Truck, RotateCcw, ChevronLeft } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

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
  const { addItem } = useCartStore();

  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : null;

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) return;
    addItem(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#111111] transition-colors mb-6"
      >
        <ChevronLeft size={16} /> Back to shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="space-y-3">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-square rounded-sm overflow-hidden bg-[#F4F0E6]"
          >
            {product.images?.[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag size={64} className="text-gray-300" />
              </div>
            )}
            {discount && (
              <span className="absolute top-4 left-4 bg-[#111111] text-white text-sm font-bold px-3 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </motion.div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 rounded-sm overflow-hidden border-2 transition-colors",
                    selectedImage === i ? "border-[#7A5230]" : "border-transparent"
                  )}
                >
                  <Image src={img} alt={`View ${i + 1}`} width={64} height={64} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="py-2">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            {product.category?.name ?? product.gender}
          </p>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#111111] leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-2xl font-bold text-[#111111]">
              {formatPrice(product.sale_price ?? product.price)}
            </span>
            {product.sale_price && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
            {discount && (
              <span className="text-sm font-semibold text-[#7A5230]">Save {discount}%</span>
            )}
          </div>

          {/* Stock */}
          <p className={cn("text-sm mt-2 font-medium", product.stock > 0 ? "text-green-500" : "text-red-400")}>
            {product.stock > 0 ? `In stock (${product.stock} left)` : "Out of stock"}
          </p>

          {/* Description */}
          {product.description && (
            <p className="text-gray-500 text-sm mt-5 leading-relaxed">{product.description}</p>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-[#111111] mb-2">
                Colour: <span className="font-normal text-gray-500">{selectedColor}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-all",
                      selectedColor === color ? "border-[#7A5230] scale-110" : "border-gray-300"
                    )}
                    style={{ background: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-[#111111] mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-sm border-2 transition-all",
                      selectedSize === size
                        ? "border-[#7A5230] bg-[#111111]/10 text-white"
                        : "border-gray-200 text-gray-500 hover:border-[#111111]"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {product.sizes?.length > 0 && !selectedSize && (
                <p className="text-xs text-red-400 mt-1.5">Please select a size</p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="mt-5 flex items-center gap-3">
            <p className="text-sm font-semibold text-[#111111]">Qty</p>
            <div className="flex items-center border border-gray-200 rounded-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-400 hover:text-[#111111] transition-colors text-lg leading-none"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-medium text-[#111111] min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 text-gray-400 hover:text-[#111111] transition-colors text-lg leading-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-sm transition-all duration-200",
                product.stock === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : added
                  ? "bg-[#3a2c1f] text-white"
                  : "bg-[#111111] hover:bg-[#3a2c1f] text-white hover:shadow-lg hover:shadow-[#7A5230]/25"
              )}
            >
              <ShoppingBag size={18} />
              {added ? "Added!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button className="p-3.5 border border-gray-200 rounded-sm text-gray-400 hover:text-red-400 hover:border-red-200 transition-colors">
              <Heart size={20} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="mt-6 space-y-2.5 border-t border-gray-100 pt-5">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Truck size={16} className="text-[#7A5230] flex-shrink-0" />
              Free delivery on orders over R1,000
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <RotateCcw size={16} className="text-[#7A5230] flex-shrink-0" />
              30-day returns accepted
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-display font-medium text-[#111111] mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
