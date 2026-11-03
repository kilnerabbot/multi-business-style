import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
  title: string;
  subtitle?: string;
  viewAllHref: string;
}

export default function FeaturedProducts({ products, title, subtitle, viewAllHref }: FeaturedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
      <div className="flex items-end justify-between mb-9">
        <div>
          {subtitle && <p className="font-label text-[0.74rem] text-neutral-500 mb-2">{subtitle}</p>}
          <h2 className="font-display text-3xl sm:text-[2.4rem] text-black">{title}</h2>
        </div>
        <Link href={viewAllHref} className="text-[0.95rem] text-black underline underline-offset-4 decoration-black/30 hover:decoration-black">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
