"use client";
import React from 'react';

export default function DeveloperPresenceDocPage(){
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">� 실시간 개발자 접속 상태 시스템</h1>
      <p className="text-gray-600 mb-8 text-sm">REST API + JWT 기반 실시간 개발자 온라인 상태 추적 시스템의 완전한 구현 가이드</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🎯 시스템 개요</h2>
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
          <p className="text-sm text-blue-800 mb-2"><strong>목표:</strong> 로그인한 개발자들의 실시간 접속 상태를 추적하고 표시</p>
          <p className="text-sm text-blue-800"><strong>특징:</strong> 간단한 REST API 기반, JWT 인증, 중복 제거, 자동 정리</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🔄 전체 프로세스 플로우</h2>
        <div className="bg-white border rounded p-4 text-sm">
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4">
              <strong>1. 로그인 후 자동 등록</strong>
              <p className="text-gray-600">페이지 로드 → useSimplePresence 훅 실행 → POST /api/presence/connect</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <strong>2. 서버에서 사용자 등록</strong>
              <p className="text-gray-600">JWT 파싱 → 이메일 추출 → SimplePresenceService.onConnect() → 메모리에 저장</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <strong>3. 상태 주기적 확인</strong>
              <p className="text-gray-600">10초마다 GET /api/presence → 온라인 사용자 목록 반환 → UI 업데이트</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <strong>4. 사용자 표시</strong>
              <p className="text-gray-600">RealTimeSidebar에서 presence.online 배열 렌더링 → 실시간 개발자 현황 표시</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🔧 백엔드 구현</h2>
        
        <h3 className="text-lg font-medium mb-2">1. SimplePresenceService.java</h3>
        <div className="bg-gray-50 border rounded p-4 text-xs font-mono whitespace-pre-wrap mb-4">
{`@Service
public class SimplePresenceService {
    // sessionId -> userId 매핑
    private final Map<String, String> sessionUserMap = new ConcurrentHashMap<>();
    // 온라인 사용자 목록
    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();

    public void onConnect(String sessionId, String userId) {
        sessionUserMap.put(sessionId, userId);
        boolean wasAdded = onlineUsers.add(userId);
        if (wasAdded) {
            log.info("User online: {}", userId);
        }
    }

    public void onDisconnect(String sessionId) {
        String userId = sessionUserMap.remove(sessionId);
        if (userId != null) {
            boolean stillHasSession = sessionUserMap.containsValue(userId);
            if (!stillHasSession) {
                onlineUsers.remove(userId);
                log.info("User offline: {}", userId);
            }
        }
    }

    public Set<String> getOnlineUsers() {
        return new HashSet<>(onlineUsers);
    }
}`}
        </div>

        <h3 className="text-lg font-medium mb-2">2. PresenceController.java</h3>
        <div className="bg-gray-50 border rounded p-4 text-xs font-mono whitespace-pre-wrap mb-4">
{`@RestController
@RequestMapping("/api/presence")
public class PresenceController {
    private final SimplePresenceService presenceService;
    private final JwtUtil jwtUtil;

    // 현재 온라인 사용자 목록 조회
    @GetMapping
    public ResponseEntity<?> getPresence() {
        return ResponseEntity.ok(Map.of("online", presenceService.getOnlineUsers()));
    }
    
    // 로그인 시 자동 등록
    @PostMapping("/connect")
    public ResponseEntity<?> connect(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        JwtUtil.TokenInfo tokenInfo = jwtUtil.getTokenInfo(token);
        String userId = tokenInfo.getEmail(); // JWT에서 이메일 추출
        String sessionId = "session-" + userId + "-" + System.currentTimeMillis();
        
        presenceService.onConnect(sessionId, userId);
        return ResponseEntity.ok(Map.of(
            "message", "Connected successfully", 
            "userId", userId,
            "online", presenceService.getOnlineUsers()
        ));
    }
}`}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">💻 프론트엔드 구현</h2>
        
        <h3 className="text-lg font-medium mb-2">1. useSimplePresence.ts 훅</h3>
        <div className="bg-gray-50 border rounded p-4 text-xs font-mono whitespace-pre-wrap mb-4">
{`export function useSimplePresence(token?: string) {
  const [state, setState] = useState<SimplePresenceState>({ 
    online: [], 
    connected: false 
  });

  useEffect(() => {
    if (!token) return;

    // 자동 등록 (최초 1회)
    const autoConnect = async () => {
      const url = window.location.port === '3000' 
        ? 'http://localhost:8080/api/presence/connect'
        : '/api/presence/connect';
      
      await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
    };

    // 주기적 상태 확인
    const fetchPresence = async () => {
      const url = window.location.port === '3000' 
        ? 'http://localhost:8080/api/presence'
        : '/api/presence';
      
      const response = await fetch(url, {
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setState(s => ({ 
          ...s, 
          online: data.online, 
          connected: true 
        }));
      }
    };

    // 즉시 연결 + 10초마다 상태 확인
    autoConnect().then(() => setTimeout(fetchPresence, 1000));
    const interval = setInterval(fetchPresence, 10000);
    
    return () => clearInterval(interval);
  }, [token]);

  return state;
}`}
        </div>

        <h3 className="text-lg font-medium mb-2">2. RealTimeSidebar.tsx 사용</h3>
        <div className="bg-gray-50 border rounded p-4 text-xs font-mono whitespace-pre-wrap mb-4">
{`export function RealTimeSidebar() {
    const authToken = localStorage.getItem('authToken');
    const presence = useSimplePresence(authToken || undefined);

    return (
        <div className="space-y-2">
            <span>접속 중 ({presence.online.length}명)</span>
            {presence.online.map((userId) => (
                <div key={userId} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full">
                        <span className="text-white text-xs">
                            {userId.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="text-sm font-medium">{userId}</div>
                </div>
            ))}
        </div>
    );
}`}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🔄 핵심 API 엔드포인트</h2>
        <div className="space-y-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold text-green-600">GET /api/presence</h4>
            <p className="text-sm text-gray-600 mt-1">현재 온라인 사용자 목록 조회</p>
            <div className="bg-gray-50 rounded p-2 mt-2 text-xs font-mono">
              Response: {"{ \"online\": [\"user1@example.com\", \"user2@example.com\"] }"}
            </div>
          </div>
          
          <div className="border rounded p-4">
            <h4 className="font-semibold text-blue-600">POST /api/presence/connect</h4>
            <p className="text-sm text-gray-600 mt-1">사용자 온라인 상태 등록 (자동 호출)</p>
            <div className="bg-gray-50 rounded p-2 mt-2 text-xs font-mono">
              Headers: Authorization: Bearer {"{JWT_TOKEN}"}
            </div>
          </div>
          
          <div className="border rounded p-4">
            <h4 className="font-semibold text-red-600">POST /api/presence/clear</h4>
            <p className="text-sm text-gray-600 mt-1">모든 온라인 사용자 정리 (테스트용)</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">⚡ 동작 특징</h2>
        <ul className="list-disc ml-6 text-sm space-y-2 text-gray-700">
          <li><strong>자동 등록:</strong> 페이지 로드 시 JWT 토큰이 있으면 자동으로 온라인 상태 등록</li>
          <li><strong>실제 사용자 ID:</strong> JWT에서 이메일을 추출하여 실제 사용자로 표시</li>
          <li><strong>중복 방지:</strong> 같은 사용자가 여러 탭을 열어도 1명으로 표시</li>
          <li><strong>주기적 갱신:</strong> 10초마다 최신 온라인 목록을 가져와서 UI 업데이트</li>
          <li><strong>개발환경 지원:</strong> localhost:3000 → localhost:8080 자동 포트 매핑</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">� 테스트 방법</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <ol className="list-decimal ml-6 text-sm space-y-2 text-gray-800">
            <li>백엔드 실행: <code className="bg-gray-100 px-1 rounded">./gradlew bootRun</code></li>
            <li>브라우저 1에서 로그인 → 개발자 현황 확인</li>
            <li>브라우저 2(다른 브라우저)에서 로그인 → 개발자 현황 확인</li>
            <li>두 브라우저 모두에서 온라인 사용자 목록이 표시되는지 확인</li>
            <li>테스트 정리: <code className="bg-gray-100 px-1 rounded">curl -X POST http://localhost:8080/api/presence/clear</code></li>
          </ol>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">🚀 향후 개선 계획</h2>
        <ul className="list-disc ml-6 text-sm space-y-1 text-gray-700">
          <li>WebSocket 실시간 브로드캐스트 추가 (현재는 10초 폴링)</li>
          <li>Redis 연동으로 다중 서버 환경 지원</li>
          <li>사용자 로그아웃 시 자동 오프라인 처리</li>
          <li>Heartbeat 기반 자동 비활성 사용자 정리</li>
          <li>사용자별 상태 정보 (활동 중, 자리비움 등)</li>
        </ul>
      </section>
    </div>
  );
}
