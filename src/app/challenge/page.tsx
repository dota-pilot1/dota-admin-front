"use client";

import { ChallengeHeader } from "@/widgets/challenge/ui/ChallengeHeader";
import { ChallengeList, type Challenge, type Participant } from "@/widgets/challenge/ui/ChallengeList";
import { ChallengeDetail } from "@/widgets/challenge/ui/ChallengeDetail";
import Script from "next/script";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { issueReward } from "@/features/challenge/api/reward";
import { toast } from "sonner";
import { recordPayment } from "@/features/payments/api/create";
import type { PaymentItem } from "@/features/payments/api/list";

// PortOne configuration (prefer env in production)
const STORE_ID = "store-8859c392-62e5-4fe5-92d3-11c686e9b2bc";
const CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "channel-key-943d5d92-0688-4619-ac6e-7116f665abc0";
const SKIP_BACKEND = process.env.NEXT_PUBLIC_SKIP_BACKEND === "1";

const DUMMY: Challenge[] = [
    {
        id: 1,
        title: "주간 스터디 발표",
        description: "Spring AI 또는 RAG 체인 실습 내용을 10분 발표",
        tags: ["Spring Boot", "Spring AI", "RAG"],
        achievedCount: 5,
        author: { id: 100, name: "Tech Lead" },
        participants: [
            { id: 201, name: "김개발", email: "dev1@example.com" },
            { id: 202, name: "이리액트", email: "react@example.com" },
        ],
    },
    {
        id: 2,
        title: "프론트 성능 개선",
        description: "Next.js에서 framer-motion 사용해 전환 애니메이션 적용 및 TTI 10% 개선",
        tags: ["Next.js", "React", "framer-motion"],
        achievedCount: 3,
        author: { id: 101, name: "FE Lead" },
        participants: [
            { id: 203, name: "박모션" },
            { id: 204, name: "최렌더" },
        ],
    },
    {
        id: 3,
        title: "드래그앤드롭 UX 개선",
        description: "dnd-kit으로 칸반 보드 구성 및 키보드 접근성 추가",
        tags: ["dnd-kit", "React"],
        achievedCount: 4,
        author: { id: 100, name: "Tech Lead" },
        participants: [
            { id: 205, name: "오칸반" },
            { id: 206, name: "윤드롭" },
        ],
    },
    {
        id: 4,
        title: "사내 챗봇 개선",
        description: "RAG 파이프라인 튜닝으로 답변 정확도 15% 향상",
        tags: ["RAG", "Chatbot"],
        achievedCount: 2,
        author: { id: 102, name: "AI Lead" },
        participants: [
            { id: 207, name: "정봇" },
            { id: 208, name: "한지식" },
        ],
    },
];

