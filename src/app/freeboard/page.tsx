"use client";

import { useState, useEffect } from 'react';
import { FreeboardList, type Post } from "@/features/freeboard/ui/freeboard-list";

function getFakePosts(): Post[] {
    return [
        {
            id: "1",
            title: "첫 번째 글: 환영합니다 👋",
            author: "관리자",
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            comments: 3,
        },
        {
            id: "2",
            title: "프로젝트 아이디어 공유해요",
            author: "홍길동",
            createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            comments: 7,
        },
        {
            id: "3",
            title: "개발 팁 모음",
            author: "김개발",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            comments: 2,
        },
    ];
}

export default function FreeboardPage() {
    const [username, setUsername] = useState<string>('게스트');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                try {
                    const parsed = JSON.parse(userInfo);
                    setUsername(parsed.username || parsed.name || '사용자');
                } catch (error) {
                    console.error('Failed to parse user info:', error);
                }
            }
        }
    }, []);

    const posts = getFakePosts();

    return (
        <main className="container mx-auto px-4 py-6 space-y-6">
            <h1 className="text-2xl font-bold">자유 게시판</h1>
            <p className="text-sm text-muted-foreground">안녕하세요, {username} 님</p>
            <div className="max-w-3xl">
                <FreeboardList posts={posts} />
            </div>
        </main>
    );
}
