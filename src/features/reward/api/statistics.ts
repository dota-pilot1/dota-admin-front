import api from "@/shared/lib/axios";

export type RewardStatistics = {
    totalRewardsCount: number;
    processedRewardsCount: number;
    totalAmount: number;
    topChallenges: Array<{
        challengeId: number;
        challengeTitle: string;
        totalAmount: number;
        rewardCount: number;
    }>;
    topParticipants: Array<{
        participantId: number;
        participantName: string;
        totalAmount: number;
        rewardCount: number;
    }>;
};

export type RewardStatisticsResponse = {
    success: boolean;
    statistics: RewardStatistics;
    timestamp: string;
};

// 포상 통계 조회 - 엔드포인트 변경: /api/rewards/statistics
export async function getRewardStatistics(): Promise<RewardStatisticsResponse> {
    try {
        const { data } = await api.get('/api/rewards/statistics');
        return data;
    } catch (err: unknown) {
        let message = "포상 통계 조회 중 오류가 발생했습니다.";
        if (typeof err === "object" && err !== null) {
            const e = err as { response?: { data?: { message?: string } }; message?: string };
            message = e.response?.data?.message || e.message || message;
        }
        throw new Error(message);
    }
}
