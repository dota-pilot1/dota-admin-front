"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { History, Award, User, Calendar, Eye } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import React, { useState } from "react";
import { useRewardHistory } from '@/features/reward/hooks/useRewardHistory';
import { RewardDetailDialog } from './RewardDetailDialog';
import type { RewardHistoryItem } from '@/features/reward/api/rewardHistory';

interface ChallengeRewardHistoryProps {
    challengeId: number | null;
}

export function ChallengeRewardHistory({ challengeId }: ChallengeRewardHistoryProps) {
    const [selectedReward, setSelectedReward] = useState<RewardHistoryItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const { data: rewardData, isLoading, isError } = useRewardHistory(challengeId);
    
    // API 응답에서 실제 데이터 추출
    const data = rewardData?.rewards ?? [];

    if (!challengeId) {
        return (
            <Card className="h-fit">
                <CardHeader className="bg-gray-50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        포상 히스토리
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>챌린지를 선택하여 포상 히스토리를 확인하세요</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="h-fit">
                <CardHeader className="bg-gray-50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        포상 히스토리
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border rounded-lg p-3">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-1/2 mb-1" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        포상 히스토리
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertDescription>
                            포상 히스토리를 불러오지 못했습니다.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    const handleRewardClick = (reward: RewardHistoryItem) => {
        setSelectedReward(reward);
        setIsDialogOpen(true);
    };

    const getMethodBadge = (method: 'POINT' | 'CASH') => {
        switch (method) {
            case 'CASH':
                return <Badge variant="default" className="bg-green-500">💰 현금</Badge>;
            case 'POINT':
                return <Badge variant="default" className="bg-blue-500">🏆 포인트</Badge>;
            default:
                return <Badge variant="secondary">{method}</Badge>;
        }
    };

    const getStatusBadge = (processed: boolean) => {
        return processed ? (
            <Badge variant="default" className="bg-green-500">✅ 완료</Badge>
        ) : (
            <Badge variant="outline" className="border-orange-500 text-orange-600">⏳ 대기</Badge>
        );
    };

    return (
        <>
            <Card className="h-full flex flex-col">
                <CardHeader className="rounded-t-xl px-5 py-4 border-b bg-slate-50/80 dark:bg-slate-800/50 flex-shrink-0 items-center gap-0">
                    <div className="flex items-center justify-between w-full">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100/70 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                <History className="h-4 w-4" />
                            </span>
                            <span className="ml-1">포상 히스토리</span>
                        </CardTitle>
                        <Badge variant="outline" className="h-5 px-2 text-[10px] font-medium bg-white/60 dark:bg-slate-800/60">
                            총 {data.length}건
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-5 flex-1 overflow-y-auto">
                    {data.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>아직 포상 내역이 없습니다</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-full overflow-y-auto">
                            {data.map((reward) => (
                                <div 
                                    key={reward.id}
                                    className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => handleRewardClick(reward)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium text-sm">{reward.participantName}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {getMethodBadge(reward.method)}
                                            {getStatusBadge(reward.processed)}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">금액</span>
                                            <span className="font-bold text-sm">
                                                {reward.amount.toLocaleString()}
                                                {reward.method === 'CASH' ? '원' : 'P'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            사유: {reward.reason}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{new Date(reward.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-6 px-2 text-xs"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRewardClick(reward);
                                                }}
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                상세
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 포상 상세 다이얼로그 */}
            <RewardDetailDialog
                reward={selectedReward}
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setSelectedReward(null);
                }}
            />
        </>
    );
}
