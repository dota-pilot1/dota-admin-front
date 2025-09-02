"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Users, Crown, Shield, User, Clock, Trophy, Coins } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { useApiForGetUserList } from '@/features/users/hooks/useApiForGetUserList';
import type { User as UserType } from '@/features/users/api/getUserList';

export function UserList() {
    const { data: userData, isLoading, isError } = useApiForGetUserList();
    
    // API 응답에서 실제 데이터 추출
    const users = userData?.users ?? [];

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <Crown className="h-3 w-3 text-yellow-600" />;
            case 'MODERATOR':
                return <Shield className="h-3 w-3 text-blue-600" />;
            default:
                return <User className="h-3 w-3 text-gray-600" />;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <Badge variant="default" className="bg-yellow-500 text-xs">관리자</Badge>;
            case 'MODERATOR':
                return <Badge variant="default" className="bg-blue-500 text-xs">모더레이터</Badge>;
            default:
                return <Badge variant="outline" className="text-xs">일반</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <div className="w-2 h-2 bg-green-500 rounded-full" />;
            case 'INACTIVE':
                return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
            case 'BANNED':
                return <div className="w-2 h-2 bg-red-500 rounded-full" />;
            default:
                return <div className="w-2 h-2 bg-gray-300 rounded-full" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatLastLogin = (dateString?: string) => {
        if (!dateString) return '없음';
        const now = new Date();
        const lastLogin = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return '방금 전';
        if (diffInHours < 24) return `${diffInHours}시간 전`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`;
        return formatDate(dateString);
    };

    if (isLoading) {
        return (
            <Card className="h-fit min-h-[300px] flex flex-col">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg flex-shrink-0">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Users className="h-4 w-4 text-indigo-600" />
                        </div>
                        사용자 목록
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 p-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-5 w-12" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="h-fit min-h-[300px] flex flex-col">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg flex-shrink-0">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Users className="h-4 w-4 text-indigo-600" />
                        </div>
                        사용자 목록
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center p-4">
                    <Alert variant="destructive" className="w-full">
                        <AlertDescription>
                            사용자 목록을 불러오지 못했습니다.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col min-h-[300px]">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg px-4 py-3 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Users className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span>사용자 목록</span>
                    </CardTitle>
                    <Badge variant="outline" className="h-6 px-2 text-xs font-medium bg-white/80">
                        총 {users.length}명
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto">
                {users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground h-full flex flex-col justify-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 rounded-full flex items-center justify-center">
                            <Users className="h-8 w-8 text-indigo-400" />
                        </div>
                        <p className="text-sm font-medium mb-1">사용자가 없습니다</p>
                        <p className="text-xs text-gray-500">가입한 사용자가 없습니다</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-full overflow-y-auto">
                        {users.map((user) => (
                            <div 
                                key={user.id}
                                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="relative">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                            {user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1">
                                        {getStatusBadge(user.status)}
                                    </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm truncate">{user.username}</span>
                                        {getRoleIcon(user.role)}
                                        {getRoleBadge(user.role)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {user.email}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{formatLastLogin(user.lastLoginAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Trophy className="h-3 w-3" />
                                            <span>{user.completedChallenges || 0}</span>
                                        </div>
                                        {user.totalRewards && user.totalRewards > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Coins className="h-3 w-3" />
                                                <span>{(user.totalRewards / 10000).toFixed(0)}만원</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
