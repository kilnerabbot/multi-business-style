import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL    = process.env.MBS_ADMIN_EMAIL    ?? "";
const ADMIN_PASSWORD = process.env.MBS_ADMIN_PASSWORD ?? "";
const ADMIN_SECRET   = process.env.MBS_ADMIN_SECRET   ?? "mbs-fallback-secret";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("mbs_admin", ADMIN_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return res;
}
