"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default function UserGuidePage() {
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
                    <BookOpen className="h-8 w-8" />
                    사용자 가이드
                </h1>
                <p className="text-muted-foreground text-lg">
                    두타 어드민 시스템 사용법 및 기능 설명입니다.
                </p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>🚧 준비 중</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        사용자 가이드 문서는 현재 준비 중입니다. 곧 업데이트될 예정입니다.
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
