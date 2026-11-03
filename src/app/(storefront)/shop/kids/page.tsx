export const revalidate = 60;

import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types";
import ShopClient from "../ShopClient";
import CategoryHero from "@/components/ui/CategoryHero";

async function getKidsProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("active", true)
      .eq("gender", "kids")
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

export default async function KidsPage() {
  const [products, categories] = await Promise.all([getKidsProducts(), getCategories()]);
  return (
    <>
      <CategoryHero
        title="For Kids"
        subtitle="Kids' Collection"
        description="Fun, colourful, and built to last. Cool styles for little ones who have big personalities."
        gradient="bg-gradient-to-br from-[#1a2e2a] via-[#0f2a1e] to-[#111111]"
        accent="#34d399"
        tag="Kids' Favourites"
        cta={{ label: "Shop All Kids'", href: "/shop/kids" }}
      />
      <ShopClient initialProducts={products} categories={categories} activeGender="kids" />
    </>
  );
}
