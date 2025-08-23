"use client";

import { UsersRemotePanel } from "@/features/users/ui/users-remote-panel";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useMemo } from "react";

export default function MembersPage() {
    const { user, id, isLoggedIn } = useAuthStore();
    const displayName = useMemo(() => {
        if (user) return user;
        return isLoggedIn ? "알수없는 사용자" : "게스트";
    }, [user, isLoggedIn]);

    return (
        <main className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">회원 관리</h1>
                <p className="text-sm text-muted-foreground mb-6">
                    현재 사용자: <span className="font-medium">{displayName}</span>{id ? ` (ID: ${id})` : ""}
                </p>
                <UsersRemotePanel />
            </div>
        </main>
    );
}
