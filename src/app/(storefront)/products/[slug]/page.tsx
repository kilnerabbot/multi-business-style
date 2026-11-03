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
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("active", true)
      .eq("gender", product.gender)
      .neq("id", product.id)
      .limit(4);
    return (data as Product[]) ?? [];
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
