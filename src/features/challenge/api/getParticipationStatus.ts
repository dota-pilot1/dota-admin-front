// 챌린지 참여 상태 확인 API
import api from '@/shared/lib/axios';

// 챌린지 참여 상태 확인 응답 타입
export type ParticipationStatusResponse = {
    success: boolean;
    isParticipant: boolean;
    userId: number;
    challengeId: number;
    timestamp: string;
};

// 챌린지 참여 상태 확인 API
export async function apiForGetParticipationStatus(challengeId: number): Promise<ParticipationStatusResponse> {
    console.log('apiForGetParticipationStatus called with challengeId:', challengeId);
    try {
        const res = await api.get(`/api/challenges/${challengeId}/participation-status`);
        console.log('apiForGetParticipationStatus success:', res.data);
        return res.data;
    } catch (error) {
        console.error('apiForGetParticipationStatus error:', error);
        throw error;
    }
}
