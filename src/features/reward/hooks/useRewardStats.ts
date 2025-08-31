import { useQuery } from '@tanstack/react-query';
import { 
  apiForGetRewardStats, 
  apiForGetChallengeRewardStats,
  apiForGetRewardStatsByPeriod,
  apiForGetRewardStatsByMethod
} from '../api/rewardStats';

// 전체 포상 통계 - 새로운 API 사용
export function useRewardStats() {
  return useQuery({
    queryKey: ['rewards', 'statistics'],
    queryFn: apiForGetRewardStats,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
}

// 챌린지별 포상 통계 - 동일한 API 사용 (하위 호환성)
export function useChallengeRewardStats() {
  return useQuery({
    queryKey: ['rewards', 'statistics', 'challenges'],
    queryFn: apiForGetChallengeRewardStats,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
}

// 기간별 포상 통계 - 동일한 API 사용 (하위 호환성)
export function useRewardStatsByPeriod(startDate: string, endDate: string, enabled = true) {
  return useQuery({
    queryKey: ['rewards', 'statistics', 'period', startDate, endDate],
    queryFn: () => apiForGetRewardStatsByPeriod(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
}

// 포상 방법별 통계 - 동일한 API 사용 (하위 호환성)
export function useRewardStatsByMethod() {
  return useQuery({
    queryKey: ['rewards', 'statistics', 'by-method'],
    queryFn: apiForGetRewardStatsByMethod,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
}