// 챌린지 상태 변경 Tanstack Query 훅
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiStartChallenge, apiCompleteChallenge, apiReopenChallenge, type ChallengeStatusResponse } from '../api/updateChallengeStatus';
import { toast } from 'sonner';

// 챌린지 시작 훅
export function useStartChallenge(options?: { onErrorDialog?: (msg: string) => void }) {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (challengeId: number) => apiStartChallenge(challengeId),
        onSuccess: (data: ChallengeStatusResponse, challengeId: number) => {
            queryClient.invalidateQueries({ queryKey: ['challenges', challengeId] });
            queryClient.invalidateQueries({ queryKey: ['challenges', 'list'] });
            toast.success(data.message || '챌린지가 시작되었습니다!');
        },
        onError: (error: unknown) => {
            const message = (error as any)?.response?.data?.message || '챌린지 시작에 실패했습니다.';
            options?.onErrorDialog?.(message);
        },
    });
}

// 챌린지 완료 훅
export function useCompleteChallenge(options?: { onErrorDialog?: (msg: string) => void }) {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (challengeId: number) => apiCompleteChallenge(challengeId),
        onSuccess: (data: ChallengeStatusResponse, challengeId: number) => {
            queryClient.invalidateQueries({ queryKey: ['challenges', challengeId] });
            queryClient.invalidateQueries({ queryKey: ['challenges', 'list'] });
            toast.success(data.message || '챌린지가 완료되었습니다!');
        },
        onError: (error: unknown) => {
            const message = (error as any)?.response?.data?.message || '챌린지 완료에 실패했습니다.';
            options?.onErrorDialog?.(message);
        },
    });
}

// 챌린지 재개방 훅
export function useReopenChallenge(options?: { onErrorDialog?: (msg: string) => void }) {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (challengeId: number) => apiReopenChallenge(challengeId),
        onSuccess: (data: ChallengeStatusResponse, challengeId: number) => {
            queryClient.invalidateQueries({ queryKey: ['challenges', challengeId] });
            queryClient.invalidateQueries({ queryKey: ['challenges', 'list'] });
            toast.success(data.message || '챌린지가 다시 열렸습니다!');
        },
        onError: (error: unknown) => {
            const message = (error as any)?.response?.data?.message || '챌린지 재개방에 실패했습니다.';
            options?.onErrorDialog?.(message);
        },
    });
}
