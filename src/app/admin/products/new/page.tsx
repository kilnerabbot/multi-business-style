import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Category } from "@/types";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0D1B2A] mb-8">Add Product</h1>
      <ProductForm categories={(categories as Category[]) ?? []} />
    </div>
  );
}
