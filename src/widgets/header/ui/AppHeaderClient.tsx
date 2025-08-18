"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useEffect, useState } from "react";

export function AppHeaderClient() {
    const pathname = usePathname();
    const logout = useLogout();
    const [isAuthed, setIsAuthed] = useState(false);
    const [username, setUsername] = useState("guest");

    // localStorage에서 인증 상태 확인
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const userInfo = localStorage.getItem("userInfo");
        
        if (token && userInfo) {
            setIsAuthed(true);
            try {
                const parsed = JSON.parse(userInfo);
                setUsername(parsed.email || parsed.username || "guest");
            } catch {
                setUsername("guest");
            }
        } else {
            setIsAuthed(false);
            setUsername("guest");
        }
    }, []);

    const handleLogout = () => {
        logout.mutate();
    };

    if (pathname?.startsWith("/login")) return null;

    return (
        <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
            <div className="container mx-auto flex items-center justify-between py-3 px-4">
                <Link href="/" className="text-lg font-semibold">
                    Dota Admin
                </Link>
                <nav className="flex items-center gap-4">
                    {/* Main navigation */}
                    {isAuthed && (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                대시보드
                            </Link>
                            <Link
                                href="/freeboard"
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                자유 게시판
                            </Link>
                            <Link
                                href="/members"
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                회원 관리
                            </Link>
                        </>
                    )}

                    {/* Auth section */}
                    {isAuthed ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{username}</span>
                            <Button 
                                size="sm" 
                                variant="secondary" 
                                onClick={handleLogout}
                                disabled={logout.isPending}
                            >
                                {logout.isPending ? "로그아웃 중..." : "로그아웃"}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button asChild size="sm" variant="default">
                                <Link href="/login">로그인</Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                                <Link href="/register">회원가입</Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </div>
            <div className="h-1 w-full bg-yellow-400" />
        </header>
    );
}