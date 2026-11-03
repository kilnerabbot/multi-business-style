"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Product, Category } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";

const GENDERS = [
  { value: "", label: "All" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "unisex", label: "Unisex" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "sale", label: "On Sale" },
];

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
  activeGender?: string;
}

export default function ShopClient({ initialProducts, categories, activeGender }: ShopClientProps) {
  const [gender, setGender] = useState(activeGender ?? "");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [onlySale, setOnlySale] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...initialProducts];

    if (gender) result = result.filter((p) => p.gender === gender);
    if (onlySale) result = result.filter((p) => p.sale_price !== null);
    result = result.filter((p) => (p.sale_price ?? p.price) <= maxPrice);

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
        break;
      case "sale":
        result = result.filter((p) => p.sale_price !== null);
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [initialProducts, gender, sort, maxPrice, onlySale]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-medium text-[#111111]">
          {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "All Products"}
        </h1>
        <p className="text-gray-400 mt-1">{filtered.length} items</p>
      </div>

      {/* Gender tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {GENDERS.map((g) => (
          <button
            key={g.value}
            onClick={() => setGender(g.value)}
            className={cn(
              "flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all",
              gender === g.value
                ? "bg-[#111111] text-white"
                : "bg-[#F4F0E6] text-[#111111] hover:bg-gray-200"
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <FilterPanel
            sort={sort}
            setSort={setSort}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onlySale={onlySale}
            setOnlySale={setOnlySale}
            categories={categories}
          />
        </aside>

        <div className="flex-1 min-w-0">
          {/* Mobile filter bar */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-[#111111] border border-gray-200 px-4 py-2 rounded-lg"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#7A5230]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <p className="text-xl font-semibold text-[#111111]">No products found</p>
              <p className="text-gray-400">Try adjusting your filters</p>
              <button
                onClick={() => { setGender(""); setOnlySale(false); setMaxPrice(5000); }}
                className="text-sm text-[#7A5230] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="absolute inset-y-0 left-0 w-72 bg-white p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#111111]">Filters</h3>
              <button onClick={() => setFilterOpen(false)}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <FilterPanel
              sort={sort}
              setSort={setSort}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onlySale={onlySale}
              setOnlySale={setOnlySale}
              categories={categories}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({
  sort, setSort, maxPrice, setMaxPrice, onlySale, setOnlySale, categories,
}: {
  sort: string;
  setSort: (v: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  onlySale: boolean;
  setOnlySale: (v: boolean) => void;
  categories: Category[];
}) {
  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Sort</h4>
        <div className="space-y-2">
          {SORT_OPTIONS.map((o) => (
            <label key={o.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={o.value}
                checked={sort === o.value}
                onChange={() => setSort(o.value)}
                className="accent-[#7A5230]"
              />
              <span className="text-sm text-[#111111]">{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Max price */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Max Price: R{maxPrice.toLocaleString()}
        </h4>
        <input
          type="range"
          min={100}
          max={5000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#7A5230]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>R100</span>
          <span>R5,000</span>
        </div>
      </div>

      {/* Sale toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setOnlySale(!onlySale)}
            className={cn(
              "w-10 h-5 rounded-full transition-colors relative",
              onlySale ? "bg-[#7A5230]" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                onlySale ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </div>
          <span className="text-sm text-[#111111] font-medium">Sale items only</span>
        </label>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Categories</h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className="block text-sm text-[#111111] hover:text-[#7A5230] transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
