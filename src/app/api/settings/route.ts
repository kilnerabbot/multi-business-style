import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Public endpoint — storefront reads site settings (no auth required)
export async function GET() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await db
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) return NextResponse.json({ settings: null }, { status: 500 });
  return NextResponse.json({ settings: data }, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
