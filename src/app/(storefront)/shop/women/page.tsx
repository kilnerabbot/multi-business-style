export const revalidate = 60;

import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types";
import ShopClient from "../ShopClient";
import CategoryHero from "@/components/ui/CategoryHero";

async function getWomenProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("active", true)
      .eq("gender", "women")
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

export default async function WomenPage() {
  const [products, categories] = await Promise.all([getWomenProducts(), getCategories()]);
  return (
    <>
      <CategoryHero
        title="For Her"
        subtitle="Women's Collection"
        description="Elegant, expressive, and iconic. Every piece tells a story — make it yours."
        gradient="bg-gradient-to-br from-[#1f1a2e] via-[#2a1a3e] to-[#0D1B2A]"
        accent="#a78bfa"
        tag="New Season"
        cta={{ label: "Shop All Women's", href: "/shop/women" }}
      />
      <ShopClient initialProducts={products} categories={categories} activeGender="women" />
    </>
  );
}
