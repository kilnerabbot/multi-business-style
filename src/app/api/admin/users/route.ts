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

/* GET — list all users with profile + order stats */
export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = adminDb();

  const [
    { data: authData },
    { data: profiles },
    { data: orderRows },
  ] = await Promise.all([
    db.auth.admin.listUsers({ perPage: 1000 }),
    db.from("profiles").select("*"),
    db.from("orders")
      .select("customer_id, total, status")
      .not("customer_id", "is", null),
  ]);

  const profileMap = Object.fromEntries(
    (profiles ?? []).map((p: Record<string, unknown>) => [p.id, p])
  );

  // Aggregate order stats per customer
  const statsMap: Record<string, { count: number; spend: number }> = {};
  for (const row of orderRows ?? []) {
    const cid = row.customer_id as string;
    if (!statsMap[cid]) statsMap[cid] = { count: 0, spend: 0 };
    statsMap[cid].count += 1;
    if (row.status !== "cancelled") statsMap[cid].spend += row.total as number;
  }

  const users = (authData?.users ?? []).map((u) => {
    const profile = profileMap[u.id] ?? {};
    const stats   = statsMap[u.id]  ?? { count: 0, spend: 0 };
    return {
      id:            u.id,
      email:         u.email ?? "",
      created_at:    u.created_at,
      last_sign_in:  u.last_sign_in_at ?? null,
      provider:      u.app_metadata?.provider ?? "email",
      full_name:     profile.full_name   ?? null,
      phone:         profile.phone       ?? null,
      role:          profile.role        ?? "customer",
      address_line1: profile.address_line1 ?? null,
      address_line2: profile.address_line2 ?? null,
      suburb:        profile.suburb      ?? null,
      city:          profile.city        ?? null,
      province:      profile.province    ?? null,
      postal_code:   profile.postal_code ?? null,
      order_count:   stats.count,
      total_spend:   stats.spend,
    };
  });

  // Newest first
  users.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return NextResponse.json({ users });
}

/* PATCH — update user role */
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, role } = await req.json();
  if (!userId || !["customer", "admin"].includes(role))
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const db = adminDb();
  const { error } = await db
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/* DELETE — remove user entirely (auth + profile) */
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  if (!userId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = adminDb();
  // Delete auth user (cascade removes profile if FK is set up)
  const { error } = await db.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Also delete profile row just in case
  await db.from("profiles").delete().eq("id", userId);

  return NextResponse.json({ ok: true });
}
