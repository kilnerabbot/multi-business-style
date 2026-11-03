import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST() {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get("mbs_admin")?.value;
  if (session !== (process.env.MBS_ADMIN_SECRET ?? "mbs-fallback-secret")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Make the bucket public
  const { data, error } = await db.storage.updateBucket("product-images", {
    public: true,
    allowedMimeTypes: ["image/*"],
    fileSizeLimit: 10485760, // 10MB
  });

  if (error) {
    // Bucket might not exist yet — try creating it as public
    const { data: created, error: createErr } = await db.storage.createBucket("product-images", {
      public: true,
      allowedMimeTypes: ["image/*"],
      fileSizeLimit: 10485760,
    });
    if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 });
    return NextResponse.json({ ok: true, action: "created", data: created });
  }

  return NextResponse.json({ ok: true, action: "updated", data });
}
