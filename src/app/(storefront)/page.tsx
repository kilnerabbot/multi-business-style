export const revalidate = 60;

import HeroSection from "@/components/home/HeroSection";
import CategoryBanner from "@/components/home/CategoryBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoStrip from "@/components/home/PromoStrip";
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
  const [featured, menProducts, womenProducts, kidsProducts] = await Promise.all([
    getFeaturedProducts(),
    getProductsByGender("men"),
    getProductsByGender("women"),
    getProductsByGender("kids"),
  ]);

  return (
    <>
      <HeroSection />
      <PromoStrip />
      <CategoryBanner />
      {featured.length > 0 && (
        <FeaturedProducts
          products={featured}
          title="Featured Styles"
          subtitle="Handpicked favourites"
          viewAllHref="/shop"
        />
      )}
      {menProducts.length > 0 && (
        <div className="bg-[#F4F6F8]">
          <FeaturedProducts
            products={menProducts}
            title="For Him"
            subtitle="Men's latest arrivals"
            viewAllHref="/shop/men"
          />
        </div>
      )}
      {womenProducts.length > 0 && (
        <FeaturedProducts
          products={womenProducts}
          title="For Her"
          subtitle="Women's new collection"
          viewAllHref="/shop/women"
        />
      )}
      {kidsProducts.length > 0 && (
        <div className="bg-[#F4F6F8]">
          <FeaturedProducts
            products={kidsProducts}
            title="For Kids"
            subtitle="Cool styles for little ones"
            viewAllHref="/shop/kids"
          />
        </div>
      )}
    </>
  );
}
