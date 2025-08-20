"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ArrowLeft, Code, Database } from "lucide-react";
import Link from "next/link";

export default function ApiReferencePage() {
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
                    <Code className="h-8 w-8" />
                    API 레퍼런스
                </h1>
                <p className="text-muted-foreground text-lg">
                    백엔드 API 엔드포인트 및 스키마 문서입니다.
                </p>
            </div>

            {/* Authentication */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>🔐 인증</CardTitle>
                    <CardDescription>
                        모든 API 요청에는 JWT Bearer 토큰이 필요합니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted p-4 rounded-lg mb-4">
                        <pre className="text-sm">
                            <code>{`Authorization: Bearer <your_jwt_token>`}</code>
                        </pre>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        토큰은 로그인 후 localStorage에 저장되며, Axios 인터셉터에 의해 자동으로 헤더에 추가됩니다.
                    </p>
                </CardContent>
            </Card>

            {/* Payment APIs */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>💳 결제 API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* POST /admin/payments */}
                    <div className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default" className="bg-green-600">POST</Badge>
                            <code className="text-sm font-mono">/admin/payments</code>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">결제 기록을 저장합니다.</p>

                        <h4 className="font-semibold mb-2">Request Body</h4>
                        <div className="bg-muted p-4 rounded-lg mb-4">
                            <pre className="text-xs overflow-x-auto">
                                <code>{`{
  "paymentId": "pay_1734567890_201",
  "orderName": "주간 스터디 발표 포상 (김개발)",
  "amount": 50000,
  "currency": "KRW",
  "status": "PAID" | "FAILED" | "PENDING",
  "method": "EASY_PAY",
  "provider": "KAKAOPAY",
  "payerName": "김개발",
  "payerEmail": "dev1@example.com",
  "paidAt": "2024-01-01T12:00:00.000Z",
  "challengeId": 1,
  "participantId": 201,
  "raw": { /* PortOne 응답 원본 */ }
}`}</code>
                            </pre>
                        </div>

                        <h4 className="font-semibold mb-2">Response</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-xs">
                                <code>{`{
  "success": true,
  "id": "generated_id",
  "message": "결제 기록이 저장되었습니다."
}`}</code>
                            </pre>
                        </div>
                    </div>

                    {/* GET /admin/payments */}
                    <div className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default" className="bg-blue-600">GET</Badge>
                            <code className="text-sm font-mono">/admin/payments</code>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">결제 내역을 조회합니다.</p>

                        <h4 className="font-semibold mb-2">Response</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-xs overflow-x-auto">
                                <code>{`[
  {
    "id": "pay_1734567890_201",
    "orderName": "주간 스터디 발표 포상 (김개발)",
    "amount": 50000,
    "currency": "KRW",
    "status": "PAID",
    "method": "EASY_PAY",
    "provider": "KAKAOPAY",
    "payerName": "김개발",
    "payerEmail": "dev1@example.com",
    "paidAt": "2024-01-01T12:00:00.000Z"
  }
]

// 또는

{
  "items": [/* 위와 동일한 배열 */]
}`}</code>
                            </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reward APIs */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>🎁 포상 API</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default" className="bg-green-600">POST</Badge>
                            <code className="text-sm font-mono">/admin/challenges/reward</code>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">챌린지 포상을 처리합니다.</p>

                        <h4 className="font-semibold mb-2">Request Body</h4>
                        <div className="bg-muted p-4 rounded-lg mb-4">
                            <pre className="text-xs">
                                <code>{`{
  "challengeId": 1,
  "participantId": 201,
  "amount": 50000
}`}</code>
                            </pre>
                        </div>

                        <h4 className="font-semibold mb-2">Response</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-xs">
                                <code>{`{
  "success": true,
  "message": "포상이 처리되었습니다."
}`}</code>
                            </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Database Schema */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        🗄️ 데이터베이스 스키마
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Payments Table */}
                    <div>
                        <h4 className="font-semibold mb-3">payments 테이블</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-xs overflow-x-auto">
                                <code>{`CREATE TABLE payments (
    id VARCHAR(255) PRIMARY KEY,          -- paymentId (PortOne ID)
    order_name VARCHAR(500) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'KRW',
    status ENUM('PAID', 'FAILED', 'PENDING') NOT NULL,
    method VARCHAR(50),
    provider VARCHAR(50),
    payer_name VARCHAR(100),
    payer_email VARCHAR(255),
    paid_at TIMESTAMP NULL,
    challenge_id INT,
    participant_id INT,
    raw_response JSON,                     -- PortOne 원본 응답
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`}</code>
                            </pre>
                        </div>
                    </div>

                    {/* Rewards Table */}
                    <div>
                        <h4 className="font-semibold mb-3">rewards 테이블</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-xs overflow-x-auto">
                                <code>{`CREATE TABLE rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    challenge_id INT NOT NULL,
    participant_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_challenge_participant (challenge_id, participant_id)
);`}</code>
                            </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Error Codes */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>⚠️ 에러 코드</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">HTTP 상태 코드</h4>
                                <ul className="space-y-1 text-sm">
                                    <li><Badge variant="destructive">400</Badge> 잘못된 요청 데이터</li>
                                    <li><Badge variant="destructive">401</Badge> 인증 실패</li>
                                    <li><Badge variant="secondary">404</Badge> 엔드포인트 없음</li>
                                    <li><Badge variant="destructive">500</Badge> 서버 내부 오류</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">에러 응답 형식</h4>
                                <div className="bg-muted p-3 rounded-lg">
                                    <pre className="text-xs">
                                        <code>{`{
  "success": false,
  "message": "에러 메시지",
  "code": "ERROR_CODE"
}`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Implementation Notes */}
            <Card>
                <CardHeader>
                    <CardTitle>📝 구현 참고사항</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li>• <strong>멱등성</strong>: 결제 API는 <code>paymentId</code>로 중복 저장 방지</li>
                        <li>• <strong>포상 중복</strong>: <code>(challengeId, participantId)</code> 조합으로 중복 포상 방지</li>
                        <li>• <strong>CORS</strong>: 프론트엔드 도메인에서의 요청 허용 필요</li>
                        <li>• <strong>웹훅</strong>: PortOne 웹훅으로 실제 결제 검증 권장</li>
                        <li>• <strong>로깅</strong>: 모든 결제 관련 요청/응답 로그 저장 권장</li>
                    </ul>
                </CardContent>
            </Card>
        </main>
    );
}
