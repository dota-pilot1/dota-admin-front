"use client";

import React, { useState } from 'react';
import { Zap, Shield, Server, Globe, Users, Code2, AlertTriangle, CheckCircle2, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';

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

const CollapsibleSection = ({ title, children, defaultOpen = false }: {
  title: string,
  children: React.ReactNode,
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left font-semibold flex items-center justify-between hover:bg-gray-50"
      >
        {title}
        {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );
};

const ComparisonTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-4 text-left font-semibold">구분</th>
            <th className="border p-4 text-left font-semibold text-blue-600">AuthGuard</th>
            <th className="border p-4 text-left font-semibold text-green-600">Axios 인터셉터</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-4 font-medium">작동 레벨</td>
            <td className="border p-4">페이지/컴포넌트 렌더링</td>
            <td className="border p-4">HTTP 요청/응답</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border p-4 font-medium">작동 시점</td>
            <td className="border p-4">페이지 접근 시</td>
            <td className="border p-4">API 호출 시</td>
          </tr>
          <tr>
            <td className="border p-4 font-medium">주요 목적</td>
            <td className="border p-4">페이지 접근 제어</td>
            <td className="border p-4">토큰 자동 관리</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border p-4 font-medium">인증 체크</td>
            <td className="border p-4">localStorage 기반</td>
            <td className="border p-4">서버 응답 기반</td>
          </tr>
          <tr>
            <td className="border p-4 font-medium">사용자 경험</td>
            <td className="border p-4">페이지 리다이렉트</td>
            <td className="border p-4">백그라운드 토큰 갱신</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border p-4 font-medium">보안 수준</td>
            <td className="border p-4">클라이언트 사이드만</td>
            <td className="border p-4">서버 사이드 검증</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default function AxiosVsAuthGuardPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🔄 Axios 인터셉터 vs AuthGuard</h1>
        <p className="text-lg text-gray-600">두 인증 시스템의 역할 차이와 상호 보완 관계를 상세히 설명합니다.</p>
      </div>

      {/* 개요 */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">💡 핵심 이해</h2>
          <p className="text-lg text-gray-700 mb-4">
            많은 개발자들이 <strong>Axios 인터셉터</strong>와 <strong>AuthGuard</strong>의 역할이 헷갈린다고 합니다. 
            둘 다 인증과 관련되어 있지만, <strong className="text-blue-600">완전히 다른 레벨에서 작동</strong>하며 
            <strong className="text-green-600">상호 보완적인 관계</strong>입니다.
          </p>
          <div className="bg-white p-4 rounded border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-medium">AuthGuard</span>
                <span className="text-sm text-gray-600">페이지 접근 제어</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="font-medium">Axios 인터셉터</span>
                <span className="text-sm text-gray-600">API 호출 관리</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 작동 레벨 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🏗️ 작동 레벨</h2>
        
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
          <pre>{`┌─────────────────────────────────────────┐
│               Browser                    │
├─────────────────────────────────────────┤
│  [Page Level]                           │
│  AuthGuard ← 페이지 렌더링 전 체크        │
│  ├─ 토큰 있나? localStorage 확인          │
│  ├─ 없으면 로그인 페이지로 리다이렉트       │
│  └─ 있으면 페이지 렌더링                 │
├─────────────────────────────────────────┤
│  [HTTP Level]                           │
│  Axios Interceptor ← API 호출 시 체크    │
│  ├─ 요청: 토큰 자동 첨부                 │
│  ├─ 응답: 토큰 만료 시 자동 갱신          │
│  └─ 원본 요청 재시도                    │
└─────────────────────────────────────────┘`}</pre>
        </div>
      </section>

      {/* 비교 테이블 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">📊 상세 비교</h2>
        <ComparisonTable />
      </section>

      {/* 실제 동작 시나리오 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🎬 실제 동작 시나리오</h2>
        
        <div className="space-y-6">
          <CollapsibleSection title="시나리오 1: 일반적인 페이지 접근" defaultOpen>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                <div className="font-semibold text-blue-800 mb-2">순서</div>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                  <li>사용자가 /dashboard URL 입력</li>
                  <li><strong>[AuthGuard]</strong> localStorage에서 토큰 확인</li>
                  <li><strong>[AuthGuard]</strong> 토큰 있음 → 페이지 렌더링 허용</li>
                  <li>대시보드 컴포넌트 로드</li>
                  <li>컴포넌트에서 사용자 정보 API 호출</li>
                  <li><strong>[Axios 인터셉터]</strong> 요청에 토큰 자동 첨부</li>
                  <li>서버에서 데이터 반환</li>
                  <li>대시보드에 데이터 표시</li>
                </ol>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="시나리오 2: 토큰 만료 상황">
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-400">
                <div className="font-semibold text-orange-800 mb-2">토큰 만료 처리 과정</div>
                <ol className="list-decimal list-inside space-y-1 text-sm text-orange-700">
                  <li>사용자가 /payments 페이지에서 작업 중</li>
                  <li><strong>[AuthGuard]</strong> 이미 페이지 로드 시 체크 완료 (5분 전 토큰이 유효했음)</li>
                  <li>사용자가 "결제 생성" 버튼 클릭 (현재 토큰은 만료됨)</li>
                  <li>결제 생성 API 호출</li>
                  <li><strong>[Axios 인터셉터]</strong> 만료된 토큰을 요청에 첨부</li>
                  <li>서버에서 401 + TOKEN_EXPIRED 응답</li>
                  <li><strong>[Axios 인터셉터]</strong> 토큰 만료 감지 → 자동 갱신</li>
                  <li><strong>[Axios 인터셉터]</strong> 새 토큰으로 원본 요청 재시도</li>
                  <li>결제 생성 성공</li>
                  <li><strong>사용자는 토큰 만료를 전혀 인지 못함</strong></li>
                </ol>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="시나리오 3: 인증되지 않은 사용자">
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded border-l-4 border-red-400">
                <div className="font-semibold text-red-800 mb-2">접근 차단 과정</div>
                <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
                  <li>비로그인 사용자가 /admin URL 직접 입력</li>
                  <li><strong>[AuthGuard]</strong> localStorage 체크 → 토큰 없음</li>
                  <li><strong>[AuthGuard]</strong> 3초 후 /login으로 리다이렉트</li>
                  <li>로그인 페이지 표시</li>
                </ol>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="시나리오 4: 다른 탭에서 로그아웃">
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                <div className="font-semibold text-purple-800 mb-2">다중 탭 동기화</div>
                <div className="text-sm text-purple-700 mb-3">
                  <strong>상황:</strong> 탭 A는 /dashboard에서 작업 중, 탭 B는 설정 페이지에서 로그아웃 클릭
                </div>
                <ol className="list-decimal list-inside space-y-1 text-sm text-purple-700">
                  <li><strong>[탭 B]</strong> 로그아웃 API 호출</li>
                  <li><strong>[탭 B]</strong> localStorage에서 토큰 삭제</li>
                  <li><strong>[탭 A]</strong> AuthGuard가 storage 이벤트 감지</li>
                  <li><strong>[탭 A]</strong> checkAuth() 재실행 → 토큰 없음 확인</li>
                  <li><strong>[탭 A]</strong> /login으로 자동 리다이렉트</li>
                </ol>
              </div>
            </div>
        </CollapsibleSection>
        </div>
      </section>

      {/* 코드 비교 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">💻 코드로 보는 차이점</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <FeatureCard title="AuthGuard 특징" icon={Shield} color="blue">
              <p className="text-sm mb-4">페이지 렌더링 레벨에서 동작</p>
              <CodeBlock title="AuthGuard 핵심 로직">
{`export function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // localStorage 직접 체크 (클라이언트 사이드)
    const token = localStorage.getItem("authToken");
    const user = getCurrentUser();
    
    if (token && user) {
      setIsAuthenticated(true); // 페이지 렌더링 허용
    } else {
      router.replace("/login"); // 리다이렉트
    }
  }, []);
  
  // 조건부 렌더링
  if (!isAuthenticated) return null;
  return <>{children}</>;
}`}
              </CodeBlock>
            </FeatureCard>
          </div>
          
          <div>
            <FeatureCard title="Axios 인터셉터 특징" icon={Zap} color="green">
              <p className="text-sm mb-4">HTTP 요청/응답 레벨에서 동작</p>
              <CodeBlock title="Axios 인터셉터 핵심 로직">
{`// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401 && 
        error.response?.data?.errorCode === 'TOKEN_EXPIRED') {
      
      const newToken = await refreshToken();
      error.config.headers.Authorization = \`Bearer \${newToken}\`;
      return api(error.config); // 원본 요청 재시도
    }
    return Promise.reject(error);
  }
);`}
              </CodeBlock>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* 왜 둘 다 필요한가 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🤔 왜 둘 다 필요한가?</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-red-600">❌ AuthGuard만 있다면?</h3>
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <CodeBlock title="문제 상황">
{`const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  
  useEffect(() => {
    // AuthGuard가 페이지 로드 시 토큰 체크했지만
    // API 호출 시점에는 토큰이 만료될 수 있음
    fetchPayments().then(setPayments); // 토큰 만료 시 실패
  }, []);
  
  const createPayment = async () => {
    try {
      // 매번 수동으로 토큰 만료 체크 필요
      if (isTokenExpired()) {
        await refreshToken();
      }
      await api.post('/payments', data); // 번거로움
    } catch (error) {
      // 토큰 만료 에러 수동 처리 필요
    }
  };
};`}
              </CodeBlock>
              <p className="text-red-700 text-sm mt-4">
                <strong>문제점:</strong> 모든 API 호출마다 수동으로 토큰 관리를 해야 하며, 
                토큰 만료 시 사용자가 에러를 경험합니다.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-red-600">❌ Axios 인터셉터만 있다면?</h3>
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <CodeBlock title="문제 상황">
{`const AdminPage = () => {
  // 인증되지 않은 사용자도 페이지에 접근 가능
  // API 호출 시점에서야 인증 에러 발생
  
  useEffect(() => {
    // 토큰이 없어도 API 호출 시도
    fetchAdminData() // 401 에러 발생
      .catch(() => {
        // 에러 발생 후에야 로그인 페이지로 이동
        window.location.href = '/login';
      });
  }, []);
  
  // 사용자는 빈 페이지를 보다가 갑자기 로그인 페이지로 이동
  // 좋지 않은 사용자 경험
};`}
              </CodeBlock>
              <p className="text-red-700 text-sm mt-4">
                <strong>문제점:</strong> 인증되지 않은 사용자도 페이지에 접근할 수 있고, 
                API 에러 발생 후에야 리다이렉트되어 좋지 않은 사용자 경험을 제공합니다.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-green-600">✅ 최적의 조합 효과</h3>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <CodeBlock title="최적의 조합">
{`const DashboardPage = () => {
  // AuthGuard가 이미 인증 확인 완료
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Axios 인터셉터가 토큰 관리 자동화
    fetchDashboardData().then(setData); // 토큰 만료 시 자동 갱신
  }, []);
  
  const handleAction = async () => {
    // 개발자는 토큰 관리를 신경 쓰지 않고 비즈니스 로직에 집중
    await createSomething();
  };
};`}
              </CodeBlock>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span><strong>즉시 피드백:</strong> AuthGuard가 페이지 접근 즉시 인증 체크</span>
                </div>
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span><strong>끊김 없는 작업:</strong> Axios 인터셉터가 백그라운드에서 토큰 갱신</span>
                </div>
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span><strong>일관된 경험:</strong> 두 시스템이 협력하여 매끄러운 사용자 플로우 제공</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 개발 가이드라인 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🛠️ 개발 가이드라인</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              언제 AuthGuard를 사용할까?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">전체 페이지가 인증이 필요한 경우</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">페이지별로 접근 권한을 제어해야 하는 경우</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">로그인 상태에 따라 다른 컴포넌트를 렌더링해야 하는 경우</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-green-600" />
              언제 Axios 인터셉터를 사용할까?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">모든 API 요청에 토큰을 첨부해야 하는 경우</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">토큰 만료를 사용자가 인지하지 못하게 처리하고 싶은 경우</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">API 호출 코드를 간단하게 유지하고 싶은 경우</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            사용하지 말아야 할 경우
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">AuthGuard</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>❌ 공개 페이지나 부분적으로만 인증이 필요한 경우</li>
                <li>❌ SEO가 중요한 페이지 (서버 사이드 렌더링 필요)</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">Axios 인터셉터</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>❌ 인증이 필요 없는 API나 외부 API 호출 시</li>
                <li>❌ 토큰 형식이 다른 API (OAuth, API Key 등)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 주의사항 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🚨 주의사항</h2>
        
        <div className="space-y-6">
          <CollapsibleSection title="1. 중복 체크 방지">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-red-600 mb-2">❌ 잘못된 예시</h4>
                <CodeBlock>
{`const protectedApiCall = async () => {
  // AuthGuard가 이미 체크했는데 또 체크
  if (!localStorage.getItem('authToken')) {
    router.push('/login');
    return;
  }
  
  // Axios 인터셉터가 이미 토큰 첨부하는데 또 첨부
  const token = localStorage.getItem('authToken');
  const response = await api.get('/data', {
    headers: { Authorization: \`Bearer \${token}\` }
  });
};`}
                </CodeBlock>
              </div>
              <div>
                <h4 className="font-medium text-green-600 mb-2">✅ 올바른 예시</h4>
                <CodeBlock>
{`const protectedApiCall = async () => {
  // AuthGuard가 페이지 접근 제어 담당
  // Axios 인터셉터가 토큰 관리 담당
  const response = await api.get('/data'); // 간단!
};`}
                </CodeBlock>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="2. 상태 동기화">
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <CodeBlock title="로그인 성공 시 상태 동기화">
{`const handleLogin = async (credentials) => {
  const { token, user } = await loginApi(credentials);
  
  // localStorage 저장
  localStorage.setItem('authToken', token);
  localStorage.setItem('userInfo', JSON.stringify(user));
  
  // AuthGuard에 알림
  window.dispatchEvent(new Event('loginSuccess'));
  
  // 이제 두 시스템 모두 최신 상태 반영
};`}
              </CodeBlock>
            </div>
          </CollapsibleSection>
        </div>
      </section>

      {/* 실무 팁 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">💡 실무 팁</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard title="디버깅 순서" icon={Code2} color="blue">
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>AuthGuard 로그 확인</li>
              <li>Network 탭에서 토큰 첨부 확인</li>
              <li>서버 응답에서 에러코드 확인</li>
              <li>Axios 인터셉터 로그 확인</li>
            </ol>
          </FeatureCard>

          <FeatureCard title="성능 최적화" icon={Zap} color="green">
            <div className="text-sm space-y-2">
              <p>• AuthGuard는 페이지당 한 번만 체크</p>
              <p>• Axios 인터셉터는 요청당 실행</p>
              <p>• 불필요한 체크 로직 최소화</p>
              <p>• useMemo로 체크 결과 캐싱</p>
            </div>
          </FeatureCard>

          <FeatureCard title="에러 처리 분리" icon={AlertTriangle} color="orange">
            <div className="text-sm space-y-2">
              <p>• AuthGuard: 페이지 레벨 에러 (리다이렉트)</p>
              <p>• Axios 인터셉터: API 레벨 에러 (자동 복구)</p>
              <p>• 각자의 책임 영역을 명확히 구분</p>
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* 결론 */}
      <section className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">🎯 결론</h2>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg border">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-800 mb-2">AuthGuard</h3>
              <p className="text-gray-700 text-sm">
                "이 페이지에 들어올 자격이 있나?"<br />
                <span className="font-medium">(페이지 접근 제어)</span>
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">Axios 인터셉터</h3>
              <p className="text-gray-700 text-sm">
                "API 요청할 때 토큰 관리는 내가 알아서 할게"<br />
                <span className="font-medium">(HTTP 레벨 인증)</span>
              </p>
            </div>
          </div>
          
          <div className="text-lg text-gray-700">
            두 시스템이 함께 작동하여 <strong className="text-blue-600">개발자는 비즈니스 로직에 집중</strong>하고, 
            <strong className="text-green-600">사용자는 끊김 없는 경험</strong>을 할 수 있게 됩니다. 🚀
          </div>
        </div>
      </section>
    </div>
  );
}
