// 챌린지 참여 관련 Tanstack Query 훅
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiForParticipateChallenge, type ParticipateResponse } from '../api/participateChallenge';
import { apiForLeaveChallenge, type LeaveChallengeResponse } from '../api/leaveChallenge';
import { apiForGetParticipationStatus, type ParticipationStatusResponse } from '../api/getParticipationStatus';
import { toast } from 'sonner';

// 챌린지 참여 상태 확인 훅
export function useParticipationStatus(challengeId: number | null) {
    return useQuery({
        queryKey: ['challenges', challengeId, 'participation-status'],
        queryFn: () => challengeId ? apiForGetParticipationStatus(challengeId) : Promise.reject('No challengeId'),
        enabled: !!challengeId,
        staleTime: 1000 * 60 * 5, // 5분간 fresh
        gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    });
}

// 챌린지 참여 훅
export function useParticipateChallenge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (challengeId: number) => apiForParticipateChallenge(challengeId),
        onSuccess: (data: ParticipateResponse, challengeId: number) => {
            // 참여 상태 캐시 무효화
            queryClient.invalidateQueries({ 
                queryKey: ['challenges', challengeId, 'participation-status'] 
            });
            // 챌린지 목록 캐시 무효화
            queryClient.invalidateQueries({ 
                queryKey: ['challenges', 'list'] 
            });
            // 챌린지 상세 캐시 무효화
            queryClient.invalidateQueries({ 
                queryKey: ['challenges', challengeId] 
            });

            toast.success(data.message || '챌린지 참여가 완료되었습니다!');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || '챌린지 참여에 실패했습니다.';
            toast.error(message);
        },
    });
}

// 챌린지 탈퇴 훅
export function useLeaveChallenge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (challengeId: number) => apiForLeaveChallenge(challengeId),
        onSuccess: (data: LeaveChallengeResponse, challengeId: number) => {
            // 참여 상태 캐시 무효화
            queryClient.invalidateQueries({ 
                queryKey: ['challenges', challengeId, 'participation-status'] 
            });
            // 챌린지 목록 캐시 무효화
            queryClient.invalidateQueries({ 
                queryKey: ['challenges', 'list'] 
            });
            // 챌린지 상세 캐시 무효화
            queryClient.invalidateQueries({ 
                queryKey: ['challenges', challengeId] 
            });

            toast.success(data.message || '챌린지에서 탈퇴했습니다.');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || '챌린지 탈퇴에 실패했습니다.';
            toast.error(message);
        },
    });
}
