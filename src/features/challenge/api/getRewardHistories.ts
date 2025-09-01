import api from '@/shared/lib/axios';

export interface RewardedParticipantsResponse {
  success: boolean;
  challengeId: number;
  rewardedParticipantIds: number[];
  rewardedCount: number;
  timestamp: string;
}

/**
 * 특정 챌린지의 포상 지급 이력 조회 (이미 받은 사람 체크용)
 */
export async function getRewardedParticipants(challengeId: number): Promise<RewardedParticipantsResponse> {
  const response = await api.get(`/api/challenges/${challengeId}/reward-histories`);
  return response.data;
}

/**
 * 특정 참가자가 이미 포상받았는지 확인
 */
export async function isParticipantRewarded(challengeId: number, participantId: number): Promise<boolean> {
  const data = await getRewardedParticipants(challengeId);
  return data.rewardedParticipantIds.includes(participantId);
}
