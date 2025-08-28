"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Calendar, Clock, User, Target, Users, Award } from "lucide-react";
import { useApiForGetChallengeDetail } from "@/features/challenge/hooks/useApiForGetChallengeDetail";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertDescription } from "@/shared/ui/alert";

interface ChallengeDetailV2Props {
    challengeId: number | null;
}

export function ChallengeDetailV2({ challengeId }: ChallengeDetailV2Props) {
    const { data, isLoading, isError, error } = useApiForGetChallengeDetail(challengeId);

    if (!challengeId) {
        return (
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        챌린지 상세 정보
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>챌린지를 선택하여 상세 정보를 확인하세요</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        챌린지 상세 정보
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        챌린지 상세 정보
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertDescription>
                            챌린지 정보를 불러오지 못했습니다. 
                            {error instanceof Error && `: ${error.message}`}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (!data?.challenge) {
        return (
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        챌린지 상세 정보
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertDescription>
                            챌린지 정보가 없습니다.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    const challenge = data.challenge;

    // 상태별 색상 설정
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'RECRUITING':
                return <Badge variant="default" className="bg-blue-500">모집중</Badge>;
            case 'IN_PROGRESS':
                return <Badge variant="default" className="bg-orange-500">진행중</Badge>;
            case 'COMPLETED':
                return <Badge variant="default" className="bg-green-500">완료</Badge>;
            case 'CANCELLED':
                return <Badge variant="destructive">취소됨</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    // 보상 타입별 표시
    const getRewardTypeDisplay = (type: string) => {
        switch (type) {
            case 'CASH': return '💰 현금';
            case 'POINT': return '🏆 포인트';
            case 'ITEM': return '🎁 아이템';
            default: return type;
        }
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    챌린지 상세 정보
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* 제목과 상태 */}
                <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-xl font-semibold leading-tight">{challenge.title}</h2>
                        {getStatusBadge(challenge.status)}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {challenge.description}
                    </p>
                </div>

                {/* 태그 */}
                {challenge.tags && challenge.tags.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-1">
                            <span className="text-blue-500">#</span> 태그
                        </h3>
                        <div className="flex flex-wrap gap-1">
                            {challenge.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* 기본 정보 */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">작성자 ID</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">{challenge.authorId}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">참여자</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">
                            {challenge.participantIds.length}명
                        </p>
                    </div>
                </div>

                {/* 일정 정보 */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        일정
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">시작일</span>
                            <span className="font-medium">{challenge.startDate}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">종료일</span>
                            <span className="font-medium">{challenge.endDate}</span>
                        </div>
                    </div>
                </div>

                {/* 보상 정보 */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        보상
                    </h3>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {getRewardTypeDisplay(challenge.rewardType)}
                            </span>
                            <span className="text-lg font-bold text-orange-600">
                                {challenge.rewardAmount.toLocaleString()}
                                {challenge.rewardType === 'CASH' ? '원' : challenge.rewardType === 'POINT' ? 'P' : '개'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 생성/수정 시간 */}
                <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>생성: {new Date(challenge.createdAt).toLocaleString()}</span>
                    </div>
                    {challenge.updatedAt !== challenge.createdAt && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>수정: {new Date(challenge.updatedAt).toLocaleString()}</span>
                        </div>
                    )}
                </div>

                {/* 액션 버튼들 */}
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                        수정
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                        참여자 관리
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
