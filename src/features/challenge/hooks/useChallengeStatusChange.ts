import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    apiForStartChallenge, 
    apiForCompleteChallenge, 
    apiForCancelChallenge, 
    apiForReopenChallenge 
} from '../api/changeStatus';
import { toast } from 'sonner';

export function useChallengeStatusChange() {
    const queryClient = useQueryClient();

    const startChallenge = useMutation({
        mutationFn: apiForStartChallenge,
        onSuccess: (data) => {
            toast.success(data.message);
            // 챌린지 목록과 상세 정보 새로고침
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
            queryClient.invalidateQueries({ queryKey: ['challenge', data.challenge.id] });
        },
        onError: (error: unknown) => {
            let message = '챌린지 시작에 실패했습니다.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-expect-error
                message = error.response?.data?.message || message;
            }
            toast.error(message);
        },
    });

    const completeChallenge = useMutation({
        mutationFn: apiForCompleteChallenge,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
            queryClient.invalidateQueries({ queryKey: ['challenge', data.challenge.id] });
        },
        onError: (error: unknown) => {
            let message = '챌린지 완료에 실패했습니다.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-ignore
                message = error.response?.data?.message || message;
            }
            toast.error(message);
        },
    });

    const cancelChallenge = useMutation({
        mutationFn: apiForCancelChallenge,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
            queryClient.invalidateQueries({ queryKey: ['challenge', data.challenge.id] });
        },
        onError: (error: unknown) => {
            let message = '챌린지 취소에 실패했습니다.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-ignore
                message = error.response?.data?.message || message;
            }
            toast.error(message);
        },
    });

    const reopenChallenge = useMutation({
        mutationFn: apiForReopenChallenge,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
            queryClient.invalidateQueries({ queryKey: ['challenge', data.challenge.id] });
        },
        onError: (error: unknown) => {
            let message = '챌린지 재개에 실패했습니다.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-ignore
                message = error.response?.data?.message || message;
            }
            toast.error(message);
        },
    });

    return {
        startChallenge: startChallenge.mutate,
        completeChallenge: completeChallenge.mutate,
        cancelChallenge: cancelChallenge.mutate,
        reopenChallenge: reopenChallenge.mutate,
        isLoading: 
            startChallenge.isPending || 
            completeChallenge.isPending || 
            cancelChallenge.isPending || 
            reopenChallenge.isPending,
    };
}
