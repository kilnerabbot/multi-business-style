import { createClient } from "@supabase/supabase-js";
import UsersClient, { AdminUser } from "./UsersClient";

const adminDb = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export default async function UsersPage() {
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
    (profiles ?? []).map((p) => [p.id, p])
  );

  const statsMap: Record<string, { count: number; spend: number }> = {};
  for (const row of orderRows ?? []) {
    const cid = row.customer_id as string;
    if (!statsMap[cid]) statsMap[cid] = { count: 0, spend: 0 };
    statsMap[cid].count += 1;
    if (row.status !== "cancelled") statsMap[cid].spend += row.total as number;
  }

  const users: AdminUser[] = (authData?.users ?? [])
    .map((u) => {
      const profile = profileMap[u.id] ?? {};
      const stats   = statsMap[u.id]  ?? { count: 0, spend: 0 };
      return {
        id:            u.id,
        email:         u.email ?? "",
        created_at:    u.created_at,
        last_sign_in:  u.last_sign_in_at ?? null,
        provider:      (u.app_metadata?.provider as string) ?? "email",
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
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return <UsersClient initialUsers={users} />;
}
