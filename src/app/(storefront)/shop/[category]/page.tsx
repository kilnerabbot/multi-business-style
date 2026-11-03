import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types";
import ShopClient from "../ShopClient";
import { notFound } from "next/navigation";

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();
    return data as Category;
  } catch {
    return null;
  }
}

async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("active", true)
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });
    return (data as Product[]) ?? [];
  } catch {
    return [];
  }
}

async function getAllCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("categories").select("*").order("display_order");
    return (data as Category[]) ?? [];
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;

  const genderSlugs = ["men", "women", "kids", "accessories"];
  if (genderSlugs.includes(slug)) {
    const categories = await getAllCategories();
    const gender = slug === "accessories" ? "unisex" : slug;

    let products: Product[] = [];
    try {
      const supabase = createClient();
      const accCatId = categories.find((c) => c.slug === "accessories")?.id ?? "";
      const { data } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("active", true)
        .eq(
          slug === "accessories" ? "category_id" : "gender",
          slug === "accessories" ? accCatId : gender
        )
        .order("created_at", { ascending: false });
      products = (data as Product[]) ?? [];
    } catch { /* show empty */ }

    return (
      <ShopClient
        initialProducts={products}
        categories={categories}
        activeGender={slug !== "accessories" ? gender : undefined}
      />
    );
  }

  const [category, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getAllCategories(),
  ]);

  if (!category) notFound();

  const products = await getProductsByCategory(category.id);

  return (
    <ShopClient
      initialProducts={products}
      categories={categories}
      activeGender={category.gender ?? undefined}
    />
  );
}
