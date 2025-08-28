"use client";

import { ChallengeHeader } from "@/widgets/challenge/ui/ChallengeHeader";
import { CreateChallengeForm } from "@/features/challenge/ui/CreateChallengeForm";
import { ChallengeList, type Participant } from "@/widgets/challenge/ui/ChallengeList";
import { ChallengeDetail } from "@/widgets/challenge/ui/ChallengeDetail";
import { ChallengeDetailV2 } from "@/widgets/challenge/ui/ChallengeDetailV2";
import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { issueReward } from "@/features/challenge/api/reward";
import { toast } from "sonner";
import { recordPayment } from "@/features/payments/api/create";
import type { PaymentItem } from "@/features/payments/api/list";
import { useApiForGetChallengeList } from "@/features/challenge/hooks/useApiForGetChallengeList";
import type { ApiForGetChallengeListResponse } from "@/features/challenge/api/getChallengeList";

// Minimal PortOne v2 browser SDK typings
type PortOneRequest = {
    storeId: string;
    channelKey: string;
    paymentId: string;
    orderName: string;
    totalAmount: number;
    currency: string;
    payMethod: string;
    easyPay?: { provider?: string };
    customer?: { fullName?: string; email?: string };
};

type PortOneError = { code: string; message: string };
type PortOneSuccess = {
    paymentId: string;
    orderName?: string;
    approvedAt?: string;
    amount?: { total?: number; currency?: string };
    method?: string;
    easyPay?: { provider?: string };
    // Success result does NOT include `code`
    code?: undefined;
    [k: string]: unknown;
};
type PortOneResult = PortOneSuccess | PortOneError;
type PortOneSDK = { requestPayment: (req: PortOneRequest) => Promise<PortOneResult> };


// PortOne configuration (prefer env in production)
const STORE_ID = "store-8859c392-62e5-4fe5-92d3-11c686e9b2bc";
const CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "channel-key-943d5d92-0688-4619-ac6e-7116f665abc0";
const SKIP_BACKEND = process.env.NEXT_PUBLIC_SKIP_BACKEND === "1";

export default function ChallengePage() {
    // fetch from backend and keep local state for optimistic updates
    const { data, isLoading, isError } = useApiForGetChallengeList();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    
    // API 데이터를 직접 사용
    const items = data?.challenges ?? [];
    
    // 선택된 아이템 (선택하지 않으면 null)
    const selected = selectedId ? items.find(c => c.id === selectedId) ?? null : null;
    const router = useRouter();
    const queryClient = useQueryClient();

    const handlePay = useCallback(async (amountPerPerson: number, recipients: Participant[] = []) => {
        if (typeof window === "undefined") return;
        if (!selected) return;
        if (!Array.isArray(recipients) || recipients.length === 0) return;
        const created: PaymentItem[] = [];
        // 로컬 캐시 저장 함수 (불필요, 주석 처리)
        /*
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
        */
        // Prefer PortOne v2 SDK if available

        const PortOne: PortOneSDK | undefined = (window as unknown as { PortOne?: PortOneSDK }).PortOne;
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
                    const res = await PortOne.requestPayment({
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
                    const isSuccess = !!res && !("code" in res);
                    if (isSuccess) {
                        // ✅ 결제 성공: PortOne 응답 결과 로그 출력
                        console.log("[PortOne][결제 성공 응답]", res);
                        try {
                            if (!SKIP_BACKEND) {
                                // 🔥 [백엔드 API 요청 1] 결제 기록 저장 (POST /admin/payments)
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
                                    raw: res as PortOneResult,
                                });

                                // 🔥 [백엔드 API 요청 2] 포상 처리 (POST /admin/challenges/reward)
                                await issueReward({ challengeId: selected.id, participantId: r.id, amount: amountPerPerson });
                            }

                            // ✅ 모든 처리 성공: UI 업데이트 (달성 숫자 업데이트 제거)
                            if (process.env.NODE_ENV !== "production") {
                                console.log("[Payment & Reward][Success]", { challengeId: selected.id, participantId: r.id, amount: amountPerPerson });
                            }
                            toast.success(`${r.name}에게 ${amountPerPerson.toLocaleString()}원 포상 완료`);
                            // 로컬 캐시 저장 불필요 (주석 처리)
                            // const cached = recordLocalPayment(r, paymentId, "PAID", "EASY_PAY", "KAKAOPAY");
                            // if (cached) created.push(cached);
                        } catch (backendError: unknown) {
                            // ❌ 백엔드 API 실패: 사용자에게 명확한 에러 메시지
                            if (process.env.NODE_ENV !== "production") {
                                console.error("[Backend][Error]", backendError);
                            }
                            const msg = backendError instanceof Error ? backendError.message : "포상 처리 중 오류가 발생했습니다.";
                            toast.error(`${r.name} 포상 실패: ${msg}`);
                            // 실패한 경우에도 로컬 캐시 저장 불필요 (주석 처리)
                            // const cached = recordLocalPayment(r, paymentId, "PAID", "EASY_PAY", "KAKAOPAY");
                            // if (cached) created.push(cached);
                        }
                    } else {
                        // ❌ 결제 실패: 포상 진행 안함
                        const msg = (res as PortOneError).message || "알 수 없는 오류";
                        toast.error(`결제 실패(${r.name}): ${msg}`);
                        // 다음 참여자 처리 중단
                        break;
                    }
                } catch (err: unknown) {
                    if (process.env.NODE_ENV !== "production") {
                        console.error("[PortOne][Error]", err);
                    }
                    const msg = err instanceof Error ? err.message : String(err);
                    toast.error(`결제 실패(${r.name}): ${msg}`);
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
        }
    }, [selected, queryClient, router]);

    return (
        <main className="max-w-6xl mx-auto p-6">
            {/* PortOne v2 SDK */}
            <Script src="https://cdn.portone.io/v2/browser-sdk.js" strategy="afterInteractive" />
            <div className="flex items-center justify-between">
                <ChallengeHeader />
                <div className="ml-4">
                    <CreateChallengeForm />
                </div>
            </div>

            {/* 여백용 영역 */}
            <div className="mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    {isLoading ? (
                        <div className="text-sm text-muted-foreground">챌린지를 불러오는 중...</div>
                    ) : isError ? (
                        <div className="text-sm text-destructive">챌린지 목록을 가져오지 못했습니다.</div>
                    ) : items.length === 0 ? (
                        <div className="text-sm text-muted-foreground">표시할 챌린지가 없습니다.</div>
                    ) : (
                        <ChallengeList items={items} selectedId={selected?.id} onSelect={setSelectedId} />
                    )}
                </div>
                <div>
                    {/* 기존 상세 보기 */}
                    {/* <ChallengeDetail data={selected} onPay={handlePay} /> */}

                    {/* 새로운 API 연동 상세 보기 */}
                    {selected ? (
                        <ChallengeDetailV2 challengeId={selected.id} />
                    ) : (
                        <div className="flex items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg">
                            <div className="text-center text-muted-foreground">
                                <p className="text-lg mb-2">📋</p>
                                <p>챌린지를 선택해주세요</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
