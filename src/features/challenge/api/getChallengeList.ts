// 챌린지 전체 목록 조회 API
import api from '@/shared/lib/axios';

export type Participant = {
    id: number;
    name: string;
    email?: string;
    achievedAt?: string;
};

export type Challenge = {
    id: number;
    title: string;
    description: string;
    authorId?: number; // 작성자 ID
    username?: string; // 작성자 username
    email?: string; // 작성자 이메일
    status: string;
    startDate: string;
    endDate: string;
    rewardAmount: number;
    rewardType: string;
    participantIds?: number[];
    participants?: Participant[];
    participantCount?: number;
    createdAt: string;
    tags?: string[];
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
