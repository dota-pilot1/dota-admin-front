import api from "@/shared/lib/axios";

export type PaymentItem = {
    id: string;
    orderName: string;
    amount: number;
    currency: string;
    status: "PAID" | "FAILED" | "PENDING";
    method?: string; // EASY_PAY, CARD, etc.
    provider?: string; // KAKAOPAY, TOSSPAY, ...
    payerName?: string;
    payerEmail?: string;
    paidAt?: string; // ISO timestamp
};

export async function getPayments(): Promise<PaymentItem[]> {
    try {
        const { data } = await api.get<PaymentItem[] | { items: PaymentItem[] }>("/admin/payments");
        if (Array.isArray(data)) return data;
        if (data && Array.isArray((data as { items?: PaymentItem[] }).items)) return (data as { items?: PaymentItem[] }).items ?? [];
        return [];
    } catch (err: unknown) {
        const e = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
        const status = e?.response?.status;
        if (status === 404) {
            // Endpoint not available yet -> treat as empty list for graceful UX in dev
            return [];
        }
        const message = e?.response?.data?.message || e?.message || "결제 내역을 불러오지 못했습니다.";
        throw new Error(message);
    }
}
