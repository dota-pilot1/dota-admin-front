"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ArrowLeft, Target, CreditCard, Database, Users, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ChallengeProcessPage() {
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
                    <Target className="h-8 w-8" />
                    챌린지 포상 프로세스
                </h1>
                <p className="text-muted-foreground text-lg">
                    <code className="bg-muted px-2 py-1 rounded text-sm">src/app/challenge/page.tsx</code>에서
                    구현된 챌린지 포상 결제 시스템의 전체 워크플로우를 설명합니다.
                </p>
            </div>

            {/* 개요 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        📋 프로세스 개요
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-sm">1. 참여자 선택</h4>
                            <p className="text-xs text-muted-foreground">포상받을 사람 선택</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CreditCard className="h-6 w-6 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-sm">2. 결제 처리</h4>
                            <p className="text-xs text-muted-foreground">PortOne 결제 게이트웨이</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Database className="h-6 w-6 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-sm">3. 데이터 저장</h4>
                            <p className="text-xs text-muted-foreground">결제 & 포상 기록</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle className="h-6 w-6 text-orange-600" />
                            </div>
                            <h4 className="font-semibold text-sm">4. 완료 처리</h4>
                            <p className="text-xs text-muted-foreground">UI 업데이트 & 알림</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 상세 단계별 설명 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>🔄 상세 워크플로우</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {/* 1단계 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    1
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2">사용자 액션: 포상하기 버튼 클릭</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    챌린지 페이지에서 참여자를 선택하고 포상 금액을 입력한 후 &ldquo;포상하기&rdquo; 버튼을 클릭합니다.
                                </p>
                                <div className="bg-muted p-3 rounded-lg">
                                    <pre className="text-xs overflow-x-auto">
                                        <code>{`// ChallengeDetail 컴포넌트에서 호출
<Button onClick={() => handlePay(amount, selectedParticipants)}>
    포상하기
</Button>`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* 2단계 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2">handlePay 함수 실행</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    메인 결제 처리 함수가 실행되어 PortOne v2 SDK를 통해 결제를 시작합니다.
                                </p>
                                <div className="bg-muted p-3 rounded-lg">
                                    <pre className="text-xs overflow-x-auto">
                                        <code>{`const handlePay = useCallback(async (amountPerPerson: number, recipients: Participant[]) => {
    // 1. 유효성 검사
    if (!selected || recipients.length === 0) return;
    
    // 2. PortOne SDK 호출
    const res = await PortOne.requestPayment({
        storeId: STORE_ID,
        channelKey: CHANNEL_KEY,
        paymentId: \`pay_\${Date.now()}_\${r.id}\`,
        orderName: \`\${selected.title} 포상 (\${r.name})\`,
        totalAmount: amountPerPerson,
        currency: "KRW",
        payMethod: "EASY_PAY",
        easyPay: { provider: "KAKAOPAY" }
    });
}, [selected, queryClient, router]);`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* 3단계 - 성공 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    3A
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    결제 성공시 처리
                                    <Badge variant="default" className="bg-green-600">SUCCESS</Badge>
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    PortOne 결제가 성공하면 백엔드 API를 순차적으로 호출합니다.
                                </p>
                                <div className="space-y-3">
                                    <div className="bg-muted p-3 rounded-lg">
                                        <h4 className="font-medium text-xs mb-2">🔥 API 1: 결제 기록 저장</h4>
                                        <pre className="text-xs overflow-x-auto">
                                            <code>{`await recordPayment({
    paymentId,
    orderName: \`\${selected.title} 포상 (\${r.name})\`,
    amount: amountPerPerson,
    currency: "KRW",
    status: "PAID",
    method: "EASY_PAY",
    provider: "KAKAOPAY",
    challengeId: selected.id,
    participantId: r.id,
    raw: res // PortOne 응답 원본
});`}</code>
                                        </pre>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="bg-muted p-3 rounded-lg">
                                        <h4 className="font-medium text-xs mb-2">🔥 API 2: 포상 처리</h4>
                                        <pre className="text-xs overflow-x-auto">
                                            <code>{`await issueReward({
    challengeId: selected.id,
    participantId: r.id,
    amount: amountPerPerson
});`}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3단계 - 실패 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    3B
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    결제 실패시 처리
                                    <Badge variant="destructive">FAILED</Badge>
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    PortOne 결제가 실패하면 에러 메시지를 표시하고 포상 처리를 중단합니다.
                                </p>
                                <div className="bg-muted p-3 rounded-lg">
                                    <pre className="text-xs overflow-x-auto">
                                        <code>{`if (!isSuccess) {
    const msg = (res as PortOneError).message || "알 수 없는 오류";
    toast.error(\`결제 실패(\${r.name}): \${msg}\`);
    break; // 다음 참여자 처리 중단
}`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* 4단계 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    4
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2">UI 업데이트 및 완료 처리</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    백엔드 처리 완료 후 사용자 인터페이스를 업데이트하고 결제 내역 페이지로 이동합니다.
                                </p>
                                <div className="space-y-3">
                                    <div className="bg-muted p-3 rounded-lg">
                                        <h4 className="font-medium text-xs mb-2">성공시</h4>
                                        <pre className="text-xs overflow-x-auto">
                                            <code>{`// 1. 챌린지 달성 카운트 증가
setItems(prev => prev.map(c => 
    c.id === selected.id 
        ? { ...c, achievedCount: c.achievedCount + 1 } 
        : c
));

// 2. 성공 토스트 메시지
toast.success(\`\${r.name}에게 \${amount.toLocaleString()}원 포상 완료\`);

// 3. 로컬 캐시 저장
recordLocalPayment(r, paymentId, "PAID");

// 4. 결제 내역 페이지로 이동
router.push("/payments");`}</code>
                                        </pre>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded-lg">
                                        <h4 className="font-medium text-xs mb-2 text-red-800">실패시</h4>
                                        <pre className="text-xs overflow-x-auto text-red-700">
                                            <code>{`// 에러 토스트 메시지 표시
toast.error(\`\${r.name} 포상 실패: \${error.message}\`);

// 로컬 캐시는 여전히 저장 (결제는 성공했으므로)
recordLocalPayment(r, paymentId, "PAID");`}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 핵심 파일 구조 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>📁 핵심 파일 구조</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-sm mb-1">
                                <code>src/app/challenge/page.tsx</code>
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">메인 로직이 포함된 챌린지 페이지</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• <code>handlePay</code> 함수: 전체 결제 프로세스 관리</li>
                                <li>• <code>recordLocalPayment</code> 함수: 로컬 캐시 저장</li>
                                <li>• PortOne v2 SDK 통합</li>
                                <li>• 상태 관리 (챌린지 목록, 선택된 챌린지)</li>
                            </ul>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-semibold text-sm mb-1">
                                <code>src/features/payments/api/create.ts</code>
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">결제 기록 저장 API 클라이언트</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• <code>recordPayment</code> 함수</li>
                                <li>• POST /admin/payments 엔드포인트 호출</li>
                            </ul>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                            <h4 className="font-semibold text-sm mb-1">
                                <code>src/features/challenge/api/reward.ts</code>
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">포상 처리 API 클라이언트</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• <code>issueReward</code> 함수</li>
                                <li>• POST /admin/challenges/reward 엔드포인트 호출</li>
                            </ul>
                        </div>
                        <div className="border-l-4 border-orange-500 pl-4">
                            <h4 className="font-semibold text-sm mb-1">
                                <code>src/widgets/challenge/ui/ChallengeDetail.tsx</code>
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">챌린지 상세 정보 및 포상 UI 컴포넌트</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• 참여자 선택 인터페이스</li>
                                <li>• 포상 금액 입력</li>
                                <li>• &ldquo;포상하기&rdquo; 버튼</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 주요 특징 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>⚡ 주요 특징</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm">장점</h4>
                            <ul className="text-sm space-y-1">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    단일 파일에 모든 로직 집중
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    명확한 데이터 흐름
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    로컬 캐시로 오프라인 지원
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    개발 모드 디버깅 지원
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm">개선 포인트</h4>
                            <ul className="text-sm space-y-1">
                                <li className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-orange-600" />
                                    커스텀 훅으로 분리 필요
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-orange-600" />
                                    에러 처리 로직 개선
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-orange-600" />
                                    타입 정의 별도 파일 분리
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-orange-600" />
                                    다중 참여자 동시 처리
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 환경 설정 */}
            <Card>
                <CardHeader>
                    <CardTitle>⚙️ 환경 설정</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-2">필수 환경변수</h4>
                            <div className="bg-muted p-3 rounded-lg">
                                <pre className="text-xs">
                                    <code>{`NEXT_PUBLIC_PORTONE_CHANNEL_KEY=channel-key-943d5d92-0688-4619-ac6e-7116f665abc0
NEXT_PUBLIC_SKIP_BACKEND=1  # 개발시에만 (백엔드 없이 테스트)`}</code>
                                </pre>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-2">PortOne 설정</h4>
                            <div className="bg-muted p-3 rounded-lg">
                                <pre className="text-xs">
                                    <code>{`const STORE_ID = "store-8859c392-62e5-4fe5-92d3-11c686e9b2bc";
const CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

// PortOne v2 SDK 로드
<Script src="https://cdn.portone.io/v2/browser-sdk.js" strategy="afterInteractive" />`}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
