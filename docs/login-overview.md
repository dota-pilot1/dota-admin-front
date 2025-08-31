# 🏗️ 로그인 시스템 개요

## 📖 시스템 아키텍처

### 전체 구조
```
┌─────────────────┐    HTTP Request     ┌─────────────────┐
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
                                        └─────────────────┘
```

## 🔐 인증 방식

| 구분 | 토큰 종류 | 만료 시간 | 저장 위치 | 용도 |
|------|-----------|-----------|-----------|------|
| Primary | JWT Access Token | 5분 | localStorage | API 요청 인증 |
| Secondary | Refresh Token | 14일 | HttpOnly Cookie | 토큰 갱신 |

## 🎯 핵심 컴포넌트

### 프론트엔드
- **AuthGuard**: 페이지 접근 권한 확인
- **Axios 인터셉터**: 자동 토큰 첨부 및 갱신
- **useLogin Hook**: 로그인 처리 및 상태 관리

### 백엔드
- **JwtAuthenticationFilter**: JWT 토큰 검증
- **AuthController**: 로그인/로그아웃/토큰갱신 API
- **RefreshTokenService**: Refresh Token 관리

## ⚡ 주요 기능

### 1. 자동 토큰 갱신
```typescript
// 401 에러 감지 시 자동 처리
if (errorCode === 'TOKEN_EXPIRED') {
  const newToken = await refreshToken();
  // 원본 요청 재시도
}
```

### 2. Race Condition 방지
```typescript
// 로그인 성공 후 지연 리다이렉트
setTimeout(() => {
  window.location.href = '/dashboard';
}, 500);
```

### 3. Token Rotation
```java
// 기존 토큰 무효화 후 새 토큰 발급
refreshTokenService.invalidateToken(oldToken);
return generateNewTokens(user);
```

## 🛡️ 보안 특징

- **BCrypt 해싱**: 비밀번호 안전 저장
- **JWT 서명**: HMAC SHA-256으로 위조 방지
- **HttpOnly Cookie**: XSS 공격 방지
- **Token Rotation**: 토큰 탈취 시 피해 최소화

## 📋 API 엔드포인트

| 메서드 | 경로 | 설명 | 인증 필요 |
|--------|------|------|-----------|
| POST | /api/auth/login | 로그인 | ❌ |
| POST | /api/auth/refresh | 토큰 갱신 | 🍪 Cookie |
| POST | /api/auth/logout | 로그아웃 | ✅ JWT |
| GET | /api/user/me | 내 정보 조회 | ✅ JWT |

## 🔄 토큰 생명주기

```
1. 로그인 성공
   ↓
2. JWT (5분) + Refresh Token (14일) 발급
   ↓
3. API 요청 시 JWT 자동 첨부
   ↓
4. JWT 만료 시 Refresh Token으로 자동 갱신
   ↓
5. 새 JWT + 새 Refresh Token 발급 (Token Rotation)
   ↓
6. Refresh Token 만료 시 재로그인 필요
```

## ⚙️ 환경 설정

### 백엔드 (application.yml)
```yaml
app:
  jwt:
    secret: ${JWT_SECRET:your-secret-key}
    expiration: 300000  # 5분 (밀리초)
  refresh-token:
    expiration: 1209600000  # 14일 (밀리초)
```

### 프론트엔드 (환경변수)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 🧪 테스트 계정

| 이메일 | 비밀번호 | 역할 |
|--------|----------|------|
| terecal@daum.net | 123456 | ADMIN |
| test@example.com | password123 | USER |

## 📚 관련 문서

- [로그인 프로세스 가이드](./login-process.md) - 상세한 단계별 프로세스
- [API 문서] - 백엔드 API 상세 명세
