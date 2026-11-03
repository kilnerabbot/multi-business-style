import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Public: returns active products for a list of ids, in the order requested.
export async function GET(req: NextRequest) {
  const ids = (new URL(req.url).searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[0-9a-f-]{36}$/i.test(s))
    .slice(0, 100);
  if (!ids.length) return NextResponse.json({ products: [] });

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await db
    .from("products")
    .select("*, category:categories(*)")
    .in("id", ids)
    .eq("active", true);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const byId = new Map((data ?? []).map((p) => [p.id, p]));
  return NextResponse.json({ products: ids.map((id) => byId.get(id)).filter(Boolean) });
}
