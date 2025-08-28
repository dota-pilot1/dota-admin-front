// 챌린지 탈퇴 API
import api from '@/shared/lib/axios';

// 챌린지 탈퇴 응답 타입 (참여와 동일한 구조)
export type LeaveChallengeResponse = {
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

// 챌린지 탈퇴 API
export async function apiForLeaveChallenge(challengeId: number): Promise<LeaveChallengeResponse> {
    const res = await api.delete(`/api/challenges/${challengeId}/participate`);
    return res.data;
}
