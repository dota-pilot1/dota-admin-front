import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, email, password } = await req
    .json()
    .catch(() => ({ username: "", email: "", password: "" }));

  if (!username || !email || !password) {
    return NextResponse.json(
      { ok: false, message: "username, email, password 가 필요합니다." },
      { status: 400 }
    );
  }

  // 실제 서비스라면 DB에 사용자 생성 로직 수행
  return NextResponse.json(
    {
      ok: true,
      username,
      message: "User registered successfully",
      userId: 1,
    },
    { status: 201 }
  );
}
