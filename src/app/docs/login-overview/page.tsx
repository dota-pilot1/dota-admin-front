"use client";

import React from 'react';
import { Database, Shield, Zap, Clock, Lock, CheckCircle2, RefreshCw, Users } from 'lucide-react';

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

const TokenLifecycle = () => {
  const steps = [
    { step: 1, title: "로그인 성공", color: "bg-green-500" },
    { step: 2, title: "JWT (5분) + Refresh Token (14일) 발급", color: "bg-blue-500" },
    { step: 3, title: "API 요청 시 JWT 자동 첨부", color: "bg-purple-500" },
    { step: 4, title: "JWT 만료 시 Refresh Token으로 자동 갱신", color: "bg-orange-500" },
    { step: 5, title: "새 JWT + 새 Refresh Token 발급 (Token Rotation)", color: "bg-indigo-500" },
    { step: 6, title: "Refresh Token 만료 시 재로그인 필요", color: "bg-red-500" }
  ];

  return (
    <div className="space-y-4">
      {steps.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className={`w-8 h-8 ${item.color} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
            {item.step}
          </div>
          <div className="flex-1">
            <p className="text-gray-700">{item.title}</p>
          </div>
          {index < steps.length - 1 && (
            <div className="w-px h-8 bg-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function LoginOverviewPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🏗️ 로그인 시스템 개요</h1>
        <p className="text-lg text-gray-600">JWT 기반 인증 시스템의 전체 아키텍처와 핵심 기능을 소개합니다.</p>
      </div>

      {/* 시스템 아키텍처 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">📖 시스템 아키텍처</h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-semibold mb-6">전체 구조</h3>
          <div className="bg-white p-6 rounded-lg border">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
{`┌─────────────────┐    HTTP Request     ┌─────────────────┐
│   Frontend      │ ──────────────────> │   Backend       │
│   (Next.js)     │                     │   (Spring Boot) │
│                 │ <────────────────── │                 │
└─────────────────┘    HTTP Response    └─────────────────┘
         │                                       │
         │                                       │
         v                                       v
┌─────────────────┐                     ┌─────────────────┐
│   Local Storage │                     │   PostgreSQL    │
│   - JWT Token   │                     │   - Users       │
│   - User Info   │                     │   - Roles       │
└─────────────────┘                     │   - RefreshTokens│
                                        └─────────────────┘`}
            </pre>
          </div>
        </div>
      </section>


      {/* 관리자 페이지 필요성 및 설계 예시 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">👨‍💼 관리자 페이지 필요성</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>회원 관리/세션 관리: 로그인 유저 정보, 세션(RefreshToken) 목록, 강제 로그아웃/차단 기능 제공</li>
          <li>운영/보안: 실시간 모니터링 및 제어, 보안 사고 대응력 강화</li>
          <li>추천: 별도의 관리자 페이지에서 유저/세션 관리 기능 구현 권장</li>
        </ul>
        <div className="mt-2 p-4 border rounded bg-gray-50">
          <b>관리자 페이지 설계 예시:</b>
          <ul className="list-disc ml-6 mt-2">
            <li>유저 목록/검색/상세 정보</li>
            <li>세션(RefreshToken) 목록 및 상태 표시</li>
            <li>강제 로그아웃/차단 버튼</li>
            <li>실시간 세션 모니터링</li>
          </ul>
          <span className="text-xs text-gray-500">※ 운영/보안 강화를 위해 관리자 페이지 구현을 적극 추천합니다.</span>
        </div>
      </section>
      {/* 인증 방식 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🔐 인증 방식</h2>
        
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">구분</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">토큰 종류</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">만료 시간</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">저장 위치</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">용도</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-medium text-blue-600">Primary</td>
                <td className="px-6 py-4">JWT Access Token</td>
                <td className="px-6 py-4">5분</td>
                <td className="px-6 py-4">localStorage</td>
                <td className="px-6 py-4">API 요청 인증</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-green-600">Secondary</td>
                <td className="px-6 py-4">Refresh Token</td>
                <td className="px-6 py-4">14일</td>
                <td className="px-6 py-4">HttpOnly Cookie</td>
                <td className="px-6 py-4">토큰 갱신</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 핵심 컴포넌트 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🎯 핵심 컴포넌트</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center gap-2">
              <Users className="w-6 h-6" />
              프론트엔드
            </h3>
            <div className="space-y-4">
              <FeatureCard title="AuthGuard" icon={Shield} color="purple">
                <p className="text-sm">페이지 접근 권한 확인</p>
              </FeatureCard>
              <FeatureCard title="Axios 인터셉터" icon={Zap} color="green">
                <p className="text-sm">자동 토큰 첨부 및 갱신</p>
              </FeatureCard>
              <FeatureCard title="useLogin Hook" icon={Lock} color="blue">
                <p className="text-sm">로그인 처리 및 상태 관리</p>
              </FeatureCard>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center gap-2">
              <Database className="w-6 h-6" />
              백엔드
            </h3>
            <div className="space-y-4">
              <FeatureCard title="JwtAuthenticationFilter" icon={Shield} color="red">
                <p className="text-sm">JWT 토큰 검증</p>
              </FeatureCard>
              <FeatureCard title="AuthController" icon={Users} color="orange">
                <p className="text-sm">로그인/로그아웃/토큰갱신 API</p>
              </FeatureCard>
              <FeatureCard title="RefreshTokenService" icon={RefreshCw} color="purple">
                <p className="text-sm">Refresh Token 관리</p>
              </FeatureCard>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">⚡ 주요 기능</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard title="자동 토큰 갱신" icon={RefreshCw} color="green">
            <div className="bg-white p-4 rounded border">
              <pre className="text-xs text-gray-700">
{`// 401 에러 감지 시 자동 처리
if (errorCode === 'TOKEN_EXPIRED') {
  const newToken = await refreshToken();
  // 원본 요청 재시도
}`}
              </pre>
            </div>
          </FeatureCard>
          
          <FeatureCard title="Race Condition 방지" icon={Clock} color="orange">
            <div className="bg-white p-4 rounded border">
              <pre className="text-xs text-gray-700">
{`// 로그인 성공 후 지연 리다이렉트
setTimeout(() => {
  window.location.href = '/dashboard';
}, 500);`}
              </pre>
            </div>
          </FeatureCard>
          
          <FeatureCard title="Token Rotation" icon={Shield} color="red">
            <div className="bg-white p-4 rounded border">
              <pre className="text-xs text-gray-700">
{`// 기존 토큰 무효화 후 새 토큰 발급
refreshTokenService.invalidateToken(oldToken);
return generateNewTokens(user);`}
              </pre>
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* 보안 특징 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🛡️ 보안 특징</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Lock className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-800">BCrypt 해싱</h4>
                <p className="text-sm text-blue-700">비밀번호 안전 저장</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">JWT 서명</h4>
                <p className="text-sm text-green-700">HMAC SHA-256으로 위조 방지</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <Database className="w-6 h-6 text-purple-600" />
              <div>
                <h4 className="font-semibold text-purple-800">HttpOnly Cookie</h4>
                <p className="text-sm text-purple-700">XSS 공격 방지</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <RefreshCw className="w-6 h-6 text-orange-600" />
              <div>
                <h4 className="font-semibold text-orange-800">Token Rotation</h4>
                <p className="text-sm text-orange-700">토큰 탈취 시 피해 최소화</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API 엔드포인트 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">📋 API 엔드포인트</h2>
        
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">메서드</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">경로</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">설명</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">인증 필요</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">POST</span></td>
                <td className="px-6 py-4 font-mono text-sm">/api/auth/login</td>
                <td className="px-6 py-4">로그인</td>
                <td className="px-6 py-4"><span className="text-red-600">❌</span></td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">POST</span></td>
                <td className="px-6 py-4 font-mono text-sm">/api/auth/refresh</td>
                <td className="px-6 py-4">토큰 갱신</td>
                <td className="px-6 py-4"><span className="text-yellow-600">🍪 Cookie</span></td>
              </tr>
              <tr>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">POST</span></td>
                <td className="px-6 py-4 font-mono text-sm">/api/auth/logout</td>
                <td className="px-6 py-4">로그아웃</td>
                <td className="px-6 py-4"><span className="text-green-600">✅ JWT</span></td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">GET</span></td>
                <td className="px-6 py-4 font-mono text-sm">/api/user/me</td>
                <td className="px-6 py-4">내 정보 조회</td>
                <td className="px-6 py-4"><span className="text-green-600">✅ JWT</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 토큰 생명주기 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🔄 토큰 생명주기</h2>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-8">
          <TokenLifecycle />
        </div>
      </section>

      {/* 환경 설정 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">⚙️ 환경 설정</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard title="백엔드 (application.yml)" icon={Database} color="green">
            <div className="bg-white p-4 rounded border">
              <pre className="text-xs text-gray-700">
{`app:
  jwt:
    secret: \${JWT_SECRET:your-secret-key}
    expiration: 300000  # 5분 (밀리초)
  refresh-token:
    expiration: 1209600000  # 14일 (밀리초)`}
              </pre>
            </div>
          </FeatureCard>
          
          <FeatureCard title="프론트엔드 (환경변수)" icon={Users} color="blue">
            <div className="bg-white p-4 rounded border">
              <pre className="text-xs text-gray-700">
{`NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`}
              </pre>
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* 테스트 계정 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🧪 테스트 계정</h2>
        
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">이메일</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">비밀번호</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">역할</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-mono text-sm">terecal@daum.net</td>
                <td className="px-6 py-4 font-mono text-sm">123456</td>
                <td className="px-6 py-4"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">ADMIN</span></td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">test@example.com</td>
                <td className="px-6 py-4 font-mono text-sm">password123</td>
                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">USER</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 관련 문서 */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">📚 관련 문서</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold">로그인 프로세스 가이드</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">상세한 단계별 프로세스 및 성공/실패 케이스 분석</p>
            <a href="/docs/login-system-guide" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              문서 보기 →
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">API 문서</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">백엔드 API 상세 명세 및 사용 방법</p>
            <span className="text-gray-400 text-sm">준비 중...</span>
          </div>
        </div>
      </section>
    </div>
  );
}
