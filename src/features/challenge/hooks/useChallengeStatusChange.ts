import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    apiStartChallenge, 
    apiCompleteChallenge, 
    apiReopenChallenge 
} from '../api/updateChallengeStatus';
import { toast } from 'sonner';
import { useErrorOverlay } from '@/shared/components/ErrorOverlay';

export function useChallengeStatusChange() {
    const queryClient = useQueryClient();
    const { pushError } = useErrorOverlay();

    const startChallenge = useMutation({
        mutationFn: apiStartChallenge,
        onSuccess: (data) => {
            toast.success(data.message);
            // 챌린지 목록과 상세 정보 새로고침
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
            queryClient.invalidateQueries({ queryKey: ['challenge', 'detail', data.challenge.id] });
        },
        onError: (error: unknown) => {
            let message = '챌린지 시작에 실패했습니다.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-expect-error
                message = error.response?.data?.message || message;
            }
            pushError(message);
        },
    });

    const completeChallenge = useMutation({
        mutationFn: apiCompleteChallenge,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
            queryClient.invalidateQueries({ queryKey: ['challenge', 'detail', data.challenge.id] });
        },
        onError: (error: unknown) => {
            let message = '챌린지 완료에 실패했습니다.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-ignore
                message = error.response?.data?.message || message;
            }
            pushError(message);
        },
    });

    const reopenChallenge = useMutation({
        mutationFn: apiReopenChallenge,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
            queryClient.invalidateQueries({ queryKey: ['challenge', 'detail', data.challenge.id] });
        },
        onError: (error: unknown) => {
            let message = '챌린지 재개에 실패했습니다.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-ignore
                message = error.response?.data?.message || message;
            }
            pushError(message);
        },
    });

    return {
        startChallenge: startChallenge.mutate,
        completeChallenge: completeChallenge.mutate,
        reopenChallenge: reopenChallenge.mutate,
        isLoading: 
            startChallenge.isPending || 
            completeChallenge.isPending || 
            reopenChallenge.isPending,
    };
}
