import { useQuery } from '@tanstack/react-query';
import { getRewardStatistics, type RewardStatisticsResponse } from '../api/statistics';

export function useRewardStatistics() {
    return useQuery<RewardStatisticsResponse>({
        queryKey: ['rewards', 'statistics'],
        queryFn: getRewardStatistics,
        staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
        gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 방지
    });
}
