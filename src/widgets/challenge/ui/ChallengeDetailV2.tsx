"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Calendar, Clock, User, Target, Users, Award } from "lucide-react";
import { useApiForGetChallengeDetail } from "@/features/challenge/hooks/useApiForGetChallengeDetail";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { ChallengeRewardDialog } from "@/shared/components/ChallengeRewardDialog";
import React from "react";
import { useRewardInfo } from '@/features/challenge/hooks/useRewardInfo';
import { ChallengeStatusPanel } from "@/shared/components/ChallengeStatusPanel";
import { ChallengeEditDialog } from "@/shared/components/ChallengeEditDialog";
import { getCurrentUser } from "@/entities/user/lib/auth-utils";
import { ParticipateChallengeButton } from "@/features/challenge/ui/ParticipateChallengeButton";

interface ChallengeDetailV2Props {
    challengeId: number | null;
}

export function ChallengeDetailV2({ challengeId }: ChallengeDetailV2Props) {
    const { data, isLoading, isError, error } = useApiForGetChallengeDetail(challengeId);
    const currentUser = getCurrentUser();
    const currentUserId = currentUser?.id ?? null;

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

    // 보상 타입별 표시
    const getRewardTypeDisplay = (type: string) => {
        switch (type) {
            case 'CASH': return '💰 현금';
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
                {/* 최상단: 제목, 상태, 설명 */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-xl font-semibold leading-tight">{challenge.title}</h2>
                        <div className="flex items-center gap-2">
                            <ChallengeStatusPanel 
                                challengeId={challenge.id}
                                status={challenge.status}
                                mode="compact"
                            />
                            {/* 작성자가 본인이면 수정 버튼, 아니면 참여 버튼 */}
                            {currentUserId === challenge.authorId ? (
                                <ChallengeEditDialog challenge={challenge} />
                            ) : (
                                <ParticipateChallengeButton
                                    challengeId={challenge.id}
                                    authorId={challenge.authorId}
                                    className="h-8 px-3 text-xs"
                                />
                            )}
                        </div>
                    </div>
                    {/* 작성자 정보 추가 */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="font-medium">작성자</span>: {challenge.username || '알 수 없음'}
                        {challenge.email && <span className="ml-2">({challenge.email})</span>}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {challenge.description}
                    </p>
                </div>

                {/* 일정과 보상 정보를 각각 한 줄씩 세로로 배치 */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">일정</span>
                        <span className="pl-4 text-muted-foreground">{challenge.startDate}</span>
                        <span className="mx-2">~</span>
                        <span className="font-medium">{challenge.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">보상</span>
                        <span className="pl-4 text-muted-foreground">{getRewardTypeDisplay(challenge.rewardType)}</span>
                        <span className="mx-2">/</span>
                        <span className="font-bold text-orange-600">{challenge.rewardAmount.toLocaleString()}{challenge.rewardType === 'CASH' ? '원' : '개'}</span>
                    </div>
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

                {/* 하단: 참여자 목록만 출력 */}
                <div className="mt-6">
                    <div className="flex items-center gap-2 text-sm mb-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">참여자 목록</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {challenge.participants && challenge.participants.length > 0 ? (
                            challenge.participants.map((p: any) => (
                                <Badge key={p.id} variant="secondary" className="text-xs px-2 py-1">
                                    {p.name}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-xs text-muted-foreground">아직 참여자가 없습니다.</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
