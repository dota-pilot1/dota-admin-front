import { useQuery } from '@tanstack/react-query';
import { apiForGetChallengeDetail, ChallengeDetailResponse } from '../api/getChallengeDetail';

export function useApiForGetChallengeDetail(id: number | null) {
    return useQuery<ChallengeDetailResponse>({
        queryKey: ['challenge', 'detail', id],
        queryFn: () => apiForGetChallengeDetail(id!),
        enabled: id !== null,
        staleTime: 1000 * 60 * 5, // 5분간 캐시
        gcTime: 1000 * 60 * 30,   // 30분간 가비지 컬렉션 방지
    });
}
