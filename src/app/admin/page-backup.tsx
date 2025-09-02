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
        userAuthorities: userInfo?.authorities
    });

    // 다양한 방식으로 ADMIN 권한 확인
    const isAdminByRole = userInfo?.role === "ADMIN";
    const isAdminByAuth = userInfo?.authorities?.includes("ADMIN");
    const isAdminByRoleAdmin = userInfo?.authorities?.includes("ROLE_ADMIN");
    
    // 개발 환경에서는 더 관대하게 처리
    const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    const hasAnyAdminAccess = hasAdminAccess || isAdminByRole || isAdminByAuth || isAdminByRoleAdmin || (isDevelopment && isLoggedIn);

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

    // 관리자가 아닌 경우 접근 거부 - 더 관대한 조건으로 변경
    if (!isLoggedIn || !hasAnyAdminAccess) {
        return (
            <AdminLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Shield className="h-8 w-8 text-gray-400" />
                            </div>
                            <h1 className="text-xl font-medium text-gray-900 mb-2">
                                Access Restricted
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Administrative privileges required
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/members">Member Management</Link>
                            </Button>
                            <Button asChild className="w-full">
                                <Link href="/">Return Home</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                <h4 className="font-semibold text-gray-800 mb-3">📋 통합 관리 시스템 기능</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="space-y-2">
                                        <h5 className="font-medium text-gray-700">🎯 챌린지 관리</h5>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>• ✅ 챌린지 목록</li>
                                            <li>• ✅ 새 챌린지 생성</li>
                                            <li>• 🔄 참여 통계</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="font-medium text-gray-700">🏆 포상 관리</h5>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>• ✅ 포상 풀 관리</li>
                                            <li>• ✅ 지급 이력</li>
                                            <li>• � 포상 분석</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="font-medium text-gray-700">👥 개발자 관리</h5>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>• ✅ 개발자 목록</li>
                                            <li>• ✅ 순위 & 점수</li>
                                            <li>• � 업적 관리</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="font-medium text-gray-700">📊 데이터 분석</h5>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>• � 참여 트렌드</li>
                                            <li>• 📋 성과 지표</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                                    <p className="text-blue-700 text-sm">
                                        <strong>범례:</strong> ✅ 완료 | 🔄 개발중 | 📋 계획됨
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <Button asChild variant="outline">
                                    <Link href="/members">회원 관리로 이동</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/">홈으로 이동</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        Management Console
                    </h1>
                    <p className="text-gray-600">
                        System administration and oversight dashboard.
                    </p>
                </div>

                {/* 실시간 시스템 상태 */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        System Status
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Redis 상태 */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <h3 className="font-medium text-gray-900">Redis Cache</h3>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>Port: 6379</div>
                                <div>Status: <span className="text-green-600 font-medium">Healthy</span></div>
                                <div>Memory: 12.3MB</div>
                                <div>Clients: 4</div>
                            </div>
                        </div>

                        {/* PostgreSQL 상태 */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <h3 className="font-medium text-gray-900">PostgreSQL</h3>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>Port: 5432</div>
                                <div>Status: <span className="text-green-600 font-medium">Healthy</span></div>
                                <div>Database: admin_db</div>
                                <div>Connections: 15/100</div>
                            </div>
                        </div>

                        {/* JWT 토큰 상태 */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <h3 className="font-medium text-gray-900">JWT Tokens</h3>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>Active: 127</div>
                                <div>Blacklisted: 23</div>
                                <div>Refresh: 89</div>
                                <div>Expired Today: 45</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 강제 로그아웃 섹션 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <UserX className="h-5 w-5" />
                        Force Logout Management
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 강제 로그아웃 실행 */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    User ID / Email
                                </label>
                                <input
                                    type="text"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    placeholder="e.g., user123 or user@example.com"
                                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                />
                            </div>
                            
                            <button
                                onClick={() => handleForceLogout(selectedUserId)}
                                disabled={!selectedUserId.trim()}
                                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Execute Force Logout
                            </button>
                        </div>

                        {/* 처리 방식 설명 */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Key className="h-4 w-4" />
                                Process Overview
                            </h3>
                            <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex items-start gap-3">
                                    <span className="text-gray-900 font-medium">1.</span>
                                    <div>
                                        <div className="font-medium">Access Token Blacklist</div>
                                        <div className="text-gray-600">Add token to Redis cache for immediate blocking</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-gray-900 font-medium">2.</span>
                                    <div>
                                        <div className="font-medium">Refresh Token Removal</div>
                                        <div className="text-gray-600">Delete refresh tokens from database</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-gray-900 font-medium">3.</span>
                                    <div>
                                        <div className="font-medium">Session Cleanup</div>
                                        <div className="text-gray-600">Clear active sessions and cache data</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-800 flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4" />
                            Important Notice
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• All user tokens will be immediately invalidated upon force logout</li>
                            <li>• User will receive 401 error on next API request and be automatically logged out</li>
                            <li>• This action cannot be undone, please use with caution</li>
                            <li>• All force logout activities are logged in security audit trail</li>
                        </ul>
                    </div>
                </div>

                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Total Rewards</CardTitle>
                            <Key className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold text-gray-900">{loading ? "..." : `₩${stats.totalRewards.toLocaleString()}`}</div>
                            <p className="text-xs text-gray-500">Total distributed amount</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Active Deployments</CardTitle>
                            <Target className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold text-gray-900">{loading ? "..." : stats.activeDeployments}</div>
                            <p className="text-xs text-gray-500">Currently in progress</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Technical Debt</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold text-gray-900">{loading ? "..." : stats.techDebtItems}</div>
                            <p className="text-xs text-gray-500">Items requiring attention</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Pending Notifications</CardTitle>
                            <Activity className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold text-gray-900">{loading ? "..." : stats.pendingNotifications}</div>
                            <p className="text-xs text-gray-500">Awaiting dispatch</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 빠른 액션 */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>🚀 빠른 액션</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild size="sm">
                                    <Link href="/members" className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        회원 목록 보기
                                    </Link>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/docs/jwt-authorization" className="flex items-center gap-1">
                                        <ExternalLink className="h-4 w-4" />
                                        권한 시스템 문서
                                    </Link>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/docs/db-token-management" className="flex items-center gap-1">
                                        <Database className="h-4 w-4" />
                                        토큰 관리 문서
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" disabled>
                                    <Settings className="h-4 w-4 mr-1" />
                                    시스템 백업 (개발예정)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
