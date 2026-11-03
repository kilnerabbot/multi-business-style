export const revalidate = 60;

import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types";
import ShopClient from "../ShopClient";
import CategoryHero from "@/components/ui/CategoryHero";

async function getSaleProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("active", true)
      .not("sale_price", "is", null)
      .order("created_at", { ascending: false });
    return (data as Product[]) ?? [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("categories").select("*").order("display_order");
    return (data as Category[]) ?? [];
  } catch {
    return [];
  }
}

export default async function SalePage() {
  const [products, categories] = await Promise.all([getSaleProducts(), getCategories()]);
  return (
    <>
      <CategoryHero
        title="Sale"
        subtitle="Limited Time Deals"
        description="Big savings across men's, women's, kids' and accessories. Don't sleep on these prices — they won't last."
        gradient="bg-gradient-to-br from-[#2e0a0a] via-[#1a0808] to-[#0D1B2A]"
        accent="#f87171"
        tag="Up to 40% off"
        cta={{ label: "Shop All Sale Items", href: "/shop/sale" }}
      />
      <ShopClient initialProducts={products} categories={categories} />
    </>
  );
}
