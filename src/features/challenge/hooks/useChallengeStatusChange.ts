import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    apiStartChallenge, 
    apiCompleteChallenge, 
    apiReopenChallenge 
} from '../api/updateChallengeStatus';
import { toast } from 'sonner';

export function useChallengeStatusChange() {
    const queryClient = useQueryClient();

    const startChallenge = useMutation({
        mutationFn: apiStartChallenge,
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
        mutationFn: apiCompleteChallenge,
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

    // cancelChallenge는 CANCELLED 상태가 제거되어 사용하지 않음
    const cancelChallenge = useMutation({
        mutationFn: () => Promise.reject('CANCELLED status has been removed'),
        onError: () => {
            toast.error('취소 기능은 더 이상 지원되지 않습니다.');
        },
    });

    const reopenChallenge = useMutation({
        mutationFn: apiReopenChallenge,
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
        cancelChallenge: cancelChallenge.mutate, // 호환성을 위해 유지하지만 실제로는 사용 안 함
        reopenChallenge: reopenChallenge.mutate,
        isLoading: 
            startChallenge.isPending || 
            completeChallenge.isPending || 
            cancelChallenge.isPending || 
            reopenChallenge.isPending,
    };
}
