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
        <main className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">회원 관리</h1>
                <UsersRemotePanel />
            </div>
        </main>
    );
}
