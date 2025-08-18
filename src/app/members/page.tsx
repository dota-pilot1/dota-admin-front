"use client";

import { useState, useEffect } from 'react';
import { UsersRemotePanel } from "@/features/users/ui/users-remote-panel";

export default function MembersPage() {
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

    return (
        <main className="container mx-auto px-4 py-6 space-y-6">
            <h1 className="text-2xl font-bold">회원 관리</h1>
            <div className="max-w-3xl">
                <UsersRemotePanel />
            </div>
        </main>
    );
}
