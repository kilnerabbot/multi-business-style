import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, address, subtotal, deliveryFee, total } = body;

    if (!items?.length || !address || !total) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Link the order to the logged-in customer, if any
    let customerId: string | null = null;
    try {
      const auth = await createClient();
      const { data: { user } } = await auth.auth.getUser();
      customerId = user?.id ?? null;
    } catch { /* guest checkout */ }

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        items,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        province:         address.province,
        suburb:           address.suburb,
        shipping_address: address,
        guest_email:      address.email,
        customer_id:      customerId,
        status:           "pending",
      })
      .select()
      .single();

    if (error || !order) {
      console.error("[orders/create]", error);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json({ orderId: order.id, orderNumber: order.order_number });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
