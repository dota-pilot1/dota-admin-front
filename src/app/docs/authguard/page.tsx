"use client";

import React, { useState } from 'react';
import { Shield, Users, Monitor, CheckCircle2, AlertTriangle, Code2, Lock, RefreshCw, ArrowRight } from 'lucide-react';

const CodeBlock = ({ title, children, language = "typescript" }: { 
  title?: string, 
  children: string, 
  language?: string 
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {title && (
        <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
          <span className="font-medium text-sm text-gray-700">{title}</span>
          <button
            onClick={copyToClipboard}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>
      )}
      <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
        <pre className="text-sm">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, icon: Icon, children, color = "blue" }: {
  title: string,
  icon: any,
  children: React.ReactNode,
  color?: "blue" | "green" | "orange" | "red" | "purple"
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    red: "bg-red-50 border-red-200 text-red-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800"
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-6 w-6" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const FlowDiagram = ({ title, steps, color = "blue" }: {
  title: string,
  steps: string[],
  color?: "blue" | "green" | "orange" | "red" | "purple"
}) => {
  const colorMap = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    purple: "bg-purple-500"
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`w-8 h-8 ${colorMap[color]} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm">{step}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsageExample = ({ title, description, code }: {
  title: string,
  description: string,
  code: string
}) => {
  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <CodeBlock>
        {code}
      </CodeBlock>
    </div>
  );
};

export default function AuthGuardPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🛡️ AuthGuard 가이드</h1>
        <p className="text-lg text-gray-600">페이지 렌더링 레벨에서 작동하는 인증 컴포넌트에 대해 상세히 설명합니다.</p>
      </div>

      {/* 개요 */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">📍 개요</h2>
          <p className="text-lg text-gray-700 mb-4">
            AuthGuard는 <strong className="text-blue-600">페이지 렌더링 레벨에서 작동하는 인증 컴포넌트</strong>입니다. 
            사용자가 페이지에 접근할 때 인증 상태를 확인하고, 인증되지 않은 사용자를 로그인 페이지로 리다이렉트하는 역할을 담당합니다.
          </p>
          <div className="bg-white p-4 rounded border flex items-center gap-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold">핵심 기능</h3>
              <p className="text-sm text-gray-600">페이지 접근 제어와 실시간 인증 상태 동기화</p>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 역할 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🎯 핵심 역할</h2>
        
        <div className="space-y-8">
          <FeatureCard title="1. 페이지 접근 제어" icon={Lock} color="blue">
            <div className="space-y-3">
              <p className="text-sm"><strong>목적:</strong> 보호된 페이지에 인증된 사용자만 접근하도록 제한</p>
              <p className="text-sm"><strong>작동 시점:</strong> React 컴포넌트 렌더링 전</p>
              <p className="text-sm"><strong>처리 방식:</strong> localStorage의 토큰과 사용자 정보 확인</p>
            </div>
          </FeatureCard>

          <FeatureCard title="2. 인증 상태 실시간 감지" icon={Monitor} color="green">
            <div className="space-y-3">
              <p className="text-sm"><strong>로그인 성공 이벤트:</strong> loginSuccess 커스텀 이벤트 리스닝</p>
              <p className="text-sm"><strong>다중 탭 동기화:</strong> storage 이벤트로 다른 탭의 로그인/로그아웃 감지</p>
              <p className="text-sm"><strong>초기 인증 체크:</strong> 페이지 로드 시 인증 상태 확인</p>
            </div>
          </FeatureCard>

          <FeatureCard title="3. 사용자 경험 최적화" icon={Users} color="purple">
            <div className="space-y-3">
              <p className="text-sm"><strong>로딩 상태:</strong> 인증 확인 중 로딩 스피너 표시</p>
              <p className="text-sm"><strong>조건부 렌더링:</strong> 인증된 경우에만 자식 컴포넌트 렌더링</p>
              <p className="text-sm"><strong>자동 리다이렉트:</strong> 인증 실패 시 로그인 페이지로 이동</p>
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* 구조 및 구현 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🏗️ 구조 및 구현</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">현재 사용 중인 AuthGuard</h3>
            <p className="text-sm text-gray-600 mb-4">파일: <code className="bg-gray-100 px-2 py-1 rounded">/src/shared/components/AuthGuard.tsx</code></p>
            
            <CodeBlock title="AuthGuard 핵심 구현">
{`export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // 공개 페이지는 인증 체크하지 않음
      if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) {
        setIsChecking(false);
        setIsAuthenticated(true);
        return;
      }

      const token = localStorage.getItem("authToken");
      const user = getCurrentUser();

      if (token && user) {
        console.log("✅ Auth check passed");
        setIsAuthenticated(true);
        setIsChecking(false);
      } else {
        console.log("❌ Auth check failed");
        setIsAuthenticated(false);
        setIsChecking(false);
        
        // 3초 지연 후 리다이렉트 (디버깅용)
        setTimeout(() => {
          router.replace("/login");
        }, 3000);
      }
    };

    // 초기 체크
    const timeoutId = setTimeout(() => {
      checkAuth();
    }, 200);

    // 이벤트 리스너
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "userInfo") {
        checkAuth();
      }
    };

    const handleLoginSuccess = () => {
      clearTimeout(timeoutId);
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("loginSuccess", handleLoginSuccess);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginSuccess", handleLoginSuccess);
    };
  }, [pathname, router]);

  // 로딩 중
  if (isChecking) {
    return <LoadingSpinner />;
  }

  // 인증 실패
  if (!isAuthenticated) {
    return null;
  }

  // 인증 성공
  return <>{children}</>;
}`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">조건부 AuthGuard</h3>
            <p className="text-sm text-gray-600 mb-4">파일: <code className="bg-gray-100 px-2 py-1 rounded">/src/shared/lib/conditional-auth-guard.tsx</code></p>
            
            <CodeBlock title="조건부 AuthGuard 구현">
{`const PUBLIC_ROUTES = ['/', '/login', '/register'];

