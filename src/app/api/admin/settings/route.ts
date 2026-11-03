import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const adminDb = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

const ADMIN_SECRET = process.env.MBS_ADMIN_SECRET ?? "mbs-fallback-secret";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("mbs_admin")?.value === ADMIN_SECRET;
}

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = adminDb();
  const { data, error } = await db
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowed = [
    "email","phone","address","business_hours","business_hours_sub",
    "order_whatsapp",
    "facebook_url","instagram_url","twitter_url","tiktok_url",
    "whatsapp_url","youtube_url",
  ];

  const update: Record<string, string> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) update[key] = (body[key] ?? "").toString().trim();
  }

  const db = adminDb();
  const { error } = await db
    .from("site_settings")
    .update(update)
    .eq("id", 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
