"use client";

import React from 'react';
import { Shield, Zap, Users, Lock, RefreshCw, Clock } from 'lucide-react';

export default function FrontendOverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">🧩 프론트엔드 로그인 시스템 총정리</h1>
      <p className="text-gray-600 mb-10">AuthGuard, Axios 인터셉터, 토큰 저장/갱신, UI 처리 흐름을 한눈에 정리.</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🔐 인증 책임 분리</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li><b>Axios 인터셉터</b>: 요청 전 Access Token 자동 첨부, 401 만료 시 재발급 흐름 트리거</li>
          <li><b>AuthGuard</b>: 라우트 접근 제어 (로그인 필요/비로그인 전용/권한별)</li>
          <li><b>로컬 상태</b>: localStorage(authToken, userInfo) + 글로벌 훅(useLogin/useLogout)</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🧪 토큰 수명 & 저장</h2>
        <div className="bg-white border rounded p-4 text-sm font-mono overflow-auto">
{`AccessToken: localStorage (5분)
RefreshToken: HttpOnly Cookie (14일) + 백엔드 DB (session control)`}
        </div>
        <p className="mt-3 text-sm text-gray-600">Refresh Token은 프론트 JS 접근 불가(HttpOnly) → 탈취 위험 감소.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">⚡ 요청 처리 흐름</h2>
        <div className="bg-gray-50 border rounded p-4 font-mono text-xs whitespace-pre-wrap">
{`1. 화면 렌더링 시 localStorage에서 authToken, userInfo 로드
2. 보호 페이지 진입 → AuthGuard 검사 (토큰 존재 + 만료 여부는 API 응답 기반)
3. API 호출 → Axios 인터셉터가 Authorization 헤더 설정
4. 응답이 401 + TOKEN_EXPIRED → refresh 흐름 (중복 호출 mutex 처리)
5. 새 토큰 저장 후 원본 요청 재시도
6. 관리자가 서버에서 RefreshToken 무효화 → 5분 이내 AccessToken 만료되며 자동 로그아웃 효과`}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🛡️ Race Condition & Token Rotation</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700 text-sm">
          <li>Refresh 요청 동시 발생 → Promise queue / in-flight 플래그로 한 번만 수행</li>
          <li>성공 시 대기 중 요청 재시도, 실패 시 일괄 로그아웃</li>
          <li>Rotation: 새 Refresh 발급 시 기존 DB 레코드 revoke</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🗜️ 상태 / 저장 키</h2>
        <div className="bg-white border rounded p-4 font-mono text-xs space-y-2">
          <div>localStorage.authToken = JWT Access</div>
          <div>localStorage.userInfo = {`{"username":"...","email":"...","role":"..."}`}</div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">�️ 실시간 Presence (신규)</h2>
        <p className="text-sm text-gray-700 mb-2">Redis + STOMP 기반 접속 상태 브로드캐스트 1차 구축 완료.</p>
        <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
          <li><b>백엔드</b>: WebSocketConfig, WebSocketAuthHandshakeInterceptor, PresenceService, WebSocketPresenceEventListener</li>
          <li><b>저장</b>: Redis Set(presence:online), lastSeen 키</li>
          <li><b>브로드캐스트</b>: /topic/presence (joined/left/online)</li>
          <li><b>다음</b>: 프론트 STOMP Hook + /app/ping Heartbeat</li>
        </ul>
        <a href="/docs/frontend/websocket-presence" className="inline-block mt-3 text-blue-600 hover:underline text-sm">➡ 개발자 현황 시스템 가이드</a>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">�👨‍💼 관리자 영향</h2>
        <p className="text-sm text-gray-700">서버에서 RefreshToken revoke 시 프론트는 다음 API 401 순간 재로그인 처리. UX: 짧은 세션 종료 알림 가능.</p>
      </section>

      <section className="mb-4">
        <h2 className="text-2xl font-bold mb-4">✅ 요약</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-1 text-sm">
          <li>AuthGuard = 화면 접근 레벨</li>
          <li>Axios 인터셉터 = 네트워크 레벨</li>
          <li>RefreshToken DB 관리 = 운영/보안/강제 로그아웃 기반</li>
          <li>5분 Access + 14일 Refresh = 보안/편의 균형</li>
        </ul>
      </section>
    </div>
  );
}
