import api from "@/shared/lib/axios";

export type RewardRequest = {
    challengeId: number;
    participantId: number;
    amount: number;
};

export type RewardResponse = {
    success: boolean;
    message?: string;
};

// Assumption: backend exposes POST /admin/challenges/reward with JSON body
// Adjust the endpoint to match your server when available.
export async function issueReward(req: RewardRequest): Promise<RewardResponse> {
    try {
        const { data } = await api.post<RewardResponse>("/admin/challenges/reward", req);
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
