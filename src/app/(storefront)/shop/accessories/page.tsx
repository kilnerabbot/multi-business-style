export const revalidate = 60;

import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types";
import ShopClient from "../ShopClient";
import CategoryHero from "@/components/ui/CategoryHero";

async function getAccessoryProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "accessories")
      .single();

    const query = supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("active", true)
      .order("created_at", { ascending: false });

    const { data } = cat?.id
      ? await query.eq("category_id", cat.id)
      : await query.eq("gender", "unisex");

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

export default async function AccessoriesPage() {
  const [products, categories] = await Promise.all([getAccessoryProducts(), getCategories()]);
  return (
    <>
      <CategoryHero
        title="Accessories"
        subtitle="The Finishing Touch"
        description="Complete any look with the perfect accessory. Caps, bags, belts, beanies — everything that pulls it together."
        gradient="bg-gradient-to-br from-[#2e2a1a] via-[#1e1a0a] to-[#111111]"
        accent="#fbbf24"
        tag="Must-Haves"
        cta={{ label: "Shop All Accessories", href: "/shop/accessories" }}
      />
      <ShopClient initialProducts={products} categories={categories} />
    </>
  );
}
