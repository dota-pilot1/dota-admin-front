// 챌린지 전체 목록 조회 API
import api from '@/shared/lib/axios';

export type Challenge = {
    id: number;
    title: string;
    description: string;
    author: string;
    status: string;
    startDate: string;
    endDate: string;
    rewardAmount: number;
    rewardType: string;
    participantIds?: number[];
    participantCount?: number;
    createdAt: string;
};

export type ApiForGetChallengeListResponse = {
    success: boolean;
    challenges: Challenge[];
    count: number;
};

export async function apiForGetChallengeList(): Promise<ApiForGetChallengeListResponse> {
    const res = await api.get('/api/challenges');
    return res.data;
}
