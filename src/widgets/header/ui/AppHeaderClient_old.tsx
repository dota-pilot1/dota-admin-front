"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/entities/user/lib/auth-utils";
import { ChevronDown } from "lucide-react";

export function AppHeaderClient() {
    const pathname = usePathname();
    const logout = useLogout();
    const [isAuthed, setIsAuthed] = useState(false);
    const [userInfo, setUserInfo] = useState<{
        username: string;
        email: string;
        role: string;
    } | null>(null);
    const [docsOpen, setDocsOpen] = useState(false);

    // localStorage에서 인증 상태 확인
    useEffect(() => {
        const checkAuthStatus = () => {
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
        };

        // 초기 체크
        checkAuthStatus();

        // storage 이벤트 리스너 추가 (다른 탭에서 로그인/로그아웃 시)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "authToken" || e.key === "userInfo") {
                checkAuthStatus();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // 주기적으로 토큰 상태 체크 (500ms 간격)
        const interval = setInterval(checkAuthStatus, 500);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
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
                            // 기본 진입점: 루트(/) 접근 시 이 메뉴를 활성화 처리
                            { href: "/challenge", label: "챌린지" },
                            { href: "/challenge-stats", label: "챌린지 통계" },
                            { href: "/dashboard", label: "Tech Hub" },
                            { href: "/freeboard", label: "자유 게시판" },
                            { href: "/members", label: "회원 관리" },
                            { href: "/payments", label: "결제 내역" },
                        ].map(({ href, label }) => {
                            // 기본 선택: 루트('/')일 때 챌린지 메뉴(/challenge) 활성화
                            const isHome = pathname === '/' || pathname === '';
                            let isActive = pathname === href || (href !== '/' && pathname?.startsWith(href + '/'));
                            if (isHome && href === '/challenge') {
                                isActive = true;
                            }
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`text-sm font-medium transition-colors px-2 py-1 rounded-md ${
                                        isActive
                                            ? "text-blue-600 font-bold bg-blue-50 border border-blue-300"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}

                        {/* 문서 드롭다운 메뉴 */}
                        <div className="relative">
                            <button
                                onClick={() => setDocsOpen(!docsOpen)}
                                className={`text-sm font-medium transition-colors px-2 py-1 rounded-md flex items-center gap-1 ${
                                    pathname?.startsWith('/docs')
                                        ? "text-blue-600 font-bold bg-blue-50 border border-blue-300"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                문서
                                <ChevronDown className={`h-3 w-3 transition-transform ${docsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {docsOpen && (
                                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg border rounded-md py-1 min-w-[220px] z-50">
                                    <Link
                                        href="/docs"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        📚 문서 홈
                                    </Link>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <Link
                                        href="/docs/login-system-guide"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        � 로그인 시스템 가이드
                                    </Link>
                                    <Link
                                        href="/docs/login-flow-analysis"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        � 로그인 플로우 분석
                                    </Link>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <Link
                                        href="/docs/token-basics"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        � 토큰 기초 이해하기
                                    </Link>
                                </div>
                            )}
                        </div>
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