"use client";

import React from 'react';
import { Database, Shield, RefreshCw, Lock, Ban, Timer, Fingerprint } from 'lucide-react';

export default function BackendOverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">🗄️ 백엔드 로그인 시스템 총정리</h1>
      <p className="text-gray-600 mb-10">Spring Security + JWT + Refresh Token DB 관리 구조 핵심 요약.</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🏛️ 아키텍처 계층</h2>
        <div className="bg-gray-50 border rounded p-4 font-mono text-xs whitespace-pre-wrap">
{`Controller -> Service -> Repository -> Entity (JPA)
JwtAuthenticationFilter (OncePerRequest) -> SecurityContext
RefreshTokenService: 발급/재발급/무효화/revoke 관리`}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🔐 토큰 정책</h2>
        <ul className="list-disc ml-6 space-y-2 text-sm text-gray-700">
          <li>Access Token: 5분 (짧게 → 탈취 피해 최소화)</li>
          <li>Refresh Token: 14일 (쿠키 + DB 저장)</li>
          <li>재발급 시 Rotation: 이전 Refresh DB 레코드 revoke 처리</li>
        </ul>
        <div className="mt-4 bg-white border rounded p-4 font-mono text-xs">
{`app.jwt.expiration=300000
app.refresh-token.expiration=1209600000  # 14일 (밀리초)
`}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🧬 Refresh Token 엔티티 필드 (예시)</h2>
        <div className="bg-white border rounded p-4 font-mono text-xs whitespace-pre-wrap">
{`id (PK)
userId (또는 User 연관)
refreshToken (고유 값)
expiresAt (만료 시각)
revoked (boolean)
createdAt / updatedAt`}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">⚙️ 발급 & 저장 시점</h2>
        <ol className="list-decimal ml-6 space-y-2 text-sm text-gray-700">
          <li>로그인 성공 → Access + Refresh 생성</li>
          <li>RefreshToken 엔티티 DB 저장 (expiresAt = now + 14d)</li>
          <li>RefreshToken HttpOnly 쿠키로 클라이언트 전송</li>
          <li>모든 재발급 시 새 엔티티 추가 or 기존 갱신 + 이전 revoke</li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🔄 재발급 플로우</h2>
        <div className="bg-gray-50 border rounded p-4 font-mono text-xs whitespace-pre-wrap">
{`1. /api/auth/refresh 요청 (쿠키 포함)
2. DB에서 refreshToken 조회 -> 존재 & !revoked & 만료 안 됨 확인
3. 새 Access + Refresh 생성
4. 기존 레코드 revoke(true)
5. 새 Refresh 저장 & 쿠키로 교체 (Rotation)
`}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🛑 강제 로그아웃 (Revoke)</h2>
        <ul className="list-disc ml-6 space-y-2 text-sm text-gray-700">
          <li>관리자 → 특정 사용자 refresh 토큰 레코드 revoked=true 업데이트 또는 삭제</li>
          <li>남은 Access Token은 최대 5분 내 자연 만료 → 사실상 즉시 세션 종료 효과</li>
          <li>다음 API 호출 시 401 → 프론트 로그아웃 처리</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🛡️ 보안 고려</h2>
        <ul className="list-disc ml-6 space-y-2 text-sm text-gray-700">
          <li>쿠키: HttpOnly + Secure(배포 시) + SameSite=Lax/Strict</li>
          <li>JWT 서명키 관리: 환경변수 / Secret Manager</li>
          <li>Brute-force 방어: 로그인 실패 횟수 제한 (추가 예정)</li>
          <li>Old Refresh 재사용 공격: Rotation + revoke 검사로 차단</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">📊 모니터링 포인트</h2>
        <ul className="list-disc ml-6 space-y-2 text-sm text-gray-700">
          <li>발급 대비 revoke 비율</li>
          <li>동시 세션 수 (userId별 active refresh count)</li>
          <li>비정상 갱신 시도 (만료/취소 토큰 요청)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">✅ 요약</h2>
        <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
          <li>14일 만료 = application 설정(app.refresh-token.expiration)</li>
          <li>DB 저장 시점 = 로그인 성공 직후</li>
          <li>Revoke 후 최대 5분 내 세션 종료</li>
          <li>Rotation으로 탈취/재사용 방지</li>
          <li>관리자 제어: 실시간 강제 로그아웃/세션 추적</li>
        </ul>
      </section>
    </div>
  );
}
