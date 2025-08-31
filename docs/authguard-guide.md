# 🛡️ AuthGuard 가이드

## 📍 개요

AuthGuard는 **페이지 렌더링 레벨에서 작동하는 인증 컴포넌트**입니다. 사용자가 페이지에 접근할 때 인증 상태를 확인하고, 인증되지 않은 사용자를 로그인 페이지로 리다이렉트하는 역할을 담당합니다.

## 🎯 핵심 역할

### 1. 페이지 접근 제어
- **목적**: 보호된 페이지에 인증된 사용자만 접근하도록 제한
- **작동 시점**: React 컴포넌트 렌더링 전
- **처리 방식**: localStorage의 토큰과 사용자 정보 확인

### 2. 인증 상태 실시간 감지
- **로그인 성공 이벤트**: `loginSuccess` 커스텀 이벤트 리스닝
- **다중 탭 동기화**: `storage` 이벤트로 다른 탭의 로그인/로그아웃 감지
- **초기 인증 체크**: 페이지 로드 시 인증 상태 확인

### 3. 사용자 경험 최적화
- **로딩 상태**: 인증 확인 중 로딩 스피너 표시
- **조건부 렌더링**: 인증된 경우에만 자식 컴포넌트 렌더링
- **자동 리다이렉트**: 인증 실패 시 로그인 페이지로 이동

## 🏗️ 구조 및 구현

### 현재 사용 중인 AuthGuard (`/src/shared/components/AuthGuard.tsx`)

```typescript
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // 공개 페이지는 인증 체크하지 않음
      if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) {
        setIsChecking(false);
        setIsAuthenticated(true);
        return;
      }

      const token = localStorage.getItem("authToken");
      const user = getCurrentUser();

      if (token && user) {
        console.log("✅ Auth check passed");
        setIsAuthenticated(true);
        setIsChecking(false);
      } else {
        console.log("❌ Auth check failed");
        setIsAuthenticated(false);
        setIsChecking(false);
        
        // 3초 지연 후 리다이렉트 (디버깅용)
        setTimeout(() => {
          router.replace("/login");
        }, 3000);
      }
    };

    // 초기 체크
    const timeoutId = setTimeout(() => {
      checkAuth();
    }, 200);

    // 이벤트 리스너
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "userInfo") {
        checkAuth();
      }
    };

    const handleLoginSuccess = () => {
      clearTimeout(timeoutId);
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("loginSuccess", handleLoginSuccess);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginSuccess", handleLoginSuccess);
    };
  }, [pathname, router]);

  // 로딩 중
  if (isChecking) {
    return <LoadingSpinner />;
  }

  // 인증 실패
  if (!isAuthenticated) {
    return null;
  }

  // 인증 성공
  return <>{children}</>;
}
```

### 조건부 AuthGuard (`/src/shared/lib/conditional-auth-guard.tsx`)

```typescript
const PUBLIC_ROUTES = ['/', '/login', '/register'];

export function ConditionalAuthGuard({ children }: ConditionalAuthGuardProps) {
  const pathname = usePathname();
  
  // 공개 페이지는 AuthGuard 없이 렌더링
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }
  
  // 보호된 페이지는 AuthGuard로 감싸기
  return <AuthGuard>{children}</AuthGuard>;
}
```

## 🔄 작동 과정

### 일반적인 페이지 접근 플로우
```
1. 사용자가 페이지 URL 입력/클릭
2. Next.js 라우팅 시작
3. ConditionalAuthGuard 실행:
   ├─ 공개 페이지인가? → YES: 바로 렌더링
   └─ 보호된 페이지인가? → YES: AuthGuard 실행
4. AuthGuard 인증 체크:
   ├─ localStorage에 토큰 있는가?
   ├─ getCurrentUser()로 사용자 정보 있는가?
   └─ 모두 있으면 → 자식 컴포넌트 렌더링
5. 페이지 내용 표시
```

### 인증 실패 시 플로우
```
1. AuthGuard 인증 체크 실행
2. 토큰 또는 사용자 정보 없음 감지
3. 인증 실패 로그 출력
4. 3초 대기 (디버깅용)
5. router.replace("/login") 실행
6. 로그인 페이지로 리다이렉트
```

### 로그인 성공 후 플로우
```
1. 로그인 API 성공
2. localStorage에 토큰/사용자 정보 저장
3. 커스텀 이벤트 발생: window.dispatchEvent(new Event('loginSuccess'))
4. AuthGuard가 이벤트 감지
5. checkAuth() 재실행
6. 인증 상태 업데이트 → 보호된 페이지 렌더링
```

## 🎪 사용 방법

### 1. 전역 적용 (현재 방식)
```typescript
// /src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <ConditionalAuthGuard>
            <AppHeader />
            {children}
          </ConditionalAuthGuard>
        </QueryProvider>
      </body>
    </html>
  );
}
```

### 2. 개별 페이지 적용
```typescript
// /src/app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>보호된 대시보드 내용</div>
    </AuthGuard>
  );
}
```

### 3. 조건부 적용
```typescript
// 특정 조건에서만 인증 체크
export function ConditionalProtection({ children, requireAuth }) {
  if (requireAuth) {
    return <AuthGuard>{children}</AuthGuard>;
  }
  return <>{children}</>;
}
```

## ⚡ 특징 및 장점

### 1. 클라이언트 사이드 보호
- React 컴포넌트 레벨에서 즉시 접근 제한
- 브라우저에서 실시간 인증 상태 확인

