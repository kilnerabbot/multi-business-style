import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { resend, FROM } from "@/lib/email";
import { statusUpdateHtml, UpdateStatus } from "@/lib/emails/statusUpdate";
import { Order } from "@/types";

const adminDb = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

async function checkAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("mbs_admin")?.value;
  return session === (process.env.MBS_ADMIN_SECRET ?? "mbs-fallback-secret");
}

// Statuses that trigger a customer email
const EMAIL_STATUSES: UpdateStatus[] = ["processing", "shipped", "delivered", "cancelled"];

export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();

  const db = adminDb();

  // Update the status
  const { error } = await db
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send email if it's a meaningful status change
  if (EMAIL_STATUSES.includes(status as UpdateStatus)) {
    try {
      const { data: order } = await db.from("orders").select("*").eq("id", id).single();

      if (order) {
        const o = order as Order;
        const toEmail = o.guest_email ?? o.shipping_address?.email;
        const customerName = o.shipping_address?.first_name;

        if (toEmail) {
          await resend.emails.send({
            from:    FROM,
            to:      toEmail,
            subject: `Your order update — #${id.slice(0, 8).toUpperCase()} · Multi Business Style`,
            html:    statusUpdateHtml({
              orderId:      o.id,
              status:       status as UpdateStatus,
              customerName: customerName,
            }),
          });
        }
      }
    } catch (emailErr) {
      // Don't fail the status update if email errors
      console.error("Status email error:", emailErr);
    }
  }

  return NextResponse.json({ ok: true });
}
