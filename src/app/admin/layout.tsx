import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("mbs_admin")?.value;
  const secret  = process.env.MBS_ADMIN_SECRET ?? "mbs-fallback-secret";

  if (session !== secret) redirect("/admin-login");

  return (
    <div className="flex min-h-screen bg-[#F4F6F8]">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 min-w-0">{children}</main>
    </div>
  );
}
