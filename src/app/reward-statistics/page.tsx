"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { 
    Trophy, 
    Users, 
    DollarSign, 
    CheckCircle, 
    TrendingUp,
    RefreshCw,
    Award,
    Target,
    Crown
} from 'lucide-react';
import { useRewardStatistics } from '@/features/reward/hooks/useRewardStatistics';
import { cn } from '@/lib/utils';

export default function RewardStatisticsPage() {
    const { data, isLoading, isError, error, refetch, isFetching } = useRewardStatistics();

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">포상 통계</h1>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-4">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                    <div className="text-red-500 text-center">
                        <p className="text-lg font-semibold">데이터 로드 실패</p>
                        <p className="text-sm text-muted-foreground">
                            {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
                        </p>
                    </div>
                    <Button onClick={() => refetch()} variant="outline" size="sm">
                        다시 시도
                    </Button>
                </div>
            </div>
        );
    }

    const stats = data?.statistics;
    if (!stats) return null;

    return (
        <div className="container mx-auto p-4 space-y-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        포상 통계
                    </h1>
                    <p className="text-muted-foreground mt-1">챌린지 포상 현황과 랭킹을 확인하세요</p>
                </div>
                <Button 
                    onClick={() => refetch()} 
                    variant="outline" 
                    size="sm"
                    disabled={isFetching}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
                    새로고침
                </Button>
            </div>

            {/* 전체 통계 카드 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-blue-600">총 포상 건수</p>
                                <p className="text-xl font-bold text-blue-700">
                                    {stats.totalRewardsCount.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-500 rounded-full">
                                <Award className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-green-600">처리 완료</p>
                                <p className="text-xl font-bold text-green-700">
                                    {stats.processedRewardsCount.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-2 bg-green-500 rounded-full">
                                <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-yellow-600">총 포상 금액</p>
                                <p className="text-xl font-bold text-yellow-700">
                                    {(stats.totalAmount / 10000).toFixed(0)}만원
                                </p>
                            </div>
                            <div className="p-2 bg-yellow-500 rounded-full">
                                <DollarSign className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-purple-600">처리율</p>
                                <p className="text-xl font-bold text-purple-700">
                                    {stats.totalRewardsCount > 0 
                                        ? Math.round((stats.processedRewardsCount / stats.totalRewardsCount) * 100)
                                        : 0
                                    }%
                                </p>
                            </div>
                            <div className="p-2 bg-purple-500 rounded-full">
                                <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 랭킹 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 챌린지별 포상 랭킹 */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Target className="h-5 w-5 text-orange-500" />
                            챌린지별 포상 랭킹
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            포상 금액이 높은 챌린지 TOP 5
                        </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            {stats.topChallenges.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground text-sm">
                                    아직 포상 데이터가 없습니다
                                </div>
                            ) : (
                                stats.topChallenges.map((challenge, index) => (
                                    <div key={challenge.challengeId} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                                                index === 0 ? "bg-yellow-500 text-white" :
                                                index === 1 ? "bg-gray-400 text-white" :
                                                index === 2 ? "bg-orange-600 text-white" :
                                                "bg-gray-200 text-gray-600"
                                            )}>
                                                {index === 0 ? <Crown className="h-4 w-4" /> : index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{challenge.challengeTitle}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="font-mono">
                                                {challenge.totalAmount.toLocaleString()}원
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 참가자별 포상 랭킹 */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="h-5 w-5 text-blue-500" />
                            참가자별 포상 랭킹
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            포상을 많이 받은 참가자 TOP 5
                        </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            {stats.topParticipants.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground text-sm">
                                    아직 포상 데이터가 없습니다
                                </div>
                            ) : (
                                stats.topParticipants.map((participant, index) => (
                                    <div key={participant.participantId} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                                                index === 0 ? "bg-yellow-500 text-white" :
                                                index === 1 ? "bg-gray-400 text-white" :
                                                index === 2 ? "bg-orange-600 text-white" :
                                                "bg-gray-200 text-gray-600"
                                            )}>
                                                {index === 0 ? <Crown className="h-4 w-4" /> : index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{participant.participantName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="font-mono">
                                                {participant.totalAmount.toLocaleString()}원
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
