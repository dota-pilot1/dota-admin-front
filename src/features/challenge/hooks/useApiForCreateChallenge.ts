import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    apiForCreateChallenge,
    CreateChallengeRequest,
    CreateChallengeResponse
} from '../api/createChallenge';
import { getToastErrorMessage } from '@/shared/lib/error-utils';

export function useApiForCreateChallenge() {
    const qc = useQueryClient();

    return useMutation<CreateChallengeResponse, Error, CreateChallengeRequest>({
        mutationFn: apiForCreateChallenge,
        onSuccess: (data) => {
            // 성공 토스트 메시지
            toast.success(data.message || '챌린지가 성공적으로 생성되었습니다!');

            // 목록 갱신
            qc.invalidateQueries({ queryKey: ['challenges', 'list'] });
        },
        onError: (error) => {
            // 토스트용 공통 에러 유틸리티 함수 사용
            const message = getToastErrorMessage(error);
            toast.error(message);
        }
    });
}