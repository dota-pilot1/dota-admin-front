import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiForDeleteChallenge } from '../api/deleteChallenge';

export function useDeleteChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (challengeId: number) => apiForDeleteChallenge(challengeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
    },
  });
}
