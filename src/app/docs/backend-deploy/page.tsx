"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft, Server, Terminal } from "lucide-react";
import Link from "next/link";

export default function BackendDeployPage() {
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
                    <Server className="h-8 w-8" />
                    백엔드 EC2 배포 매뉴얼
                </h1>
                <p className="text-muted-foreground text-lg">
                    Ubuntu EC2에서 Spring Boot(JAR) 애플리케이션을 재배포하는 단계별 가이드입니다. 각 단계는 복붙 가능한 명령어로 제공됩니다.
                </p>
            </div>

            {/* 0. 접속 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Terminal className="h-5 w-5" /> 0. EC2 접속 (로컬에서 실행)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
                            <code>{`# 로컬 터미널에서 실행
ssh -i <your-key>.pem ubuntu@<ec2-public-ip>`}</code>
                        </pre>
                    </div>
                </CardContent>
            </Card>

            {/* 1. 실행 중 프로세스 종료 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>1) 실행 중인 백엔드 프로세스 종료</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">현재 실행 중인 Java 프로세스를 확인하고 종료합니다.</p>
                    <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
                            <code>{`ps -ef | grep java
# 위 출력에서 PID 확인 후 강제 종료 (예: 294417)
kill -9 294417`}</code>
                        </pre>
                    </div>
                </CardContent>
            </Card>

            {/* 2. 코드 업데이트 (옵션) */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>2) 코드 업데이트 (옵션)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">Git을 사용 중이라면 최신 코드를 가져옵니다.</p>
                    <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
                            <code>{`cd ~/dota-admin-backend
git pull`}</code>
                        </pre>
                    </div>
                </CardContent>
            </Card>

            {/* 3. 빌드 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>3) Gradle 빌드 (테스트 제외)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
                            <code>{`cd ~/dota-admin-backend
./gradlew clean build -x test`}</code>
                        </pre>
                    </div>
                    <p className="text-xs text-muted-foreground">빌드 결과 JAR: <code>build/libs/dota-admin-backend-0.0.1-SNAPSHOT.jar</code></p>
                </CardContent>
            </Card>

            {/* 4. 실행 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>4) 백그라운드 실행 (nohup)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
                            <code>{`cd ~/dota-admin-backend
nohup java -jar build/libs/dota-admin-backend-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
# 백그라운드 PID 출력됨`}</code>
                        </pre>
                    </div>
                    <p className="text-xs text-muted-foreground">필요 시 환경변수는 <code>nohup</code> 앞에 붙여서 실행하세요. 예: <code>SERVER_PORT=8080 JAVA_OPTS=&quot;-Xms256m -Xmx512m&quot; nohup java ...</code></p>
                </CardContent>
            </Card>

            {/* 5. 확인 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>5) 로그/상태 확인</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
                            <code>{`# 실시간 로그 확인 (종료: Ctrl+C)
tail -f app.log

# 포트 리스닝 확인 (옵션)
ss -lntp | grep 8080

# 헬스체크 (엔드포인트에 맞게 변경)
curl -s http://localhost:8080/actuator/health || curl -s http://localhost:8080/api/challenges | head`}</code>
                        </pre>
                    </div>
                </CardContent>
            </Card>

            {/* 6. 재배포 요약 (원클립) */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>6) 재배포 원클립 요약</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
                            <code>{`# 1) 기존 프로세스 종료
ps -ef | grep java
kill -9 <PID>

# 2) 빌드 & 실행
dcd() { cd ~/dota-admin-backend && ./gradlew clean build -x test && nohup java -jar build/libs/dota-admin-backend-0.0.1-SNAPSHOT.jar > app.log 2>&1 & }
dcd

# 3) 로그 확인
tail -f app.log`}</code>
                        </pre>
                    </div>
                </CardContent>
            </Card>

            {/* 참고 */}
            <Card>
                <CardHeader>
                    <CardTitle>참고</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        <li>장기적으로는 <code>systemd</code> 서비스로 등록해 관리(자동 재시작, 로그 로테이션)하는 것을 권장합니다.</li>
                        <li>보안상 JAR/로그 파일 권한과 보안 그룹(포트 8080 오픈 범위)을 점검하세요.</li>
                    </ul>
                </CardContent>
            </Card>
        </main>
    );
}
