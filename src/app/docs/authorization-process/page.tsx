"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Separator } from "@/shared/ui/separator";
import { ShieldCheck, User, Key, ArrowRight, Database, Server, Lock, CheckCircle, AlertCircle } from "lucide-react";

export default function AuthorizationProcessPage() {
    return (
        <main className="max-w-4xl mx-auto p-6 space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    권한 관리 프로세스
                </h1>
                <p className="text-muted-foreground">
                    백엔드 권한 관리 시스템의 전체 프로세스를 단계별로 설명합니다.
                </p>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">User → Role → Authority</Badge>
                    <Badge variant="outline">JWT 인증</Badge>
                    <Badge variant="outline">Spring Security</Badge>
                    <Badge variant="outline">@PreAuthorize</Badge>
                </div>
            </header>

            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>권한 관리 구조 개요</AlertTitle>
                <AlertDescription>
                    현재 시스템은 <strong>User → Role → Authority</strong> 3단계 구조로 설계되어 있습니다. 
                    사용자는 하나의 Role을 가지며, 각 Role은 여러 Authority(권한)을 포함할 수 있습니다.
                </AlertDescription>
            </Alert>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Database className="h-6 w-6" />
                    1. 데이터베이스 구조
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">핵심 테이블</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-500" />
                                    <code className="text-sm font-mono">users</code>
                                    <span className="text-xs text-muted-foreground">- 사용자 정보</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Key className="h-4 w-4 text-green-500" />
                                    <code className="text-sm font-mono">roles</code>
                                    <span className="text-xs text-muted-foreground">- 역할 정보</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-purple-500" />
                                    <code className="text-sm font-mono">authorities</code>
                                    <span className="text-xs text-muted-foreground">- 권한 정보</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">매핑 테이블</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-orange-500" />
                                    <code className="text-sm font-mono">role_authorities</code>
                                    <span className="text-xs text-muted-foreground">- 역할-권한 매핑</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-red-500" />
                                    <code className="text-sm font-mono">user_authorities</code>
                                    <span className="text-xs text-muted-foreground">- 사용자 개별 권한</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-slate-50">
                    <CardHeader>
                        <CardTitle className="text-lg">관계 구조</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-4 text-sm">
                                <div className="bg-blue-100 px-3 py-2 rounded border">User</div>
                                <ArrowRight className="h-4 w-4" />
                                <div className="bg-green-100 px-3 py-2 rounded border">Role</div>
                                <ArrowRight className="h-4 w-4" />
                                <div className="bg-purple-100 px-3 py-2 rounded border">Authority</div>
                            </div>
                            <p className="text-xs text-muted-foreground">users.role_id → roles.id → role_authorities → authorities</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Server className="h-6 w-6" />
                    2. 권한 검증 프로세스
                </h2>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                                JWT 토큰 파싱 및 사용자 인증
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded text-sm">
                                <p><strong>위치:</strong> <code>JwtAuthenticationFilter.doFilterInternal()</code></p>
                                <p><strong>파일:</strong> <code>config/JwtAuthenticationFilter.java:46-119</code></p>
                            </div>
                            <ol className="list-decimal list-inside space-y-1 text-sm">
                                <li>HTTP 요청에서 <code>Authorization: Bearer &lt;token&gt;</code> 헤더 추출</li>
                                <li>JWT 토큰 유효성 및 만료 시간 검증</li>
                                <li>토큰에서 사용자 이메일 추출</li>
                                <li>이메일로 데이터베이스에서 사용자 정보 조회</li>
                            </ol>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                                사용자 권한 정보 수집
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded text-sm">
                                <p><strong>위치:</strong> <code>JwtAuthenticationFilter.java:82-89</code></p>
                                <p><strong>관련 메서드:</strong> <code>UserService.getUserAuthorities()</code></p>
                            </div>
                            <ol className="list-decimal list-inside space-y-1 text-sm">
                                <li><strong>Role 권한 추가:</strong> <code>"ROLE_" + user.getRole().getName()</code> 형태로 Spring Security에 등록</li>
                                <li><strong>Authority 권한 수집:</strong> 사용자 ID로 모든 권한 조회
                                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-xs">
                                        <li>Role을 통한 간접 권한: <code>role_authorities</code> 테이블 조회</li>
                                        <li>직접 부여된 권한: <code>user_authorities</code> 테이블 조회</li>
                                    </ul>
                                </li>
                                <li><strong>SecurityContext 설정:</strong> 수집된 권한들을 Spring Security Context에 저장</li>
                            </ol>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                                API 엔드포인트 권한 검증
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded text-sm">
                                <p><strong>Spring Security 설정:</strong> <code>@EnableMethodSecurity(prePostEnabled = true)</code></p>
                                <p><strong>파일:</strong> <code>config/SecurityConfig.java:22</code></p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">권한 검증 방식:</p>
                                <div className="bg-blue-50 p-3 rounded text-sm">
                                    <p><strong>@PreAuthorize("hasRole('ADMIN')")</strong></p>
                                    <p className="text-xs">→ 사용자가 ADMIN 롤을 가지고 있는지 확인</p>
                                </div>
                                <div className="bg-green-50 p-3 rounded text-sm">
                                    <p><strong>@PreAuthorize("hasAuthority('USER_MANAGE')")</strong></p>
                                    <p className="text-xs">→ 사용자가 USER_MANAGE 권한을 가지고 있는지 확인</p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded text-sm">
                                    <p><strong>@PreAuthorize("hasRole('ADMIN') or hasAuthority('USER_READ')")</strong></p>
                                    <p className="text-xs">→ ADMIN 롤이거나 USER_READ 권한이 있는지 확인</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                                권한 검증 결과 처리
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="font-medium text-sm">권한 있음</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground pl-6">API 호출이 성공적으로 처리됩니다.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        <span className="font-medium text-sm">권한 없음</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground pl-6">403 Forbidden 응답과 함께 <code>CustomAccessDeniedHandler</code>가 작동합니다.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Lock className="h-6 w-6" />
                    3. 권한 체크 구현 예시
                </h2>

                <Card>
                    <CardHeader>
                        <CardTitle>컨트롤러 메서드에서의 권한 체크</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-gray-900 text-gray-100 p-4 rounded text-sm">
                            <pre>{`@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('USER_READ')")
    public ResponseEntity<List<UserDto>> getUsers() {
        // ADMIN 롤이거나 USER_READ 권한이 있는 사용자만 접근 가능
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('USER_CREATE')")
    public ResponseEntity<UserDto> createUser(@RequestBody CreateUserDto dto) {
        // USER_CREATE 권한이 있는 사용자만 접근 가능
        return ResponseEntity.ok(userService.createUser(dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        // ADMIN 롤을 가진 사용자만 접근 가능
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}`}</pre>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">4. 권한 관리 플로우 다이어그램</h2>

                <Card className="bg-slate-50">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="inline-block bg-blue-100 px-4 py-2 rounded border">
                                    HTTP Request with JWT Token
                                </div>
                            </div>
                            <div className="text-center">
                                <ArrowRight className="h-4 w-4 mx-auto rotate-90" />
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-green-100 px-4 py-2 rounded border">
                                    JWT Authentication Filter
                                </div>
                            </div>
                            <div className="text-center">
                                <ArrowRight className="h-4 w-4 mx-auto rotate-90" />
                            </div>
                            <div className="flex justify-center gap-4">
                                <div className="bg-purple-100 px-3 py-2 rounded border text-sm">User 조회</div>
                                <ArrowRight className="h-4 w-4 my-auto" />
                                <div className="bg-orange-100 px-3 py-2 rounded border text-sm">Role 확인</div>
                                <ArrowRight className="h-4 w-4 my-auto" />
                                <div className="bg-red-100 px-3 py-2 rounded border text-sm">Authorities 수집</div>
                            </div>
                            <div className="text-center">
                                <ArrowRight className="h-4 w-4 mx-auto rotate-90" />
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-yellow-100 px-4 py-2 rounded border">
                                    SecurityContext 설정
                                </div>
                            </div>
                            <div className="text-center">
                                <ArrowRight className="h-4 w-4 mx-auto rotate-90" />
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-gray-100 px-4 py-2 rounded border">
                                    @PreAuthorize 검증
                                </div>
                            </div>
                            <div className="text-center">
                                <ArrowRight className="h-4 w-4 mx-auto rotate-90" />
                            </div>
                            <div className="flex justify-center gap-4">
                                <div className="bg-green-200 px-3 py-2 rounded border text-sm">✅ 권한 있음</div>
                                <div className="bg-red-200 px-3 py-2 rounded border text-sm">❌ 권한 없음</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">5. 관련 파일 및 클래스</h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">인증/인가 관련</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div><code>config/SecurityConfig.java</code> - Spring Security 설정</div>
                            <div><code>config/JwtAuthenticationFilter.java</code> - JWT 토큰 처리</div>
                            <div><code>config/CustomAccessDeniedHandler.java</code> - 권한 없음 처리</div>
                            <div><code>config/CustomAuthenticationEntryPoint.java</code> - 인증 실패 처리</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">엔티티 및 서비스</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div><code>entity/UserEntity.java</code> - 사용자 엔티티</div>
                            <div><code>entity/RoleEntity.java</code> - 역할 엔티티</div>
                            <div><code>entity/AuthorityEntity.java</code> - 권한 엔티티</div>
                            <div><code>application/UserService.java</code> - 사용자 서비스</div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>권한 관리 핵심 포인트</AlertTitle>
                <AlertDescription>
                    1. JWT 토큰에서 사용자 식별 → 2. 데이터베이스에서 Role과 Authority 조회 → 3. Spring Security Context 설정 → 4. @PreAuthorize로 API별 권한 검증
                </AlertDescription>
            </Alert>

            <footer className="text-xs text-muted-foreground pt-8 border-t">
                문서 작성일: {new Date().toISOString().split('T')[0]} | 권한 관리 프로세스 v1.0
            </footer>
        </main>
    );
}