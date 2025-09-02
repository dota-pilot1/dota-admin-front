"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useAuthStore } from "@/features/auth/store/authStore";
import { isAdmin, getCurrentUser } from "@/entities/user/lib/auth-utils";
import { Shield, Users, Activity, Settings, Database, Key, AlertTriangle, ExternalLink, LogOut, UserX, Target } from "lucide-react";
import Link from "next/link";
import { AdminLayout } from "./components/AdminLayout";

interface AdminStats {
    totalRewards: number;
    activeDeployments: number;
    techDebtItems: number;
    pendingNotifications: number;
}

export default function AdminPage() {
    const { user, isLoggedIn } = useAuthStore();
    const [stats, setStats] = useState<AdminStats>({
        totalRewards: 0,
        activeDeployments: 0,
        techDebtItems: 0,
        pendingNotifications: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState('');

    // 관리자 권한 확인
    const userInfo = getCurrentUser();
    const hasAdminAccess = isAdmin();
    
    // 디버깅용 로그
    console.log('🔍 Admin Page - 권한 확인:', {
        userInfo,
        isLoggedIn,
        hasAdminAccess,
        userRole: userInfo?.role,
        userAuthorities: userInfo?.authorities,
        hostname: window.location.hostname,
        nodeEnv: process.env.NODE_ENV
    });

    // 다양한 방식으로 ADMIN 권한 확인
    const isAdminByRole = userInfo?.role === "ADMIN";
    const isAdminByAuth = userInfo?.authorities?.includes("ADMIN");
    const isAdminByRoleAdmin = userInfo?.authorities?.includes("ROLE_ADMIN");
    
    // 개발 환경에서는 더 관대하게 처리
    const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    
    // 개발 환경에서는 로그인만 되어 있으면 접근 허용
    const hasAnyAdminAccess = isDevelopment 
        ? isLoggedIn 
        : (hasAdminAccess || isAdminByRole || isAdminByAuth || isAdminByRoleAdmin);

    useEffect(() => {
        if (!hasAnyAdminAccess) return;

        // 가짜 통계 데이터 로딩
        const loadStats = async () => {
            try {
                // 실제로는 API에서 가져와야 함
                setTimeout(() => {
                    setStats({
                        totalRewards: 156000,
                        activeDeployments: 12,
                        techDebtItems: 34,
                        pendingNotifications: 8
                    });
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('통계 로딩 실패:', error);
                setLoading(false);
            }
        };

        loadStats();
    }, [hasAnyAdminAccess]);

    // 가짜 강제 로그아웃 함수
    const handleForceLogout = async (userId: string) => {
        if (!userId.trim()) {
            alert('사용자 ID를 입력해주세요.');
            return;
        }

        if (!confirm(`사용자 "${userId}"를 강제 로그아웃하시겠습니까?\n\n⚠️ 이 작업은 다음을 수행합니다:\n- 모든 Access Token 무효화\n- Refresh Token 삭제\n- 활성 세션 종료`)) {
            return;
        }

        try {
            // 가짜 API 호출 시뮬레이션
            alert('🔄 강제 로그아웃 처리 중...');
            
            // 실제로는 이런 API 호출이 들어가야 함:
            // const response = await fetch('/api/admin/force-logout', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            //     },
            //     body: JSON.stringify({ 
            //         userId: userId.trim(),
            //         reason: '관리자에 의한 강제 로그아웃'
            //     })
            // });

            setTimeout(() => {
                alert(`✅ 사용자 "${userId}"가 강제 로그아웃되었습니다.\n\n처리 내용:\n- Access Token 블랙리스트 등록\n- Refresh Token DB에서 삭제\n- 사용자는 다음 API 요청 시 401 에러로 자동 로그아웃`);
                setSelectedUserId('');
            }, 1500);

        } catch (error) {
            console.error('강제 로그아웃 오류:', error);
            alert('❌ 강제 로그아웃 중 오류가 발생했습니다.');
        }
    };

    // 관리자가 아닌 경우 접근 거부 - 개발 환경에서는 우회
    if (!isDevelopment && (!isLoggedIn || !hasAnyAdminAccess)) {
        return (
            <AdminLayout>
                <div className="max-w-md mx-auto mt-20 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-6 w-6 text-gray-400" />
                    </div>
                    <h1 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h1>
                    <p className="text-sm text-gray-500 mb-6">Admin privileges required</p>
                    
                    <div className="space-y-2">
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/members">Members</Link>
                        </Button>
                        <Button asChild className="w-full">
                            <Link href="/">Home</Link>
                        </Button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                {/* 헤더 */}
                <div className="mb-6">
                    <h1 className="text-lg font-medium text-gray-900">Dashboard</h1>
                </div>

                {/* 시스템 상태 */}
                <div className="bg-white border border-gray-200 rounded p-4 mb-6">
                    <h2 className="text-sm font-medium text-gray-900 mb-3">System Status</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {/* Redis */}
                        <div className="bg-gray-50 rounded p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <h3 className="text-xs font-medium text-gray-900">Redis</h3>
                            </div>
                            <div className="text-xs text-gray-600">Port: 6379</div>
                        </div>

                        {/* PostgreSQL */}
                        <div className="bg-gray-50 rounded p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <h3 className="text-xs font-medium text-gray-900">PostgreSQL</h3>
                            </div>
                            <div className="text-xs text-gray-600">Port: 5432</div>
                        </div>

                        {/* JWT */}
                        <div className="bg-gray-50 rounded p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <h3 className="text-xs font-medium text-gray-900">JWT</h3>
                            </div>
                            <div className="text-xs text-gray-600">Active: 127</div>
                        </div>
                    </div>
                </div>

                {/* 강제 로그아웃 */}
                <div className="bg-white border border-gray-200 rounded p-4 mb-6">
                    <h2 className="text-sm font-medium text-gray-900 mb-3">Force Logout</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-700 mb-1">User ID</label>
                            <input
                                type="text"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                placeholder="user123"
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                            <button
                                onClick={() => handleForceLogout(selectedUserId)}
                                disabled={!selectedUserId.trim()}
                                className="w-full mt-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-2 px-4 rounded text-sm"
                            >
                                Execute
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded p-3">
                            <h3 className="text-xs font-medium text-gray-900 mb-2">Process</h3>
                            <div className="space-y-1 text-xs text-gray-700">
                                <div>1. Blacklist token</div>
                                <div>2. Remove refresh token</div>
                                <div>3. Clear sessions</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-xs text-yellow-700">
                            This action cannot be undone. User will be logged out immediately.
                        </p>
                    </div>
                </div>

                {/* 통계 */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded p-3">
                        <div className="text-xs text-gray-500">Rewards</div>
                        <div className="text-lg font-medium text-gray-900">{loading ? "..." : `₩${stats.totalRewards.toLocaleString()}`}</div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded p-3">
                        <div className="text-xs text-gray-500">Deployments</div>
                        <div className="text-lg font-medium text-gray-900">{loading ? "..." : stats.activeDeployments}</div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded p-3">
                        <div className="text-xs text-gray-500">Tech Debt</div>
                        <div className="text-lg font-medium text-gray-900">{loading ? "..." : stats.techDebtItems}</div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded p-3">
                        <div className="text-xs text-gray-500">Notifications</div>
                        <div className="text-lg font-medium text-gray-900">{loading ? "..." : stats.pendingNotifications}</div>
                    </div>
                </div>

                {/* 액션 */}
                <div className="bg-white border border-gray-200 rounded p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                    <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                            <Link href="/members">Members</Link>
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                            Settings
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