export function ConditionalAuthGuard({ children }: ConditionalAuthGuardProps) {
  const pathname = usePathname();
  
  // 공개 페이지는 AuthGuard 없이 렌더링
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }
  
  // 보호된 페이지는 AuthGuard로 감싸기
  return <AuthGuard>{children}</AuthGuard>;
}`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* 작동 과정 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🔄 작동 과정</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <FlowDiagram 
            title="일반적인 페이지 접근 플로우"
            color="blue"
            steps={[
              "사용자가 페이지 URL 입력/클릭",
              "Next.js 라우팅 시작",
              "ConditionalAuthGuard 실행: 공개/보호 페이지 판단",
              "AuthGuard 인증 체크: localStorage 토큰 확인",
              "getCurrentUser()로 사용자 정보 확인",
              "모두 있으면 자식 컴포넌트 렌더링",
              "페이지 내용 표시"
            ]}
          />

          <FlowDiagram 
            title="인증 실패 시 플로우"
            color="red"
            steps={[
              "AuthGuard 인증 체크 실행",
              "토큰 또는 사용자 정보 없음 감지",
              "인증 실패 로그 출력",
              "3초 대기 (디버깅용)",
              "router.replace('/login') 실행",
              "로그인 페이지로 리다이렉트"
            ]}
          />
        </div>

        <div className="mt-8">
          <FlowDiagram 
            title="로그인 성공 후 플로우"
            color="green"
            steps={[
              "로그인 API 성공",
              "localStorage에 토큰/사용자 정보 저장",
              "커스텀 이벤트 발생: window.dispatchEvent(new Event('loginSuccess'))",
              "AuthGuard가 이벤트 감지",
              "checkAuth() 재실행",
              "인증 상태 업데이트 → 보호된 페이지 렌더링"
            ]}
          />
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🎪 사용 방법</h2>
        
        <div className="space-y-8">
          <UsageExample
            title="1. 전역 적용 (현재 방식)"
            description="모든 페이지에 조건부로 AuthGuard를 적용하는 방식입니다."
            code={`// /src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <ConditionalAuthGuard>
            <AppHeader />
            {children}
          </ConditionalAuthGuard>
        </QueryProvider>
      </body>
    </html>
  );
}`}
          />

          <UsageExample
            title="2. 개별 페이지 적용"
            description="특정 페이지에만 AuthGuard를 적용하는 방식입니다."
            code={`// /src/app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>보호된 대시보드 내용</div>
    </AuthGuard>
  );
}`}
          />

          <UsageExample
            title="3. 조건부 적용"
            description="특정 조건에서만 인증 체크를 수행하는 방식입니다."
            code={`// 특정 조건에서만 인증 체크
