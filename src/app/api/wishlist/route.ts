import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const adminDb = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function getUser(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user }, error } = await adminDb().auth.getUser(token);
  return error ? null : user;
}

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// Saved product ids, newest first
export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { data, error } = await adminDb()
    .from("wishlist")
    .select("product_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ids: (data ?? []).map((r) => r.product_id) });
}

// Save one product ({ product_id }) or merge several ({ product_ids })
export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const body = await req.json();
  const ids: string[] = Array.isArray(body.product_ids)
    ? body.product_ids
    : body.product_id ? [body.product_id] : [];
  if (!ids.length) return NextResponse.json({ ok: true });

  // Only keep ids that are real products (ignore stale ids from a guest list)
  const { data: valid } = await adminDb().from("products").select("id").in("id", ids);
  const rows = (valid ?? []).map((p) => ({ user_id: user.id, product_id: p.id }));
  if (rows.length) {
    const { error } = await adminDb().from("wishlist").upsert(rows, { onConflict: "user_id,product_id", ignoreDuplicates: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const productId = new URL(req.url).searchParams.get("product_id");
  if (!productId) return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
  const { error } = await adminDb().from("wishlist").delete().eq("user_id", user.id).eq("product_id", productId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
