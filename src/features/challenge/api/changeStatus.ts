import api from '@/shared/lib/axios';

export interface ChallengeStatusChangeResponse {
    success: boolean;
    message: string;
    challenge: {
        id: number;
        title: string;
        description: string;
        authorId: number;
        username?: string;
        email?: string;
        tags: string[];
        participantIds: number[];
        status: 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED';
        startDate: string;
        endDate: string;
        rewardAmount: number;
        rewardType: 'CASH' | 'ITEM';
        createdAt: string;
        updatedAt: string;
    };
    timestamp: string;
}

export async function apiForStartChallenge(challengeId: number): Promise<ChallengeStatusChangeResponse> {
    const { data } = await api.patch<ChallengeStatusChangeResponse>(`/api/challenges/${challengeId}/start`);
    return data;
}

export async function apiForCompleteChallenge(challengeId: number): Promise<ChallengeStatusChangeResponse> {
    const { data } = await api.patch<ChallengeStatusChangeResponse>(`/api/challenges/${challengeId}/complete`);
    return data;
}

export async function apiForReopenChallenge(challengeId: number): Promise<ChallengeStatusChangeResponse> {
    const { data } = await api.patch<ChallengeStatusChangeResponse>(`/api/challenges/${challengeId}/reopen`);
    return data;
}
