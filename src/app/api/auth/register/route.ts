import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json().catch(() => ({}));
		const { email = "user" + Date.now() + "@example.com" } = body;
		const userId = Math.floor(Math.random() * 100000);
		return NextResponse.json({ success: true, user: { email, userId } });
	} catch (e) {
		return NextResponse.json({ success: false }, { status: 400 });
	}
}

export const dynamic = "force-dynamic";
