"use client";

import { UsersRemotePanel } from "@/features/users/ui/users-remote-panel";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useMemo } from "react";
import { isAdmin } from "@/entities/user/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Shield, Key, AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function MembersPage() {
    const { user, id, isLoggedIn } = useAuthStore();
    const displayName = useMemo(() => {
        if (user) return user;
        return isLoggedIn ? "알수없는 사용자" : "게스트";
    }, [user, isLoggedIn]);

    // 더 관대한 관리자 권한 확인
    const userInfo = user;
    const hasAdminAccess = isAdmin() || 
                          userInfo === "ADMIN" || 
                          (process.env.NODE_ENV === 'development' && isLoggedIn);

    return (
        <main className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">회원 관리</h1>
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-muted-foreground">
                        현재 사용자: <span className="font-medium">{displayName}</span>{id ? ` (ID: ${id})` : ""}
                    </p>
                    
                    {/* 관리자 페이지 이동 버튼 */}
                    {hasAdminAccess && (
                        <Button asChild variant="destructive" size="sm" className="ml-auto">
                            <Link href="/admin" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                🛡️ 관리자 페이지
                                <ExternalLink className="h-3 w-3" />
                            </Link>
                        </Button>
                    )}
                </div>

                {/* 관리자 전용 도구 섹션 */}
                {hasAdminAccess && (
                    <div className="mb-8">
                        <Card className="border-blue-200 bg-blue-50/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-700">
                                    <Shield className="h-5 w-5" />
                                    관리자 도구
                                    <Badge variant="secondary" className="ml-2">ADMIN</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* 세션 관리 */}
                                    <div className="p-4 bg-white rounded-lg border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Key className="h-4 w-4 text-blue-600" />
                                            <h3 className="font-medium">세션 관리</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            사용자 토큰 관리 및 강제 로그아웃
                                        </p>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" disabled>
                                                토큰 관리
                                            </Button>
                                            <Badge variant="outline" className="text-xs">개발중</Badge>
                                        </div>
                                    </div>

                                    {/* 권한 관리 */}
                                    <div className="p-4 bg-white rounded-lg border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield className="h-4 w-4 text-green-600" />
                                            <h3 className="font-medium">권한 관리</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            사용자 역할 및 권한 변경
                                        </p>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" disabled>
                                                권한 설정
                                            </Button>
                                            <Badge variant="outline" className="text-xs">예정</Badge>
                                        </div>
                                    </div>

                                    {/* 관리자 대시보드 */}
                                    <div className="p-4 bg-white rounded-lg border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                                            <h3 className="font-medium">관리자 대시보드</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            전체 시스템 관리 및 모니터링
                                        </p>
                                        <div className="flex gap-2">
                                            <Button asChild size="sm">
                                                <Link href="/admin" className="flex items-center gap-1">
                                                    이동하기
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                            <Badge variant="secondary" className="text-xs">사용 가능</Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* 관리자 알림 */}
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-yellow-800">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span className="text-sm font-medium">관리자 알림</span>
                                    </div>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        강제 로그아웃 및 세션 관리 기능은 현재 개발 중입니다. 
                                        기본적인 회원 목록 조회 및 관리자 대시보드는 사용 가능합니다.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* 기존 회원 관리 패널 */}
                <UsersRemotePanel />
            </div>
        </main>
    );
}
