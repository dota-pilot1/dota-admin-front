import { useQuery } from '@tanstack/react-query';
import { apiForGetRewardInfo, RewardInfoResponse } from '../api/getRewardInfo';

export function useRewardInfo(challengeId: number | null) {
  return useQuery<RewardInfoResponse>({
    queryKey: ['challenges', challengeId, 'reward-info'],
    queryFn: () => apiForGetRewardInfo(challengeId!),
    enabled: !!challengeId,
    staleTime: 1000 * 30,
  });
}
