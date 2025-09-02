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
            <header className="sticky top-0 z-50 w-full">
                {/* 메인 헤더 영역 */}
                <div className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200/80">
                    <div className="container flex h-14 max-w-screen-2xl items-center px-6">
                        {/* 로고 및 홈 링크 */}
                        <Link href="/" className="flex items-center space-x-2 mr-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">D</span>
                            </div>
                            <span className="font-semibold text-gray-900">DOTA Admin</span>
                        </Link>

                        {/* 네비게이션 */}
                        <nav className="flex items-center space-x-1 flex-1">
                            <Link 
                                href="/dashboard" 
                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    pathname === "/dashboard" 
                                        ? "bg-blue-100 text-blue-700" 
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                대시보드
                            </Link>
                            <Link 
                                href="/challenge" 
                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    pathname === "/challenge" 
                                        ? "bg-blue-100 text-blue-700" 
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                챌린지
                            </Link>
                            <Link 
                                href="/members" 
                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    pathname === "/members" 
                                        ? "bg-blue-100 text-blue-700" 
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                회원 관리
                            </Link>
                            <Link 
                                href="/freeboard" 
                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    pathname === "/freeboard" 
                                        ? "bg-blue-100 text-blue-700" 
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                자유게시판
                            </Link>

                            {/* 즐겨찾기 드롭다운 */}
                            <div className="relative dropdown-favorites">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFavoritesOpen(!favoritesOpen);
                                        setDocsOpen(false);
                                    }}
                                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1"
                                >
                                    <Star className="h-4 w-4" />
                                    즐겨찾기
                                </button>
                            </div>
                        </nav>

                        {/* 우측 사용자 영역 */}
                        <div className="flex items-center space-x-4">
                            {isAuthed && userInfo && (
                                <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">{userInfo.username}</div>
                                        <div className="text-xs text-gray-500">{userInfo.role}</div>
                                    </div>
                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                    >
                                        로그아웃
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
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
