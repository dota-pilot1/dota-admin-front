"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";
// Removed RewardStatsOverview (중복 카드) – 헤더에 단일 총 포상액만 노출
import { RewardRankingTable } from "@/widgets/reward/ui/RewardRankingTable";
import { ChallengeRewardStats } from "@/widgets/reward/ui/ChallengeRewardStats";
import { RewardPeriodFilter } from "@/widgets/reward/ui/RewardPeriodFilter";
import { useRewardStatsByPeriod, useRewardStats } from "@/features/reward/hooks/useRewardStats";
import { Skeleton } from "@/shared/ui/skeleton";

export default function ChallengeStatsPage() {
  const [dateFilter, setDateFilter] = useState<{
    startDate: string;
    endDate: string;
    enabled: boolean;
  }>({
    startDate: '',
    endDate: '',
    enabled: false
  });

  const { data: periodStats, isLoading: periodStatsLoading } = useRewardStatsByPeriod(
    dateFilter.startDate,
    dateFilter.endDate,
    dateFilter.enabled
  );
  const { data: totalStats, isLoading: totalStatsLoading } = useRewardStats();

  function handleQuickFilter(days: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];
    setDateFilter({
      startDate: startDateStr,
      endDate: endDateStr,
      enabled: true
    });
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/20">
      <div className="container mx-auto py-8 space-y-8">
        {/* 헤더 (타이틀 + 총 포상액 + 기간 필터) */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/challenge">
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                포상 통계 대시보드
              </h1>
              <p className="text-muted-foreground mt-1">챌린지 참여자들의 포상 현황과 통계를 확인하세요</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full lg:w-auto">
            {/* 총 포상액 (기간 필터 적용 시 기간 합계, 아니면 전체) */}
            <div className="flex flex-col items-start sm:items-end min-w-[160px]">
              <span className="text-xs text-muted-foreground mb-1">총 포상액</span>
              { (dateFilter.enabled ? periodStatsLoading : totalStatsLoading) ? (
                <Skeleton className="h-7 w-28" />
              ) : (
                <span className="text-2xl font-bold tracking-tight text-primary">
                  { (dateFilter.enabled ? periodStats?.summary.totalCashAmount : totalStats?.summary.totalCashAmount)?.toLocaleString() ?? 0 }원
                </span>
              ) }
            </div>
            <div className="sm:border-l sm:pl-6">
              <RewardPeriodFilter
                onQuickFilter={handleQuickFilter}
                isLoading={periodStatsLoading}
              />
            </div>
          </div>
        </div>

        {/* 기간 필터가 적용되었을 때 알림 */}
        {dateFilter.enabled && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm py-4 px-4 shadow-sm">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              📅 {dateFilter.startDate} ~ {dateFilter.endDate} 기간의 통계를 조회 중입니다.
              {periodStats && (
                <span className="ml-2 font-semibold">
                  총 {periodStats.summary.totalParticipants}명이 {periodStats.summary.totalRewards}건의 포상을 받았습니다.
                </span>
              )}
            </p>
          </div>
        )}

  {/* (중복 제거됨) 이전 개요 카드 영역 제거 */}

        {/* 포상자 순위 테이블 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <RewardRankingTable />
          <div className="space-y-8">
            {/* 향후 추가 위젯들 */}
          </div>
        </div>

        {/* 챌린지별 포상 현황 */}
        <ChallengeRewardStats />
      </div>
    </div>
  );
}
