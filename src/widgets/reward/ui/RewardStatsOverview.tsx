"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { TrendingUp, Users, Award, DollarSign, Trophy } from "lucide-react";
import { useRewardStats, useRewardStatsByMethod } from '@/features/reward/hooks/useRewardStats';

export function RewardStatsOverview() {
    const { data: rewardStats, isLoading, isError } = useRewardStats();
    const { data: methodStats, isLoading: methodStatsLoading } = useRewardStatsByMethod();

    if (isLoading || methodStatsLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border shadow-sm rounded-sm">
                        <CardHeader className="py-4 px-4">
                            <Skeleton className="h-4 w-28" />
                        </CardHeader>
                        <CardContent className="py-4 px-4 pt-0">
                            <Skeleton className="h-8 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive" className="mb-8 border shadow-sm rounded-sm">
                <AlertDescription>
                    통계 데이터를 불러오지 못했습니다.
                </AlertDescription>
            </Alert>
        );
    }

    const summary = rewardStats?.summary;
    const cash = methodStats?.cash;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 총 현금 포상 */}
            <Card className="border shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-sm">
                <CardHeader className="py-4 px-4">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        현금 포상 총액
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-4 px-4 pt-0">
                    <div className="text-2xl font-bold text-green-600">
                        {summary?.totalCashAmount?.toLocaleString() ?? 0}원
                    </div>
                </CardContent>
            </Card>

            {/* 총 포상액 */}
            <Card className="border shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-sm">
                <CardHeader className="py-4 px-4">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        총 포상액
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-4 px-4 pt-0">
                    <div className="text-2xl font-bold text-blue-600">
                        {summary?.totalAmount?.toLocaleString() ?? 0}원
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}