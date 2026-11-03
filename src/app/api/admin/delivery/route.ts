import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.MBS_ADMIN_SECRET ?? "mbs-fallback-secret";

const adminDb = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("mbs_admin")?.value === ADMIN_SECRET;
}

/* PATCH — update a single rate row */
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, rate, free_above } = await req.json();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const rateNum      = parseFloat(rate);
  const freeAboveNum = free_above !== "" && free_above != null ? parseFloat(free_above) : null;

  if (isNaN(rateNum))
    return NextResponse.json({ error: "Invalid rate value" }, { status: 400 });

  const { error } = await adminDb()
    .from("delivery_rates")
    .update({
      rate: rateNum,
      free_above: freeAboveNum,
    })
    .eq("id", id);

  if (error) {
    console.error("[delivery PATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

/* POST — seed default rates if table is empty */
export async function POST(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  // If seeding defaults
  if (body.seed) {
    const defaults = [
      { province: "Johannesburg (own delivery)", rate: 60,  free_above: 1000, is_johannesburg: true },
      { province: "Gauteng (other)",             rate: 80,  free_above: 1000, is_johannesburg: false },
      { province: "Western Cape",                rate: 130, free_above: 1200, is_johannesburg: false },
      { province: "KwaZulu-Natal",               rate: 110, free_above: 1200, is_johannesburg: false },
      { province: "Eastern Cape",                rate: 120, free_above: 1200, is_johannesburg: false },
      { province: "Free State",                  rate: 100, free_above: 1000, is_johannesburg: false },
      { province: "Limpopo",                     rate: 130, free_above: 1200, is_johannesburg: false },
      { province: "Mpumalanga",                  rate: 120, free_above: 1200, is_johannesburg: false },
      { province: "North West",                  rate: 110, free_above: 1200, is_johannesburg: false },
      { province: "Northern Cape",               rate: 150, free_above: 1500, is_johannesburg: false },
    ];

    const { error } = await adminDb()
      .from("delivery_rates")
      .upsert(defaults, { onConflict: "province" });

    if (error) {
      console.error("[delivery seed]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
