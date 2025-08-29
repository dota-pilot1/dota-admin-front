import { useQuery } from '@tanstack/react-query';
import { apiForGetRewardHistory } from '../api/rewardHistory';

export function useRewardHistory(challengeId: number | null) {
  return useQuery({
    queryKey: ['rewardHistory', challengeId],
    queryFn: () => challengeId ? apiForGetRewardHistory(challengeId) : Promise.resolve(null),
    enabled: !!challengeId,
    staleTime: 1000 * 60, // 1분간 캐시
  });
}
