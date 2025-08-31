# 🔄 Axios 인터셉터 vs AuthGuard 비교 가이드

## 📋 개요

많은 개발자들이 **Axios 인터셉터**와 **AuthGuard**의 역할이 헷갈린다고 합니다. 둘 다 인증과 관련되어 있지만, **완전히 다른 레벨에서 작동**하며 **상호 보완적인 관계**입니다.

## 🎯 핵심 차이점

### 1. 작동 레벨
```
┌─────────────────────────────────────────┐
│               Browser                    │
├─────────────────────────────────────────┤
│  [Page Level]                           │
│  AuthGuard ← 페이지 렌더링 전 체크        │
│  ├─ 토큰 있나? localStorage 확인          │
│  ├─ 없으면 로그인 페이지로 리다이렉트       │
│  └─ 있으면 페이지 렌더링                 │
├─────────────────────────────────────────┤
│  [HTTP Level]                           │
│  Axios Interceptor ← API 호출 시 체크    │
│  ├─ 요청: 토큰 자동 첨부                 │
│  ├─ 응답: 토큰 만료 시 자동 갱신          │
│  └─ 원본 요청 재시도                    │
└─────────────────────────────────────────┘
```

### 2. 작동 시점

| 시점 | AuthGuard | Axios 인터셉터 |
|------|-----------|---------------|
| **페이지 로드** | ✅ 즉시 체크 | ❌ 동작 안 함 |
| **API 호출** | ❌ 동작 안 함 | ✅ 토큰 첨부 |
| **토큰 만료** | ❌ 감지 못함 | ✅ 자동 갱신 |
| **로그인 성공** | ✅ 이벤트 감지 | ❌ 직접 관여 안 함 |

## 🚀 실제 동작 시나리오

### 시나리오 1: 일반적인 페이지 접근
```
1. 사용자가 /dashboard URL 입력
2. [AuthGuard] localStorage에서 토큰 확인
3. [AuthGuard] 토큰 있음 → 페이지 렌더링 허용
4. 대시보드 컴포넌트 로드
5. 컴포넌트에서 사용자 정보 API 호출
6. [Axios 인터셉터] 요청에 토큰 자동 첨부
7. 서버에서 데이터 반환
8. 대시보드에 데이터 표시
```

### 시나리오 2: 토큰 만료 상황
```
1. 사용자가 /payments 페이지에서 작업 중
2. [AuthGuard] 이미 페이지 로드 시 체크 완료 (5분 전 토큰이 유효했음)
3. 사용자가 "결제 생성" 버튼 클릭 (현재 토큰은 만료됨)
4. 결제 생성 API 호출
5. [Axios 인터셉터] 만료된 토큰을 요청에 첨부
6. 서버에서 401 + TOKEN_EXPIRED 응답
7. [Axios 인터셉터] 토큰 만료 감지 → 자동 갱신
8. [Axios 인터셉터] 새 토큰으로 원본 요청 재시도
9. 결제 생성 성공
10. 사용자는 토큰 만료를 전혀 인지 못함
```

### 시나리오 3: 인증되지 않은 사용자
```
1. 비로그인 사용자가 /admin URL 직접 입력
2. [AuthGuard] localStorage 체크 → 토큰 없음
3. [AuthGuard] 3초 후 /login으로 리다이렉트
4. 로그인 페이지 표시
```

### 시나리오 4: 다른 탭에서 로그아웃
```
탭 A: /dashboard에서 작업 중
탭 B: 설정 페이지에서 로그아웃 클릭

1. [탭 B] 로그아웃 API 호출
2. [탭 B] localStorage에서 토큰 삭제
3. [탭 A] AuthGuard가 storage 이벤트 감지
4. [탭 A] checkAuth() 재실행 → 토큰 없음 확인
5. [탭 A] /login으로 자동 리다이렉트
```

## 🎪 코드로 보는 차이점

### AuthGuard 코드 특징
```typescript
// 페이지 렌더링 레벨에서 동작
export function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // localStorage 직접 체크 (클라이언트 사이드)
    const token = localStorage.getItem("authToken");
    const user = getCurrentUser();
    
    if (token && user) {
      setIsAuthenticated(true); // 페이지 렌더링 허용
    } else {
      router.replace("/login"); // 리다이렉트
    }
  }, []);
  
  // 조건부 렌더링
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
```

### Axios 인터셉터 코드 특징
```typescript
// HTTP 요청/응답 레벨에서 동작
api.interceptors.request.use((config) => {
  // 모든 요청에 토큰 자동 첨부
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    // 토큰 만료 시 자동 처리
    if (error.response?.status === 401 && 
        error.response?.data?.errorCode === 'TOKEN_EXPIRED') {
      
      const newToken = await refreshToken(); // 새 토큰 발급
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return api(error.config); // 원본 요청 재시도
    }
    return Promise.reject(error);
  }
);
```

## 🔧 왜 둘 다 필요한가?

### AuthGuard만 있다면?
```typescript
// ❌ 문제 상황
const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  
  useEffect(() => {
    // AuthGuard가 페이지 로드 시 토큰 체크했지만
    // API 호출 시점에는 토큰이 만료될 수 있음
    fetchPayments().then(setPayments); // 토큰 만료 시 실패
  }, []);
  
  const createPayment = async () => {
    try {
      // 매번 수동으로 토큰 만료 체크 필요
      if (isTokenExpired()) {
        await refreshToken();
      }
      await api.post('/payments', data); // 번거로움
    } catch (error) {
      // 토큰 만료 에러 수동 처리 필요
    }
  };
};
```

