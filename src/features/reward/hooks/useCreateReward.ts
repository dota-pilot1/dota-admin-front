import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiForCreateReward } from '../api/createReward';
import { toast } from 'sonner';

export function useCreateReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiForCreateReward,
    onSuccess: (data, variables) => {
      toast.success(data.message || '포상이 성공적으로 지급되었습니다!');
      
      // 챌린지 관련 쿼리 무효화 (포상 내역 반영)
      queryClient.invalidateQueries({ 
        queryKey: ['challenges', variables.challengeId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['challenges', 'list'] 
      });
    },
    onError: (error: unknown) => {
      let message = '포상 지급에 실패했습니다.';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        // @ts-ignore
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    },
  });
}
