import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password, email, name } = body;

        // Basic validation
        if (!username || !password || !email) {
            return NextResponse.json(
                { success: false, message: '필수 정보를 입력해주세요.' },
                { status: 400 }
            );
        }

        // Mock registration - in real app, save to database
        // Check if user already exists (mock check)
        if (username === 'admin') {
            return NextResponse.json(
                { success: false, message: '이미 존재하는 사용자명입니다.' },
                { status: 409 }
            );
        }

        // Create user (mock)
        const newUser = {
            id: Date.now(), // Simple ID generation for mock
            username,
            name: name || username,
            email
        };

        return NextResponse.json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            user: newUser
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
