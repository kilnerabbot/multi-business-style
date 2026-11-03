import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
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

const GENDERS = ["men", "women", "kids", "unisex"];
const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

function clean(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const gender = GENDERS.includes(String(body.gender)) ? String(body.gender) : null;
  const image = String(body.image ?? "").trim() || null;
  const display_order = Number.parseInt(String(body.display_order ?? "0"), 10) || 0;
  return { name, gender, image, display_order };
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return unauthorized();
  const c = clean(await req.json());
  if (!c.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const { data, error } = await adminDb()
    .from("categories")
    .insert({ ...c, slug: slugify(c.name) })
    .select()
    .single();
  if (error) {
    const msg = error.code === "23505" ? "A category with that name already exists." : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, category: data });
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin())) return unauthorized();
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const c = clean(body);
  if (!c.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  // The slug is the category's URL, so it stays unchanged when renaming.
  const { error } = await adminDb().from("categories").update(c).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return unauthorized();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Products stay; the foreign key sets their category to null.
  const { error } = await adminDb().from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
