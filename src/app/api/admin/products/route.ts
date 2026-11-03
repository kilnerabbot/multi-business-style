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

  const body = await req.json();
  const payload = {
    name: body.name,
    slug: slugify(body.name),
    description: body.description,
    price: parseFloat(body.price),
    sale_price: body.sale_price ? parseFloat(body.sale_price) : null,
    category_id: body.category_id || null,
    gender: body.gender,
    stock: parseInt(body.stock),
    featured: body.featured,
    active: body.active,
    images: body.images,
    sizes: body.sizes,
    colors: body.colors,
  };

  const { error } = await adminDb().from("products").insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...rest } = body;
  const payload = {
    name: rest.name,
    slug: slugify(rest.name),
    description: rest.description,
    price: parseFloat(rest.price),
    sale_price: rest.sale_price ? parseFloat(rest.sale_price) : null,
    category_id: rest.category_id || null,
    gender: rest.gender,
    stock: parseInt(rest.stock),
    featured: rest.featured,
    active: rest.active,
    images: rest.images,
    sizes: rest.sizes,
    colors: rest.colors,
  };

  const { error } = await adminDb().from("products").update(payload).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
