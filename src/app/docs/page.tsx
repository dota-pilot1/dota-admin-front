"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { FileText, CreditCard, BookOpen, Settings, Users, Code, Target, Server, ShieldCheck } from "lucide-react";
import Link from "next/link";

const docItems = [
    {
        id: "authorization-process",
        title: "권한 관리 프로세스",
        description: "백엔드 권한 관리 시스템의 전체 프로세스를 단계별로 설명",
        icon: ShieldCheck,
        href: "/docs/authorization-process",
        tags: ["권한", "인증", "Spring Security", "JWT"],
        priority: "high"
    },
    {
        id: "auth-system",
        title: "권한 / 롤 시스템",
        description: "현재 Role 기반 구조와 초기화 & 등록 정책 설명",
        icon: ShieldCheck,
        href: "/docs/auth-system",
        tags: ["Role", "권한", "Bootstrap"],
        priority: "high"
    },
    {
        id: "challenge-process",
        title: "챌린지 포상 프로세스",
        description: "handlePay 함수 중심의 전체 챌린지 포상 워크플로우 및 파일 구조 설명",
        icon: Target,
        href: "/docs/challenge-process",
        tags: ["챌린지", "워크플로우", "handlePay"],
        priority: "high"
    },
    {
        id: "payment-process",
        title: "결제 프로세스",
        description: "챌린지 포상 결제 시스템의 전체 프로세스 및 구현 가이드",
        icon: CreditCard,
        href: "/docs/payment-process",
        tags: ["PortOne", "결제", "프로세스"],
        priority: "high"
    },
    {
        id: "backend-deploy",
        title: "백엔드 EC2 배포",
        description: "EC2에서 Spring Boot 서버 재배포: 명령어 복붙 매뉴얼",
        icon: Server,
        href: "/docs/backend-deploy",
        tags: ["EC2", "Spring Boot", "배포"],
        priority: "high"
    },
    {
        id: "api-reference",
        title: "API 레퍼런스",
        description: "백엔드 API 엔드포인트 및 스키마 문서",
        icon: Code,
        href: "/docs/api-reference",
        tags: ["API", "백엔드", "스키마"],
        priority: "high"
    },
    {
        id: "user-guide",
        title: "사용자 가이드",
        description: "어드민 시스템 사용법 및 기능 설명",
        icon: BookOpen,
        href: "/docs/user-guide",
        tags: ["사용법", "가이드"],
        priority: "medium"
    },
    {
        id: "setup-guide",
        title: "설치 및 설정",
        description: "개발 환경 설정 및 배포 가이드",
        icon: Settings,
        href: "/docs/setup-guide",
        tags: ["설정", "배포"],
        priority: "medium"
    },
];

export default function DocsPage() {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sortedItems = [...docItems].sort((a, b) =>
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder]
    );

    return (
        <main className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-8 w-8" />
                    두타 어드민 문서
                </h1>
                <p className="text-muted-foreground text-lg">
                    시스템 구조, API 가이드, 사용법 등을 확인할 수 있습니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Icon className="h-6 w-6 text-primary" />
                                    {item.title}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {item.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {item.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <Link href={item.href}>
                                    <Button variant="outline" className="w-full">
                                        문서 보기
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-12 p-6 bg-muted/30 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    개발팀 정보
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <h3 className="font-medium mb-2">Frontend</h3>
                        <ul className="text-muted-foreground space-y-1">
                            <li>• Next.js 15.4.6 + App Router</li>
                            <li>• TypeScript + Tailwind CSS</li>
                            <li>• React Query + Zustand</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">결제 시스템</h3>
                        <ul className="text-muted-foreground space-y-1">
                            <li>• PortOne v2 SDK</li>
                            <li>• KakaoPay 통합</li>
                            <li>• JWT 인증</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Backend</h3>
                        <ul className="text-muted-foreground space-y-1">
                            <li>• Express.js + MySQL</li>
                            <li>• PortOne Webhook</li>
                            <li>• REST API</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
