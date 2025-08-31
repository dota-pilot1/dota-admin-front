# 🚀 Axios 인터셉터 가이드

## 📍 개요

Axios 인터셉터는 **HTTP 요청/응답 레벨에서 작동하는 미들웨어**입니다. API 호출 시 토큰을 자동으로 첨부하고, 토큰 만료 에러를 감지하여 자동으로 토큰을 갱신하는 역할을 담당합니다.

## 🎯 핵심 역할

### 1. 요청 인터셉터 (Request Interceptor)
- **목적**: 모든 API 요청에 JWT 토큰을 자동으로 첨부
- **작동 시점**: HTTP 요청이 서버로 전송되기 직전
- **처리 내용**: localStorage에서 `authToken`을 읽어 `Authorization` 헤더에 추가

```typescript
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
```

### 2. 응답 인터셉터 (Response Interceptor)
- **목적**: 토큰 만료 에러를 감지하고 자동으로 토큰 갱신
- **작동 시점**: 서버로부터 응답을 받은 직후
- **처리 조건**: `401 상태코드` + `TOKEN_EXPIRED` 에러코드

```typescript
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const errorData = error.response?.data;
        const status = error.response?.status;
        
        // 401 에러이고 TOKEN_EXPIRED인 경우에만 refresh 시도
        if (status === 401 && 
            errorData?.errorCode === 'TOKEN_EXPIRED' && 
            !originalRequest._retry && 
            !originalRequest.url?.includes('/auth/refresh')) {
            
            originalRequest._retry = true;
            
            try {
                const { refreshToken } = await import("@/features/auth/api/refresh");
                const newToken = await refreshToken();
                
                // 새 토큰으로 원본 요청 재시도
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);
```

## 🔄 작동 과정

### 일반적인 API 요청 플로우
```
1. API 함수 호출 (예: fetchUserData())
2. Request Interceptor 실행 → JWT 토큰 헤더 추가
3. 서버로 HTTP 요청 전송
4. 서버 응답 수신
5. Response Interceptor 실행 → 성공 시 데이터 반환
```

### 토큰 만료 시 플로우
```
1. API 함수 호출 (예: fetchUserData())
2. Request Interceptor 실행 → 만료된 JWT 토큰 헤더 추가
3. 서버로 HTTP 요청 전송
4. 서버 응답: 401 + TOKEN_EXPIRED
5. Response Interceptor 실행:
   ├─ 토큰 만료 감지
   ├─ Refresh Token으로 새 토큰 발급
   ├─ 새 토큰으로 원본 요청 재시도
   └─ 성공 시 데이터 반환
```

## 🎪 실제 사용 예시

### 사용자 정보 조회 API
```typescript
// /src/features/user/api/get-user.ts
export async function fetchUserData() {
    // axios 인터셉터가 자동으로 토큰을 첨부하고 만료 시 갱신
    const response = await api.get('/api/user/me');
    return response.data;
}
```

### 결제 생성 API
```typescript
// /src/features/payment/api/create-payment.ts
export async function createPayment(paymentData: PaymentRequest) {
    // 토큰이 만료되었다면 자동으로 갱신하고 재시도
    const response = await api.post('/api/payments', paymentData);
    return response.data;
}
```

## ⚡ 특징 및 장점

### 1. 투명성 (Transparency)
- API 함수들은 토큰 관리를 신경 쓸 필요 없음
- 기존 API 코드 수정 없이 토큰 관리 로직 적용

### 2. 자동 토큰 갱신
- 토큰 만료를 사용자가 느끼지 못하게 백그라운드에서 처리
- 원본 요청을 자동으로 재시도하여 끊김 없는 사용자 경험

### 3. 중복 요청 방지
- `_retry` 플래그로 무한 루프 방지
- refresh API 호출 시에는 인터셉터 동작 안 함

### 4. 에러 처리 분리
- 토큰 관련 에러는 인터셉터에서 처리
- 비즈니스 로직 에러는 각 API 함수에서 처리

## 🚨 제한사항

### 1. localStorage 의존성
- 브라우저 환경에서만 동작 (SSR 시 토큰 첨부 안 됨)
- localStorage 접근 불가 시 토큰 첨부 불가

### 2. 네트워크 레벨 에러
- 네트워크 연결 실패 시에는 동작하지 않음
- 서버가 응답하지 않는 경우 토큰 갱신 불가

### 3. Refresh Token 만료
- Refresh Token도 만료된 경우 자동 갱신 실패
- 이 경우 사용자가 수동으로 재로그인 필요

## 🛠️ 설정 및 환경

### 환경 변수
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Axios 인스턴스 설정
```typescript
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true, // refresh_token 쿠키 포함
});
```

## 🔗 연관 컴포넌트

### 1. AuthGuard
- **관계**: 독립적이지만 상호 보완
- **차이점**: AuthGuard는 페이지 레벨, Axios는 API 레벨

### 2. Refresh Token API
- **파일**: `/src/features/auth/api/refresh.ts`
- **역할**: 실제 토큰 갱신 로직 수행

### 3. JWT 유틸리티
- **파일**: `/src/shared/lib/jwt-utils.ts`
- **역할**: 토큰 디코딩 및 유효성 검사

## 📚 디버깅 팁

### 개발 환경에서의 로그
```typescript
if (process.env.NODE_ENV === 'development') {
    console.log("⏰ Token expired, attempting refresh");
    console.log("✅ Token refresh successful, retrying request");
    console.log("❌ Token refresh failed");
}
```

### 확인해야 할 사항
1. `localStorage`에 `authToken`이 있는지
2. 서버에서 `TOKEN_EXPIRED` 에러코드를 정확히 반환하는지
3. Refresh Token 쿠키가 브라우저에 설정되어 있는지
4. `withCredentials: true` 설정이 되어 있는지

## 🚀 최적화 방안

### 1. 토큰 갱신 중 중복 요청 처리
현재는 각 요청마다 개별적으로 토큰 갱신을 시도합니다. 여러 요청이 동시에 들어올 경우 토큰 갱신 요청이 중복될 수 있습니다.

### 2. 토큰 만료 예측
JWT 토큰의 만료 시간을 미리 확인하여 만료되기 전에 미리 갱신하는 방식도 고려할 수 있습니다.

### 3. 에러 상태 관리
토큰 갱신 실패 시 사용자에게 적절한 피드백을 제공하는 전역 에러 상태 관리 시스템 도입을 고려할 수 있습니다.
