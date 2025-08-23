"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { ShieldCheck, RefreshCcw, Database, Settings, Flag, Layers } from "lucide-react";

export default function AuthSystemDocsPage() {
    return (
        <main className="max-w-4xl mx-auto p-6 space-y-10">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    권한 / 롤 시스템 매뉴얼
                </h1>
                <p className="text-muted-foreground">
                    현재 버전은 간소화된 Role 중심 구조(권한 체크 비활성화 상태) + 부트스트랩(기동 시 시드) + 런타임 등록 정책(첫 사용자 ADMIN 승격 옵션) 으로 구성됩니다.
                </p>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Role</Badge>
                    <Badge variant="secondary">Bootstrap</Badge>
                    <Badge variant="secondary">Registration Policy</Badge>
                    <Badge variant="secondary">Init Seeding</Badge>
                </div>
            </header>

            <section className="space-y-3 text-sm leading-relaxed">
                <Card>
                    <CardHeader>
                        <CardTitle>핵심 전략 요약</CardTitle>
                        <CardDescription>Role = 그룹(집합) / Authority = 세밀 권한 코드</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Role</strong>: 화면/비즈니스 단에서 다루기 쉬운 상위 그룹. 예) USER, ADMIN, DEVELOPER</li>
                            <li><strong>Authority</strong>: 실질적인 접근 제어 단위 (예정). 예) CHALLENGE_READ, CHALLENGE_WRITE, USER_MANAGE</li>
                            <li>Role 은 여러 Authority 를 포함하는 집합(Set) 역할. 사용자 → 단일 Role(or 다중 Role 확장) → 권한 해석</li>
                            <li>현재 단계: 단순 Role 기반 (Authority 테이블 초기화됨). 추후 V8 Migration 에서 Authority 재도입 후 Role ↔ Authority 매핑 복원</li>
                            <li>장점: UI / 운영에서 Role 으로 빠른 지정, 내부 정책은 Authority 조합으로 세밀 제어</li>
                            <li>목표: 메서드/@PreAuthorize 직접 사용 최소화 → 커스텀 권한 어댑터 or AOP + 캐시</li>
                        </ul>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2"><Layers className="h-5 w-5" />구성 레이어</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>1. Bootstrap (기동 시 1회)</CardTitle>
                        <CardDescription>애플리케이션 시작 시 기본 데이터 보장</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm leading-relaxed">
                        <ul className="list-disc pl-5 space-y-1">
                            <li><code>RoleInitializer</code>: USER, ADMIN, (임시) DEVELOPER 롤이 없으면 생성</li>
                            <li><code>UserInitializer</code>: 설정 기반 기본 관리자 계정(존재하지 않을 때만) 생성</li>
                            <li>설정 토글: <code>app.roles.autocreate</code>, <code>app.users.autocreate</code></li>
                            <li>admin 계정 설정: <code>app.users.admin.username|email|password</code></li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>2. Registration Policy (런타임)</CardTitle>
                        <CardDescription>UserService 내부 등록 시점 역할 결정</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm leading-relaxed">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>기본 배정 대상: USER</li>
                            <li>예외: <code>app.registration.first-user-admin=true</code> && (현재 DB 내 사용자 0 || ADMIN 0) → 첫 가입자를 ADMIN 승격</li>
                            <li>Fallback: USER 롤이 (이상 상황으로) 사라져 있으면 DEVELOPER 존재 시 그 롤 사용</li>
                            <li>정책 메서드: (UserService) <code>resolveRegistrationRole()</code></li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>3. RoleService</CardTitle>
                        <CardDescription>순수 CRUD, 초기 seeding 책임 없음</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm leading-relaxed">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>create/update/delete 시 중복 이름 검증만 수행</li>
                            <li>기본 롤이 비어 있어도 자동 생성 X (Bootstrap 레이어 분리)</li>
                            <li>Authority(세분 권한) 로직은 현재 비활성화된 상태, 추후 V8 Migration 예정</li>
                        </ul>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2"><Database className="h-5 w-5" />데이터 / 마이그레이션</h2>
                <div className="space-y-3 text-sm leading-relaxed">
                    <p>최근 초기화 단계에서 <code>V7__Reset_authorization_tables.sql</code> 을 통해 기존 권한/매핑 테이블을 비우고 최소 롤만 재시드했습니다.</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Truncate: authorities, role_authorities, user_authorities (필요 시)</li>
                        <li>Seed: USER, ADMIN (+ DEVELOPER 유지)</li>
                        <li>모든 사용자 롤 재설정 → 필요 시 ADMIN 후보 이메일 승격</li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2"><ShieldCheck className="h-5 w-5" />현재 보안 상태</h2>
                <Alert>
                    <AlertTitle>메서드 레벨 @PreAuthorize 제거됨</AlertTitle>
                    <AlertDescription>
                        현재는 엔드포인트 접근 제어가 최소화된 상태이므로, 재도입 시 권한 코드(Authority) 또는 고정된 Permission Enum 기반 구조를 설계해야 합니다.
                    </AlertDescription>
                </Alert>
                <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed">
                    <li>JWT 인증은 유지 (토큰 발급 / 파싱 정상 동작)</li>
                    <li>AccessDenied 커스텀 핸들러는 상세 JSON 응답 반환 (missingRole, currentAuthorities 등)</li>
                    <li>로그 레벨 DEBUG 에서 부트스트랩/등록 정책 로깅 확인 가능</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2"><RefreshCcw className="h-5 w-5" />향후 개선 로드맵</h2>
                <ol className="list-decimal pl-5 space-y-1 text-sm leading-relaxed">
                    <li>Authority 테이블 재도입 + V8 Migration (고정 Permission Code 삽입)</li>
                    <li>Role ↔ Authority 매핑 화면 / API 추가</li>
                    <li>스코프 기반 또는 비즈니스 도메인 그룹화 (CHALLENGE_READ 등)</li>
                    <li>엔드포인트 단 @PreAuthorize 대신 AOP + 커스텀 애너테이션 도입 고려</li>
                    <li>권한 캐시 전략 (Role/Authority 변경 시 캐시 무효화)</li>
                </ol>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2"><Settings className="h-5 w-5" />설정 요약</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <Card>
                        <CardHeader><CardTitle>application.yml</CardTitle></CardHeader>
                        <CardContent className="space-y-1">
                            <code className="block">app.roles.autocreate=true</code>
                            <code className="block">app.users.autocreate=true</code>
                            <code className="block">app.users.admin.username=admin</code>
                            <code className="block">app.registration.first-user-admin=true</code>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>주요 클래스</CardTitle></CardHeader>
                        <CardContent className="space-y-1">
                            <code className="block">bootstrap/RoleInitializer</code>
                            <code className="block">bootstrap/UserInitializer</code>
                            <code className="block">application/RoleService</code>
                            <code className="block">application/UserService</code>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <footer className="text-xs text-muted-foreground pt-10 border-t">문서 버전: v1 (권한 재도입 전 단순화 단계)</footer>
        </main>
    );
}
