"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { 
    UserX, 
    LogOut, 
    AlertTriangle, 
    Key, 
    Activity, 
    Clock,
    Search,
    RefreshCw
} from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";

// 가짜 활성 세션 데이터
const mockActiveSessions = [
    {
        id: '1',
        userId: 'user123',
        username: 'john_doe',
        email: 'john@example.com',
        loginTime: '2025-01-02 14:30:22',
        lastActivity: '2025-01-02 15:45:10',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0.0.0',
        tokenCount: 2
    },
    {
        id: '2',
        userId: 'user456',
        username: 'jane_smith',
        email: 'jane@example.com',
        loginTime: '2025-01-02 13:15:45',
        lastActivity: '2025-01-02 15:42:33',
        ipAddress: '10.0.0.50',
        userAgent: 'Firefox 121.0',
        tokenCount: 1
    },
    {
        id: '3',
        userId: 'user789',
        username: 'admin_test',
        email: 'admin@example.com',
        loginTime: '2025-01-02 12:00:00',
        lastActivity: '2025-01-02 15:44:55',
        ipAddress: '172.16.0.10',
        userAgent: 'Safari 17.2',
        tokenCount: 3
    }
];

export default function ForceLogoutPage() {
    const [selectedUserId, setSelectedUserId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sessions, setSessions] = useState(mockActiveSessions);
    const [isLoading, setIsLoading] = useState(false);

    // 가짜 강제 로그아웃 함수
    const handleForceLogout = async (userId: string, username?: string) => {
        if (!userId.trim()) {
            alert('사용자 ID를 입력해주세요.');
            return;
        }

        const targetUser = username || userId;
        if (!confirm(`사용자 "${targetUser}"를 강제 로그아웃하시겠습니까?\n\n⚠️ 이 작업은 다음을 수행합니다:\n- 모든 Access Token 무효화\n- Refresh Token 삭제\n- 활성 세션 종료`)) {
            return;
        }

        setIsLoading(true);
        try {
            // 가짜 API 호출 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 세션 목록에서 해당 사용자 제거
            setSessions(prev => prev.filter(session => session.userId !== userId && session.username !== userId));
            
            alert(`✅ 사용자 "${targetUser}"가 강제 로그아웃되었습니다.\n\n처리 내용:\n- Access Token 블랙리스트 등록\n- Refresh Token DB에서 삭제\n- 사용자는 다음 API 요청 시 401 에러로 자동 로그아웃`);
            setSelectedUserId('');

        } catch (error) {
            console.error('강제 로그아웃 오류:', error);
            alert('❌ 강제 로그아웃 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 세션 새로고침
    const refreshSessions = () => {
        setIsLoading(true);
        setTimeout(() => {
            setSessions([...mockActiveSessions]);
            setIsLoading(false);
        }, 1000);
    };

    // 검색 필터링
    const filteredSessions = sessions.filter(session => 
        session.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* 페이지 헤더 */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <UserX className="h-6 w-6 text-red-600" />
                        강제 로그아웃 관리
                        <Badge variant="destructive">핵심 기능</Badge>
                    </h1>
                    <p className="text-gray-600 mt-1">
                        사용자의 모든 토큰을 무효화하여 즉시 로그아웃시킵니다.
                    </p>
                </div>

                {/* 빠른 강제 로그아웃 */}
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-800 flex items-center gap-2">
                            <LogOut className="h-5 w-5" />
                            🚨 빠른 강제 로그아웃
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    placeholder="사용자 ID 또는 이메일 입력 (예: user123, john@example.com)"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>
                            <Button
                                onClick={() => handleForceLogout(selectedUserId)}
                                disabled={!selectedUserId.trim() || isLoading}
                                variant="destructive"
                                className="px-6"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        처리중...
                                    </>
                                ) : (
                                    <>
                                        <UserX className="h-4 w-4 mr-2" />
                                        강제 로그아웃
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 활성 세션 관리 */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-green-600" />
                                활성 세션 목록
                                <Badge variant="secondary">{filteredSessions.length}개</Badge>
                            </CardTitle>
                            <Button 
                                onClick={refreshSessions} 
                                variant="outline" 
                                size="sm"
                                disabled={isLoading}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                새로고침
                            </Button>
                        </div>
                        
                        {/* 검색 */}
                        <div className="flex items-center gap-2 mt-4">
                            <Search className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="사용자명, 이메일, ID로 검색..."
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredSessions.map((session) => (
                                <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-sm">
                                                        {session.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{session.username}</h4>
                                                    <p className="text-sm text-gray-600">{session.email}</p>
                                                </div>
                                                <Badge variant="outline">ID: {session.userId}</Badge>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>로그인: {session.loginTime}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Activity className="h-3 w-3" />
                                                    <span>활동: {session.lastActivity}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Key className="h-3 w-3" />
                                                    <span>토큰: {session.tokenCount}개</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span>IP: {session.ipAddress}</span><br/>
                                                    <span>{session.userAgent}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Button
                                            onClick={() => handleForceLogout(session.userId, session.username)}
                                            variant="destructive"
                                            size="sm"
                                            disabled={isLoading}
                                        >
                                            <UserX className="h-4 w-4 mr-1" />
                                            강제 로그아웃
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            
                            {filteredSessions.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                    <p>활성 세션이 없습니다</p>
                                    {searchTerm && <p className="text-sm">"{searchTerm}"에 대한 검색 결과가 없습니다</p>}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 주의사항 */}
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                        <CardTitle className="text-yellow-800 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            ⚠️ 강제 로그아웃 주의사항
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-yellow-700">
                            <li>• <strong>즉시 효과</strong>: 강제 로그아웃 시 해당 사용자의 모든 토큰이 즉시 무효화됩니다</li>
                            <li>• <strong>자동 리다이렉트</strong>: 사용자는 다음 API 요청 시 401 에러로 로그인 페이지로 이동됩니다</li>
                            <li>• <strong>취소 불가</strong>: 이 작업은 취소할 수 없으니 신중히 사용하세요</li>
                            <li>• <strong>로그 기록</strong>: 모든 강제 로그아웃 이력은 보안 로그에 기록됩니다</li>
                            <li>• <strong>다중 세션</strong>: 사용자가 여러 기기에서 로그인한 경우 모든 세션이 종료됩니다</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
