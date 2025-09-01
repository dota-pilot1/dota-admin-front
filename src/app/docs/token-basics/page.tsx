"use client";

import React, { useState } from 'react';
import { Copy, Check, Clock, Shield, RefreshCw, AlertCircle } from 'lucide-react';

const CodeBlock = ({ children, title, language = "javascript" }: { children: string, title?: string, language?: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <div className="relative group">
      {title && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-medium rounded-t-lg border-b border-gray-600">
          {title}
        </div>
      )}
      <div className="relative">
        <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto ${title ? 'rounded-t-none' : ''} rounded-lg`}>
          <code className={`language-${language}`}>{children.trim()}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
          title="클립보드에 복사"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-300" />
          )}
        </button>
      </div>
    </div>
  );
};

const ExampleBox = ({ title, icon: Icon, children, color = "blue" }: { 
  title: string, 
  icon: React.ComponentType<{className?: string}>, 
  children: React.ReactNode, 
  color?: "blue" | "green" | "orange" | "red"
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    red: "bg-red-50 border-red-200 text-red-800"
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5" />
        <h4 className="font-semibold">{title}</h4>
      </div>
      {children}
    </div>
  );
};

export default function TokenBasicsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🔑 토큰 기초부터 차근차근 이해하기</h1>
        <p className="text-lg text-gray-600">백엔드가 토큰 만료를 어떻게 판단하고, 프론트엔드에서는 왜 복잡한 로직이 필요한지 쉽게 설명합니다</p>
      </div>

      {/* 1. 기본 개념 */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6">🎯 1단계: 토큰이 뭐고 왜 만료되나요?</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <ExampleBox title="토큰이란?" icon={Shield} color="blue">
            <p className="mb-2">토큰은 <strong>&ldquo;출입증&rdquo;</strong>과 같습니다.</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>회사에 들어갈 때 보여주는 사원증</li>
              <li>API를 호출할 때 &ldquo;나는 로그인된 사용자야!&rdquo;라고 증명</li>
              <li>만료일이 있어서 오래된 건 무효</li>
            </ul>
          </ExampleBox>

          <ExampleBox title="왜 5분만 유효한가요?" icon={Clock} color="orange">
            <p className="mb-2">보안을 위해서 <strong>짧게</strong> 설정했습니다.</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>토큰이 해킹당해도 5분 후엔 자동 무효</li>
              <li>사용자는 5분마다 재로그인 안 해도 됨</li>
              <li>Refresh Token이 자동으로 연장해줌</li>
            </ul>
          </ExampleBox>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold mb-3">🕐 현재 설정된 시간</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Access Token (일반 API용)</strong>
              <div className="bg-white p-2 rounded border mt-1">
                ⏰ <strong>5분</strong> 동안만 유효
              </div>
            </div>
            <div>
              <strong>Refresh Token (갱신용)</strong>
              <div className="bg-white p-2 rounded border mt-1">
                ⏰ <strong>14일</strong> 동안 유효
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 백엔드가 만료를 판단하는 방법 */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6">🔍 2단계: 백엔드는 어떻게 &ldquo;만료됐다&rdquo;고 판단하나요?</h2>
        
        <div className="space-y-6">
          <ExampleBox title="토큰 안에는 만료 시간이 들어있어요" icon={Clock} color="blue">
            <p className="mb-3">JWT 토큰을 열어보면 이런 정보가 들어있습니다:</p>
            <CodeBlock title="토큰 내부 정보 (JWT Payload)" language="json">
{`{
  "sub": "user@example.com",     // 사용자 이메일
  "role": "USER",                // 사용자 권한
  "iat": 1725174000,            // 발급 시간 (2024-09-01 12:00:00)
  "exp": 1725174300             // 만료 시간 (2024-09-01 12:05:00) <- 이게 핵심!
}`}
            </CodeBlock>
          </ExampleBox>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="font-bold mb-4">🤖 백엔드의 판단 과정</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold">프론트엔드가 API 요청</h4>
                  <p className="text-gray-600">Header에 &ldquo;Bearer 토큰값&rdquo; 포함해서 요청</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold">백엔드가 토큰을 해독</h4>
                  <p className="text-gray-600">JWT 라이브러리로 토큰 내부 정보를 읽음</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold">현재 시간과 비교</h4>
                  <div className="bg-gray-50 p-3 rounded mt-2">
                    <code className="text-sm">
                      현재시간(12:06) {'>'}= 만료시간(12:05) → ❌ 만료됨!
                    </code>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h4 className="font-semibold">401 에러 응답</h4>
                  <p className="text-gray-600">&ldquo;토큰이 만료되었습니다&rdquo; 메시지와 함께 거부</p>
                </div>
              </div>
            </div>
          </div>

          <CodeBlock title="백엔드 토큰 검증 코드 (JwtAuthenticationFilter.java)" language="java">
{`// 1. Header에서 토큰 추출
String token = request.getHeader("Authorization");
if (token != null && token.startsWith("Bearer ")) {
    token = token.substring(7); // "Bearer " 제거
    
    try {
        // 2. JWT 라이브러리로 토큰 검증
        Claims claims = Jwts.parser()
            .setSigningKey(secretKey)
            .parseClaimsJws(token)
            .getBody();
            
        // 3. 자동으로 만료 시간 체크됨
        // 만료되면 ExpiredJwtException 발생
        
        String email = claims.getSubject();
        // 토큰이 유효하면 인증 성공!
        
    } catch (ExpiredJwtException e) {
        // 4. 만료된 경우 401 에러 반환
        response.setStatus(401);
        return;
    }
}`}
          </CodeBlock>
        </div>
      </section>

      {/* 3. 프론트엔드의 401 감지 */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6">📡 3단계: 프론트엔드는 어떻게 &ldquo;만료됐다&rdquo;는 걸 알아요?</h2>
        
        <ExampleBox title="401 응답을 받으면 만료된 걸로 판단" icon={AlertCircle} color="red">
          <p className="mb-3">백엔드가 401 상태코드로 응답하면 &ldquo;아, 토큰이 만료됐구나!&rdquo; 알게 됩니다.</p>
        </ExampleBox>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold mb-4">🔄 실제 상황 예시</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
              <strong>12:00</strong> - 사용자가 로그인 (토큰 발급, 12:05까지 유효)
            </div>
            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
              <strong>12:03</strong> - 챌린지 목록 API 호출 → ✅ 성공 (아직 유효)
            </div>
            <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
              <strong>12:06</strong> - 리워드 통계 API 호출 → ❌ 401 에러 (만료됨!)
            </div>
            <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
              <strong>자동</strong> - Axios가 401을 감지하고 토큰 갱신 시도
            </div>
          </div>
        </div>

        <CodeBlock title="Axios가 401을 감지하는 코드" language="javascript">
{`// Axios Response 인터셉터
api.interceptors.response.use(
    (response) => {
        // 성공한 응답은 그대로 통과
        return response;
    },
    async (error) => {
        // 에러가 발생한 경우
        if (error.response?.status === 401) {
            console.log(&quot;401 에러 감지! 토큰이 만료된 것 같아요&quot;);
            // 여기서 토큰 갱신 로직 실행
        }
        
        return Promise.reject(error);
    }
);`}
        </CodeBlock>
      </section>

      {/* 4. refreshPromise 설명 */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6">🤔 4단계: refreshPromise가 왜 필요한가요?</h2>
        
        <div className="space-y-6">
          <ExampleBox title="문제 상황: 동시에 여러 API가 401을 받으면?" icon={AlertCircle} color="orange">
            <p className="mb-3">사용자가 페이지를 새로고침하면 여러 API가 동시에 호출됩니다:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>사용자 정보 가져오기 API</li>
              <li>챌린지 목록 API</li>
              <li>리워드 통계 API</li>
              <li>모두 동시에 401 에러 받음!</li>
            </ul>
          </ExampleBox>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h3 className="font-bold text-red-800 mb-3">❌ refreshPromise 없이 하면...</h3>
            <div className="space-y-2 text-sm text-red-700">
              <div>• API 1이 401 받음 → 토큰 갱신 요청</div>
              <div>• API 2가 401 받음 → 또 토큰 갱신 요청</div>
              <div>• API 3이 401 받음 → 또또 토큰 갱신 요청</div>
              <div className="font-semibold mt-2">결과: 백엔드에 갱신 요청이 3번이나! 😱</div>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <h3 className="font-bold text-green-800 mb-3">✅ refreshPromise로 하면...</h3>
            <div className="space-y-2 text-sm text-green-700">
              <div>• API 1이 401 받음 → 토큰 갱신 요청 (refreshPromise 생성)</div>
              <div>• API 2가 401 받음 → &ldquo;어? 이미 갱신 중이네&rdquo; (같은 Promise 재사용)</div>
              <div>• API 3이 401 받음 → &ldquo;어? 이미 갱신 중이네&rdquo; (같은 Promise 재사용)</div>
              <div className="font-semibold mt-2">결과: 백엔드에 갱신 요청이 1번만! 😊</div>
            </div>
          </div>

          <CodeBlock title="refreshPromise 로직 - 쉬운 버전" language="javascript">
{`// 전역 변수: 현재 토큰 갱신 중인지 추적
let refreshPromise = null;

async function refreshToken() {
    // 이미 갱신 중이면 그걸 기다림 (중복 방지!)
    if (refreshPromise) {
        console.log(&quot;이미 갱신 중이니까 기다릴게요&quot;);
        return refreshPromise;
    }
    
    // 갱신 중이 아니면 새로 시작
    console.log(&quot;새로 토큰 갱신 시작!&quot;);
    refreshPromise = fetch('/api/auth/refresh')
        .then(response => response.json())
        .then(data => {
            const newToken = data.accessToken;
            localStorage.setItem('authToken', newToken);
            return newToken;
        })
        .finally(() => {
            // 갱신 완료되면 다시 null로 초기화
            refreshPromise = null;
            console.log(&quot;갱신 완료! 다음에 또 갱신할 수 있어요&quot;);
        });
    
    return refreshPromise;
}`}
          </CodeBlock>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🎯 핵심 포인트</h4>
            <p className="text-blue-700 text-sm">
              refreshPromise는 &ldquo;교통정리&rdquo; 역할입니다. 여러 명이 동시에 &ldquo;토큰 갱신해주세요!&rdquo;라고 외쳐도, 
              한 번만 실제로 갱신하고 모든 사람이 같은 결과를 받도록 해줍니다.
            </p>
          </div>
        </div>
      </section>

      {/* 5. 전체 흐름 요약 */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6">🔄 5단계: 전체 흐름 한눈에 보기</h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="font-semibold">사용자가 페이지 접속 또는 버튼 클릭</h4>
                <p className="text-gray-600 text-sm">여러 API가 동시에 호출됨</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="font-semibold">백엔드가 토큰 검사</h4>
                <p className="text-gray-600 text-sm">현재시간 {'>'}= 만료시간 → 401 에러 응답</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="font-semibold">Axios가 401 감지</h4>
                <p className="text-gray-600 text-sm">여러 API가 동시에 401을 받아도 refreshPromise로 한 번만 갱신</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">4</div>
              <div>
                <h4 className="font-semibold">새 토큰 발급받고 원래 요청 재시도</h4>
                <p className="text-gray-600 text-sm">사용자는 아무것도 모르고 자연스럽게 데이터를 받음</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 마무리 */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">🎉 이제 이해되셨나요?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-green-800">✅ 핵심 정리</h3>
            <ul className="text-sm space-y-1 text-green-700">
              <li>• 토큰에는 만료 시간이 내장되어 있음</li>
              <li>• 백엔드는 현재시간과 비교해서 만료 판단</li>
              <li>• 401 에러로 프론트엔드에게 알려줌</li>
              <li>• refreshPromise로 중복 갱신 방지</li>
              <li>• 사용자는 자동 갱신을 전혀 모름</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-800">🔧 실제 설정</h3>
            <ul className="text-sm space-y-1 text-blue-700">
              <li>• Access Token: 5분 (보안)</li>
              <li>• Refresh Token: 14일 (편의성)</li>
              <li>• 자동 갱신으로 seamless 경험</li>
              <li>• 로그아웃 시에만 재로그인 필요</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. 토큰 형식 보충 설명 */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6">🔤 6단계: 토큰 형식은 어떻게 정해지나요?</h2>
        
        <div className="space-y-6">
          <ExampleBox title="JWT (JSON Web Token) 형식 이해하기" icon={Shield} color="blue">
            <p className="mb-3">JWT는 3개 부분으로 나뉘어진 문자열입니다:</p>
            <div className="bg-white p-4 rounded border">
              <code className="text-sm break-all">
                <span className="text-red-600 font-bold">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>
                <span className="text-gray-500">.</span>
                <span className="text-blue-600 font-bold">eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjUxNzQwMDAsImV4cCI6MTcyNTE3NDMwMH0</span>
                <span className="text-gray-500">.</span>
                <span className="text-green-600 font-bold">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
              </code>
            </div>
          </ExampleBox>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-2">🔴 Header (헤더)</h4>
              <p className="text-red-700 text-sm mb-3">토큰 타입과 암호화 방식</p>
              <CodeBlock language="json">
{`{
  "alg": "HS256",  // 암호화 알고리즘
  "typ": "JWT"     // 토큰 타입
}`}
              </CodeBlock>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-2">🔵 Payload (내용)</h4>
              <p className="text-blue-700 text-sm mb-3">실제 사용자 정보와 만료시간</p>
              <CodeBlock language="json">
{`{
  "sub": "user@example.com",
  "role": "USER",
  "iat": 1725174000,  // 발급시간
  "exp": 1725174300   // 만료시간
}`}
              </CodeBlock>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">🔵 Signature (서명)</h4>
              <p className="text-green-700 text-sm mb-3">토큰이 위조되지 않았음을 보증</p>
              <div className="text-xs text-green-600 bg-white p-2 rounded border">
                Header + Payload + 비밀키로 생성된 암호화된 서명
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="font-bold mb-4">🏭 백엔드에서 토큰 생성 과정</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold">사용자 정보 수집</h4>
                  <p className="text-gray-600 text-sm">로그인 성공 후 이메일, 권한 등을 가져옴</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold">Payload 생성</h4>
                  <p className="text-gray-600 text-sm">현재시간 + 5분 = 만료시간 계산</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold">암호화 및 서명</h4>
                  <p className="text-gray-600 text-sm">비밀키로 서명을 만들어서 위조 방지</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h4 className="font-semibold">Base64 인코딩</h4>
                  <p className="text-gray-600 text-sm">URL에서 안전하게 전송할 수 있도록 문자열로 변환</p>
                </div>
              </div>
            </div>
          </div>

          <CodeBlock title="백엔드 토큰 생성 코드 (JwtUtil.java)" language="java">
{`public String generateToken(String email, String role) {
    // 1. 현재 시간 계산
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION_MS); // 5분 후
    
    // 2. Payload 구성
    Map<String, Object> claims = new HashMap<>();
    claims.put("sub", email);       // 사용자 식별자
    claims.put("role", role);       // 사용자 권한
    claims.put("iat", now);         // 발급 시간
    
    // 3. JWT 생성 및 서명
    return Jwts.builder()
        .setClaims(claims)                    // Payload 설정
        .setSubject(email)                    // Subject 설정
        .setIssuedAt(now)                     // 발급 시간
        .setExpiration(expiryDate)            // 만료 시간
        .signWith(SignatureAlgorithm.HS256, JWT_SECRET)  // 서명
        .compact();                           // 최종 문자열로 변환
}`}
          </CodeBlock>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-yellow-800 mb-3">🔐 보안 요소</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🛡️ 위조 방지</h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  <li>서명(Signature)으로 내용 변조 감지</li>
                  <li>비밀키는 서버에서만 알고 있음</li>
                  <li>내용이 바뀌면 서명이 맞지 않음</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⏰ 시간 기반 보안</h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  <li>만료 시간이 토큰에 내장</li>
                  <li>시간이 지나면 자동으로 무효</li>
                  <li>탈취되어도 5분 후 사용 불가</li>
                </ul>
              </div>
            </div>
          </div>

          <ExampleBox title="실제 토큰 해독해보기" icon={RefreshCw} color="green">
            <p className="mb-3">온라인 JWT 디코더 사이트에서 토큰을 붙여넣어보세요:</p>
            <div className="space-y-2 text-sm">
              <div>🌐 <strong>jwt.io</strong> - JWT 공식 디버거</div>
              <div>🔍 토큰을 붙여넣으면 Header, Payload, Signature가 보임</div>
              <div>⚠️ <strong>주의</strong>: 실제 운영 토큰은 절대 온라인 사이트에 입력하지 마세요!</div>
            </div>
          </ExampleBox>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 핵심 포인트</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• JWT는 자체적으로 정보를 포함하는 &ldquo;self-contained&rdquo; 토큰</li>
              <li>• 서버가 DB 조회 없이도 토큰만으로 사용자 정보와 만료 여부 확인 가능</li>
              <li>• Base64로 인코딩되어 있지만 암호화는 아님 (누구나 디코딩 가능)</li>
              <li>• 보안은 서명(Signature)이 담당 - 비밀키 없이는 위조 불가</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