### Axios 인터셉터만 있다면?
```typescript
// ❌ 문제 상황
const AdminPage = () => {
  // 인증되지 않은 사용자도 페이지에 접근 가능
  // API 호출 시점에서야 인증 에러 발생
  
  useEffect(() => {
    // 토큰이 없어도 API 호출 시도
    fetchAdminData() // 401 에러 발생
      .catch(() => {
        // 에러 발생 후에야 로그인 페이지로 이동
        window.location.href = '/login';
      });
  }, []);
  
  // 사용자는 빈 페이지를 보다가 갑자기 로그인 페이지로 이동
  // 좋지 않은 사용자 경험
};
```

## ⚡ 최적의 조합 효과

### 1. 빠른 접근 제어 + 자동 토큰 관리
```typescript
// ✅ 최적의 조합
const DashboardPage = () => {
  // AuthGuard가 이미 인증 확인 완료
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Axios 인터셉터가 토큰 관리 자동화
    fetchDashboardData().then(setData); // 토큰 만료 시 자동 갱신
  }, []);
  
  const handleAction = async () => {
    // 개발자는 토큰 관리를 신경 쓰지 않고 비즈니스 로직에 집중
    await createSomething();
  };
};
```

### 2. 사용자 경험 개선
- **즉시 피드백**: AuthGuard가 페이지 접근 즉시 인증 체크
- **끊김 없는 작업**: Axios 인터셉터가 백그라운드에서 토큰 갱신
- **일관된 경험**: 두 시스템이 협력하여 매끄러운 사용자 플로우 제공

## 🛠️ 개발 시 고려사항

### 언제 AuthGuard를 사용할까?
- ✅ 전체 페이지가 인증이 필요한 경우
- ✅ 페이지별로 접근 권한을 제어해야 하는 경우  
- ✅ 로그인 상태에 따라 다른 컴포넌트를 렌더링해야 하는 경우

### 언제 Axios 인터셉터를 사용할까?
- ✅ 모든 API 요청에 토큰을 첨부해야 하는 경우
- ✅ 토큰 만료를 사용자가 인지하지 못하게 처리하고 싶은 경우
- ✅ API 호출 코드를 간단하게 유지하고 싶은 경우

### 사용하지 말아야 할 경우
- ❌ AuthGuard: 공개 페이지나 부분적으로만 인증이 필요한 경우
- ❌ Axios 인터셉터: 인증이 필요 없는 API나 외부 API 호출 시

## 🚨 주의사항

### 1. 중복 체크 방지
```typescript
// ❌ 잘못된 예시 - 중복 체크
const protectedApiCall = async () => {
  // AuthGuard가 이미 체크했는데 또 체크
  if (!localStorage.getItem('authToken')) {
    router.push('/login');
    return;
  }
  
  // Axios 인터셉터가 이미 토큰 첨부하는데 또 첨부
  const token = localStorage.getItem('authToken');
  const response = await api.get('/data', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// ✅ 올바른 예시 - 각자 역할 분담
const protectedApiCall = async () => {
  // AuthGuard가 페이지 접근 제어 담당
  // Axios 인터셉터가 토큰 관리 담당
  const response = await api.get('/data'); // 간단!
};
```

### 2. 상태 동기화
```typescript
// AuthGuard와 Axios 인터셉터 간 상태 동기화 중요
// 로그인 성공 시
const handleLogin = async (credentials) => {
  const { token, user } = await loginApi(credentials);
  
  // localStorage 저장
  localStorage.setItem('authToken', token);
  localStorage.setItem('userInfo', JSON.stringify(user));
  
  // AuthGuard에 알림
  window.dispatchEvent(new Event('loginSuccess'));
  
  // 이제 두 시스템 모두 최신 상태 반영
};
```

## 📚 실무 팁

### 1. 디버깅 시 확인 순서
```
1. AuthGuard 로그 확인 - 페이지 접근 시 인증 체크 성공했나?
2. Network 탭 확인 - API 요청에 토큰이 첨부되었나?
3. 응답 확인 - 서버에서 TOKEN_EXPIRED 에러코드 정확히 반환하나?
4. Axios 인터셉터 로그 확인 - 토큰 갱신 시도했나?
```

### 2. 성능 최적화
```typescript
// AuthGuard는 페이지당 한 번만 체크
// Axios 인터셉터는 요청당 실행
// 불필요한 체크 로직 최소화

// ✅ 좋은 예시
const checkAuth = useMemo(() => {
  return localStorage.getItem('authToken') && getCurrentUser();
}, []); // 한 번만 체크

// ❌ 나쁜 예시  
const checkAuth = () => {
  return localStorage.getItem('authToken') && getCurrentUser();
}; // 매번 체크
```

### 3. 에러 처리 분리
```typescript
// AuthGuard: 페이지 레벨 에러 (리다이렉트)
// Axios 인터셉터: API 레벨 에러 (자동 복구 시도)

// 각각의 책임 영역을 명확히 구분하여
// 유지보수성 향상
```

## 🎯 결론

**Axios 인터셉터**와 **AuthGuard**는 다음과 같이 협력합니다:

1. **AuthGuard**: "이 페이지에 들어올 자격이 있나?" (페이지 접근 제어)
2. **Axios 인터셉터**: "API 요청할 때 토큰 관리는 내가 알아서 할게" (HTTP 레벨 인증)

두 시스템이 함께 작동하여 **개발자는 비즈니스 로직에 집중**하고, **사용자는 끊김 없는 경험**을 할 수 있게 됩니다. 🚀
