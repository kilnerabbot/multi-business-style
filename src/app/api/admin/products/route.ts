import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

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

// "body-cream" -> "body-cream-2" -> "body-cream-3" when the address is already taken
async function uniqueSlug(name: string) {
  const base = slugify(name) || "product";
  const { data } = await adminDb().from("products").select("slug").like("slug", `${base}%`);
  const taken = new Set((data ?? []).map((r) => r.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const payload = {
    name: body.name,
    slug: await uniqueSlug(body.name),
    description: body.description,
    price: parseFloat(body.price),
    sale_price: body.sale_price ? parseFloat(body.sale_price) : null,
    category_id: body.category_id || null,
    gender: body.gender,
    stock: parseInt(body.stock) || 0,
    featured: body.featured,
    active: body.active,
    images: body.images,
    sizes: body.sizes ?? [],
    colors: body.colors ?? [],
  };

  const { error } = await adminDb().from("products").insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Quick toggle from the products list: only flips visibility
  if (body.action === "toggle") {
    const { error } = await adminDb().from("products").update({ active: !!body.active }).eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  }

  const { id, ...rest } = body;
  const payload = {
    name: rest.name,
    description: rest.description,
    price: parseFloat(rest.price),
    sale_price: rest.sale_price ? parseFloat(rest.sale_price) : null,
    category_id: rest.category_id || null,
    gender: rest.gender,
    stock: parseInt(rest.stock) || 0,
    featured: rest.featured,
    active: rest.active,
    images: rest.images,
    sizes: rest.sizes ?? [],
    colors: rest.colors ?? [],
  };

  const { error } = await adminDb().from("products").update(payload).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await adminDb().from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
