export const revalidate = 60;

import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types";
import ShopClient from "./ShopClient";

async function getProducts(gender?: string, sale?: boolean, q?: string): Promise<Product[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (gender) query = query.eq("gender", gender);
    if (sale) query = query.not("sale_price", "is", null);
    if (q) query = query.ilike("name", `%${q.replace(/[%,]/g, " ").trim()}%`);

    const { data } = await query;
    return (data as Product[]) ?? [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    return (data as Category[]) ?? [];
  } catch {
    return [];
  }
}

interface ShopPageProps {
  searchParams: Promise<{ gender?: string; sale?: string; sort?: string; q?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params.gender, params.sale === "true", params.q),
    getCategories(),
  ]);

  return (
    <ShopClient
      initialProducts={products}
      categories={categories}
      activeGender={params.gender}
    />
  );
}
