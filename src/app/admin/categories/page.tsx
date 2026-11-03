import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Category } from "@/types";
import CategoriesClient from "./CategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order")
    .order("name");

  const { data: counts } = await supabase.from("products").select("category_id");
  const countMap: Record<string, number> = {};
  (counts ?? []).forEach((r: { category_id: string | null }) => {
    if (r.category_id) countMap[r.category_id] = (countMap[r.category_id] ?? 0) + 1;
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0D1B2A] mb-2">Categories</h1>
      <p className="text-sm text-gray-400 mb-8">
        Add, rename or remove the categories products are filed under.
      </p>
      <CategoriesClient initial={(categories as Category[]) ?? []} counts={countMap} />
    </div>
  );
}
