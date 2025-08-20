"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ArrowLeft, AlertTriangle, Lightbulb, Phone } from "lucide-react";
import Link from "next/link";

export default function PaymentProcessPage() {
    return (
        <main className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <Link href="/docs">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        문서 목록으로 돌아가기
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    🏆 두타 어드민 결제 프로세스 메뉴얼
                </h1>
                <p className="text-muted-foreground text-lg">
                    <code className="bg-muted px-2 py-1 rounded text-sm">src/app/challenge/page.tsx</code>에서 구현된
                    챌린지 포상 결제 시스템의 전체 프로세스를 설명합니다.
                </p>
            </div>

            {/* 기술 스택 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🔧 기술 스택
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold mb-2">결제 게이트웨이</h4>
                            <Badge variant="outline">PortOne v2 SDK</Badge>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">인증</h4>
                            <Badge variant="outline">JWT Bearer Token</Badge>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">상태 관리</h4>
                            <Badge variant="outline">React Query</Badge>
                            <Badge variant="outline" className="ml-2">Local Storage</Badge>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">UI</h4>
                            <Badge variant="outline">Sonner Toast</Badge>
                            <Badge variant="outline" className="ml-2">Next.js Router</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 핵심 컴포넌트 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>🌟 핵심 컴포넌트</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* 환경 설정 */}
                    <div>
                        <h4 className="font-semibold mb-3">1. 환경 설정</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
                                <code>{`const STORE_ID = "store-8859c392-62e5-4fe5-92d3-11c686e9b2bc";
const CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "channel-key-943d5d92-0688-4619-ac6e-7116f665abc0";
const SKIP_BACKEND = process.env.NEXT_PUBLIC_SKIP_BACKEND === "1";`}</code>
                            </pre>
                        </div>
                    </div>

                    {/* 타입 정의 */}
                    <div>
                        <h4 className="font-semibold mb-3">2. 타입 정의</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
                                <code>{`type PortOneRequest = {
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

type PortOneSuccess = {
    paymentId: string;
    orderName?: string;
    approvedAt?: string;
    amount?: { total?: number; currency?: string };
    method?: string;
    easyPay?: { provider?: string };
    code?: undefined; // 성공시에는 code가 없음
};

type PortOneError = { 
    code: string; 
    message: string 
};`}</code>
                            </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 결제 프로세스 단계 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🔄 결제 프로세스 단계
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {[
                            {
                                step: "1단계",
                                title: "결제 초기화",
                                description: "유효성 검사 및 기본 설정",
                                code: `const handlePay = useCallback(async (amountPerPerson: number, recipients: Participant[] = []) => {
    // 유효성 검사
    if (typeof window === "undefined") return;
    if (!selected) return;
    if (!Array.isArray(recipients) || recipients.length === 0) return;`
                            },
                            {
                                step: "2단계",
                                title: "PortOne SDK 확인",
                                description: "SDK 로드 상태 확인",
                                code: `const PortOne: PortOneSDK | undefined = (window as unknown as { PortOne?: PortOneSDK }).PortOne;
if (!PortOne?.requestPayment) {
    // SDK 로드 실패시 리턴
    return;
}`
                            },
                            {
                                step: "3단계",
                                title: "결제 요청 생성",
                                description: "결제 정보 설정 및 PortOne 호출",
                                code: `const paymentId = \`pay_\${Date.now()}_\${r.id}\`;
const res = await PortOne.requestPayment({
    storeId: STORE_ID,
    channelKey: CHANNEL_KEY,
    paymentId,
    orderName: \`\${selected.title} 포상 (\${r.name})\`,
    totalAmount: amountPerPerson,
    currency: "KRW",
    payMethod: "EASY_PAY",
    easyPay: { provider: "KAKAOPAY" },
    customer: r.name ? { fullName: r.name, email: r.email } : undefined,
});`
                            },
                            {
                                step: "4단계",
                                title: "결제 결과 처리",
                                description: "성공/실패 판단 및 분기 처리",
                                code: `// PortOne v2: 성공시 code 필드 없음, 실패시 code 필드 있음
const isSuccess = !!res && !("code" in res);

if (isSuccess) {
    // 성공 처리
} else {
    // 실패 처리
    const msg = (res as PortOneError).message || "알 수 없는 오류";
    toast.error(\`결제 실패(\${r.name}): \${msg}\`);
}`
                            },
                            {
                                step: "5단계",
                                title: "백엔드 API 호출",
                                description: "결제 기록 저장 및 포상 처리",
                                code: `if (!SKIP_BACKEND) {
    // 1. 결제 기록 저장
    await recordPayment({
        paymentId,
        orderName: \`\${selected.title} 포상 (\${r.name})\`,
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
    
    // 2. 포상 처리
    await issueReward({ 
        challengeId: selected.id, 
        participantId: r.id, 
        amount: amountPerPerson 
    });
}`
                            },
                            {
                                step: "6단계",
                                title: "로컬 상태 업데이트",
                                description: "UI 업데이트 및 사용자 피드백",
                                code: `// 챌린지 달성 카운트 증가
setItems(prev => prev.map(c => 
    c.id === selected.id 
        ? { ...c, achievedCount: (c.achievedCount ?? 0) + 1 } 
        : c
));

// 성공 메시지
toast.success(\`\${r.name}에게 \${amountPerPerson.toLocaleString()}원 포상 완료\`);`
                            },
                            {
                                step: "7단계",
                                title: "로컬 캐시 저장",
                                description: "오프라인 데이터 및 UX 개선",
                                code: `const recordLocalPayment = (r: Participant, id: string, status = "PAID") => {
    const key = "paymentsCache";
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const item = {
        id,
        orderName: \`\${selected.title} 포상 (\${r.name})\`,
        amount: amountPerPerson,
        currency: "KRW",
        status,
        method: "EASY_PAY",
        provider: "KAKAOPAY",
        payerName: r.name,
        payerEmail: r.email,
        paidAt: new Date().toISOString(),
    };
    arr.unshift(item);
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 100)));
    return item;
};`
                            },
                            {
                                step: "8단계",
                                title: "페이지 이동",
                                description: "결제 완료 후 결과 페이지로 이동",
                                code: `// React Query 캐시 업데이트
queryClient.setQueryData<PaymentItem[]>(["payments", "list"], (old) => {
    const prev = Array.isArray(old) ? old : [];
    return [...created, ...prev];
});

// 결제 내역 페이지로 이동
router.push("/payments");`
                            }
                        ].map((process) => (
                            <div key={process.step} className="border-l-4 border-primary pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="default">{process.step}</Badge>
                                    <h4 className="font-semibold">{process.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{process.description}</p>
                                <div className="bg-muted p-4 rounded-lg">
                                    <pre className="text-xs overflow-x-auto">
                                        <code>{process.code}</code>
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* 에러 처리 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        🚨 에러 처리
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">백엔드 에러 허용</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
                                <code>{`try {
    await recordPayment({...});
} catch (persistErr: unknown) {
    // 백엔드 실패해도 사용자에게는 성공으로 처리
    console.warn("[Payments][Persist][Warn]", msg);
}`}</code>
                            </pre>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">결제 게이트웨이 에러</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
                                <code>{`if (!isSuccess) {
    const msg = (res as PortOneError).message || "알 수 없는 오류";
    toast.error(\`결제 실패(\${r.name}): \${msg}\`);
    break; // 다음 참여자 처리 중단
}`}</code>
                            </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 설정 및 환경변수 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🔧 설정 및 환경변수
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">필수 환경변수</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-sm">
                                <code>{`NEXT_PUBLIC_PORTONE_CHANNEL_KEY=channel-key-943d5d92-0688-4619-ac6e-7116f665abc0
NEXT_PUBLIC_SKIP_BACKEND=1  # 개발시에만`}</code>
                            </pre>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">개발 모드 디버깅</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-sm">
                                <code>{`if (process.env.NODE_ENV !== "production") {
    console.log("[PortOne][Request]", requestData);
    console.log("[PortOne][Result]", response);
    console.log("[Reward][Success]", rewardData);
}`}</code>
                            </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 현재 제한사항 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>📊 현재 제한사항</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">단일 참여자</Badge>
                                <span className="text-sm">한 번에 한 명만 결제 (UX 고려)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">결제 수단</Badge>
                                <span className="text-sm">KAKAOPAY EASY_PAY만 지원</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">통화</Badge>
                                <span className="text-sm">KRW 고정</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">백엔드 의존성</Badge>
                                <span className="text-sm">백엔드 없어도 동작 (로컬 캐시)</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 향후 개선 계획 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        🚀 향후 개선 계획
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3">코드 분리</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• 커스텀 훅: <code>usePayment()</code>, <code>useReward()</code></li>
                                <li>• API 계층: 결제 로직을 별도 서비스로</li>
                                <li>• 타입 정의: 별도 파일로 분리</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">기능 확장</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• 다중 결제: 여러 참여자 동시 포상</li>
                                <li>• 결제 수단: 카드, 계좌이체 등 추가</li>
                                <li>• 환불: 잘못된 결제 취소 기능</li>
                                <li>• 알림: 실시간 결제 알림</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 문의사항 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        📞 문의사항
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        결제 프로세스 관련 문의는 개발팀으로 연락해주세요.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h4 className="font-medium mb-2">Frontend</h4>
                            <p className="text-muted-foreground">React + PortOne v2 SDK</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Backend</h4>
                            <p className="text-muted-foreground">Express + PortOne Webhook</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Database</h4>
                            <p className="text-muted-foreground">MySQL payments/rewards 테이블</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
