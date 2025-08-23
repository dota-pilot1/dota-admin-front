import api from '@/shared/lib/axios';

export interface ChallengeDetailResponse {
    success: boolean;
    challenge: {
        id: number;
        title: string;
        description: string;
        authorId: number;
        tags: string[];
        participantIds: number[];
        status: 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
        startDate: string; // yyyy-MM-dd
        endDate: string;   // yyyy-MM-dd
        rewardAmount: number;
        rewardType: 'CASH' | 'POINT' | 'ITEM';
        createdAt: string;
        updatedAt: string;
    };
}

export async function apiForGetChallengeDetail(id: number): Promise<ChallengeDetailResponse> {
    const { data } = await api.get<ChallengeDetailResponse>(`/api/challenges/${id}`);
    return data;
}
