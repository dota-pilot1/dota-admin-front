"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useEffect, useState, useRef } from "react";
import { getCurrentUser } from "@/entities/user/lib/auth-utils";
import { ChevronDown, Star } from "lucide-react";

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
    const [favoritesOpen, setFavoritesOpen] = useState(false);

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

    // 즐겨찾기 목록
    const favorites = [
        {
            id: 1,
            title: "UI 샘플 1000개 만들기",
            url: "https://interactive-ui-level1-sxj6.vercel.app/",
            description: "인터랙티브 UI 챌린지 사이트"
        },
        // 추가 즐겨찾기는 여기에 넣을 수 있습니다
    ];

    // 드롭다운 외부 클릭 시 닫기 처리
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.dropdown-docs') && docsOpen) {
                setDocsOpen(false);
            }
            if (!target.closest('.dropdown-favorites') && favoritesOpen) {
                setFavoritesOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [docsOpen, favoritesOpen]);

    const handleLogout = () => {
        logout.mutate();
    };

    if (pathname?.startsWith("/login")) return null;

    return (
        <>
        <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
            <div className="container mx-auto flex items-center justify-between py-2 px-4">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    Dota Admin
                </Link>

                {/* Main navigation - 인증된 사용자만 표시 */}
                {isAuthed && (
                    <nav className="flex items-center gap-6">
                        {[
                            { href: "/challenge", label: "챌린지" },
                            { href: "/challenge-stats", label: "챌린지 통계" },
                            { href: "/dashboard", label: "Tech Hub" },
                            { href: "/freeboard", label: "자유 게시판" },
                            { href: "/members", label: "회원 관리" },
                            { href: "/docs2", label: "문서2" },
                            // { href: "/payments", label: "결제 내역" }, // 임시 주석 처리
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

                        {/* 즐겨찾기 버튼 */}
                        <button
                            onClick={() => setFavoritesOpen(!favoritesOpen)}
                            className={`text-sm font-medium transition-colors px-2 py-1 rounded-md flex items-center gap-1 ${
                                favoritesOpen
                                    ? "text-yellow-600 font-bold bg-yellow-50 border border-yellow-300"
                                    : "text-muted-foreground hover:text-foreground hover:text-yellow-600"
                            }`}
                        >
                            <Star className="h-3 w-3" />
                            즐겨찾기
                        </button>

                        {/* 문서 드롭다운 메뉴 */}
                        <div className="relative dropdown-docs">
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
                                    
                                    {/* 로그인 시스템 섹션 */}
                                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        로그인 시스템
                                    </div>
                                    <Link
                                        href="/docs/frontend/overview"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        🧩 프론트엔드 총정리
                                    </Link>
                                    <Link
                                        href="/docs/backend/overview"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        🗄️ 백엔드 총정리
                                    </Link>
                                    
                                    <div className="border-t border-gray-200 my-1"></div>
                                    
                                    {/* 권한 관리 섹션 */}
                                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        권한 관리
                                    </div>
                                    <Link
                                        href="/docs/authorization-process"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        🔐 권한 관리 프로세스
                                    </Link>
                                    <Link
                                        href="/docs/auth-system"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        🛡️ 권한 / 롤 시스템
                                    </Link>
                                    
                                    <div className="border-t border-gray-200 my-1"></div>
                                    
                                    {/* 인증 컴포넌트 섹션 */}
                                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        인증 컴포넌트
                                    </div>
                                    <Link
                                        href="/docs/axios-vs-authguard"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        🔄 Axios vs AuthGuard
                                    </Link>
                                    <Link
                                        href="/docs/axios-interceptor"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        🚀 Axios 인터셉터
                                    </Link>
                                    <Link
                                        href="/docs/authguard"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        🛡️ AuthGuard
                                    </Link>
                                    
                                    <div className="border-t border-gray-200 my-1"></div>
                                    
                                    {/* 핵심 요약 섹션 */}
                                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        핵심 요약
                                    </div>
                                    <Link
                                        href="/docs/login-logic-summary"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDocsOpen(false)}
                                    >
                                        ⚡ 로그인 로직 5단계
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

        {/* 즐겨찾기 드롭다운 - 전체 화면 오버레이 */}
        {favoritesOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 dropdown-favorites">
                {/* 배경 오버레이 */}
                <div 
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setFavoritesOpen(false)}
                />
                
                {/* 즐겨찾기 카드 */}
                <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 p-6 m-4 max-w-md w-full animate-in slide-in-from-top-4 duration-300 z-50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            즐겨찾기
                        </h3>
                        <button
                            onClick={() => setFavoritesOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {favorites.map((favorite, index) => (
                            <div
                                key={favorite.id}
                                className="block p-3 rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log('즐겨찾기 클릭:', favorite.url);
                                    window.open(favorite.url, '_blank', 'noopener,noreferrer');
                                    setFavoritesOpen(false);
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <span className="text-yellow-600 font-bold text-sm">#{index + 1}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate">
                                            {favorite.title}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {favorite.description}
                                        </div>
                                        <div className="text-xs text-blue-600 truncate mt-1">
                                            {favorite.url}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {favorites.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Star className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                <p>아직 등록된 즐겨찾기가 없습니다</p>
                            </div>
                        )}
                    </div>
                    
                    {/* 전체 즐겨찾기 페이지로 가는 링크 */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <Link 
                            href="/favorites" 
                            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                            onClick={() => setFavoritesOpen(false)}
                        >
                            <Star className="h-4 w-4" />
                            모든 즐겨찾기 관리하기
                        </Link>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
