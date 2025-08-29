"use client";

import { ChallengeHeader } from "@/widgets/challenge/ui/ChallengeHeader";
import { CreateChallengeForm } from "@/features/challenge/ui/CreateChallengeForm";
import { ChallengeList } from "@/widgets/challenge/ui/ChallengeList";
import { ChallengeDetailV2 } from "@/widgets/challenge/ui/ChallengeDetailV2";
import { ChallengeRewardHistory } from "@/widgets/challenge/ui/ChallengeRewardHistory";
import Script from "next/script";
import { useState } from "react";
import { useApiForGetChallengeList } from "@/features/challenge/hooks/useApiForGetChallengeList";

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

    // 결제 처리 핸들러는 현재 사용되지 않으므로 주석 처리됨

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-1">
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
                
                <div className="lg:col-span-1">
                    {/* 챌린지 상세 정보 */}
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
                
                <div className="lg:col-span-1">
                    {/* 포상 히스토리 */}
                    <ChallengeRewardHistory challengeId={selected?.id ?? null} />
                </div>
            </div>
        </main>
    );
}
