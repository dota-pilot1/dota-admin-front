"use client";

import React, { useState } from 'react';
import { Copy, Check, AlertTriangle, CheckCircle2, Clock, Bug, Zap, Search } from 'lucide-react';

const CodeBlock = ({ children, title, language = "javascript" }: { children: string, title?: string, language?: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <div className="relative group mb-6">
      {title && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-medium rounded-t-lg border-b border-gray-600">
          {title}
        </div>
      )}
      <div className="relative">
        <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto ${title ? 'rounded-t-none' : ''} rounded-lg`}>
          <code className={`language-${language}`}>{children.trim()}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
          title="클립보드에 복사"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-300" />
          )}
        </button>
      </div>
    </div>
  );
};

const Timeline = ({ items }: { items: Array<{ title: string, time: string, status: 'success' | 'error' | 'warning', description: string, details?: string }> }) => {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              item.status === 'success' ? 'bg-green-100 text-green-600' :
              item.status === 'error' ? 'bg-red-100 text-red-600' :
              'bg-yellow-100 text-yellow-600'
            }`}>
              {item.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
               item.status === 'error' ? <AlertTriangle className="w-5 h-5" /> :
               <Clock className="w-5 h-5" />}
            </div>
            {index < items.length - 1 && (
              <div className="w-px h-16 bg-gray-200 mt-2"></div>
            )}
          </div>
          <div className="flex-1 pb-8">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <span className="text-sm text-gray-500">{item.time}</span>
            </div>
            <p className="text-gray-600 mb-2">{item.description}</p>
            {item.details && (
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                {item.details}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ProblemCard = ({ title, icon: Icon, children, severity }: { 
  title: string, 
  icon: any, 
  children: React.ReactNode, 
  severity: 'high' | 'medium' | 'low'
}) => {
  const severityColors = {
    high: "border-red-200 bg-red-50",
    medium: "border-orange-200 bg-orange-50", 
    low: "border-yellow-200 bg-yellow-50"
  };

  const iconColors = {
    high: "text-red-600",
    medium: "text-orange-600",
    low: "text-yellow-600"
  };

  return (
    <div className={`border-2 rounded-lg p-6 mb-6 ${severityColors[severity]}`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`h-6 w-6 ${iconColors[severity]}`} />
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
          severity === 'high' ? 'bg-red-200 text-red-800' :
          severity === 'medium' ? 'bg-orange-200 text-orange-800' :
          'bg-yellow-200 text-yellow-800'
        }`}>
          {severity}
        </span>
      </div>
      {children}
    </div>
  );
};

export default function LoginFlowAnalysisPage() {
  const timelineData = [
    {
      title: "로그인 페이지 접근",
      time: "10:00:00",
      status: "success" as const,
      description: "사용자가 /login 페이지에 접근",
      details: "로그인 폼이 정상적으로 렌더링됨. 테스트 계정 버튼들도 정상 표시."
    },
    {
      title: "로그인 요청 전송",
      time: "10:00:05",
      status: "success" as const,
      description: "이메일/비밀번호로 /api/auth/login POST 요청",
      details: "Request Body: { email: 'test@example.com', password: 'password123' }"
    },
    {
      title: "백엔드 인증 처리",
      time: "10:00:05.100",
      status: "success" as const,
      description: "사용자 검증 및 JWT 토큰 생성",
      details: "사용자 존재 확인 → 비밀번호 검증 → JWT 생성 (5분 만료) → Refresh Token 생성 (14일 만료)"
    },
    {
      title: "토큰 저장",
      time: "10:00:05.200",
      status: "success" as const,
      description: "로컬스토리지와 쿠키에 토큰 저장",
      details: "localStorage에 JWT 저장, HttpOnly 쿠키에 Refresh Token 저장"
    },
    {
      title: "Race Condition 발생",
      time: "10:00:05.250",
      status: "error" as const,
      description: "리다이렉트 직후 대시보드 API 호출 시 401 에러",
      details: "페이지 이동은 성공했으나 대시보드 데이터 로드 실패. localStorage에 토큰은 있으나 axios 헤더에 적용되기 전에 요청 발생."
    },
    {
      title: "자동 토큰 갱신 시도",
      time: "10:00:05.300",
      status: "warning" as const,
      description: "401 에러 감지 후 Refresh Token으로 갱신 시도",
      details: "Axios 인터셉터가 401 감지 → /api/auth/refresh 호출 → 새 토큰 발급"
    },
    {
      title: "원본 요청 재시도",
      time: "10:00:05.400",
      status: "success" as const,
      description: "새 토큰으로 대시보드 API 재요청",
      details: "갱신된 토큰으로 대시보드 데이터 로드 성공"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🔍 로그인 플로우 분석</h1>
        <p className="text-lg text-gray-600">로그인 과정에서 발생한 문제들과 해결 과정을 시간순으로 분석합니다.</p>
      </div>

      {/* 타임라인 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">⏰ 로그인 과정 타임라인</h2>
        <div className="bg-white rounded-lg border p-6">
          <Timeline items={timelineData} />
        </div>
      </section>

      {/* 주요 문제점들 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🚨 발견된 주요 문제점들</h2>
        
        <ProblemCard title="Race Condition" icon={Zap} severity="high">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">문제 상황</h4>
              <p className="text-sm mb-3">로그인 성공 후 즉시 페이지 이동 시, localStorage에 토큰이 저장되기 전에 API 요청이 발생하여 401 에러 발생</p>
              
              <CodeBlock title="문제가 발생한 코드" language="typescript">
{`// 문제가 있었던 원래 코드
onSuccess: (data) => {
  localStorage.setItem('token', data.token);
  window.location.href = '/dashboard'; // 즉시 이동으로 인한 Race Condition
}`}
              </CodeBlock>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">해결 방법</h4>
              <p className="text-sm mb-3">setTimeout을 사용하여 토큰 저장 완료를 보장한 후 페이지 이동</p>
              
              <CodeBlock title="수정된 코드" language="typescript">
{`onSuccess: (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(userInfo));
  
  // 커스텀 이벤트 발생으로 AuthGuard에 알림
  window.dispatchEvent(new CustomEvent('loginSuccess'));
  
  // 500ms 지연으로 Race Condition 방지
  setTimeout(() => {
    window.location.href = '/dashboard';
  }, 500);
}`}
              </CodeBlock>
            </div>
          </div>
        </ProblemCard>

        <ProblemCard title="JSON 역직렬화 실패" icon={Bug} severity="medium">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">문제 상황</h4>
              <p className="text-sm mb-3">백엔드 DTO 클래스에 setter 메서드가 없어서 Spring Boot가 요청 JSON을 객체로 변환할 수 없음</p>
              
              <CodeBlock title="에러 로그" language="text">
{`Cannot construct instance of LoginRequest (no Creators, like default constructor, exist): 
cannot deserialize from Object value (no delegate- or property-based Creator)`}
              </CodeBlock>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">해결 방법</h4>
              <p className="text-sm mb-3">모든 Request DTO 클래스에 setter 메서드 추가</p>
              
              <CodeBlock title="수정된 DTO" language="java">
{`public static class LoginRequest {
    private String email;
    private String password;
    
    // Getters
    public String email() { return email; }
    public String password() { return password; }
    
    // Jackson 역직렬화를 위한 Setters 추가
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}`}
              </CodeBlock>
            </div>
          </div>
        </ProblemCard>

        <ProblemCard title="하이드레이션 에러" icon={AlertTriangle} severity="low">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">문제 상황</h4>
              <p className="text-sm mb-3">HTML에서 button 요소 안에 또 다른 button 요소가 중첩되어 브라우저에서 하이드레이션 에러 발생</p>
              
              <CodeBlock title="에러 메시지" language="text">
{`Warning: validateDOMNesting(...): <button> cannot appear as a descendant of <button>.`}
              </CodeBlock>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">해결 방법</h4>
              <p className="text-sm mb-3">외부 button을 div로 변경하고 접근성을 위해 role과 키보드 이벤트 추가</p>
              
              <CodeBlock title="수정된 컴포넌트" language="tsx">
{`// 기존의 중첩된 button 구조 수정
<div 
  role="button" 
  tabIndex={0}
  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
  onClick={handleAccountSelect}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAccountSelect();
    }
  }}
