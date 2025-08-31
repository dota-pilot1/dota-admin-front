# 🔐 로그인 프로세스 가이드

## 📋 개요

이 문서는 로그인 성공/실패 시 시스템에서 실행되는 단계별 프로세스를 상세히 설명합니다.

---

## ✅ 로그인 성공 프로세스

### 1단계: 사용자 입력 및 요청 전송
```typescript
// 사용자가 이메일/비밀번호 입력 또는 테스트 계정 선택
POST /api/auth/login
{
  "email": "terecal@daum.net",
  "password": "123456"
}
```

### 2단계: 백엔드 인증 처리
```java
// AuthController.login()
1. 요청 데이터 수신 및 검증
2. 사용자 존재 확인 (UserService.findByEmail())
3. 비밀번호 검증 (BCrypt.checkpw())
4. JWT 토큰 생성 (JwtUtil.generateToken()) - 5분 만료
5. Refresh Token 생성 및 DB 저장 - 14일 만료
6. HttpOnly 쿠키에 Refresh Token 설정
```

### 3단계: 성공 응답 반환
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "id": 1,
  "username": "테스트관리자",
  "email": "terecal@daum.net", 
  "role": "ADMIN",
  "expiresIn": 300
}
```

### 4단계: 프론트엔드 토큰 저장
```typescript
// useLogin.ts onSuccess
1. localStorage에 JWT 토큰 저장
   localStorage.setItem('authToken', data.token)

2. localStorage에 사용자 정보 저장
   localStorage.setItem('userInfo', JSON.stringify({
     id: data.id,
     username: data.username,
     email: data.email,
     role: data.role
   }))

3. 커스텀 이벤트 발생 (AuthGuard 알림용)
   window.dispatchEvent(new CustomEvent('loginSuccess'))
```

### 5단계: 페이지 리다이렉트
```typescript
// Race Condition 방지를 위한 지연 실행
setTimeout(() => {
  window.location.href = '/dashboard';
}, 500);
```

### 6단계: AuthGuard 인증 확인
```typescript
// AuthGuard에서 이벤트 감지
1. loginSuccess 이벤트 수신
2. localStorage에서 토큰 존재 확인
3. 인증 상태를 true로 설정
4. Dashboard 페이지 렌더링 허용
```

### 7단계: API 요청 시 자동 인증
```typescript
// Axios 인터셉터가 모든 API 요청에 토큰 자동 첨부
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## ❌ 로그인 실패 프로세스

### 실패 케이스 1: 사용자 미존재

#### 1단계: 백엔드 검증 실패
```java
// AuthController.login()
1. 요청 데이터 수신
2. UserService.findByEmail() → Optional.empty()
3. BadCredentialsException 발생
```

#### 2단계: 에러 응답
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errorCode": "AUTHENTICATION_FAILED",
  "timestamp": "2025-01-09T10:30:45"
}
```

#### 3단계: 프론트엔드 에러 처리
```typescript
// useLogin.ts onError
1. 에러 상태 설정
2. 사용자에게 에러 메시지 표시
3. 로그인 폼 초기화 (선택사항)
```

### 실패 케이스 2: 비밀번호 불일치

#### 1단계: 백엔드 검증 실패
```java
// AuthController.login()
1. 사용자 존재 확인 ✓
2. BCrypt.checkpw(password, hashedPassword) → false
3. BadCredentialsException 발생
```

#### 2단계: 동일한 에러 응답 (보안상 구체적 이유 숨김)
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errorCode": "AUTHENTICATION_FAILED"
}
```

### 실패 케이스 3: 서버 에러

#### 1단계: 예상치 못한 에러 발생
```java
// 데이터베이스 연결 실패, 기타 시스템 에러
Exception e → GlobalExceptionHandler
```

#### 2단계: 일반 에러 응답
```json
{
  "success": false,
  "message": "Internal server error",
  "errorCode": "INTERNAL_SERVER_ERROR"
}
```

---

## 🔄 토큰 갱신 프로세스

### 자동 갱신 (API 요청 시 401 에러 발생)

#### 1단계: 토큰 만료 감지
```typescript
// Axios 인터셉터에서 401 응답 감지
if (error.response?.status === 401 && 
    error.response?.data?.errorCode === 'TOKEN_EXPIRED') {
  // 토큰 갱신 시도
}
```

#### 2단계: Refresh Token으로 새 토큰 요청
```typescript
// refresh.ts
POST /api/auth/refresh
// HttpOnly 쿠키의 refresh_token 자동 전송

응답:
{
  "accessToken": "새로운JWT토큰",
  "expiresIn": 300
}
```

#### 3단계: 새 토큰으로 원본 요청 재시도
```typescript
// 새 토큰을 헤더에 설정하고 원래 요청 재실행
originalRequest.headers.Authorization = `Bearer ${newToken}`;
return api(originalRequest);
```

#### 4단계: Refresh Token 갱신 실패 시
```typescript
// refresh.ts
1. localStorage 토큰 삭제
2. /login 페이지로 강제 리다이렉트
3. 사용자에게 재로그인 요청
```

---

## 🛡️ 보안 검증 단계

### JWT 토큰 검증 프로세스
```java
// JwtAuthenticationFilter
1. Authorization 헤더에서 토큰 추출
2. 토큰 만료 확인 (jwtUtil.isTokenExpired())
   → 만료 시: {"errorCode": "TOKEN_EXPIRED"} 응답
3. 토큰 서명 검증 (jwtUtil.validateToken())
   → 무효 시: 일반 401 응답
4. 토큰에서 이메일 추출
5. 데이터베이스에서 사용자 정보 조회
6. 사용자 권한 정보 로드
7. SecurityContext에 인증 정보 설정
```

### Refresh Token 검증 프로세스
```java
// RefreshTokenService
1. 쿠키에서 refresh_token 추출
2. 토큰 해시값으로 DB 조회
3. 만료 시간 확인
4. 사용자 정보 확인
5. 기존 토큰 무효화 (Token Rotation)
6. 새 Access Token 및 Refresh Token 생성
```

---

## 📊 상태 흐름도

```
[로그인 폼] 
    ↓ 사용자 입력
[API 요청]
    ↓
[백엔드 검증] ── 실패 → [에러 응답] → [에러 표시]
    ↓ 성공
[토큰 생성]
    ↓
[토큰 저장] ── Race Condition 방지 지연
    ↓
[페이지 이동]
    ↓
[AuthGuard 확인] ── 실패 → [로그인 페이지]
    ↓ 성공
[Dashboard 렌더링]
    ↓
[API 요청 시 자동 토큰 첨부]
    ↓
[토큰 만료 시 자동 갱신]
```

---

## 🔧 주요 특징

### 1. Race Condition 방지
- 로그인 성공 후 500ms 지연 리다이렉트
- 커스텀 이벤트로 상태 동기화

### 2. 자동 토큰 갱신
- Axios 인터셉터가 401 에러 감지
- TOKEN_EXPIRED 시에만 갱신 시도
- Token Rotation으로 보안 강화

### 3. 일관된 에러 처리
- 표준화된 ErrorResponse DTO 사용
- 명확한 에러 코드로 구분 처리

### 4. 보안 설계
- HttpOnly 쿠키로 Refresh Token 보호
- BCrypt 해싱으로 비밀번호 보안
- JWT 서명 검증으로 위조 방지
