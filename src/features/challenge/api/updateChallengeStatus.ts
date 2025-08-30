// 챌린지 상태 변경 API
import api from '@/shared/lib/axios';

export type ChallengeStatusResponse = {
    success: boolean;
    message: string;
    challenge: {
        id: number;
        title: string;
        description: string;
        author: string;
        status: 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED';
        startDate: string;
        endDate: string;
        rewardAmount: number;
        rewardType: string;
        participantIds: number[];
        createdAt: string;
    };
    timestamp: string;
};

// 챌린지 시작
export async function apiStartChallenge(challengeId: number): Promise<ChallengeStatusResponse> {
    const res = await api.patch(`/api/challenges/${challengeId}/start`);
    return res.data;
}

// 챌린지 완료
export async function apiCompleteChallenge(challengeId: number): Promise<ChallengeStatusResponse> {
    const res = await api.patch(`/api/challenges/${challengeId}/complete`);
    return res.data;
}

// 챌린지 재개방
export async function apiReopenChallenge(challengeId: number): Promise<ChallengeStatusResponse> {
    const res = await api.patch(`/api/challenges/${challengeId}/reopen`);
    return res.data;
}
