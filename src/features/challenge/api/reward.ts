import api from "@/shared/lib/axios";

export type RewardRequest = {
    participantId: number;
    amount: number;
    method: 'CASH';
    reason: string;
};

export type RewardResponse = {
    success: boolean;
    message?: string;
    reward?: {
        id: number;
        challengeId: number;
        participantId: number;
        amount: number;
        rewardType: string;
        createdAt: string;
    };
    timestamp: string;
};

// RESTful API: POST /api/challenges/{challengeId}/rewards
export async function issueReward(challengeId: number, req: RewardRequest): Promise<RewardResponse> {
    try {
        const { data } = await api.post<RewardResponse>(`/api/challenges/${challengeId}/rewards`, req);
        if (!data || data.success === false) {
            const msg = (data && data.message) || "포상 처리에 실패했습니다.";
            throw new Error(msg);
        }
        return data;
    } catch (err: unknown) {
        let message = "포상 처리 중 오류가 발생했습니다.";
        if (typeof err === "object" && err !== null) {
            const e = err as { response?: { data?: { message?: string } }; message?: string };
            message = e.response?.data?.message || e.message || message;
        }
        throw new Error(message);
    }
}

// 특정 챌린지의 포상 내역 조회
export async function getChallengeRewards(challengeId: number) {
    try {
        const { data } = await api.get(`/api/challenges/${challengeId}/rewards`);
        return data;
    } catch (err: unknown) {
        let message = "포상 내역 조회 중 오류가 발생했습니다.";
        if (typeof err === "object" && err !== null) {
            const e = err as { response?: { data?: { message?: string } }; message?: string };
            message = e.response?.data?.message || e.message || message;
        }
        throw new Error(message);
    }
}

// 내 포상 내역 조회
export async function getMyRewards() {
    try {
        const { data } = await api.get('/api/rewards/my');
        return data;
    } catch (err: unknown) {
        let message = "포상 내역 조회 중 오류가 발생했습니다.";
        if (typeof err === "object" && err !== null) {
            const e = err as { response?: { data?: { message?: string } }; message?: string };
            message = e.response?.data?.message || e.message || message;
        }
        throw new Error(message);
    }
}