### 2. 이벤트 기반 상태 동기화
- 로그인 성공 시 즉시 상태 업데이트
- 다중 탭 간 인증 상태 동기화

### 3. 사용자 친화적 경험
- 로딩 스피너로 체크 중 상태 표시
- 부드러운 페이지 전환 (로딩 → 인증 → 콘텐츠)

### 4. 개발자 친화적
- 명확한 콘솔 로그로 디버깅 지원
- 조건부 적용으로 유연한 사용

## 🚨 제한사항

### 1. 클라이언트 사이드 전용
- 서버 사이드에서는 작동하지 않음
- SEO 및 초기 로딩 시 보안 취약점 존재

### 2. localStorage 의존성
- localStorage 접근 불가 시 인증 체크 실패
- 브라우저 설정에 따라 동작하지 않을 수 있음

### 3. Race Condition 가능성
- 로그인 직후 빠른 페이지 전환 시 인증 상태 불일치 가능
- 현재는 200ms 지연과 이벤트 리스너로 완화

### 4. 보안 한계
- 클라이언트에서만 체크하므로 우회 가능
- 실제 보안은 서버 사이드에서 JWT 검증으로 담보

## 🛠️ 설정 및 커스터마이징

### 공개 경로 설정
```typescript
// /src/shared/lib/conditional-auth-guard.tsx
const PUBLIC_ROUTES = [
  '/',           // 홈페이지
  '/login',      // 로그인
  '/register',   // 회원가입
  '/docs',       // 문서 (선택적)
];
```

### 리다이렉트 경로 변경
```typescript
// 기본 로그인 페이지가 아닌 다른 페이지로 리다이렉트
setTimeout(() => {
  router.replace("/auth/signin"); // 커스텀 로그인 페이지
}, 3000);
```

### 로딩 컴포넌트 커스터마이징
```typescript
// 커스텀 로딩 컴포넌트
if (isChecking) {
  return <CustomLoadingSpinner message="인증 확인 중..." />;
}
```

## 🔗 연관 컴포넌트

### 1. Axios 인터셉터
- **관계**: 독립적이지만 상호 보완
- **차이점**: AuthGuard는 페이지 접근, Axios는 API 호출

### 2. JWT 유틸리티
- **파일**: `/src/shared/lib/jwt-utils.ts`
- **사용**: `getCurrentUser()` 함수로 사용자 정보 확인

### 3. 로그인 API
- **파일**: `/src/features/auth/api/login.ts`
- **연결**: 로그인 성공 시 `loginSuccess` 이벤트 발생

## 📚 디버깅 가이드

### 일반적인 문제들

#### 1. 무한 리다이렉트
```
증상: 로그인 페이지와 보호된 페이지 간 무한 리다이렉트
원인: 로그인 페이지도 AuthGuard로 보호되어 있음
해결: ConditionalAuthGuard에서 공개 경로에 '/login' 포함 확인
```

#### 2. 로그인 후에도 계속 로그인 페이지로 이동
```
증상: 로그인 성공 후에도 인증 실패로 처리됨
원인: localStorage 저장과 AuthGuard 체크 간 타이밍 이슈
해결: loginSuccess 이벤트가 제대로 발생하는지 확인
```

#### 3. 다른 탭에서 로그아웃 시 동기화 안 됨
```
증상: 한 탭에서 로그아웃해도 다른 탭은 계속 로그인 상태
원인: storage 이벤트 리스너 문제
해결: handleStorageChange 함수가 제대로 동작하는지 확인
```

### 디버깅 로그 확인
```typescript
// 개발 환경에서 출력되는 로그들
"✅ Auth check passed: { user: 'test@example.com', token: '...' }"
"❌ Auth check failed: { token: 'missing', user: 'missing' }"
"📧 Login success event received, rechecking auth"
"🔄 Storage changed, re-checking auth"
```

## 🚀 최적화 및 개선 방안

### 1. SSR 지원
Next.js의 서버 사이드에서도 인증 체크를 수행할 수 있도록 개선:
```typescript
// middleware.ts에서 서버 사이드 인증 체크
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  if (!token && !PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

### 2. 권한 기반 라우팅
사용자 역할에 따른 페이지 접근 제어:
```typescript
// 역할 기반 AuthGuard
export function RoleBasedAuthGuard({ children, requiredRole }) {
  const user = getCurrentUser();
  if (user?.role !== requiredRole) {
    return <UnauthorizedPage />;
  }
  return <>{children}</>;
}
```

### 3. 토큰 만료 예측
JWT 토큰 만료 시간을 미리 확인하여 만료되기 전에 미리 갱신:
```typescript
const checkTokenExpiry = () => {
  const payload = getTokenPayload();
  if (payload && payload.exp * 1000 - Date.now() < 60000) { // 1분 전
    // 미리 토큰 갱신
  }
};
```

## 🎭 Axios 인터셉터와의 차이점

| 구분 | AuthGuard | Axios 인터셉터 |
|------|-----------|---------------|
| **작동 레벨** | 페이지/컴포넌트 렌더링 | HTTP 요청/응답 |
| **작동 시점** | 페이지 접근 시 | API 호출 시 |
| **주요 목적** | 페이지 접근 제어 | 토큰 자동 관리 |
| **인증 체크** | localStorage 기반 | 서버 응답 기반 |
| **사용자 경험** | 페이지 리다이렉트 | 백그라운드 토큰 갱신 |
| **보안 수준** | 클라이언트 사이드만 | 서버 사이드 검증 |

두 시스템은 **상호 보완적**으로 작동하여 완전한 인증 시스템을 구성합니다.
