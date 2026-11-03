import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .eq("active", true)
      .single();
    return data ? (data as Product) : null;
  } catch {
    return null;
  }
}

async function getRelated(product: Product): Promise<Product[]> {
  try {
    const supabase = createClient();
    const base = () =>
      supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("active", true)
        .neq("id", product.id);

    // Same category first, then fill up from the same gender
    let related: Product[] = [];
    if (product.category_id) {
      const { data } = await base().eq("category_id", product.category_id).limit(4);
      related = (data as Product[]) ?? [];
    }
    if (related.length < 4) {
      const { data } = await base().eq("gender", product.gender).limit(8);
      const have = new Set(related.map((p) => p.id));
      for (const p of (data as Product[]) ?? []) {
        if (related.length >= 4) break;
        if (!have.has(p.id)) related.push(p);
      }
    }
    return related;
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelated(product);

  return <ProductDetailClient product={product} related={related} />;
}
