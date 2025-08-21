import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json().catch(() => ({}));
		const { email = "guest@example.com", password } = body;

		// 아주 단순한 mock: password 체크 생략
		const token = "mock-token-" + Math.random().toString(36).slice(2);
		const userId = Math.floor(Math.random() * 100000);
		return NextResponse.json({
			success: true,
			token,
			user: { email, userId },
		});
	} catch (e) {
		return NextResponse.json({ success: false, message: "로그인 실패" }, { status: 400 });
	}
}
