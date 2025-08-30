import api from '@/shared/lib/axios';

export interface CreateChallengeRequest {
    title: string;
    description: string;
    tags: string[];
    rewardAmount: number;
    rewardType: 'CASH' | 'ITEM';
    startDate: string; // yyyy-MM-dd
    endDate: string;   // yyyy-MM-dd
    // authorId 제거 - 서버에서 JWT 토큰으로부터 추출
}

export interface CreateChallengeResponse {
    success: boolean;
    id?: number;
    message?: string;
}

export async function apiForCreateChallenge(req: CreateChallengeRequest): Promise<CreateChallengeResponse> {
    const { data } = await api.post<CreateChallengeResponse>('/api/challenges', req);
    return data;
}