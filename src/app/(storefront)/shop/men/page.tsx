export const revalidate = 60;

import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types";
import ShopClient from "../ShopClient";
import CategoryHero from "@/components/ui/CategoryHero";

async function getMenProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("active", true)
      .eq("gender", "men")
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

export default async function MenPage() {
  const [products, categories] = await Promise.all([getMenProducts(), getCategories()]);
  return (
    <>
      <CategoryHero
        title="For Him"
        subtitle="Men's Collection"
        description="Sharp fits, bold statements, and everyday essentials. Dress the way you move."
        gradient="bg-gradient-to-br from-[#0D1B2A] via-[#1a2f45] to-[#0a2218]"
        accent="#2ECC71"
        tag="New Arrivals"
        cta={{ label: "Shop All Men's", href: "/shop/men" }}
      />
      <ShopClient initialProducts={products} categories={categories} activeGender="men" />
    </>
  );
}
