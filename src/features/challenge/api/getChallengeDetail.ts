import api from '@/shared/lib/axios';

// getChallengeList.ts의 Challenge 타입과 일치하도록 수정
export interface ChallengeDetailResponse {
    success: boolean;
    challenge: {
        id: number;
        title: string;
        description: string;
        authorId: number;
        username?: string; // 작성자 username
        email?: string; // 작성자 email
        tags: string[];
        participantIds: number[];
        participants?: Array<{
            id: number;
            name: string;
            email?: string;
            achievedAt?: string;
        }>;
        participantCount?: number;
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
