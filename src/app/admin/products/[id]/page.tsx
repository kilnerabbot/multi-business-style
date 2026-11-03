import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types";
import ProductForm from "../ProductForm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, category:categories(*)").eq("id", id).single(),
    supabase.from("categories").select("*").order("display_order"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0D1B2A] mb-8">Edit Product</h1>
      <ProductForm categories={(categories as Category[]) ?? []} product={product as Product} />
    </div>
  );
}
