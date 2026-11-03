export const revalidate = 60;

import HeroSection from "@/components/home/HeroSection";
import CategoryBanner, { CategoryTile } from "@/components/home/CategoryBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Product } from "@/types";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("active", true)
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(8);
    return (data as Product[]) ?? [];
  } catch {
    return [];
  }
}

async function getCategoryTiles(): Promise<CategoryTile[]> {
  try {
    const supabase = createClient();
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from("categories").select("name, slug, image").order("display_order").order("name"),
      supabase.from("products").select("category:categories(slug)").eq("active", true),
    ]);
    const counts: Record<string, number> = {};
    (prods ?? []).forEach((p: { category: { slug: string } | { slug: string }[] | null }) => {
      const c = Array.isArray(p.category) ? p.category[0] : p.category;
      if (c?.slug) counts[c.slug] = (counts[c.slug] ?? 0) + 1;
    });
    return (cats ?? []).map((c: { name: string; slug: string; image: string | null }) => ({ ...c, count: counts[c.slug] ?? 0 }));
  } catch {
    return [];
  }
}

async function getProductsByGender(gender: string): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("active", true)
      .eq("gender", gender)
      .order("created_at", { ascending: false })
      .limit(8);
    return (data as Product[]) ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, tiles, menProducts, womenProducts, kidsProducts] = await Promise.all([
    getFeaturedProducts(),
    getCategoryTiles(),
    getProductsByGender("men"),
    getProductsByGender("women"),
    getProductsByGender("kids"),
  ]);

  return (
    <>
      <HeroSection images={featured.map((p) => p.images?.[0]).filter(Boolean).slice(0, 2)} />
      <CategoryBanner categories={tiles} />
      {featured.length > 0 && (
        <FeaturedProducts
          products={featured}
          title="Featured styles"
          subtitle="Handpicked favourites"
          viewAllHref="/shop"
        />
      )}
      {menProducts.length > 0 && (
        <div className="bg-[#F4F0E6]">
          <FeaturedProducts
            products={menProducts}
            title="For him"
            subtitle="Men's latest arrivals"
            viewAllHref="/shop/men"
          />
        </div>
      )}
      {womenProducts.length > 0 && (
        <FeaturedProducts
          products={womenProducts}
          title="For her"
          subtitle="Women's new collection"
          viewAllHref="/shop/women"
        />
      )}
      {kidsProducts.length > 0 && (
        <div className="bg-[#F4F0E6]">
          <FeaturedProducts
            products={kidsProducts}
            title="For kids"
            subtitle="Cool styles for little ones"
            viewAllHref="/shop/kids"
          />
        </div>
      )}
    </>
  );
}
