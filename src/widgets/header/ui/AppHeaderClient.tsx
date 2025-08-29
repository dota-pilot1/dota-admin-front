"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/entities/user/lib/auth-utils";

export function AppHeaderClient() {
    const pathname = usePathname();
    const logout = useLogout();
    const [isAuthed, setIsAuthed] = useState(false);
    const [userInfo, setUserInfo] = useState<{
        username: string;
        email: string;
        role: string;
    } | null>(null);

    // localStorage에서 인증 상태 확인
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const user = getCurrentUser();

        if (token && user) {
            setIsAuthed(true);
            setUserInfo({
                username: user.username,
                email: user.email,
                role: user.role
            });
        } else {
            setIsAuthed(false);
            setUserInfo(null);
        }
    }, []);

    const handleLogout = () => {
        logout.mutate();
    };

    if (pathname?.startsWith("/login")) return null;

    return (
        <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
            <div className="container mx-auto flex items-center justify-between py-2 px-4">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    Dota Admin
                </Link>

                {/* Main navigation - 인증된 사용자만 표시 */}
                {isAuthed && (
                    <nav className="flex items-center gap-6">
                        {[
                            { href: "/dashboard", label: "대시보드" },
                            { href: "/challenge", label: "챌린지" },
                            { href: "/freeboard", label: "자유 게시판" },
                            { href: "/members", label: "회원 관리" },
                            { href: "/payments", label: "결제 내역" },
                            { href: "/docs", label: "문서" },
                            { href: "/docs/auth-system", label: "권한 시스템" },
                        ].map(({ href, label }) => {
                            const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`text-sm font-medium transition-colors px-2 py-1 rounded-md ${
                                        isActive
                                            ? "text-blue-600 font-bold underline underline-offset-4 bg-blue-50 border border-blue-300"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                )}

                {/* Auth section - 오른쪽 정렬 */}
                <div className="flex items-center gap-3">
                    {isAuthed && userInfo ? (
                        <>
                            <div className="text-sm bg-gray-100 px-3 py-1 rounded-md">
                                <span className="font-medium">{userInfo.username}</span>
                                <span className="text-muted-foreground ml-1">({userInfo.role})</span>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleLogout}
                                disabled={logout.isPending}
                                className="h-8"
                            >
                                {logout.isPending ? "로그아웃 중..." : "로그아웃"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button asChild size="sm" variant="default" className="h-8">
                                <Link href="/login">로그인</Link>
                            </Button>
                            <Button asChild size="sm" variant="outline" className="h-8">
                                <Link href="/register">회원가입</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
            {/* 더 얇은 accent bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 to-yellow-400" />
        </header>
    );
}