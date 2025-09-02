import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { CheckCircle, Database, Zap, Shield, Code } from "lucide-react";
import CodeBlock from "@/shared/components/CodeBlock";

export default function JwtAuthorizationPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* 헤더 */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    🚀 JWT 토큰 기반 권한 관리 시스템
                </h1>
                <p className="text-lg text-gray-600">
                    Spring Security와 JWT 토큰을 연동한 고성능 권한 인증 시스템 구현 가이드
                </p>
            </div>
            {/* (초기 하이라이트 블록 제거됨 - 실제 핵심 암기 블록은 Step 3 아래에 위치) */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-500" />
                        Spring Security와 JWT 토큰 연동
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        JWT 토큰에 포함된 권한 정보를 Spring Security의 인증/인가 시스템과 연동하여
                        <strong> 메모리 기반 고속 권한 관리</strong>를 구현합니다.
                    </p>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3">🔄 프론트엔드 → 백엔드 → Spring Security 전체 플로우</h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                                <div><strong>프론트엔드</strong> → Authorization: Bearer [JWT토큰] 헤더로 API 요청</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                                <div><strong>JwtAuthenticationFilter</strong> → 토큰에서 권한 정보 파싱</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                                <div><strong>Spring Security</strong> → SecurityContext에 인증 정보 저장</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                                <div><strong>@PreAuthorize</strong> → 컨트롤러 메서드 실행 전 권한 자동 검증</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">5</span>
                                <div><strong>권한 결과</strong> → ✅ 성공: 메서드 실행 / ❌ 실패: 403 Forbidden</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 권한 관리 구조 */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-500" />
                        권한 관리 구조
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center mb-4">
                        <div className="inline-block bg-blue-100 px-4 py-2 rounded-lg mb-2">
                            <strong>UserEntity</strong> (사용자)
                        </div>
                        <div className="text-gray-500 mb-2">↓ (1:1 관계)</div>
                        <div className="inline-block bg-green-100 px-4 py-2 rounded-lg mb-2">
                            <strong>RoleEntity</strong> (역할)
                        </div>
                        <div className="text-gray-500 mb-2">↓ (1:N 관계)</div>
                        <div className="inline-block bg-purple-100 px-4 py-2 rounded-lg">
                            <strong>AuthorityEntity</strong> (권한)
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="col-span-2">
                            <h4 className="font-semibold mb-2 text-center">JWT 토큰 페이로드 구조</h4>
                            <pre className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded text-sm overflow-x-auto border">
{`{
  "sub": "user@example.com",           // 사용자 식별자 (이메일)
  "role": "ADMIN",                     // 사용자 역할
  "authorities": [                     // 🔥 권한 목록 (핵심!)
    "CREATE_USER",
    "DELETE_USER", 
    "VIEW_ADMIN_PANEL",
    "MANAGE_ROLES"
  ],
  "iat": 1693123456,                   // 발급 시간
  "exp": 1693127056                    // 만료 시간
}`}
                            </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Step-by-Step 구현 가이드 */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        Step-by-Step 구현 가이드
                    </CardTitle>
                    <CardDescription>
                        JWT 토큰 기반 권한 시스템을 처음부터 구현하는 완전한 가이드
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step 1 */}
                    <div className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-500 text-white">1</Badge>
                            <h4 className="font-semibold">JwtUtil에 권한 정보를 포함한 토큰 생성 메서드 구현 <span className="text-xs font-normal text-blue-600">(로그인 단계 또는 로그인 검증 단계에서 사용되는 핵심 로직)</span></h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">사용자의 역할과 권한 정보를 JWT 토큰에 포함하는 메서드를 구현합니다.</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">{`// JwtUtil.java
public String generateToken(String email, String roleName, List<String> authorities) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expiration);

    return Jwts.builder()
            .subject(email)
            .claim("role", roleName)
            .claim("authorities", authorities)  // 🔥 권한 정보 포함
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(getSigningKey())
            .compact();
}`}</pre>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-green-500 text-white">2</Badge>
                            <h4 className="font-semibold">토큰에서 모든 정보를 한번에 추출하는 메서드 추가 <span className="text-xs font-normal text-green-600">(사용자 식별이 필요한 모든 API 에서 공통 재사용되는 파싱 로직)</span></h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">토큰을 한 번만 파싱하여 모든 사용자 정보를 추출하는 메서드를 구현합니다.</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">{`// JwtUtil.java
public TokenInfo getTokenInfo(String token) {
    Claims claims = Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    
    return new TokenInfo(
        claims.getSubject(), // email
        claims.get("role", String.class), // role
        (List<String>) claims.get("authorities") // authorities
    );
}

public static class TokenInfo {
    private final String email;
    private final String role;
    private final List<String> authorities;
    public TokenInfo(String email, String role, List<String> authorities) {
        this.email = email; this.role = role; this.authorities = authorities; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public List<String> getAuthorities() { return authorities; }
}`}</pre>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="border-l-4 border-purple-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-500 text-white">3</Badge>
                            <h4 className="font-semibold">🔍 JwtAuthenticationFilter: 토큰 → Spring Security 연동</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            <strong>핵심!</strong> 프론트에서 보낸 토큰을 파싱해서 Spring Security가 이해할 수 있는 형태로 변환하는 단계입니다.
                        </p>
                        
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded mb-3">
                            <h5 className="font-semibold text-amber-800 mb-1">⚡ 이 단계에서 일어나는 일</h5>
                            <div className="text-sm text-amber-700 space-y-1">
                                <div>1. 프론트에서 보낸 JWT 토큰을 Authorization 헤더에서 추출</div>
                                <div>2. 토큰을 파싱해서 email, role, authorities 정보 추출</div>
                                <div>3. Spring Security의 GrantedAuthority 객체로 변환</div>
                                <div>4. SecurityContext에 저장 → 이제 컨트롤러에서 권한 체크 가능!</div>
                            </div>
                        </div>

                        <CodeBlock
                          language="java"
                          title="JwtAuthenticationFilter.java"
                          code={`@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
    // 1️⃣ Authorization 헤더 확인
    String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7);
        try {
            // 2️⃣ 토큰 파싱 - 한번에 정보 추출
            JwtUtil.TokenInfo tokenInfo = jwtUtil.getTokenInfo(token);
            String email = tokenInfo.getEmail();
            String role = tokenInfo.getRole();
            List<String> authorities = tokenInfo.getAuthorities();

            // 3️⃣ 권한 객체 생성
            List<SimpleGrantedAuthority> grantedAuthorities = new ArrayList<>();
            if (role != null && !role.isEmpty()) {
                grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + role));
            }
            if (authorities != null && !authorities.isEmpty()) {
                for (String authority : authorities) {
                    grantedAuthorities.add(new SimpleGrantedAuthority(authority));
                }
            }

            // 4️⃣ SecurityContext 저장 → @PreAuthorize 사용 가능
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, null, grantedAuthorities);
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
    }
    filterChain.doFilter(request, response);
}`}
                        />
                    </div>

                    {/* 🔦 핵심 암기 블록 (형광펜 효과) - JwtAuthenticationFilter 설명 바로 아래 */}
                    <div className="mt-6 bg-yellow-50/80 border border-yellow-200 rounded-lg p-4 shadow-sm relative overflow-hidden">
                        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,243,191,0.35)_0px,rgba(255,243,191,0.35)_8px,rgba(255,255,255,0.4)_8px,rgba(255,255,255,0.4)_16px)] mix-blend-multiply" />
                        <div className="relative">
                            <h5 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                                <span className="inline-block px-2 py-0.5 rounded bg-yellow-400 text-xs font-bold text-yellow-900 shadow">암기!</span>
                                Spring Security 권한 주입 핵심 4단계
                            </h5>
                            <ol className="text-sm text-yellow-900 space-y-1 font-medium">
                                <li>1. <code className="bg-white/70 px-1 rounded">role</code> → <code className="bg-yellow-200 px-1 rounded">ROLE_(role값)</code> 형태로 변환</li>
                                <li>2. <code className="bg-white/70 px-1 rounded">authorities[]</code> 각 문자열 → <code className="bg-yellow-200 px-1 rounded">new SimpleGrantedAuthority(문자열)</code> 로 래핑하여 추가</li>
                                <li>3. <code className="bg-white/70 px-1 rounded">new UsernamePasswordAuthenticationToken(email, null, grantedAuthorities)</code></li>
                                <li>4. <code className="bg-white/70 px-1 rounded">SecurityContextHolder.getContext().setAuthentication(authToken)</code></li>
                            </ol>
                            <div className="mt-3 text-xs text-yellow-700 leading-relaxed">
                                이 블록이 실행되면 <code className="bg-yellow-100 px-1 rounded">@PreAuthorize</code> 가 사용할 수 있는 권한 목록이 <strong>메모리(SecurityContext)</strong> 에 실시간 세팅됩니다. <br />
                                즉, <span className="bg-yellow-300 px-1 rounded font-semibold">ROLE_*</span> / 개별 <span className="bg-yellow-300 px-1 rounded font-semibold">권한 문자열</span> 이 모두 GrantedAuthority 로 등록되어 컨트롤러 진입 직전에 검증됩니다.
                            </div>
                            <div className="mt-4 grid md:grid-cols-2 gap-3 text-xs">
                                <div className="bg-white/70 border border-yellow-200 rounded p-2">
                                    <p className="font-semibold text-yellow-800 mb-1">암기용 최소 패턴</p>
                                    <pre className="text-[11px] leading-4 overflow-x-auto">{`List<GrantedAuthority> auths = new ArrayList<>();
if (role != null) auths.add(new SimpleGrantedAuthority("ROLE_" + role));
for (String a : authorities) auths.add(new SimpleGrantedAuthority(a));
Authentication at = new UsernamePasswordAuthenticationToken(email, null, auths);
SecurityContextHolder.getContext().setAuthentication(at);`}</pre>
                                </div>
                                <div className="bg-white/70 border border-yellow-200 rounded p-2">
                                    <p className="font-semibold text-yellow-800 mb-1">자주 하는 실수 🚫</p>
                                    <ul className="list-disc list-inside space-y-1 text-yellow-800">
                                        <li><code className="bg-yellow-100 px-1 rounded">ROLE_</code> 접두사 빠뜨림</li>
                                        <li>authorities 문자열을 SimpleGrantedAuthority 로 래핑하지 않고 그대로 쓰려 함</li>
                                        <li>authToken 만들고 <code className="bg-yellow-100 px-1 rounded">setAuthentication()</code> 호출 누락</li>
                                        <li>토큰 만료/검증 전에 파싱 시도</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="border-l-4 border-orange-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-500 text-white">4</Badge>
                            <h4 className="font-semibold">AuthController 로그인 시 권한 정보 포함</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">로그인 시 사용자의 모든 권한을 조회하여 토큰에 포함시킵니다.</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
{`// AuthController.java - login 메서드 내부

// 🚀 사용자의 모든 권한 조회
List<AuthorityEntity> userAuthorities = userService.getUserAuthorities(user.getId());
List<String> authorityNames = userAuthorities.stream()
        .map(AuthorityEntity::getName)
        .toList();

// 🎯 권한 정보를 포함한 토큰 생성
String token = jwtUtil.generateToken(user.getEmail(), user.getRole().getName(), authorityNames);

// 응답에 권한 정보도 포함
return ResponseEntity.ok(Map.of(
    "message", "Login successful",
    "token", token,
    "id", user.getId(),
    "username", user.getUsername(),
    "email", user.getEmail(),
    "role", user.getRole().getName(),
    "authorities", authorityNames, // 🔥 권한 목록 포함
    "expiresIn", 300
));`}
                            </pre>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="border-l-4 border-red-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-red-500 text-white">5</Badge>
                            <h4 className="font-semibold">토큰 갱신 시에도 최신 권한 반영</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">토큰 갱신 시에도 사용자의 최신 권한 정보를 토큰에 포함시킵니다.</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
{`// AuthController.java - refresh 메서드 내부

// 🚀 사용자의 모든 권한 조회
List<AuthorityEntity> userAuthorities = userService.getUserAuthorities(oldToken.getUser().getId());
List<String> authorityNames = userAuthorities.stream()
        .map(AuthorityEntity::getName)
        .toList();

String access = jwtUtil.generateToken(
    oldToken.getUser().getEmail(), 
    oldToken.getUser().getRole().getName(), 
    authorityNames
);

return ResponseEntity.ok(Map.of("accessToken", access, "expiresIn", 300));`}
                            </pre>
                        </div>
                    </div>

                    {/* Step 6 */}
                    <div className="border-l-4 border-teal-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-teal-500 text-white">6</Badge>
                            <h4 className="font-semibold">SecurityConfig에서 글로벌 메서드 보안 활성화</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">@PreAuthorize 어노테이션을 사용할 수 있도록 설정합니다.</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
{`// SecurityConfig.java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)  // 🔥 메서드 레벨 보안 활성화
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()  // 나머지는 인증 필요
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        
        return http.build();
    }
}`}
                            </pre>
                        </div>
                    </div>

                    {/* Step 7 */}
                    <div className="border-l-4 border-indigo-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-indigo-500 text-white">7</Badge>
                            <h4 className="font-semibold">🎯 컨트롤러: @PreAuthorize로 권한 체크 완성!</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            이제 SecurityContext에 저장된 권한 정보를 바탕으로 <strong>메서드 실행 전 자동 권한 검증</strong>이 가능합니다!
                        </p>
                        
                        <div className="bg-green-50 border border-green-200 p-3 rounded mb-3">
                            <h5 className="font-semibold text-green-800 mb-1">💡 @PreAuthorize 동작 원리</h5>
                            <div className="text-sm text-green-700 space-y-1">
                                <div>1. 메서드 호출되기 <strong>직전</strong>에 Spring Security가 권한 표현식 평가</div>
                                <div>2. SecurityContext에서 현재 사용자의 GrantedAuthority 목록 조회</div>
                                <div>3. 표현식 조건과 매칭: hasRole('ADMIN') → ROLE_ADMIN 있는지 확인</div>
                                <div>4. ✅ 권한 있음: 메서드 실행 / ❌ 권한 없음: AccessDeniedException</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
{`// 예시: ChallengeController.java

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    // 1️⃣ AUTHORITY 기반 검증
    @PreAuthorize("hasAuthority('CREATE_CHALLENGE')")
    @PostMapping
    public ResponseEntity<?> createChallenge(@RequestBody CreateChallengeRequest request) {
        // SecurityContext에 CREATE_CHALLENGE 권한이 있는지 자동 체크
        // 없으면 403 Forbidden 응답, 있으면 메서드 실행
        return challengeService.createChallenge(request);
    }

    // 2️⃣ ROLE 기반 검증  
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChallenge(@PathVariable Long id) {
        // SecurityContext에 ROLE_ADMIN이 있는지 자동 체크
        return challengeService.deleteChallenge(id);
    }

    // 3️⃣ 복합 조건 검증 (OR 조건)
    @PreAuthorize("hasAuthority('VIEW_CHALLENGE') or hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getChallenge(@PathVariable Long id) {
        // VIEW_CHALLENGE 권한이 있거나 ADMIN 역할이 있으면 실행
        return challengeService.getChallenge(id);
    }

    // 4️⃣ 동적 권한 검증 (파라미터와 연동)
    @PreAuthorize("hasAuthority('EDIT_ANY_CHALLENGE') or " +
                  "(hasRole('USER') and #request.ownerId == authentication.name)")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateChallenge(
        @PathVariable Long id, 
        @RequestBody UpdateChallengeRequest request
    ) {
        // EDIT_ANY_CHALLENGE 권한이 있거나, 
        // USER 역할이면서 자신의 챌린지를 수정하는 경우만 실행
        return challengeService.updateChallenge(id, request);
    }

    // 5️⃣ 실시간 권한 체크 예시
    @GetMapping("/my-challenges")
    public ResponseEntity<?> getMyChallenges(Authentication auth) {
        // 런타임에 현재 사용자 정보 직접 접근 가능
        String currentUserEmail = auth.getName(); // 토큰의 sub 값
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        
        // 권한에 따라 다른 로직 실행 가능
        if (authorities.stream().anyMatch(a -> a.getAuthority().equals("VIEW_ALL_CHALLENGES"))) {
            return challengeService.getAllChallenges();
        } else {
            return challengeService.getUserChallenges(currentUserEmail);
        }
    }
}`}
                            </pre>
                        </div>
                        
                        <div className="mt-3 bg-blue-50 border border-blue-200 p-3 rounded">
                            <h5 className="font-semibold text-blue-800 mb-1">🔄 전체 플로우 요약</h5>
                            <div className="text-sm text-blue-700">
                                <strong>프론트엔드 토큰</strong> → <strong>JwtAuthenticationFilter 파싱</strong> → 
                                <strong>SecurityContext 저장</strong> → <strong>@PreAuthorize 검증</strong> → 
                                <strong>컨트롤러 실행</strong>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Spring Security 권한 타입 설명 */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-500" />
                        Spring Security 권한 타입 이해
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">🎭 ROLE (역할)</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• <code>ROLE_ADMIN</code>, <code>ROLE_USER</code></li>
                                <li>• 사용자의 기본 역할 분류</li>
                                <li>• <code>hasRole('ADMIN')</code>로 검증</li>
                                <li>• 자동으로 ROLE_ 접두사 추가</li>
                            </ul>
                        </div>
                        <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">🔑 AUTHORITY (권한)</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                                <li>• <code>CREATE_USER</code>, <code>DELETE_POST</code></li>
                                <li>• 구체적인 행위별 권한</li>
                                <li>• <code>hasAuthority('CREATE_USER')</code>로 검증</li>
                                <li>• 접두사 없이 그대로 사용</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">💡 권한 검증 예시</h4>
                        <div className="grid grid-cols-1 gap-2 text-sm font-mono">
                            <div><code>@PreAuthorize("hasRole('ADMIN')")</code> → ROLE_ADMIN 필요</div>
                            <div><code>@PreAuthorize("hasAuthority('CREATE_USER')")</code> → CREATE_USER 필요</div>
                            <div><code>@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_USERS')")</code> → 둘 중 하나</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Spring Security 권한 검증 플로우 */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-purple-500" />
                        Spring Security 권한 검증 플로우
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
                            <h4 className="font-semibold mb-3 text-gray-800">🔄 실행 시점별 권한 검증 흐름</h4>
                            <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                                    <div>
                                        <strong>요청 도착</strong> → JWT 토큰이 Authorization 헤더에 포함되어 도착
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                                    <div>
                                        <strong>JwtAuthenticationFilter 실행</strong> → 토큰 파싱 및 SecurityContext 설정
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                                    <div>
                                        <strong>@PreAuthorize 검증</strong> → 메서드 실행 전 권한 표현식 평가
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                                    <div>
                                        <strong>권한 있음</strong> → 메서드 실행 / <strong>권한 없음</strong> → 403 Forbidden 응답
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-green-800 mb-2">✅ 권한 검증 성공</h4>
                                <div className="text-sm text-green-700 space-y-1">
                                    <div>• SecurityContext에서 권한 조회</div>
                                    <div>• @PreAuthorize 표현식 true</div>
                                    <div>• 메서드 정상 실행</div>
                                    <div>• 200 OK + 응답 데이터</div>
                                </div>
                            </div>
                            
                            <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-red-800 mb-2">❌ 권한 검증 실패</h4>
                                <div className="text-sm text-red-700 space-y-1">
                                    <div>• SecurityContext에서 권한 없음</div>
                                    <div>• @PreAuthorize 표현식 false</div>
                                    <div>• AccessDeniedException 발생</div>
                                    <div>• 403 Forbidden 응답</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 장단점 */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-600">✅ 장점</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            높은 성능: DB 조회 없이 메모리에서 권한 처리
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            확장성: 높은 동시 접속자 처리 가능
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            단순함: 복잡한 캐싱 로직 불필요
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            일관성: 토큰 유효 기간 동안 권한 정보 일관성 보장
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-orange-600">⚠️ 단점 및 해결책</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div>
                            <strong>권한 변경 시 즉시 반영 안됨</strong>
                            <p className="text-gray-600 text-xs">→ 토큰 재발급 또는 짧은 만료시간 설정</p>
                        </div>
                        <div>
                            <strong>토큰 크기 증가</strong>
                            <p className="text-gray-600 text-xs">→ 권한명 최적화, 압축 등</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Spring Security 객체 변환 보충 설명 */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-orange-500" />
                        🤔 Spring Security 권한 객체 변환 - 왜 이렇게 해야 할까?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-orange-800 mb-2">💡 핵심 이해</h4>
                        <p className="text-sm text-orange-700">
                            JWT에서 추출한 권한 정보(String)를 Spring Security가 이해할 수 있는 형태(GrantedAuthority)로 변환하는 
                            <strong> "형식적인 규칙 맞추기"</strong> 과정입니다.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="border border-gray-200 p-4 rounded-lg">
                            <h5 className="font-semibold mb-2">🔧 권한 객체 변환 코드 분석</h5>
                            <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto mb-3">
{`// JwtAuthenticationFilter.java의 형식적 변환 과정

// 1️⃣ Spring Security 전용 권한 컬렉션 생성
List<SimpleGrantedAuthority> grantedAuthorities = new ArrayList<>();

// 2️⃣ ROLE 변환: Spring Security 규칙에 맞추기
if (role != null && !role.isEmpty()) {
    grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + role));
    // "ADMIN" → "ROLE_ADMIN" 변환 (hasRole('ADMIN')이 동작하도록)
}

// 3️⃣ AUTHORITY 변환: 그대로 유지
if (authorities != null && !authorities.isEmpty()) {
    for (String authority : authorities) {
        grantedAuthorities.add(new SimpleGrantedAuthority(authority));
        // "CREATE_USER" → "CREATE_USER" (hasAuthority('CREATE_USER')가 동작하도록)
    }
}`}
                            </pre>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                                    <h6 className="font-semibold text-blue-800 mb-1">🎭 ROLE 변환 규칙</h6>
                                    <div className="text-sm text-blue-700 space-y-1">
                                        <div><code>"ADMIN"</code> → <code>"ROLE_ADMIN"</code></div>
                                        <div><code>"USER"</code> → <code>"ROLE_USER"</code></div>
                                        <div className="text-xs mt-2">
                                            Spring Security가 hasRole('ADMIN')을 확인할 때 
                                            내부적으로 "ROLE_ADMIN"을 찾기 때문
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-green-50 border border-green-200 p-3 rounded">
                                    <h6 className="font-semibold text-green-800 mb-1">🔑 AUTHORITY 변환 규칙</h6>
                                    <div className="text-sm text-green-700 space-y-1">
                                        <div><code>"CREATE_USER"</code> → <code>"CREATE_USER"</code></div>
                                        <div><code>"DELETE_POST"</code> → <code>"DELETE_POST"</code></div>
                                        <div className="text-xs mt-2">
                                            hasAuthority()는 접두사 없이 
                                            정확한 문자열 매칭으로 동작
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                            <h5 className="font-semibold text-yellow-800 mb-2">⚠️ 주의사항: "형식적 규칙"으로 이해하세요</h5>
                            <div className="text-sm text-yellow-700 space-y-2">
                                <div>• 이 변환 과정은 <strong>Spring Security의 내부 동작 원리</strong>를 깊이 이해할 필요가 없습니다</div>
                                <div>• <strong>"이렇게 변환해야 @PreAuthorize가 동작한다"</strong>는 형식적 규칙으로 받아들이세요</div>
                                <div>• JWT 권한 시스템을 구현할 때 <strong>그대로 복사해서 사용</strong>하면 됩니다</div>
                                <div>• 중요한 것은 <strong>토큰 파싱 → 변환 → SecurityContext 저장</strong>의 전체 플로우입니다</div>
                            </div>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h5 className="font-semibold mb-2">🎯 실제 개발할 때는</h5>
                            <div className="text-sm space-y-1">
                                <div>1. <strong>JWT 토큰 구조 설계</strong> (authorities 필드 포함)</div>
                                <div>2. <strong>토큰 파싱 로직</strong> (JwtUtil.getTokenInfo())</div>
                                <div>3. <strong>형식적 변환 코드</strong> (위 코드 그대로 사용)</div>
                                <div>4. <strong>@PreAuthorize 활용</strong> (hasRole, hasAuthority)</div>
                            </div>
                            <div className="text-xs text-gray-600 mt-2">
                                3번은 "Spring Security 규칙"이므로 이해보다는 <strong>정확한 구현</strong>에 집중하세요!
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 배포 가이드는 별도 페이지로 분리됨 */}

            {/* 결론 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-blue-600">🎯 결론</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-4 rounded-lg text-sm">
                        <p className="mb-2 font-semibold">� 백엔드 배포 매뉴얼 분리 안내</p>
                        <p className="text-gray-600 leading-relaxed">이 문서에 있던 EC2 배포/재시작 명령어 세트는 전용 페이지로 이동되었습니다. 지속적으로 업데이트되는 최신 배포 매뉴얼은 아래 페이지에서 확인하세요.</p>
                        <div className="mt-3">
                            <a href="/docs/backend-deploy" className="inline-flex items-center text-blue-600 font-medium hover:underline">
                                /docs/backend-deploy → 백엔드 EC2 배포 매뉴얼 바로가기
                            </a>
                        </div>
                    </div>
                    <p className="mb-4">
                        JWT 토큰 기반 권한 관리 시스템으로 구현하여:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <strong>메모리 기반 고속 권한 처리</strong> 
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <strong>Spring Security 완전 연동</strong>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <strong>@PreAuthorize 자동 권한 검증</strong>
                        </li>
                    </ul>
                    <p className="mt-4 font-semibold text-blue-600">
                        이제 프론트엔드 토큰부터 백엔드 권한 체크까지 완전한 권한 관리가 가능합니다.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}