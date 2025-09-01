"use client";

import React, { useState } from 'react';
import { Zap, Server, Globe, Code2, AlertTriangle, CheckCircle2, RefreshCw, Lock, Monitor } from 'lucide-react';

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
  icon: React.ComponentType<{className?: string}>,
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

const FlowDiagram = () => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">토큰 만료 시 플로우</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
          <div className="flex-1">
            <p className="font-medium">API 함수 호출</p>
            <p className="text-sm text-gray-600">예: fetchUserData()</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
          <div className="flex-1">
            <p className="font-medium">Request Interceptor 실행</p>
            <p className="text-sm text-gray-600">만료된 JWT 토큰 헤더 추가</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
          <div className="flex-1">
            <p className="font-medium">서버 응답</p>
            <p className="text-sm text-gray-600">401 + TOKEN_EXPIRED</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
          <div className="flex-1">
            <p className="font-medium">Response Interceptor 실행</p>
            <p className="text-sm text-gray-600">토큰 만료 감지 → Refresh Token으로 새 토큰 발급</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
          <div className="flex-1">
            <p className="font-medium">원본 요청 재시도</p>
            <p className="text-sm text-gray-600">새 토큰으로 원본 요청 재시도 → 성공</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AxiosInterceptorPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🚀 Axios 인터셉터 가이드</h1>
        <p className="text-lg text-gray-600">HTTP 요청/응답 레벨에서 작동하는 토큰 관리 미들웨어에 대해 상세히 설명합니다.</p>
      </div>

      {/* 개요 */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">📍 개요</h2>
          <p className="text-lg text-gray-700 mb-4">
            Axios 인터셉터는 <strong className="text-green-600">HTTP 요청/응답 레벨에서 작동하는 미들웨어</strong>입니다. 
            API 호출 시 토큰을 자동으로 첨부하고, 토큰 만료 에러를 감지하여 자동으로 토큰을 갱신하는 역할을 담당합니다.
          </p>
          <div className="bg-white p-4 rounded border flex items-center gap-4">
            <Zap className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold">핵심 기능</h3>
              <p className="text-sm text-gray-600">투명한 토큰 관리로 개발자가 비즈니스 로직에만 집중할 수 있게 해줍니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 역할 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🎯 핵심 역할</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard title="요청 인터셉터 (Request Interceptor)" icon={Monitor} color="blue">
            <div className="space-y-3">
              <p className="text-sm"><strong>목적:</strong> 모든 API 요청에 JWT 토큰을 자동으로 첨부</p>
              <p className="text-sm"><strong>작동 시점:</strong> HTTP 요청이 서버로 전송되기 직전</p>
              <p className="text-sm"><strong>처리 내용:</strong> localStorage에서 authToken을 읽어 Authorization 헤더에 추가</p>
            </div>
            
            <CodeBlock title="요청 인터셉터 구현">
{`api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
  }
  return config;
});`}
            </CodeBlock>
          </FeatureCard>

          <FeatureCard title="응답 인터셉터 (Response Interceptor)" icon={RefreshCw} color="green">
            <div className="space-y-3">
              <p className="text-sm"><strong>목적:</strong> 토큰 만료 에러를 감지하고 자동으로 토큰 갱신</p>
              <p className="text-sm"><strong>작동 시점:</strong> 서버로부터 응답을 받은 직후</p>
              <p className="text-sm"><strong>처리 조건:</strong> 401 상태코드 + TOKEN_EXPIRED 에러코드</p>
            </div>
            
            <CodeBlock title="응답 인터셉터 구현">
{`api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorData = error.response?.data;
    const status = error.response?.status;
    
    if (status === 401 && 
        errorData?.errorCode === 'TOKEN_EXPIRED' && 
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = \`Bearer \${newToken}\`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);`}
            </CodeBlock>
          </FeatureCard>
        </div>
      </section>

      {/* 작동 과정 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🔄 작동 과정</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">일반적인 API 요청 플로우</h3>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>API 함수 호출 (예: fetchUserData())</li>
                <li><strong>Request Interceptor</strong> 실행 → JWT 토큰 헤더 추가</li>
                <li>서버로 HTTP 요청 전송</li>
                <li>서버 응답 수신</li>
                <li><strong>Response Interceptor</strong> 실행 → 성공 시 데이터 반환</li>
              </ol>
            </div>
          </div>
          
          <div>
            <FlowDiagram />
          </div>
        </div>
      </section>

      {/* 실제 사용 예시 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🎪 실제 사용 예시</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">사용자 정보 조회 API</h3>
            <CodeBlock title="/src/features/user/api/get-user.ts">
{`export async function fetchUserData() {
  // axios 인터셉터가 자동으로 토큰을 첨부하고 만료 시 갱신
  const response = await api.get('/api/user/me');
  return response.data;
}`}
            </CodeBlock>
            <p className="text-sm text-gray-600 mt-2">
              개발자는 토큰 관리를 전혀 신경 쓰지 않고 단순히 API를 호출하기만 하면 됩니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">결제 생성 API</h3>
            <CodeBlock title="/src/features/payment/api/create-payment.ts">
{`export async function createPayment(paymentData: PaymentRequest) {
  // 토큰이 만료되었다면 자동으로 갱신하고 재시도
  const response = await api.post('/api/payments', paymentData);
  return response.data;
}`}
            </CodeBlock>
            <p className="text-sm text-gray-600 mt-2">
              토큰 만료 시에도 사용자가 인지하지 못하게 백그라운드에서 자동 처리됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 특징 및 장점 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">⚡ 특징 및 장점</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FeatureCard title="1. 투명성 (Transparency)" icon={Globe} color="blue">
              <ul className="text-sm space-y-1">
                <li>• API 함수들은 토큰 관리를 신경 쓸 필요 없음</li>
                <li>• 기존 API 코드 수정 없이 토큰 관리 로직 적용</li>
              </ul>
            </FeatureCard>

            <FeatureCard title="2. 자동 토큰 갱신" icon={RefreshCw} color="green">
              <ul className="text-sm space-y-1">
                <li>• 토큰 만료를 사용자가 느끼지 못하게 백그라운드에서 처리</li>
                <li>• 원본 요청을 자동으로 재시도하여 끊김 없는 사용자 경험</li>
              </ul>
            </FeatureCard>
          </div>

          <div className="space-y-6">
            <FeatureCard title="3. 중복 요청 방지" icon={Lock} color="orange">
              <ul className="text-sm space-y-1">
                <li>• _retry 플래그로 무한 루프 방지</li>
                <li>• refresh API 호출 시에는 인터셉터 동작 안 함</li>
              </ul>
            </FeatureCard>

            <FeatureCard title="4. 에러 처리 분리" icon={AlertTriangle} color="red">
              <ul className="text-sm space-y-1">
                <li>• 토큰 관련 에러는 인터셉터에서 처리</li>
                <li>• 비즈니스 로직 에러는 각 API 함수에서 처리</li>
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
              <h3 className="font-semibold text-red-800 mb-3">1. localStorage 의존성</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• 브라우저 환경에서만 동작 (SSR 시 토큰 첨부 안 됨)</li>
                <li>• localStorage 접근 불가 시 토큰 첨부 불가</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">2. 네트워크 레벨 에러</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• 네트워크 연결 실패 시에는 동작하지 않음</li>
                <li>• 서버가 응답하지 않는 경우 토큰 갱신 불가</li>
              </ul>
            </div>
          </div>

          <div>
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">3. Refresh Token 만료</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Refresh Token도 만료된 경우 자동 갱신 실패</li>
                <li>• 이 경우 사용자가 수동으로 재로그인 필요</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 설정 및 환경 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🛠️ 설정 및 환경</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard title="환경 변수" icon={Code2} color="blue">
            <CodeBlock>
{`NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`}
            </CodeBlock>
          </FeatureCard>

          <FeatureCard title="Axios 인스턴스 설정" icon={Server} color="green">
            <CodeBlock>
{`const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // refresh_token 쿠키 포함
});`}
            </CodeBlock>
          </FeatureCard>
        </div>
      </section>

      {/* 연관 컴포넌트 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🔗 연관 컴포넌트</h2>
        
        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">1. AuthGuard</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-sm">관계</p>
                <p className="text-sm text-gray-600">독립적이지만 상호 보완</p>
              </div>
              <div>
                <p className="font-medium text-sm">차이점</p>
                <p className="text-sm text-gray-600">AuthGuard는 페이지 레벨, Axios는 API 레벨</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">2. Refresh Token API</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-sm">파일</p>
                <p className="text-sm text-gray-600 font-mono">/src/features/auth/api/refresh.ts</p>
              </div>
              <div>
                <p className="font-medium text-sm">역할</p>
                <p className="text-sm text-gray-600">실제 토큰 갱신 로직 수행</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">3. JWT 유틸리티</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-sm">파일</p>
                <p className="text-sm text-gray-600 font-mono">/src/shared/lib/jwt-utils.ts</p>
              </div>
              <div>
                <p className="font-medium text-sm">역할</p>
                <p className="text-sm text-gray-600">토큰 디코딩 및 유효성 검사</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 디버깅 팁 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">📚 디버깅 팁</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">개발 환경에서의 로그</h3>
            <CodeBlock>
{`if (process.env.NODE_ENV === 'development') {
  console.log("⏰ Token expired, attempting refresh");
  console.log("✅ Token refresh successful, retrying request");
  console.log("❌ Token refresh failed");
}`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">확인해야 할 사항</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm">localStorage에 authToken이 있는지</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm">서버에서 TOKEN_EXPIRED 에러코드를 정확히 반환하는지</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm">Refresh Token 쿠키가 브라우저에 설정되어 있는지</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm">withCredentials: true 설정이 되어 있는지</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 최적화 방안 */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">🚀 최적화 방안</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-3">1. 토큰 갱신 중 중복 요청 처리</h3>
            <p className="text-sm text-gray-600">
              현재는 각 요청마다 개별적으로 토큰 갱신을 시도합니다. 
              여러 요청이 동시에 들어올 경우 토큰 갱신 요청이 중복될 수 있습니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-3">2. 토큰 만료 예측</h3>
            <p className="text-sm text-gray-600">
              JWT 토큰의 만료 시간을 미리 확인하여 만료되기 전에 
              미리 갱신하는 방식도 고려할 수 있습니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-3">3. 에러 상태 관리</h3>
            <p className="text-sm text-gray-600">
              토큰 갱신 실패 시 사용자에게 적절한 피드백을 제공하는 
              전역 에러 상태 관리 시스템 도입을 고려할 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
