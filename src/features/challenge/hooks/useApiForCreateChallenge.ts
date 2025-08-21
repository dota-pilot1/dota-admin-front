import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiForCreateChallenge, CreateChallengeRequest, CreateChallengeResponse } from '../api/createChallenge';

export function useApiForCreateChallenge() {
    const qc = useQueryClient();
    return useMutation<CreateChallengeResponse, Error, CreateChallengeRequest>({
        mutationFn: apiForCreateChallenge,
        onSuccess: () => {
            // 목록 갱신 (키는 기존 목록 쿼리 키와 맞춰야 함)
            qc.invalidateQueries({ queryKey: ['challenges', 'list'] });
        }
    });
}