import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Order, Profile } from "@/types";
import AccountClient from "./AccountClient";

const adminDb = () =>
  createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export default async function AccountPage() {
  const supabase = await createClient();

  // Verify session — redirect if not authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const db = adminDb();
  let profile: Profile | null = null;
  let orders: Order[] = [];

  try {
    const { data } = await db
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data as Profile | null;
  } catch { /* profile row may not exist yet */ }

  try {
    const { data } = await db
      .from("orders")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });
    orders = (data as Order[]) ?? [];
  } catch { /* no orders */ }

  return <AccountClient profile={profile} orders={orders} />;
}
