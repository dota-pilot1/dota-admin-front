import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/shared/lib/axios';

export interface UpdateChallengeRequest {
  title: string;
  description: string;
  tags: string[];
  rewardAmount: number;
  rewardType: 'CASH' | 'ITEM';
  startDate: string;
  endDate: string;
}

async function updateChallenge(challengeId: number, data: UpdateChallengeRequest) {
  const response = await api.put(`/api/challenges/${challengeId}`, data);
  return response.data;
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ challengeId, data }: { challengeId: number; data: UpdateChallengeRequest }) =>
      updateChallenge(challengeId, data),
    onSuccess: () => {
      // 챌린지 목록과 상세 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
    },
  });
}
