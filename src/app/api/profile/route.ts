import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const adminDb = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function PATCH(req: NextRequest) {
  // Verify the user via their JWT passed in the Authorization header
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = adminDb();
  const { data: { user }, error: authError } = await db.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    suburb,
    city,
    province,
    postal_code,
  } = await req.json();

  const trim = (v: unknown) =>
    typeof v === "string" ? v.trim() || null : null;

  const { error } = await db
    .from("profiles")
    .upsert(
      {
        id:            user.id,
        email:         user.email,          // keep email in sync
        full_name:     trim(full_name),
        phone:         trim(phone),
        address_line1: trim(address_line1),
        address_line2: trim(address_line2),
        suburb:        trim(suburb),
        city:          trim(city),
        province:      trim(province),
        postal_code:   trim(postal_code),
      },
      { onConflict: "id" }
    );

  if (error) {
    console.error("[profile PATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
