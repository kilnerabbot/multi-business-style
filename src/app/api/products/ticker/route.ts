import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await db
      .from("products")
      .select("id, name, slug, price, sale_price, images")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(12);

    return NextResponse.json({ products: data ?? [] });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
