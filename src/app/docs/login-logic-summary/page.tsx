import React from 'react';

const CodeBlock = ({ code, language }: { code: string; language: string }) => (
  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
    <pre className="text-sm text-gray-100">
      <code>{code}</code>
    </pre>
  </div>
);

export default function LoginLogicSummaryPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          로그인 시스템 핵심 로직 5단계
        </h1>
        <p className="text-xl text-gray-600">
          복잡해 보이는 로그인 시스템도 결국 5가지 핵심 로직으로 정리됩니다.
        </p>
      </div>

      {/* 핵심 요약 섹션 */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">🎯 핵심 요약</h2>
        
        <div className="space-y-8">
          {/* 1단계: 로그인 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold text-blue-900 mb-3">
              1️⃣ 로그인: 토큰 획득하기
            </h3>
            <p className="text-blue-800 text-lg mb-4">
              <strong>로그인 버튼 클릭 → API 요청 → 백엔드 응답 → 토큰을 로컬스토리지에 저장</strong>
            </p>
            <CodeBlock
              code={`// 📍 위치: src/features/auth/hooks/useLogin.ts
const handleLogin = async (credentials: LoginRequest) => {
  const response = await api.post('/api/auth/login', credentials);
  
  // 토큰을 로컬스토리지에 저장
  localStorage.setItem('authToken', response.data.token);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
};`}
              language="typescript"
            />
          </div>

          {/* 2단계: 인증 */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold text-green-900 mb-3">
              2️⃣ 인증: 토큰 실어 보내기
            </h3>
            <p className="text-green-800 text-lg mb-4">
              <strong>API 요청 날릴 때 로그인 사용자 증명용으로 토큰 싣기</strong>
            </p>
            <CodeBlock
              code={`// 📍 위치: src/shared/lib/axios.ts (Request Interceptor)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  
  return config;
});`}
              language="typescript"
            />
          </div>

          {/* 3단계: 갱신 */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold text-purple-900 mb-3">
              3️⃣ 갱신: 토큰 만료 시 자동 재발급
            </h3>
            <p className="text-purple-800 text-lg mb-4">
              <strong>API 응답 받을 때 토큰 만료 응답 있을 시 토큰 재발급 요청</strong>
            </p>
            <CodeBlock
              code={`// 📍 위치: src/shared/lib/axios.ts (Response Interceptor)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // 토큰 재발급 시도
      const newToken = await refreshToken();
      
      if (newToken) {
        originalRequest.headers.Authorization = \`Bearer \${newToken}\`;
        return api.request(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);`}
              language="typescript"
            />
          </div>

          {/* 4단계: 보호 */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold text-orange-900 mb-3">
              4️⃣ 보호: 페이지 접근 제어
            </h3>
            <p className="text-orange-800 text-lg mb-4">
              <strong>로그인 상태에 따른 페이지 접근 권한 관리</strong>
            </p>
            <CodeBlock
              code={`// 📍 위치: src/features/auth/components/AuthGuard.tsx
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuthed, setIsAuthed] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = getCurrentUser();
    
    if (!token || !user) {
      router.push('/login');
      return;
    }
    
    setIsAuthed(true);
  }, []);
  
  return isAuthed ? <>{children}</> : <LoadingSpinner />;
};`}
              language="typescript"
            />
          </div>

          {/* 5단계: 중복 방지 */}
          <div className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold text-pink-900 mb-3">
              5️⃣ 중복 방지: 동시 재발급 요청 방지
            </h3>
            <p className="text-pink-800 text-lg mb-4">
              <strong>여러 API가 동시에 401을 받아도 토큰 재발급 요청은 한 번만 실행</strong>
            </p>
            <CodeBlock
              code={`// 📍 위치: src/features/auth/api/refresh.ts
let refreshPromise: Promise<string> | null = null;

export async function refreshToken(): Promise<string> {
  // 이미 재발급 요청이 진행 중이면 그 Promise를 재사용
  if (refreshPromise) {
    console.log("🔄 Reusing existing refresh promise");
    return refreshPromise;
  }

  console.log("🚀 Starting new refresh token request");
  refreshPromise = refreshTokenApi()
    .then((newToken) => {
      localStorage.setItem("authToken", newToken);
      return newToken;
    })
    .finally(() => {
      refreshPromise = null; // 완료되면 초기화
    });

  return refreshPromise;
}`}
              language="typescript"
            />
          </div>
        </div>
      </div>

      {/* 5번째 단계 중요성 */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">🎯 5번째 단계가 중요한 이유</h2>
        <div className="bg-pink-50 border border-pink-200 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-pink-900 mb-4">문제 상황</h3>
          <p className="text-pink-800 mb-4">사용자가 여러 탭에서 동시에 API 요청을 했는데 모든 토큰이 만료된 경우:</p>
          <ul className="list-decimal list-inside space-y-2 text-pink-800">
            <li>탭 A: <code>/api/users/me</code> 요청 → 401 응답 → 토큰 재발급 시작</li>
            <li>탭 B: <code>/api/posts/list</code> 요청 → 401 응답 → 토큰 재발급 시작</li>
            <li>탭 C: <code>/api/notifications</code> 요청 → 401 응답 → 토큰 재발급 시작</li>
          </ul>
        </div>
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-green-900 mb-4">✅ 해결</h3>
          <p className="text-green-800 mb-4"><code>refreshPromise</code> 변수로 진행 중인 재발급 요청을 공유:</p>
          <ul className="list-disc list-inside space-y-2 text-green-800">
            <li>첫 번째 요청만 실제 재발급 API 호출</li>
            <li>나머지는 같은 Promise 재사용</li>
            <li>모든 요청이 새 토큰을 받아서 원래 요청 재시도</li>
          </ul>
        </div>
      </div>

      {/* 범용성 섹션 */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">🌍 범용성: 어떤 백엔드든 동일한 패턴</h2>
        <p className="text-lg text-gray-700 mb-6">
          이 5단계 패턴은 백엔드 기술 스택에 관계없이 거의 동일하게 적용됩니다:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* NestJS */}
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-red-900 mb-4">🔥 NestJS + TypeScript</h3>
            <CodeBlock
              code={`// 백엔드 (NestJS)
@Post('/auth/login')
async login(@Body() loginDto: LoginDto) {
  const tokens = await this.authService.generateTokens(user);
  return { token: tokens.accessToken };
}`}
              language="typescript"
            />
          </div>

          {/* Golang */}
          <div className="bg-cyan-50 border border-cyan-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-cyan-900 mb-4">🚀 Golang + Gin</h3>
            <CodeBlock
              code={`// 백엔드 (Golang)
func Login(c *gin.Context) {
    token := generateJWT(user)
    c.JSON(200, gin.H{"token": token})
}`}
              language="go"
            />
          </div>

          {/* Python */}
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-900 mb-4">🐍 Python + FastAPI</h3>
            <CodeBlock
              code={`# 백엔드 (FastAPI)
@app.post("/auth/login")
async def login(login_data: LoginSchema):
    token = create_access_token(user)
    return {"token": token}`}
              language="python"
            />
          </div>

          {/* Java */}
          <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-orange-900 mb-4">☕ Java + Spring Boot</h3>
            <CodeBlock
              code={`// 백엔드 (Spring Boot)
@PostMapping("/auth/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    String token = jwtUtil.generateToken(user);
    return ResponseEntity.ok(new LoginResponse(token));
}`}
              language="java"
            />
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800 font-medium">
            💡 <strong>핵심</strong>: 백엔드가 JWT 토큰만 표준적으로 발급하면, 프론트엔드는 항상 같은 5단계 패턴으로 처리 가능합니다!
          </p>
        </div>
      </div>

      {/* 요약 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">📝 핵심 포인트</h2>
        <div className="text-lg text-gray-700 mb-6">
          <p className="mb-4">이 5단계가 로그인 시스템의 전부입니다:</p>
          <ol className="list-decimal list-inside space-y-2 mb-6">
            <li><strong>로그인</strong> → 토큰 저장</li>
            <li><strong>인증</strong> → API 요청 시 토큰 첨부</li>
            <li><strong>갱신</strong> → 토큰 만료 시 자동 재발급</li>
            <li><strong>보호</strong> → 페이지 접근 권한 관리</li>
            <li><strong>중복 방지</strong> → 동시 재발급 요청 방지</li>
          </ol>
          <div className="bg-pink-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-pink-900 mb-2">💡 특히 5번째가 중요한 이유</h4>
            <ul className="list-disc list-inside space-y-1 text-pink-800">
              <li><strong>성능</strong>: 불필요한 중복 API 호출 방지</li>
              <li><strong>안정성</strong>: 동시 요청 환경에서도 안전한 토큰 관리</li>
              <li><strong>사용자 경험</strong>: 여러 탭에서 동시 작업 시에도 매끄러운 동작</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