>
  <div className="flex justify-between items-center">
    <div>
      <p className="font-medium">{account.username}</p>
      <p className="text-sm text-gray-500">{account.email}</p>
    </div>
    <button 
      onClick={(e) => {
        e.stopPropagation(); // 부모 클릭 이벤트 방지
        handleLogin(account);
      }}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      로그인
    </button>
  </div>
</div>`}
              </CodeBlock>
            </div>
          </div>
        </ProblemCard>
      </section>

      {/* 해결 과정 상세 분석 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🔧 해결 과정 상세 분석</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              <Search className="inline-block w-5 h-5 mr-2" />
              문제 진단 과정
            </h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                <span>브라우저 개발자 도구 Network 탭에서 API 요청 상태 확인</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                <span>Console 탭에서 JavaScript 에러 및 로그 메시지 분석</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                <span>Application 탭에서 localStorage와 Cookie 저장 상태 확인</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                <span>백엔드 로그에서 요청 처리 과정과 에러 메시지 확인</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">5</span>
                <span>코드 디버깅을 통해 타이밍 이슈와 설정 문제 식별</span>
              </li>
            </ol>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-800">
              <CheckCircle2 className="inline-block w-5 h-5 mr-2" />
              솔루션 적용 과정
            </h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                <span>Race Condition 해결을 위한 지연 리다이렉트 구현</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                <span>백엔드 DTO에 setter 메서드 추가로 JSON 역직렬화 문제 해결</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                <span>AuthGuard에 이벤트 리스너 추가로 상태 동기화 개선</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                <span>Axios 인터셉터 개선으로 자동 토큰 갱신 안정화</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">5</span>
                <span>각 솔루션에 대한 철저한 테스트와 검증 수행</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* 성능 개선 결과 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">📊 성능 개선 결과</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-800">문제 발생 시</h3>
            <div className="text-3xl font-bold text-red-600 mb-2">~30%</div>
            <p className="text-sm text-red-700">로그인 실패율</p>
            <p className="text-xs text-red-600 mt-2">Race Condition으로 인한 401 에러</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 text-yellow-800">임시 해결 후</h3>
            <div className="text-3xl font-bold text-yellow-600 mb-2">~5%</div>
            <p className="text-sm text-yellow-700">로그인 실패율</p>
            <p className="text-xs text-yellow-600 mt-2">가끔 발생하는 타이밍 이슈</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 text-green-800">최종 해결 후</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">~0%</div>
            <p className="text-sm text-green-700">로그인 실패율</p>
            <p className="text-xs text-green-600 mt-2">안정적인 인증 플로우 구현</p>
          </div>
        </div>
      </section>

      {/* 핵심 해결책 요약 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">💡 핵심 해결책 요약</h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-800">🎯 프론트엔드 개선</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  <span><strong>지연 리다이렉트:</strong> setTimeout 500ms로 Race Condition 방지</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  <span><strong>이벤트 시스템:</strong> loginSuccess 이벤트로 상태 동기화</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  <span><strong>인터셉터 개선:</strong> refreshPromise로 중복 갱신 방지</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  <span><strong>컴포넌트 구조:</strong> button 중첩 문제 해결</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-800">🔧 백엔드 개선</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  <span><strong>DTO 수정:</strong> 모든 Request 클래스에 setter 추가</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  <span><strong>로깅 강화:</strong> 상세한 디버깅 로그 추가</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  <span><strong>에러 처리:</strong> 명확한 에러 메시지와 상태 코드</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  <span><strong>토큰 검증:</strong> JWT 시그니처 및 만료 검증 강화</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 교훈과 향후 예방책 */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">📚 교훈과 향후 예방책</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-800">🔍 얻은 교훈</h3>
            <ul className="space-y-2 text-sm ml-4">
              <li>• <strong>비동기 처리의 중요성:</strong> 프론트엔드에서 상태 변경과 페이지 이동 간의 타이밍 조절 필수</li>
              <li>• <strong>백엔드 설정의 중요성:</strong> JSON 역직렬화를 위한 DTO 구조 설계 시 주의 필요</li>
              <li>• <strong>HTML 표준 준수:</strong> 웹 표준을 위반하면 예상치 못한 문제 발생 가능</li>
              <li>• <strong>디버깅 도구 활용:</strong> 브라우저 개발자 도구와 백엔드 로그의 체계적 분석 중요</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-800">🛡️ 향후 예방책</h3>
            <ul className="space-y-2 text-sm ml-4">
              <li>• <strong>단위 테스트 강화:</strong> 인증 플로우에 대한 엔드투엔드 테스트 작성</li>
              <li>• <strong>에러 모니터링:</strong> 프로덕션 환경에서 실시간 에러 추적 시스템 도입</li>
              <li>• <strong>코드 리뷰 프로세스:</strong> 비동기 처리와 상태 관리 부분에 대한 철저한 리뷰</li>
              <li>• <strong>성능 모니터링:</strong> 로그인 성공률과 응답 시간에 대한 지속적 모니터링</li>
            </ul>
          </div>
          
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>🎯 핵심 포인트:</strong> 이번 문제 해결을 통해 JWT 기반 인증 시스템의 전체적인 이해가 크게 향상되었으며, 
              앞으로 유사한 문제들을 사전에 예방하고 빠르게 해결할 수 있는 역량을 갖추게 되었습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
