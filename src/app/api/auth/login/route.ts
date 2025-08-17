import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // In real app, validate credentials; here we accept any non-empty email/password
  const { email, password } = await req.json().catch(() => ({ email: "", password: "" }));
  if (!email || !password) {
    return NextResponse.json({ ok: false, message: "Email and password are required" }, { status: 400 });
  }

  // Set a simple cookie to mock auth (HttpOnly off for demo simplicity; set true in real app)
  const cookieStore = await cookies();
  cookieStore.set("auth", "1", { path: "/", maxAge: 60 * 60 * 24 * 7 });
  cookieStore.set("user", email, { path: "/", maxAge: 60 * 60 * 24 * 7 });

  return NextResponse.json({ ok: true });
}
