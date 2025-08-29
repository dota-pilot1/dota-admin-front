import api from '@/shared/lib/axios';

export interface RewardHistoryItem {
  id: number;
  challengeId: number;
  participantId: number;
  participantName: string;
  amount: number;
  method: 'POINT' | 'CASH';
  reason: string;
  createdAt: string;
  createdBy: number;
  createdByName: string;
  processed: boolean;
  processedAt: string | null;
}

export interface RewardHistoryResponse {
  success: boolean;
  rewards: RewardHistoryItem[];
  count: number;
  timestamp: string;
}

export async function apiForGetRewardHistory(challengeId: number): Promise<RewardHistoryResponse> {
  const response = await api.get<RewardHistoryResponse>(`/api/challenges/${challengeId}/rewards`);
  return response.data;
}

export async function apiForGetRewardDetail(challengeId: number, rewardId: number): Promise<{
  success: boolean;
  reward: RewardHistoryItem;
  timestamp: string;
}> {
  const response = await api.get(`/api/challenges/${challengeId}/rewards/${rewardId}`);
  return response.data;
}

export async function apiForProcessReward(rewardId: number): Promise<{
  success: boolean;
  message: string;
  timestamp: string;
}> {
  const response = await api.patch(`/api/rewards/${rewardId}/process`);
  return response.data;
}
