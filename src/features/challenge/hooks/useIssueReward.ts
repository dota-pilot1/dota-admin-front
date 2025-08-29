import { useMutation, useQueryClient } from "@tanstack/react-query";
import { issueReward, RewardRequest } from "../api/reward";
import { toast } from "sonner";

interface UseIssueRewardParams {
    challengeId: number;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useIssueReward({ challengeId, onSuccess, onError }: UseIssueRewardParams) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: RewardRequest) => issueReward(challengeId, request),
        onSuccess: () => {
            // 캐시 무효화하여 최신 데이터 반영 (올바른 쿼리 키 사용)
            queryClient.invalidateQueries({ queryKey: ['challenge', 'detail', challengeId] });
            queryClient.invalidateQueries({ queryKey: ['challenges', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['challenges'] }); // 일반적인 challenges 키
            queryClient.invalidateQueries({ queryKey: ['rewardHistory', challengeId] });
            queryClient.invalidateQueries({ queryKey: ['challenges', challengeId, 'reward-info'] });
            queryClient.invalidateQueries({ queryKey: ['challenges', challengeId, 'rewards'] });
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
            queryClient.invalidateQueries({ queryKey: ['my-rewards'] });

            // 추가 지연 후 한번 더 갱신 (서버 처리 시간 고려)
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['challenge', 'detail', challengeId] });
                queryClient.invalidateQueries({ queryKey: ['rewardHistory', challengeId] });
                queryClient.invalidateQueries({ queryKey: ['challenges', challengeId, 'reward-info'] });
                queryClient.invalidateQueries({ queryKey: ['challenges', challengeId, 'rewards'] });
            }, 500);

            // 성공 콜백 실행
            onSuccess?.();
        },
        onError: (error) => {
            console.error('포상 지급 실패:', error);
            toast.error("포상 지급에 실패했습니다.");
            onError?.(error);
        }
    });
}
