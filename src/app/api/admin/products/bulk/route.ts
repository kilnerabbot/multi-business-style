import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { slugify } from "@/lib/utils";

const adminDb = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

async function checkAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("mbs_admin")?.value;
  return session === (process.env.MBS_ADMIN_SECRET ?? "mbs-fallback-secret");
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { products } = await req.json();
  if (!Array.isArray(products) || products.length === 0)
    return NextResponse.json({ error: "No products provided" }, { status: 400 });

  // Resolve category names → IDs
  const db = adminDb();
  const { data: categories } = await db.from("categories").select("id, name");
  const catMap: Record<string, string> = {};
  (categories ?? []).forEach((c: { id: string; name: string }) => {
    catMap[c.name.toLowerCase()] = c.id;
  });

  const rows = products.map((p) => ({
    name:        p.name,
    slug:        slugify(p.name) + "-" + Math.random().toString(36).slice(2, 6),
    description: p.description ?? "",
    price:       parseFloat(p.price) || 0,
    sale_price:  p.sale_price ? parseFloat(p.sale_price) : null,
    category_id: catMap[(p.category ?? "").toLowerCase()] ?? null,
    gender:      ["men","women","kids","unisex"].includes(p.gender?.toLowerCase())
                   ? p.gender.toLowerCase() : "unisex",
    stock:       parseInt(p.stock) || 0,
    featured:    String(p.featured).toLowerCase() === "true",
    active:      String(p.active).toLowerCase() !== "false",
    images:      [],
    sizes:       p.sizes ? String(p.sizes).split("|").map((s: string) => s.trim()).filter(Boolean) : [],
    colors:      p.colors ? String(p.colors).split("|").map((s: string) => s.trim()).filter(Boolean) : [],
  }));

  const { data, error } = await db.from("products").insert(rows).select("id, name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, count: data?.length ?? 0, products: data });
}
