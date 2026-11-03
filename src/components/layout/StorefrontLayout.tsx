import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import WishlistSync from "./WishlistSync";
import { createAdminClient } from "@/lib/supabase/server";

export interface NavCategory { name: string; slug: string }

async function getNavCategories(): Promise<NavCategory[]> {
  try {
    const { data } = await createAdminClient()
      .from("categories")
      .select("name, slug")
      .order("display_order")
      .order("name");
    return (data as NavCategory[]) ?? [];
  } catch {
    return [];
  }
}

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const categories = await getNavCategories();
  return (
    <>
      <Navbar categories={categories} />
      <CartDrawer />
      <WishlistSync />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
