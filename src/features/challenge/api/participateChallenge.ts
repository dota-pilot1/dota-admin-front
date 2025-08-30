// 챌린지 참여 API
import api from '@/shared/lib/axios';

// 챌린지 참여 응답 타입
export type ParticipateResponse = {
    success: boolean;
    message: string;
    challenge: {
        id: number;
        title: string;
        description: string;
        author: string;
        status: string;
        startDate: string;
        endDate: string;
        rewardAmount: number;
        rewardType: string;
        participantIds: number[];
        createdAt: string;
    };
    participantCount: number;
    timestamp: string;
};

// 챌린지 참여 API
export async function apiForParticipateChallenge(challengeId: number): Promise<ParticipateResponse> {
    console.log('[API] Participating in challenge:', challengeId);
    try {
        const res = await api.post(`/api/challenges/${challengeId}/participate`);
        console.log('[API] Participate response:', res.data);
        return res.data;
    } catch (error) {
        console.error('[API] Participate error:', error);
        throw error;
    }
}
