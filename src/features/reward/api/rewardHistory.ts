import api from '@/shared/lib/axios';

export interface RewardHistoryItem {
  id: number;
  challengeId: number;
  challengeTitle: string;
  amount: number;
  method: 'CASH';
  reason: string;
  createdAt: string;
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
