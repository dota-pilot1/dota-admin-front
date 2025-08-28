// 챌린지 전체 목록 조회 커스텀 훅
import { useQuery } from '@tanstack/react-query';
import { apiForGetChallengeList, ApiForGetChallengeListResponse } from '../api/getChallengeList';

export function useApiForGetChallengeList() {
  return useQuery<ApiForGetChallengeListResponse>({
    queryKey: ['challenges', 'list'],
    queryFn: apiForGetChallengeList,
    // refetch on focus to surface recent participation changes if any missed
    refetchOnWindowFocus: true,
  });
}
