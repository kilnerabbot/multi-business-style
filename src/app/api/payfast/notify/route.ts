import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { resend, FROM } from "@/lib/email";
import { orderConfirmationHtml } from "@/lib/emails/orderConfirmation";
import { Order } from "@/types";
import crypto from "crypto";

function verifySignature(data: Record<string, string>, passphrase: string): boolean {
  const received = data.signature;
  const params = { ...data };
  delete params.signature;

  const queryString = Object.keys(params)
    .sort()
    .filter((k) => params[k] !== "")
    .map((k) => `${k}=${encodeURIComponent(params[k]).replace(/%20/g, "+")}`)
    .join("&");

  const toSign = passphrase
    ? `${queryString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    : queryString;

  const expected = crypto.createHash("md5").update(toSign).digest("hex");
  return expected === received;
}

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const params = Object.fromEntries(new URLSearchParams(text));

    const passphrase = process.env.PAYFAST_PASSPHRASE ?? "";
    if (!verifySignature(params, passphrase)) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const paymentStatus = params.payment_status;
    const orderId       = params.m_payment_id;
    const payfastId     = params.pf_payment_id;

    if (!orderId) return new NextResponse("Missing order ID", { status: 400 });

    const supabase = await createAdminClient();

    if (paymentStatus === "COMPLETE") {
      // Update order to paid
      await supabase
        .from("orders")
        .update({ status: "paid", payfast_payment_id: payfastId, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      // Fetch full order for the confirmation email
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (order) {
        const o = order as Order;
        const toEmail = o.guest_email ?? o.shipping_address?.email;

        if (toEmail) {
          await resend.emails.send({
            from:    FROM,
            to:      toEmail,
            subject: `Order Confirmed — #${orderId.slice(0, 8).toUpperCase()} · Multi Business Style`,
            html:    orderConfirmationHtml({
              orderId:     o.id,
              items:       Array.isArray(o.items) ? o.items : [],
              subtotal:    o.subtotal,
              deliveryFee: o.delivery_fee,
              total:       o.total,
              address:     o.shipping_address,
            }),
          });
        }
      }

    } else if (paymentStatus === "CANCELLED") {
      await supabase
        .from("orders")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("id", orderId);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("PayFast notify error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
