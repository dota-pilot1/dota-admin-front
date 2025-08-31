"use client";

import React, { useState } from 'react';
import { Copy, Check, ArrowRight, CheckCircle2, XCircle, AlertTriangle, Clock, Shield, Zap } from 'lucide-react';

const CodeBlock = ({ children, title, language = "typescript" }: { children: string, title?: string, language?: string }) => {
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

const ProcessStep = ({ step, title, description, icon: Icon, success = true, children }: {
  step: number,
  title: string,
  description: string,
  icon: any,
  success?: boolean,
  children?: React.ReactNode
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
          success ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {step}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-5 h-5 ${success ? 'text-green-600' : 'text-red-600'}`} />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className="text-gray-600 mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function LoginProcessPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🔐 로그인 프로세스 가이드</h1>
        <p className="text-lg text-gray-600">로그인 성공/실패 시 시스템에서 실행되는 단계별 프로세스를 상세히 설명합니다.</p>
      </div>

      {/* 로그인 성공 프로세스 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-green-800 mb-8 flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8" />
          로그인 성공 프로세스
        </h2>

        <ProcessStep
          step={1}
          title="사용자 입력 및 요청 전송"
          description="사용자가 이메일/비밀번호를 입력하거나 테스트 계정을 선택합니다"
          icon={ArrowRight}
        >
          <CodeBlock title="POST /api/auth/login" language="json">
{`{
  "email": "terecal@daum.net",
  "password": "123456"
}`}
          </CodeBlock>
        </ProcessStep>

        <ProcessStep
          step={2}
          title="백엔드 인증 처리"
          description="서버에서 사용자 검증 및 토큰 생성을 수행합니다"
          icon={Shield}
        >
          <CodeBlock title="AuthController.login()" language="java">
{`1. 요청 데이터 수신 및 검증
2. 사용자 존재 확인 (UserService.findByEmail())
3. 비밀번호 검증 (BCrypt.checkpw())
4. JWT 토큰 생성 (JwtUtil.generateToken()) - 5분 만료
5. Refresh Token 생성 및 DB 저장 - 14일 만료
6. HttpOnly 쿠키에 Refresh Token 설정`}
          </CodeBlock>
        </ProcessStep>

        <ProcessStep
          step={3}
          title="성공 응답 반환"
          description="인증 성공 시 JWT 토큰과 사용자 정보를 응답합니다"
          icon={CheckCircle2}
        >
          <CodeBlock title="Response" language="json">
{`{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "id": 1,
  "username": "테스트관리자",
  "email": "terecal@daum.net",
  "role": "ADMIN",
  "expiresIn": 300
}`}
          </CodeBlock>
        </ProcessStep>

        <ProcessStep
          step={4}
          title="프론트엔드 토큰 저장"
          description="받은 토큰과 사용자 정보를 브라우저에 저장합니다"
          icon={Zap}
        >
          <CodeBlock title="useLogin.ts onSuccess" language="typescript">
{`1. localStorage에 JWT 토큰 저장
   localStorage.setItem('authToken', data.token)

2. localStorage에 사용자 정보 저장
   localStorage.setItem('userInfo', JSON.stringify({
     id: data.id,
     username: data.username,
     email: data.email,
     role: data.role
   }))

3. 커스텀 이벤트 발생 (AuthGuard 알림용)
   window.dispatchEvent(new CustomEvent('loginSuccess'))`}
          </CodeBlock>
        </ProcessStep>

        <ProcessStep
          step={5}
          title="페이지 리다이렉트"
          description="Race Condition 방지를 위해 지연 후 대시보드로 이동합니다"
          icon={Clock}
        >
          <CodeBlock title="Delayed Redirect" language="typescript">
{`// Race Condition 방지를 위한 지연 실행
setTimeout(() => {
  window.location.href = '/dashboard';
}, 500);`}
          </CodeBlock>
        </ProcessStep>

        <ProcessStep
          step={6}
          title="AuthGuard 인증 확인"
          description="페이지 접근 권한을 확인하고 인증된 사용자만 접근을 허용합니다"
          icon={Shield}
        >
          <CodeBlock title="AuthGuard 로직" language="typescript">
{`1. loginSuccess 이벤트 수신
2. localStorage에서 토큰 존재 확인
3. 인증 상태를 true로 설정
4. Dashboard 페이지 렌더링 허용`}
          </CodeBlock>
        </ProcessStep>

        <ProcessStep
          step={7}
          title="API 요청 시 자동 인증"
          description="이후 모든 API 요청에 JWT 토큰이 자동으로 첨부됩니다"
          icon={Zap}
        >
          <CodeBlock title="Axios 인터셉터" language="typescript">
{`// Axios 인터셉터가 모든 API 요청에 토큰 자동 첨부
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`}
          </CodeBlock>
        </ProcessStep>
      </section>

      {/* 로그인 실패 프로세스 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-red-800 mb-8 flex items-center gap-3">
          <XCircle className="w-8 h-8" />
          로그인 실패 프로세스
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* 실패 케이스 1 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              케이스 1: 사용자 미존재
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1단계: 백엔드 검증 실패</h4>
                <CodeBlock language="java">
{`// AuthController.login()
1. 요청 데이터 수신
2. UserService.findByEmail() → Optional.empty()
3. BadCredentialsException 발생`}
                </CodeBlock>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2단계: 에러 응답</h4>
                <CodeBlock language="json">
{`{
  "success": false,
  "message": "Invalid credentials",
  "errorCode": "AUTHENTICATION_FAILED",
  "timestamp": "2025-01-09T10:30:45"
}`}
                </CodeBlock>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3단계: 프론트엔드 에러 처리</h4>
                <CodeBlock language="typescript">
{`// useLogin.ts onError
1. 에러 상태 설정
2. 사용자에게 에러 메시지 표시
3. 로그인 폼 초기화 (선택사항)`}
                </CodeBlock>
              </div>
            </div>
          </div>

          {/* 실패 케이스 2 */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              케이스 2: 비밀번호 불일치
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1단계: 백엔드 검증 실패</h4>
                <CodeBlock language="java">
{`// AuthController.login()
1. 사용자 존재 확인 ✓
2. BCrypt.checkpw(password, hashedPassword) → false
3. BadCredentialsException 발생`}
                </CodeBlock>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2단계: 동일한 에러 응답</h4>
                <p className="text-sm text-orange-700 mb-2">(보안상 구체적 이유 숨김)</p>
                <CodeBlock language="json">
{`{
  "success": false,
  "message": "Invalid credentials",
  "errorCode": "AUTHENTICATION_FAILED"
}`}
                </CodeBlock>
              </div>
            </div>
          </div>
        </div>

        {/* 실패 케이스 3 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            케이스 3: 서버 에러
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">1단계: 예상치 못한 에러 발생</h4>
              <CodeBlock language="java">
{`// 데이터베이스 연결 실패, 기타 시스템 에러
Exception e → GlobalExceptionHandler`}
              </CodeBlock>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2단계: 일반 에러 응답</h4>
              <CodeBlock language="json">
{`{
  "success": false,
  "message": "Internal server error",
  "errorCode": "INTERNAL_SERVER_ERROR"
}`}
              </CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* 토큰 갱신 프로세스 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 flex items-center gap-3">
          <Zap className="w-8 h-8" />
          토큰 갱신 프로세스
        </h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-6">자동 갱신 (API 요청 시 401 에러 발생)</h3>
          
          <div className="space-y-6">
            <ProcessStep
              step={1}
              title="토큰 만료 감지"
              description="Axios 인터셉터가 TOKEN_EXPIRED 에러 코드를 감지합니다"
              icon={AlertTriangle}
            >
              <CodeBlock title="Axios 인터셉터" language="typescript">
{`if (error.response?.status === 401 && 
    error.response?.data?.errorCode === 'TOKEN_EXPIRED') {
  // 토큰 갱신 시도
}`}
              </CodeBlock>
            </ProcessStep>

            <ProcessStep
              step={2}
              title="Refresh Token으로 새 토큰 요청"
              description="HttpOnly 쿠키의 refresh_token을 사용하여 새 토큰을 요청합니다"
              icon={Zap}
            >
              <CodeBlock title="refresh.ts" language="typescript">
{`POST /api/auth/refresh
// HttpOnly 쿠키의 refresh_token 자동 전송

응답:
{
  "accessToken": "새로운JWT토큰",
  "expiresIn": 300
}`}
              </CodeBlock>
            </ProcessStep>

            <ProcessStep
              step={3}
              title="새 토큰으로 원본 요청 재시도"
              description="새로 발급받은 토큰으로 원래 실패했던 요청을 다시 실행합니다"
              icon={CheckCircle2}
            >
              <CodeBlock language="typescript">
{`// 새 토큰을 헤더에 설정하고 원래 요청 재실행
originalRequest.headers.Authorization = \`Bearer \${newToken}\`;
return api(originalRequest);`}
              </CodeBlock>
            </ProcessStep>

            <ProcessStep
              step={4}
              title="Refresh Token 갱신 실패 시"
              description="Refresh Token도 만료되었거나 무효한 경우 강제 로그아웃 처리합니다"
              icon={XCircle}
              success={false}
            >
              <CodeBlock language="typescript">
{`// refresh.ts
1. localStorage 토큰 삭제
2. /login 페이지로 강제 리다이렉트
3. 사용자에게 재로그인 요청`}
              </CodeBlock>
            </ProcessStep>
          </div>
        </div>
      </section>

      {/* 상태 흐름도 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">📊 상태 흐름도</h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-8">
          <div className="space-y-4 font-mono text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>[로그인 폼]</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span>↓ 사용자 입력</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>[API 요청]</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span>↓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>[백엔드 검증] ── 실패 → [에러 응답] → [에러 표시]</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span>↓ 성공</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>[토큰 생성]</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span>↓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-500 rounded"></div>
              <span>[토큰 저장] ── Race Condition 방지 지연</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span>↓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-500 rounded"></div>
              <span>[페이지 이동]</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span>↓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>[AuthGuard 확인] ── 실패 → [로그인 페이지]</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span>↓ 성공</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>[Dashboard 렌더링]</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span>↓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>[API 요청 시 자동 토큰 첨부]</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span>↓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>[토큰 만료 시 자동 갱신]</span>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 특징 */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">🔧 주요 특징</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Race Condition 방지
            </h3>
            <ul className="space-y-1 text-sm">
              <li>• 로그인 성공 후 500ms 지연 리다이렉트</li>
              <li>• 커스텀 이벤트로 상태 동기화</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              자동 토큰 갱신
            </h3>
            <ul className="space-y-1 text-sm">
              <li>• Axios 인터셉터가 401 에러 감지</li>
              <li>• TOKEN_EXPIRED 시에만 갱신 시도</li>
              <li>• Token Rotation으로 보안 강화</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-purple-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              일관된 에러 처리
            </h3>
            <ul className="space-y-1 text-sm">
              <li>• 표준화된 ErrorResponse DTO 사용</li>
              <li>• 명확한 에러 코드로 구분 처리</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-red-800 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              보안 설계
            </h3>
            <ul className="space-y-1 text-sm">
              <li>• HttpOnly 쿠키로 Refresh Token 보호</li>
              <li>• BCrypt 해싱으로 비밀번호 보안</li>
              <li>• JWT 서명 검증으로 위조 방지</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
