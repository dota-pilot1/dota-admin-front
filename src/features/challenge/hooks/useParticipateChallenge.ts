// 챌린지 참여 관련 Tanstack Query 훅
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiForParticipateChallenge, type ParticipateResponse } from '../api/participateChallenge';
import { apiForLeaveChallenge, type LeaveChallengeResponse } from '../api/leaveChallenge';
import { apiForGetParticipationStatus } from '../api/getParticipationStatus';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
// NOTE: CommonDialog JSX was previously created inside this hook file (a .ts file) causing TS/JSX errors.
// We refactor to expose state so the consuming component (e.g. page or layout) can render a dialog.

// 에러 다이얼로그 상태 훅 (UI 책임은 외부 컴포넌트)
export function useParticipationErrorState() {
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const showError = useCallback((msg: string) => {
        setErrorMessage(msg);
        setErrorOpen(true);
    }, []);
    const closeError = useCallback(() => setErrorOpen(false), []);
    return { errorOpen, errorMessage, showError, closeError };
}

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
export function useParticipateChallenge(options?: { onErrorDialog?: (msg: string) => void }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (challengeId: number) => {
            console.log('[useParticipateChallenge] Starting mutation for challengeId:', challengeId);
            return apiForParticipateChallenge(challengeId);
        },
        onSuccess: (data: ParticipateResponse, challengeId: number) => {
            console.log('[useParticipateChallenge] Mutation success:', data);
            queryClient.invalidateQueries({ queryKey: ['challenges', challengeId, 'participation-status'] });
            queryClient.invalidateQueries({ queryKey: ['challenges', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['challenges', challengeId] });
               queryClient.invalidateQueries({ queryKey: ['challenge', 'detail', challengeId] });
            toast.success(data.message || '챌린지 참여가 완료되었습니다!');
        },
        onError: (error: unknown) => {
            console.error('[useParticipateChallenge] Mutation error:', error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = (error as any)?.response?.data?.message || '챌린지 참여에 실패했습니다.';
            options?.onErrorDialog?.(message);
        },
    });
}

// 챌린지 탈퇴 훅
export function useLeaveChallenge(options?: { onErrorDialog?: (msg: string) => void }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (challengeId: number) => {
            console.log('[useLeaveChallenge] Starting mutation for challengeId:', challengeId);
            return apiForLeaveChallenge(challengeId);
        },
        onSuccess: (data: LeaveChallengeResponse, challengeId: number) => {
            console.log('[useLeaveChallenge] Mutation success:', data);
            queryClient.invalidateQueries({ queryKey: ['challenges', challengeId, 'participation-status'] });
            queryClient.invalidateQueries({ queryKey: ['challenges', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['challenges', challengeId] });
               queryClient.invalidateQueries({ queryKey: ['challenge', 'detail', challengeId] });
            toast.success(data.message || '챌린지에서 탈퇴했습니다.');
        },
        onError: (error: unknown) => {
            console.error('[useLeaveChallenge] Mutation error:', error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = (error as any)?.response?.data?.message || '챌린지 탈퇴에 실패했습니다.';
            options?.onErrorDialog?.(message);
        },
    });
}
