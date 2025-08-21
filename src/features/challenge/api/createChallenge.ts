import api from '@/shared/lib/axios';
import { useAuthStore } from '@/features/auth/store/authStore';

export interface CreateChallengeRequest {
    title: string;
    description: string;
    tags: string[];
    rewardAmount: number;
    rewardType: 'CASH' | 'POINT' | 'ITEM';
    startDate: string; // yyyy-MM-dd
    endDate: string;   // yyyy-MM-dd
    authorId?: number; // 자동 주입
}

export interface CreateChallengeResponse {
    success: boolean;
    id?: number;
    message?: string;
}

export async function apiForCreateChallenge(req: CreateChallengeRequest): Promise<CreateChallengeResponse> {
    const { userId } = useAuthStore.getState();
    if (!userId) {
        throw new Error('로그인 사용자 ID(userId)가 없습니다.');
    }
    const body = { ...req, authorId: userId };
    const { data } = await api.post<CreateChallengeResponse>('/api/challenges', body);
    return data;
}