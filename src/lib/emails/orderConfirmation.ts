import { CartItem, ShippingAddress } from "@/types";

function formatPrice(amount: number) {
  return `R${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function orderConfirmationHtml({
  orderId,
  items,
  subtotal,
  deliveryFee,
  total,
  address,
}: {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: ShippingAddress;
}): string {
  const shortId = orderId.slice(0, 8).toUpperCase();

  const itemRows = items
    .map((item) => {
      const price = item.product?.sale_price ?? item.product?.price ?? 0;
      const lineTotal = price * item.quantity;
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;">
            <strong style="color:#0D1B2A;font-size:14px;">${item.product?.name ?? "Product"}</strong><br/>
            <span style="color:#888;font-size:12px;">
              ${[item.size, item.color].filter(Boolean).join(" · ")}
            </span>
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;text-align:center;color:#555;font-size:14px;">
            ${item.quantity}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;text-align:right;color:#0D1B2A;font-size:14px;font-weight:600;">
            ${formatPrice(lineTotal)}
          </td>
        </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Order Confirmation — MBS #${shortId}</title>
</head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0D1B2A;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
              Multi<span style="color:#2ECC71;">Business</span> Style
            </h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:3px;text-transform:uppercase;">
              Style
            </p>
          </td>
        </tr>

        <!-- Green accent bar -->
        <tr>
          <td style="background:#2ECC71;height:4px;"></td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px 40px 32px;border-radius:0 0 16px 16px;">

            <!-- Confirm heading -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:28px;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0 0 6px;color:#2ECC71;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                    ✓ Order Confirmed
                  </p>
                  <h2 style="margin:0 0 8px;color:#0D1B2A;font-size:24px;font-weight:800;">
                    Thank you, ${address.first_name}!
                  </h2>
                  <p style="margin:0;color:#666;font-size:15px;line-height:1.6;">
                    Your order <strong style="color:#0D1B2A;">#${shortId}</strong> has been received and is being processed. We'll send you another email when it ships.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Items table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr>
                <td style="padding-bottom:12px;">
                  <p style="margin:0;color:#0D1B2A;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                    Order Items
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:10px;overflow:hidden;">
                    <thead>
                      <tr style="background:#F9FAFB;">
                        <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;">Product</th>
                        <th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;">Qty</th>
                        <th style="padding:10px 16px;text-align:right;font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;">Total</th>
                      </tr>
                    </thead>
                    <tbody>${itemRows}</tbody>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Totals -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
              <tr>
                <td align="right">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:4px 0;color:#888;font-size:14px;text-align:right;padding-right:24px;">Subtotal</td>
                      <td style="padding:4px 0;color:#0D1B2A;font-size:14px;font-weight:600;min-width:80px;text-align:right;">${formatPrice(subtotal)}</td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0;color:#888;font-size:14px;text-align:right;padding-right:24px;">Delivery</td>
                      <td style="padding:4px 0;color:#0D1B2A;font-size:14px;font-weight:600;text-align:right;">${formatPrice(deliveryFee)}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0 4px;color:#0D1B2A;font-size:15px;font-weight:800;text-align:right;padding-right:24px;border-top:2px solid #f0f0f0;">Total</td>
                      <td style="padding:10px 0 4px;color:#2ECC71;font-size:15px;font-weight:800;text-align:right;border-top:2px solid #f0f0f0;">${formatPrice(total)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Shipping address -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr>
                <td style="padding-bottom:12px;">
                  <p style="margin:0;color:#0D1B2A;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                    Shipping To
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background:#F9FAFB;border-radius:10px;padding:16px 20px;">
                  <p style="margin:0 0 4px;color:#0D1B2A;font-size:14px;font-weight:600;">
                    ${address.first_name} ${address.last_name}
                  </p>
                  <p style="margin:0;color:#666;font-size:14px;line-height:1.8;">
                    ${address.address_line1}${address.address_line2 ? "<br/>" + address.address_line2 : ""}<br/>
                    ${address.suburb}, ${address.city}<br/>
                    ${address.province} ${address.postal_code}
                  </p>
                  ${address.phone ? `<p style="margin:8px 0 0;color:#888;font-size:13px;">📞 ${address.phone}</p>` : ""}
                </td>
              </tr>
            </table>

            <!-- Footer note -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;padding-top:24px;border-top:1px solid #f0f0f0;">
              <tr>
                <td style="text-align:center;">
                  <p style="margin:0 0 6px;color:#999;font-size:13px;">
                    Questions about your order? Reply to this email or contact us.
                  </p>
                  <p style="margin:0;color:#ccc;font-size:12px;">
                    © ${new Date().getFullYear()} Multi Business Style · South Africa
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}
