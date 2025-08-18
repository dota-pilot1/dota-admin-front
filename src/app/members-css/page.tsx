"use client";

import { useState, useEffect } from "react";
import UsersRemotePanelCSS from "@/features/users/ui/users-remote-panel-css";

export default function MembersCSSPage() {
    const [username, setUsername] = useState<string>('게스트');

    useEffect(() => {
        const u = localStorage.getItem("username");
        if (u) setUsername(u);
    }, []);

    return (
        <main className="container mx-auto px-4 py-6 space-y-6">
            <h1 className="text-2xl font-bold">회원 관리 (CSS Counter)</h1>
            <p className="text-sm text-muted-foreground">안녕하세요, {username} 님 - CSS Counter 최적화 버전</p>
            <div className="max-w-3xl">
                <UsersRemotePanelCSS />
            </div>
        </main>
    );
}
