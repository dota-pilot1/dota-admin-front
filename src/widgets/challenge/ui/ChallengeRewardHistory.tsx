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

    // 공통 헤더 (상태별로 재사용)
    const Header = ({ count }: { count?: number }) => (
        <CardHeader className="h-12 px-3 py-2 border-b flex-shrink-0 bg-white/60 backdrop-blur-sm">
            <div className="flex items-center justify-between h-full">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight text-gray-800">
                    <div className="h-7 w-7 flex items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm">
                        <History className="h-3.5 w-3.5" />
                    </div>
                    <span>포상 히스토리</span>
                </CardTitle>
                {typeof count === 'number' && (
                    <Badge variant="outline" className="text-[10px] h-5 px-2 border-purple-200 text-purple-600 bg-purple-50/60">
                        {count}건
                    </Badge>
                )}
            </div>
        </CardHeader>
    );

    if (!challengeId) {
        return (
            <Card className="h-fit min-h-[300px] flex flex-col">
                <Header />
                <CardContent className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center text-muted-foreground">
                        <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                            <History className="h-7 w-7 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">챌린지를 선택하여 포상 내역을 확인하세요</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="h-fit min-h-[300px] flex flex-col">
                <Header />
                <CardContent className="space-y-2 flex-1 p-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border rounded-md p-3">
                            <Skeleton className="h-3.5 w-2/3 mb-2" />
                            <Skeleton className="h-2.5 w-1/3 mb-1" />
                            <Skeleton className="h-2.5 w-1/2" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="h-fit min-h-[300px] flex flex-col">
                <Header />
                <CardContent className="flex-1 flex items-center justify-center p-4">
                    <Alert variant="destructive" className="w-full text-sm">
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
            <Card className="h-full flex flex-col min-h-[300px]">
                <Header count={data.length} />
                <CardContent className="p-4 flex-1 overflow-y-auto">
                    {data.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground h-full flex flex-col justify-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-purple-50 rounded-full flex items-center justify-center">
                                <Award className="h-8 w-8 text-purple-400" />
                            </div>
                            <p className="text-xs text-gray-500">아직 지급된 포상이 없습니다</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-full overflow-y-auto">
                            {data.map((reward) => (
                                <div 
                                    key={reward.id}
                                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-purple-200 transition-all duration-200 cursor-pointer bg-white"
                                    onClick={() => handleRewardClick(reward)}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">
                                                    {reward.participantName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-900">{reward.participantName}</span>
                                                <div className="text-sm text-gray-500">{reward.reason}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg text-gray-900 mb-1">
                                                {reward.amount.toLocaleString()}
                                                {reward.method === 'CASH' ? '원' : 'P'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getMethodBadge(reward.method)}
                                                {getStatusBadge(reward.processed)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(reward.createdAt).toLocaleDateString('ko-KR')}</span>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 px-3 text-sm text-purple-600 hover:bg-purple-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRewardClick(reward);
                                            }}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            상세보기
                                        </Button>
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
