"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
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
import { Trophy, Medal, Award } from "lucide-react";
import { useRewardStats } from '@/features/reward/hooks/useRewardStats';
import React, { useState } from 'react';
import type { RewardStatsItem } from '@/features/reward/api/rewardStats';

export function RewardRankingTable() {
    const { data: rewardStats, isLoading, isError } = useRewardStats();
    const [sortBy, setSortBy] = useState<'totalAmount' | 'totalCount'>('totalAmount');

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Trophy className="h-4 w-4" />
                        포상자 순위
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center space-x-3 p-2">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-2 w-16" />
                                </div>
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Trophy className="h-4 w-4" />
                        포상자 순위
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertDescription>
                            포상자 순위 데이터를 불러오지 못했습니다.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    const participants = rewardStats?.data ?? [];
    const sortedParticipants = [...participants].sort((a, b) => {
        if (sortBy === 'totalAmount') {
            return b.totalAmount - a.totalAmount;
        } else {
            return b.totalCount - a.totalCount;
        }
    });

    const getRankIcon = (index: number) => {
        if (index === 0) return <Trophy className="h-4 w-4 text-yellow-500" />;
        if (index === 1) return <Medal className="h-4 w-4 text-gray-400" />;
        if (index === 2) return <Award className="h-4 w-4 text-orange-600" />;
        return <span className="text-sm font-semibold text-muted-foreground">{index + 1}</span>;
    };

    return (
        <Card>
            <CardHeader className="pb-3 mt-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Trophy className="h-4 w-4" />
                        포상자 순위
                    </CardTitle>
                    <div className="flex gap-1">
                        <Button
                            variant={sortBy === 'totalAmount' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSortBy('totalAmount')}
                            className="h-7 px-2 text-xs"
                        >
                            금액순
                        </Button>
                        <Button
                            variant={sortBy === 'totalCount' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSortBy('totalCount')}
                            className="h-7 px-2 text-xs"
                        >
                            건수순
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3">
                {participants.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">아직 포상자가 없습니다</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b">
                                <TableHead className="w-10 h-8 text-xs">순위</TableHead>
                                <TableHead className="h-8 text-xs">참여자</TableHead>
                                <TableHead className="text-center h-8 text-xs">총 포상액</TableHead>
                                <TableHead className="text-center h-8 text-xs">건수</TableHead>
                                <TableHead className="text-center h-8 text-xs">마지막</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedParticipants.map((participant, index) => (
                                <TableRow key={participant.id} className="border-b hover:bg-muted/30">
                                    <TableCell className="w-10 p-2 text-center">
                                        {getRankIcon(index)}
                                    </TableCell>
                                    <TableCell className="p-2">
                                        <div className="min-w-0">
                                            <div className="font-medium text-sm truncate">{participant.participantName}</div>
                                            <div className="text-xs text-muted-foreground truncate">{participant.participantEmail}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center p-2">
                                        <div className="font-semibold text-sm">
                                            {participant.totalAmount.toLocaleString()}원
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center p-2">
                                        <div className="font-semibold text-sm">{participant.totalCount}건</div>
                                    </TableCell>
                                    <TableCell className="text-center p-2">
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(participant.lastRewardedAt).toLocaleDateString('ko-KR', { 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </div>
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