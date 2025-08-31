"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/shared/ui/table";
import { Target, Users, DollarSign, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { useChallengeRewardStats } from '@/features/reward/hooks/useRewardStats';
import React, { useState } from 'react';
import type { ChallengeRewardSummary } from '@/features/reward/api/rewardStats';

export function ChallengeRewardStats() {
    const { data: challengeStats, isLoading, isError } = useChallengeRewardStats();
    const [sortBy, setSortBy] = useState<'totalRewardAmount' | 'totalRewardedCount'>('totalRewardAmount');

    if (isLoading) {
        return (
            <Card className="border shadow-sm rounded-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-sm py-6 px-4">
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        챌린지별 포상 현황
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-6 px-4">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="space-y-3 py-4 px-4 border rounded-sm">
                                <Skeleton className="h-4 w-3/4" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="border shadow-sm rounded-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-sm py-6 px-4">
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        챌린지별 포상 현황
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-6 px-4">
                    <Alert variant="destructive" className="border shadow-sm rounded-sm">
                        <AlertDescription>
                            챌린지별 포상 현황 데이터를 불러오지 못했습니다.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    const challenges = challengeStats?.data ?? [];
    const summary = challengeStats?.summary;
    const sortedChallenges = [...challenges].sort((a, b) => {
        if (sortBy === 'totalRewardAmount') {
            return b.totalRewardAmount - a.totalRewardAmount;
        } else {
            return b.totalRewardedCount - a.totalRewardedCount;
        }
    });

    return (
        <Card className="border shadow-sm rounded-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-sm py-6 px-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        챌린지별 포상 현황
                    </CardTitle>
                </div>
                <div className="flex gap-2 justify-end mt-4 mb-2">
                    <Button
                        variant={sortBy === 'totalRewardAmount' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy('totalRewardAmount')}
                    >
                        포상액순
                    </Button>
                    <Button
                        variant={sortBy === 'totalRewardedCount' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy('totalRewardedCount')}
                    >
                        포상자수순
                    </Button>
                </div>
                {/* 챌린지 요약 통계 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center py-4 px-3 bg-white dark:bg-gray-800 rounded-sm border">
                        <div className="text-sm text-muted-foreground">전체 챌린지</div>
                        <div className="text-lg font-semibold mt-2">{summary?.totalChallenges ?? 0}개</div>
                    </div>
                    <div className="text-center py-4 px-3 bg-white dark:bg-gray-800 rounded-sm border">
                        <div className="text-sm text-muted-foreground">포상 지급 챌린지</div>
                        <div className="text-lg font-semibold text-green-600 mt-2">{summary?.totalRewardedChallenges ?? 0}개</div>
                    </div>
                    <div className="text-center py-4 px-3 bg-white dark:bg-gray-800 rounded-sm border">
                        <div className="text-sm text-muted-foreground">총 포상자</div>
                        <div className="text-lg font-semibold text-blue-600 mt-2">{summary?.totalParticipants ?? 0}명</div>
                    </div>
                    <div className="text-center py-4 px-3 bg-white dark:bg-gray-800 rounded-sm border">
                        <div className="text-sm text-muted-foreground">총 포상액</div>
                        <div className="text-lg font-semibold text-orange-600 mt-2">{summary?.totalRewardAmount?.toLocaleString() ?? 0}원</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="py-6 px-4">
                {challenges.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>포상이 지급된 챌린지가 없습니다</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>챌린지 제목</TableHead>
                                <TableHead className="text-center">포상자 수</TableHead>
                                <TableHead className="text-center">총 포상액</TableHead>
                                <TableHead className="text-center">현금 포상</TableHead>
                                <TableHead className="text-center">마지막 포상</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedChallenges.map((challenge) => (
                                <TableRow key={challenge.challengeId}>
                                    <TableCell>
                                        <div className="font-medium">{challenge.challengeTitle}</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Users className="h-4 w-4 text-blue-500" />
                                            <span className="font-semibold text-blue-600">
                                                {challenge.totalRewardedCount}명
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="font-semibold text-orange-600">
                                            {challenge.totalRewardAmount.toLocaleString()}원
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="font-semibold text-green-600">
                                            {challenge.cashRewardAmount.toLocaleString()}원
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center text-sm text-muted-foreground">
                                        {challenge.lastRewardedAt ? 
                                            new Date(challenge.lastRewardedAt).toLocaleDateString() : 
                                            '-'
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}