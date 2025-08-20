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
        if (data && Array.isArray((data as any).items)) return (data as any).items;
        return [];
    } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
            // Endpoint not available yet -> treat as empty list for graceful UX in dev
            return [];
        }
        const message = err?.response?.data?.message || err?.message || "결제 내역을 불러오지 못했습니다.";
        throw new Error(message);
    }
}
