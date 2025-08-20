import api from "@/shared/lib/axios";

export type CreatePaymentRequest = {
    paymentId: string;
    orderName: string;
    amount: number;
    currency: string;
    status: "PAID" | "FAILED" | "PENDING";
    method?: string;
    provider?: string;
    payerName?: string;
    payerEmail?: string;
    paidAt?: string;
    challengeId?: number;
    participantId?: number;
    raw?: unknown; // optional raw gateway response for debugging
};

export type CreatePaymentResponse = { success: boolean; id?: string; message?: string };

export async function recordPayment(body: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
        const { data } = await api.post<CreatePaymentResponse>("/admin/payments", body);
        return data ?? { success: true };
    } catch (err: unknown) {
        // Swallow 404 to keep UX smooth when backend endpoint is not ready
        const e = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
        if (e?.response?.status === 404) return { success: false, message: "endpoint not found" };
        const message = e?.response?.data?.message || e?.message || "결제 기록 저장에 실패했습니다.";
        throw new Error(message);
    }
}
