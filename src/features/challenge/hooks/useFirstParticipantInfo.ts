import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Participant } from '../api/getChallengeList';

/**
 * 상세 페이지에서 participantIds만 있는 경우 목록 캐시의 participants 정보를 활용해
 * 첫 번째 참가자(예: 포상 대상 기본값)의 상세 정보를 얻는다.
 */
export function useFirstParticipantInfo(challengeId: number | null) {
  const queryClient = useQueryClient();
  return useMemo<Participant | null>(() => {
    if (!challengeId) return null;
    const listData: any = queryClient.getQueryData(['challenges','list']);
    const found = listData?.challenges?.find((c: any) => c.id === challengeId);
    if (!found) return null;
    if (found.participants && found.participants.length > 0) return found.participants[0];
    return null;
  }, [challengeId, queryClient]);
}