export default function ChallengePage() {
    // keep local state for optimistic updates
    const [items, setItems] = useState<Challenge[]>(DUMMY);
    const [selectedId, setSelectedId] = useState<number | null>(items[0]?.id ?? null);
    const selected = useMemo(() => items.find(c => c.id === selectedId) ?? null, [selectedId, items]);
    const router = useRouter();
    const queryClient = useQueryClient();

    const handlePay = useCallback(async (amountPerPerson: number, recipients: Participant[] = []) => {
        if (typeof window === "undefined") return;
        if (!selected) return;
        if (!Array.isArray(recipients) || recipients.length === 0) return;
        const created: PaymentItem[] = [];
        const recordLocalPayment = (
            r: Participant,
            id: string,
            status: PaymentItem["status"] = "PAID",
            method: string = "EASY_PAY",
            provider: string = "KAKAOPAY"
        ): PaymentItem | undefined => {
            try {
                const key = "paymentsCache";
                const raw = localStorage.getItem(key);
                const arr = raw ? JSON.parse(raw) : [];
                const item = {
                    id,
                    orderName: `${selected.title} 포상 (${r.name})`,
                    amount: amountPerPerson,
                    currency: "KRW",
                    status,
                    method,
                    provider,
                    payerName: r.name,
                    payerEmail: r.email,
                    paidAt: new Date().toISOString(),
                };
                arr.unshift(item);
                localStorage.setItem(key, JSON.stringify(arr.slice(0, 100)));
                if (process.env.NODE_ENV !== "production") {
                    console.debug("[Payments][LocalCache] saved", item);
                }
                return item as PaymentItem;
            } catch { }
            return undefined;
        };
        // Prefer PortOne v2 SDK if available
        const PortOne = (window as any).PortOne;
        if (PortOne?.requestPayment) {
            // For now, process only the first recipient to avoid repeated popups
            const targets = recipients.slice(0, 1);
            for (const r of targets) {
                try {
                    const paymentId = `pay_${Date.now()}_${r.id}`;
                    if (process.env.NODE_ENV !== "production") {
                        console.log("[PortOne][Request]", {
                            storeId: STORE_ID,
                            channelKey: CHANNEL_KEY,
                            paymentId,
                            orderName: `${selected.title} 포상 (${r.name})`,
                            totalAmount: amountPerPerson,
                            currency: "KRW",
                            payMethod: "EASY_PAY",
                            easyPay: { provider: "KAKAOPAY" },
                            customer: r,
                        });
                    }
                    const res: any = await PortOne.requestPayment({
                        storeId: STORE_ID,
                        channelKey: CHANNEL_KEY,
                        paymentId,
                        orderName: `${selected.title} 포상 (${r.name})`,
                        totalAmount: amountPerPerson,
                        currency: "KRW",
                        payMethod: "EASY_PAY",
                        easyPay: { provider: "KAKAOPAY" },
                        customer: r.name ? { fullName: r.name, email: r.email } : undefined,
                    });
                    if (process.env.NODE_ENV !== "production") {
                        console.log("[PortOne][Result]", res);
                    }
                    // PortOne v2: success responses DO NOT include `code`; error responses include { code, message }
                    const isSuccess = res && !res.code;
                    if (isSuccess) {
                        try {
                            if (!SKIP_BACKEND) {
                                // Persist payment record to backend (best effort)
                                try {
                                    await recordPayment({
                                        paymentId,
                                        orderName: `${selected.title} 포상 (${r.name})`,
                                        amount: amountPerPerson,
                                        currency: "KRW",
                                        status: "PAID",
                                        method: "EASY_PAY",
                                        provider: "KAKAOPAY",
                                        payerName: r.name,
                                        payerEmail: r.email,
                                        paidAt: new Date().toISOString(),
                                        challengeId: selected.id,
                                        participantId: r.id,
                                        raw: res,
                                    });
                                } catch (persistErr: any) {
                                    if (process.env.NODE_ENV !== "production") {
                                        console.warn("[Payments][Persist][Warn]", persistErr?.message || persistErr);
                                    }
                                }
                                await issueReward({ challengeId: selected.id, participantId: r.id, amount: amountPerPerson });
                            }
                            if (process.env.NODE_ENV !== "production") {
                                console.log("[Reward][Success]", { challengeId: selected.id, participantId: r.id, amount: amountPerPerson });
                            }
                            setItems(prev => prev.map(c => c.id === selected.id ? { ...c, achievedCount: (c.achievedCount ?? 0) + 1 } : c));
                            toast.success(`${r.name}에게 ${amountPerPerson.toLocaleString()}원 포상 완료`);
                        } catch (e: any) {
                            if (process.env.NODE_ENV !== "production") {
                                console.error("[Reward][Error]", e);
                            }
                            toast.error(e?.message || `${r.name} 포상 처리에 실패했습니다.`);
                        }
                        // Record locally so /payments works without backend
                        const cached = recordLocalPayment(r, paymentId, "PAID", "EASY_PAY", "KAKAOPAY");
                        if (cached) created.push(cached);
                    } else {
                        // Non-success: do not record pending entries; only notify and stop
                        toast.error(`결제 실패(${r.name}): ${res?.message || "알 수 없는 오류"}`);
                        // Stop processing subsequent recipients on failure
                        break;
                    }
                } catch (err: any) {
                    if (process.env.NODE_ENV !== "production") {
                        console.error("[PortOne][Error]", err);
                    }
                    toast.error(`결제 실패(${r.name}): ${err?.message || err}`);
                    break;
                }
            }
            // Navigate to payments list after attempts
            // Prime React Query cache so /payments renders immediately
            try {
                queryClient.setQueryData<PaymentItem[] | undefined>(["payments", "list"], (old) => {
                    const prev = Array.isArray(old) ? old : [];
                    return [...created, ...prev];
                });
            } catch { }
            if (process.env.NODE_ENV !== "production") {
                console.log("[Navigate] -> /payments (router)");
            }
            router.push("/payments");
            return;
        }

        // Fallback: legacy IMP SDK
        const IMP = (window as any).IMP;
        if (!IMP) return;
        if (process.env.NODE_ENV !== "production") {
            console.log("[IMP][Init]");
        }
        IMP.init("impXXXXXXXXX");
        // Legacy fallback: process first only (multi-pay not supported in one call)
        const [first, ...rest] = recipients;
        if (!first) return;
        const legacyPayload = {
            pg: "kakaopay",
            pay_method: "card",
            merchant_uid: `mid_${Date.now()}_${first.id}`,
            name: `${selected.title} 포상 (${first.name})`,
            amount: amountPerPerson,
            buyer_email: first?.email || "user@example.com",
            buyer_name: first?.name || "사용자",
        };
        if (process.env.NODE_ENV !== "production") {
            console.log("[IMP][Request]", legacyPayload);
        }
        IMP.request_pay(legacyPayload, async function (rsp: any) {
            if (process.env.NODE_ENV !== "production") {
                console.log("[IMP][Result]", rsp);
            }
            if (rsp.success) {
                try {
                    if (!SKIP_BACKEND) {
                        try {
                            await recordPayment({
                                paymentId: legacyPayload.merchant_uid,
                                orderName: legacyPayload.name,
                                amount: legacyPayload.amount,
                                currency: "KRW",
                                status: "PAID",
                                method: "CARD",
                                provider: "KAKAOPAY",
                                payerName: legacyPayload.buyer_name,
                                payerEmail: legacyPayload.buyer_email,
                                paidAt: new Date().toISOString(),
                                challengeId: selected.id,
                                participantId: first.id,
                                raw: rsp,
                            });
                        } catch (persistErr: any) {
                            if (process.env.NODE_ENV !== "production") {
                                console.warn("[Payments][Persist][Warn]", persistErr?.message || persistErr);
                            }
                        }
                        await issueReward({ challengeId: selected.id, participantId: first.id, amount: amountPerPerson });
                    }
                    if (process.env.NODE_ENV !== "production") {
                        console.log("[Reward][Success]", { challengeId: selected.id, participantId: first.id, amount: amountPerPerson });
                    }
                    setItems(prev => prev.map(c => c.id === selected.id ? { ...c, achievedCount: (c.achievedCount ?? 0) + 1 } : c));
                    toast.success(`${first.name}에게 ${amountPerPerson.toLocaleString()}원 포상 완료`);
                } catch (e: any) {
                    if (process.env.NODE_ENV !== "production") {
                        console.error("[Reward][Error]", e);
                    }
                    toast.error(e?.message || "포상 처리에 실패했습니다.");
                }
                // Record locally for payments page
                const cached = recordLocalPayment(first, legacyPayload.merchant_uid);
                if (cached) {
                    try {
                        queryClient.setQueryData<PaymentItem[] | undefined>(["payments", "list"], (old) => {
                            const prev = Array.isArray(old) ? old : [];
                            return [cached, ...prev];
                        });
                    } catch { }
                }
            } else {
                toast.error("결제 실패: " + rsp.error_msg);
            }
            if (process.env.NODE_ENV !== "production") {
                console.log("[Navigate] -> /payments (router)");
            }
            router.push("/payments");
        });
    }, [selected, queryClient, router]);

    return (
        <main className="max-w-6xl mx-auto p-6">
            {/* PortOne v2 SDK */}
            <Script src="https://cdn.portone.io/v2/browser-sdk.js" strategy="afterInteractive" />
            {/* Legacy IMP SDK (fallback) */}
            <Script src="https://cdn.portone.io/v1/portone.js" strategy="afterInteractive" />
            <ChallengeHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <ChallengeList items={items} selectedId={selectedId ?? undefined} onSelect={setSelectedId} />
                </div>
                <div>
                    <ChallengeDetail data={selected} onPay={handlePay} />
                </div>
            </div>
        </main>
    );
}
