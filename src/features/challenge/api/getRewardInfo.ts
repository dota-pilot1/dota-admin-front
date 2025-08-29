import api from '@/shared/lib/axios';
import { Participant } from './getChallengeList';

export interface RewardInfoResponse {
  success: boolean;
  participantCount: number;
  challenge: {
    id: number;
    title: string;
    rewardAmount: number;
    rewardType: string;
    participantIds: number[];
    participants?: Participant[];
  };
}

export async function apiForGetRewardInfo(challengeId: number): Promise<RewardInfoResponse> {
  const { data } = await api.get<RewardInfoResponse>(`/api/challenges/${challengeId}/reward-info`);
  return data;
}
