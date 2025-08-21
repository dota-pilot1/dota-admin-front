import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({ success: true });
}

export const dynamic = "force-dynamic";
