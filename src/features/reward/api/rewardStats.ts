import api from '@/shared/lib/axios';

// 새로운 API 타입
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

// 기존 컴포넌트와의 호환성을 위한 타입들
export interface RewardStatsItem {
  id: number;
  participantName: string;
  participantEmail: string;
  totalAmount: number;
  totalCount: number;
  cashAmount: number;
  cashCount: number;
  lastRewardedAt: string;
  challenges: Array<{
    title: string;
    amount: number;
    method: 'CASH';
    reason: string;
    createdAt: string;
  }>;
}

export interface RewardStatsSummary {
    totalParticipants: number;
    totalRewards: number;
    totalAmount: number;
    totalCashAmount: number;
    averageRewardPerParticipant: number;
}

export interface ChallengeRewardSummary {
  challengeId: number;
  challengeTitle: string;
  totalRewardAmount: number;
  totalRewardedCount: number;
  cashRewardCount: number;
  cashRewardAmount: number;
  lastRewardedAt: string | null;
  participants: Array<{
    name: string;
    email: string;
    amount: number;
    method: 'CASH';
    reason: string;
    createdAt: string;
  }>;
}

export interface ChallengeStatsResponse {
  success: boolean;
  data: ChallengeRewardSummary[];
  summary: {
    totalChallenges: number;
    totalRewardedChallenges: number;
    totalParticipants: number;
    totalRewardAmount: number;
  };
  timestamp: string;
}

// 새로운 API를 기존 구조로 변환하는 어댑터 함수
function adaptToLegacyFormat(newData: RewardStatisticsResponse): RewardStatsResponse {
  const stats = newData.statistics;
  
  // 참가자 데이터를 RewardStatsItem 형태로 변환
    const data: RewardStatsItem[] = stats.topParticipants.map(participant => ({
    id: participant.participantId,
    participantName: participant.participantName,
    participantEmail: participant.participantEmail || `user${participant.participantId}@example.com`,
    totalAmount: participant.totalAmount,
    totalCount: participant.rewardCount,
    cashAmount: participant.totalAmount, // 현금만 지원
    cashCount: participant.rewardCount,
    lastRewardedAt: new Date().toISOString(), // 임시 값
    challenges: [], // 상세 챌린지 정보는 별도 API에서 가져와야 함
  }));

  return {
    success: newData.success,
    data: data,
    summary: {
      totalParticipants: stats.topParticipants.length,
      totalRewards: stats.totalRewardsCount,
      totalCashAmount: stats.totalAmount, // 현금만 지원
      totalAmount: stats.totalAmount,
      averageRewardPerParticipant: stats.topParticipants.length > 0 
        ? Math.floor(stats.totalAmount / stats.topParticipants.length) 
        : 0,
    },
    timestamp: newData.timestamp,
  };
}

function adaptToChallengeFormat(newData: RewardStatisticsResponse): ChallengeStatsResponse {
  const stats = newData.statistics;
  
  // 챌린지 데이터를 ChallengeRewardSummary 형태로 변환
  const data: ChallengeRewardSummary[] = stats.topChallenges.map(challenge => ({
    challengeId: challenge.challengeId,
    challengeTitle: challenge.challengeTitle,
    totalRewardedCount: challenge.rewardCount,
    totalRewardAmount: challenge.totalAmount,
    cashRewardCount: challenge.rewardCount, // 현금만 지원
    cashRewardAmount: challenge.totalAmount,
    lastRewardedAt: new Date().toISOString(), // 임시 값
    participants: [], // 상세 참가자 정보는 별도 API에서 가져와야 함
  }));

  return {
    success: newData.success,
    data: data,
    summary: {
      totalChallenges: stats.topChallenges.length,
      totalRewardedChallenges: stats.topChallenges.length,
      totalParticipants: stats.topParticipants.length,
      totalRewardAmount: stats.totalAmount,
    },
    timestamp: newData.timestamp,
  };
}

// 통합된 포상 통계 조회
export async function apiForGetRewardStats(): Promise<RewardStatsResponse> {
  const response = await api.get<RewardStatisticsResponse>('/api/rewards/statistics');
  return adaptToLegacyFormat(response.data);
}

// 챌린지별 포상 통계 조회
export async function apiForGetChallengeRewardStats(): Promise<ChallengeStatsResponse> {
  const response = await api.get<RewardStatisticsResponse>('/api/rewards/statistics');
  return adaptToChallengeFormat(response.data);
}

// 기간별 포상 통계 조회 (현재는 전체 통계와 동일)
export async function apiForGetRewardStatsByPeriod(startDate: string, endDate: string): Promise<RewardStatsResponse> {
  return apiForGetRewardStats();
}

// 방법별 포상 통계 조회 (현재는 전체 통계와 동일)
export async function apiForGetRewardStatsByMethod(): Promise<{
  success: boolean;
  cash: {
    totalAmount: number;
    totalCount: number;
    participants: number;
  };
  point: {
    totalAmount: number;
    totalCount: number;
    participants: number;
  };
  timestamp: string;
}> {
  const response = await api.get<RewardStatisticsResponse>('/api/rewards/statistics');
  const stats = response.data.statistics;
  
  return {
    success: response.data.success,
    cash: {
      totalAmount: stats.totalAmount, // 현금만 지원
      totalCount: stats.totalRewardsCount,
      participants: stats.topParticipants.length,
    },
    timestamp: response.data.timestamp,
  };
}