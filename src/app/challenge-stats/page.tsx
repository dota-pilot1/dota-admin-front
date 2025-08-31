"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { RewardStatsOverview } from "@/widgets/reward/ui/RewardStatsOverview";
import { RewardRankingTable } from "@/widgets/reward/ui/RewardRankingTable";
import { ChallengeRewardStats } from "@/widgets/reward/ui/ChallengeRewardStats";
import { RewardPeriodFilter } from "@/widgets/reward/ui/RewardPeriodFilter";
import { useRewardStatsByPeriod } from "@/features/reward/hooks/useRewardStats";

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
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/challenge">
                <ArrowLeft className="h-4 w-4 mr-2" />
                챌린지 목록
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                포상 통계 대시보드
              </h1>
              <p className="text-muted-foreground mt-1">
                챌린지 참여자들의 포상 현황과 통계를 확인하세요
              </p>
            </div>
          </div>
        </div>

        {/* 기간별 필터 */}
        <RewardPeriodFilter
          onQuickFilter={handleQuickFilter}
          isLoading={periodStatsLoading}
        />

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

        {/* 통계 개요 */}
        <RewardStatsOverview />

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
