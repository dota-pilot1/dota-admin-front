import React from 'react';

const CodeBlock = ({ code, language }: { code: string; language: string }) => (
  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
    <pre className="text-sm text-gray-100">
      <code>{code}</code>
    </pre>
  </div>
);

export default function DbTokenManagementPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">DB 기반 토큰 관리 시스템</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">1. 개요</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-4">
          <li>강제 로그아웃: 관리자가 특정 사용자의 토큰을 삭제하여 즉시 로그아웃 처리</li>
          <li>토큰 블랙리스트: 만료/차단된 토큰을 DB에서 관리하여 재사용 방지</li>
          <li>세션 관리: 여러 기기/브라우저에서 발급된 토큰을 개별적으로 관리</li>
          <li>감사/추적: 토큰 발급/만료/삭제 이력 추적 가능</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">2. 토큰 저장 구조 예시</h2>
        <CodeBlock
          code={`@Entity
public class RefreshTokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String refreshToken;
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
    private boolean revoked;
}`}
          language="java"
        />
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">3. 주요 API 예시</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-4">
          <li>토큰 발급: 로그인 시 DB에 토큰 저장</li>
          <li>토큰 검증: API 요청 시 DB에서 토큰 유효성 확인</li>
          <li>토큰 삭제: 로그아웃/관리자 강제 로그아웃 시 DB에서 삭제</li>
          <li>토큰 블랙리스트 등록: 비정상/위험 토큰을 블랙리스트 처리</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">4. 회원 관리 페이지 기능 예시</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-4">
          <li>사용자 목록 조회</li>
          <li>각 사용자별 로그인 세션(토큰) 목록 조회</li>
          <li>특정 토큰 삭제(강제 로그아웃)</li>
          <li>토큰 만료/차단 처리</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">5. 강제 로그아웃 처리 플로우</h2>
        <ol className="list-decimal list-inside text-lg text-gray-700 mb-4">
          <li>관리자가 회원 관리 페이지에서 특정 사용자의 토큰을 선택</li>
          <li>&ldquo;로그아웃&rdquo; 버튼 클릭 시 해당 토큰 DB에서 삭제 또는 revoked=true 처리</li>
          <li>사용자가 다음 API 요청 시 토큰이 DB에 없거나 revoked 상태면 401 반환 및 프론트에서 로그인 페이지로 이동</li>
        </ol>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">6. 장점</h2>
        <ul className="list-disc list-inside text-lg text-green-700 mb-4">
          <li>운영/보안: 관리자가 실시간으로 세션 제어 가능</li>
          <li>확장성: 다중 기기/브라우저 세션 관리</li>
          <li>감사/추적: 토큰 이력 관리로 보안 감사 용이</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">7. 단점</h2>
        <ul className="list-disc list-inside text-lg text-red-700 mb-4">
          <li>성능: 매 요청마다 DB 조회 필요 (캐싱/최적화 필요)</li>
          <li>구현 복잡도: 단순 JWT stateless 방식보다 복잡함</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">8. 실제 구현 예시</h2>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">토큰 검증</h3>
        <CodeBlock
          code={`public boolean isTokenValid(String token) {
    RefreshTokenEntity entity = refreshTokenRepository.findByRefreshToken(token);
    return entity != null && !entity.isRevoked() && entity.getExpiresAt().isAfter(LocalDateTime.now());
}`}
          language="java"
        />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">강제 로그아웃</h3>
        <CodeBlock
          code={`public void revokeToken(String token) {
    RefreshTokenEntity entity = refreshTokenRepository.findByRefreshToken(token);
    if (entity != null) {
        entity.setRevoked(true);
        refreshTokenRepository.save(entity);
    }
}`}
          language="java"
        />
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">9. 결론</h2>
        <p className="text-lg text-gray-700 mb-4">
          DB 기반 토큰 관리 시스템을 도입하면 회원 관리, 보안, 운영 측면에서 훨씬 강력한 인증/세션 제어가 가능합니다. 실시간 강제 로그아웃, 세션 추적, 토큰 블랙리스트 등 다양한 기능을 쉽게 확장할 수 있습니다.
        </p>
      </section>
    </div>
  );
}
