# 🏗️ 로그인 시스템 개요

## 📖 시스템 아키텍처

### 전체 구조 (최신화)
```
┌─────────────────┐    HTTP Request     ┌─────────────────┐
│   Frontend      │ ──────────────────> │   Backend       │
│   (Next.js)     │                     │   (Spring Boot) │
│                 │ <────────────────── │                 │
└─────────────────┘    HTTP Response    └─────────────────┘
         │                                       │
         v                                       v
┌─────────────────┐                     ┌─────────────────────────────┐
│   Local Storage │                     │   PostgreSQL                │
│   - JWT Token   │                     │   - Users                   │
│   - User Info   │                     │   - Roles                   │
└─────────────────┘                     │   - RefreshTokens (DB 관리)  │
                                        └─────────────────────────────┘
```

## 🔐 인증 방식 및 토큰 관리

| 구분      | 토큰 종류         | 만료 시간 | 저장 위치      | 용도         |
|-----------|------------------|-----------|---------------|--------------|
| Primary   | JWT Access Token | 5분       | localStorage  | API 인증     |
| Secondary | Refresh Token    | 14일      | DB(PostgreSQL)| 재발급/세션관리 |

- Access Token: stateless, 빠른 인증
- Refresh Token: DB에서 관리, 세션/보안/강제 로그아웃 등 제어 가능

---

## ⚡ DB 기반 토큰 관리 활용 방식

- **강제 로그아웃**: 관리자가 회원 관리 페이지에서 특정 사용자의 토큰을 DB에서 삭제/차단 → 즉시 로그아웃
- **블랙리스트/세션 관리**: 여러 기기/브라우저별 세션 관리, 토큰 이력 추적
- **보안/운영**: 실시간 세션 제어, 감사/추적 가능

### 주요 구현 예시
```java
// 토큰 검증
public boolean isTokenValid(String token) {
    RefreshTokenEntity entity = refreshTokenRepository.findByRefreshToken(token);
    return entity != null && !entity.isRevoked() && entity.getExpiresAt().isAfter(LocalDateTime.now());
}

// 강제 로그아웃
public void revokeToken(String token) {
    RefreshTokenEntity entity = refreshTokenRepository.findByRefreshToken(token);
    if (entity != null) {
        entity.setRevoked(true);
        refreshTokenRepository.save(entity);
    }
}
```

---

## 🔄 전체 플로우

1. 로그인 → 토큰 발급/저장 (Access, Refresh)
2. API 요청 → Access Token 인증
3. 만료 시 → Refresh Token으로 재발급 (DB 검증)
4. 관리자가 토큰 삭제/차단 → 해당 사용자는 즉시 로그아웃

---

## 📝 활용/운영 포인트

- **RefreshToken DB 저장 시점**: 로그인 성공 시점에 DB에 저장
- **무효화(삭제/차단) 효과**: 관리자가 DB에서 토큰을 삭제/차단하면, 해당 사용자는 최대 5분(Access Token 만료) 이내에 모든 API 요청이 401로 바뀌며 즉시 로그아웃 효과 발생
- **실시간 세션 제어**: 여러 기기/브라우저별 토큰 관리 가능, 관리자 페이지에서 특정 유저의 세션을 직접 제어 가능

---

## 👨‍💼 관리자 페이지 필요성

- **회원 관리/세션 관리**: 로그인 유저 정보, 세션(RefreshToken) 목록, 강제 로그아웃/차단 기능 제공
- **운영/보안**: 실시간 모니터링 및 제어, 보안 사고 대응력 강화
- **추천**: 별도의 관리자 페이지에서 유저/세션 관리 기능 구현 권장

---

## 📝 결론

- JWT + DB 기반 RefreshToken 관리로 보안, 운영, 확장성 모두 잡을 수 있음
- 회원 관리 페이지에서 실시간 세션 제어, 강제 로그아웃 등 다양한 기능 구현 가능
- 관리자 페이지를 통해 실무적 운영/보안까지 완성 가능
