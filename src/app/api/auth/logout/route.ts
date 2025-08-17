import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 303 See Other ensures browsers navigate to GET /login after POST
  const res = NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  // Remove cookies via response helpers
  res.cookies.delete("auth");
  res.cookies.delete("user");
  return res;
}

export async function GET(req: Request) {
  // If someone hits the URL directly in the browser, handle it too
  const res = NextResponse.redirect(new URL("/login", req.url), { status: 302 });
  res.cookies.delete("auth");
  res.cookies.delete("user");
  return res;
}