export function ConditionalProtection({ children, requireAuth }) {
  if (requireAuth) {
    return <AuthGuard>{children}</AuthGuard>;
  }
  return <>{children}</>;
}`}
          />
        </div>
      </section>

      {/* 특징 및 장점 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">⚡ 특징 및 장점</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FeatureCard title="1. 클라이언트 사이드 보호" icon={Shield} color="blue">
              <ul className="text-sm space-y-1">
                <li>• React 컴포넌트 레벨에서 즉시 접근 제한</li>
                <li>• 브라우저에서 실시간 인증 상태 확인</li>
              </ul>
            </FeatureCard>

            <FeatureCard title="2. 이벤트 기반 상태 동기화" icon={RefreshCw} color="green">
              <ul className="text-sm space-y-1">
                <li>• 로그인 성공 시 즉시 상태 업데이트</li>
                <li>• 다중 탭 간 인증 상태 동기화</li>
              </ul>
            </FeatureCard>
          </div>

          <div className="space-y-6">
            <FeatureCard title="3. 사용자 친화적 경험" icon={Users} color="purple">
              <ul className="text-sm space-y-1">
                <li>• 로딩 스피너로 체크 중 상태 표시</li>
                <li>• 부드러운 페이지 전환 (로딩 → 인증 → 콘텐츠)</li>
              </ul>
            </FeatureCard>

            <FeatureCard title="4. 개발자 친화적" icon={Code2} color="orange">
              <ul className="text-sm space-y-1">
                <li>• 명확한 콘솔 로그로 디버깅 지원</li>
                <li>• 조건부 적용으로 유연한 사용</li>
              </ul>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* 제한사항 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🚨 제한사항</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                1. 클라이언트 사이드 전용
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• 서버 사이드에서는 작동하지 않음</li>
                <li>• SEO 및 초기 로딩 시 보안 취약점 존재</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                2. localStorage 의존성
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• localStorage 접근 불가 시 인증 체크 실패</li>
                <li>• 브라우저 설정에 따라 동작하지 않을 수 있음</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                3. Race Condition 가능성
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• 로그인 직후 빠른 페이지 전환 시 인증 상태 불일치 가능</li>
                <li>• 현재는 200ms 지연과 이벤트 리스너로 완화</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                4. 보안 한계
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• 클라이언트에서만 체크하므로 우회 가능</li>
                <li>• 실제 보안은 서버 사이드에서 JWT 검증으로 담보</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 설정 및 커스터마이징 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🛠️ 설정 및 커스터마이징</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">공개 경로 설정</h3>
            <CodeBlock title="/src/shared/lib/conditional-auth-guard.tsx">
{`const PUBLIC_ROUTES = [
  '/',           // 홈페이지
  '/login',      // 로그인
  '/register',   // 회원가입
  '/docs',       // 문서 (선택적)
];`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">리다이렉트 경로 변경</h3>
            <CodeBlock title="커스텀 로그인 페이지로 리다이렉트">
{`// 기본 로그인 페이지가 아닌 다른 페이지로 리다이렉트
setTimeout(() => {
  router.replace("/auth/signin"); // 커스텀 로그인 페이지
}, 3000);`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">로딩 컴포넌트 커스터마이징</h3>
            <CodeBlock title="커스텀 로딩 컴포넌트">
{`// 커스텀 로딩 컴포넌트
if (isChecking) {
  return <CustomLoadingSpinner message="인증 확인 중..." />;
}`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* 연관 컴포넌트 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🔗 연관 컴포넌트</h2>
        
        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">1. Axios 인터셉터</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-sm">관계</p>
                <p className="text-sm text-gray-600">독립적이지만 상호 보완</p>
              </div>
              <div>
                <p className="font-medium text-sm">차이점</p>
                <p className="text-sm text-gray-600">AuthGuard는 페이지 접근, Axios는 API 호출</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">2. JWT 유틸리티</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-sm">파일</p>
                <p className="text-sm text-gray-600 font-mono">/src/shared/lib/jwt-utils.ts</p>
              </div>
              <div>
                <p className="font-medium text-sm">사용</p>
                <p className="text-sm text-gray-600">getCurrentUser() 함수로 사용자 정보 확인</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">3. 로그인 API</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-sm">파일</p>
                <p className="text-sm text-gray-600 font-mono">/src/features/auth/api/login.ts</p>
              </div>
              <div>
                <p className="font-medium text-sm">연결</p>
                <p className="text-sm text-gray-600">로그인 성공 시 loginSuccess 이벤트 발생</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 디버깅 가이드 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">📚 디버깅 가이드</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">일반적인 문제들</h3>
            
            <div className="space-y-6">
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">1. 무한 리다이렉트</h4>
                <div className="text-sm text-red-700 space-y-1">
                  <p><strong>증상:</strong> 로그인 페이지와 보호된 페이지 간 무한 리다이렉트</p>
                  <p><strong>원인:</strong> 로그인 페이지도 AuthGuard로 보호되어 있음</p>
                  <p><strong>해결:</strong> ConditionalAuthGuard에서 공개 경로에 '/login' 포함 확인</p>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">2. 로그인 후에도 계속 로그인 페이지로 이동</h4>
                <div className="text-sm text-red-700 space-y-1">
                  <p><strong>증상:</strong> 로그인 성공 후에도 인증 실패로 처리됨</p>
                  <p><strong>원인:</strong> localStorage 저장과 AuthGuard 체크 간 타이밍 이슈</p>
                  <p><strong>해결:</strong> loginSuccess 이벤트가 제대로 발생하는지 확인</p>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">3. 다른 탭에서 로그아웃 시 동기화 안 됨</h4>
                <div className="text-sm text-red-700 space-y-1">
                  <p><strong>증상:</strong> 한 탭에서 로그아웃해도 다른 탭은 계속 로그인 상태</p>
                  <p><strong>원인:</strong> storage 이벤트 리스너 문제</p>
                  <p><strong>해결:</strong> handleStorageChange 함수가 제대로 동작하는지 확인</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">디버깅 로그 확인</h3>
            <CodeBlock title="개발 환경에서 출력되는 로그들">
{`"✅ Auth check passed: { user: 'test@example.com', token: '...' }"
"❌ Auth check failed: { token: 'missing', user: 'missing' }"
"📧 Login success event received, rechecking auth"
"🔄 Storage changed, re-checking auth"`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* 최적화 및 개선 방안 */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">🚀 최적화 및 개선 방안</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-3">1. SSR 지원</h3>
            <p className="text-sm text-gray-600 mb-3">
              Next.js의 서버 사이드에서도 인증 체크를 수행할 수 있도록 개선
            </p>
            <CodeBlock>
{`// middleware.ts에서 서버 사이드 인증 체크
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  if (!token && !PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}`}
            </CodeBlock>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-3">2. 권한 기반 라우팅</h3>
            <p className="text-sm text-gray-600 mb-3">
              사용자 역할에 따른 페이지 접근 제어
            </p>
            <CodeBlock>
{`// 역할 기반 AuthGuard
export function RoleBasedAuthGuard({ children, requiredRole }) {
  const user = getCurrentUser();
  if (user?.role !== requiredRole) {
    return <UnauthorizedPage />;
  }
  return <>{children}</>;
}`}
            </CodeBlock>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-3">3. 토큰 만료 예측</h3>
            <p className="text-sm text-gray-600 mb-3">
              JWT 토큰 만료 시간을 미리 확인하여 만료되기 전에 미리 갱신
            </p>
            <CodeBlock>
{`const checkTokenExpiry = () => {
  const payload = getTokenPayload();
  if (payload && payload.exp * 1000 - Date.now() < 60000) { // 1분 전
    // 미리 토큰 갱신
  }
};`}
            </CodeBlock>
          </div>
        </div>
      </section>
    </div>
  );
}
