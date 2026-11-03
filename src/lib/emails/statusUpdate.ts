export type UpdateStatus = "processing" | "shipped" | "delivered" | "cancelled";

const STATUS_CONFIG: Record<UpdateStatus, { emoji: string; headline: string; body: string; color: string }> = {
  processing: {
    emoji: "🔧",
    headline: "We're preparing your order",
    body: "Good news — your order is now being processed and packed. We'll notify you as soon as it's on its way.",
    color: "#7c3aed",
  },
  shipped: {
    emoji: "🚚",
    headline: "Your order is on its way!",
    body: "Your order has been handed to our delivery partner and is heading your way. Keep an eye out — it should arrive soon.",
    color: "#ea580c",
  },
  delivered: {
    emoji: "🎉",
    headline: "Order delivered!",
    body: "Your order has been delivered. We hope you love your new items! If anything isn't right, please reach out and we'll make it good.",
    color: "#16a34a",
  },
  cancelled: {
    emoji: "❌",
    headline: "Order cancelled",
    body: "Your order has been cancelled. If you didn't request this or have any questions, please contact us right away.",
    color: "#dc2626",
  },
};

export function statusUpdateHtml({
  orderId,
  status,
  customerName,
}: {
  orderId: string;
  status: UpdateStatus;
  customerName?: string;
}): string {
  const shortId = orderId.slice(0, 8).toUpperCase();
  const cfg = STATUS_CONFIG[status];
  const name = customerName?.trim() || "there";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Order Update — MBS #${shortId}</title>
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

        <!-- Status colour bar -->
        <tr>
          <td style="background:${cfg.color};height:4px;"></td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px 40px 36px;border-radius:0 0 16px 16px;text-align:center;">

            <!-- Big emoji -->
            <p style="margin:0 0 16px;font-size:48px;line-height:1;">${cfg.emoji}</p>

            <!-- Status label -->
            <p style="margin:0 0 8px;color:${cfg.color};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
              Order Update
            </p>

            <!-- Headline -->
            <h2 style="margin:0 0 16px;color:#0D1B2A;font-size:26px;font-weight:800;line-height:1.2;">
              ${cfg.headline}
            </h2>

            <!-- Body copy -->
            <p style="margin:0 0 28px;color:#666;font-size:15px;line-height:1.7;max-width:420px;margin-left:auto;margin-right:auto;">
              Hi ${name}, ${cfg.body}
            </p>

            <!-- Order ref pill -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
              <tr>
                <td style="background:#F9FAFB;border:1px solid #e5e7eb;border-radius:8px;padding:10px 20px;">
                  <span style="color:#888;font-size:12px;">Order reference: </span>
                  <strong style="color:#0D1B2A;font-size:13px;font-family:monospace;">#${shortId}</strong>
                </td>
              </tr>
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-top:1px solid #f0f0f0;padding-top:24px;">
                  <p style="margin:0 0 4px;color:#999;font-size:13px;">
                    Questions? Just reply to this email.
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
