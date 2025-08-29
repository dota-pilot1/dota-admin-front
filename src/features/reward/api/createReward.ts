import api from '@/shared/lib/axios';

export interface RewardRequest {
  challengeId: number;
  participantId: number;
  amount: number;
  method: string; // "포인트" | "현금"
  reason: string;
}

export interface RewardResponse {
  success: boolean;
  message: string;
  rewardId?: number;
  timestamp: string;
}

export async function apiForCreateReward(data: RewardRequest): Promise<RewardResponse> {
  const response = await api.post<RewardResponse>(`/api/challenges/${data.challengeId}/rewards`, {
    participantId: data.participantId,
    amount: data.amount,
    method: data.method,
    reason: data.reason,
  });
  return response.data;
}
