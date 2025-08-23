# 백엔드 보안 구현 가이드

## Spring Security를 활용한 안전한 사용자 인증

### 1. Controller에서 인증된 사용자 정보 추출

```java
@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeService challengeService;

    @PostMapping
    public ResponseEntity<CreateChallengeResponse> createChallenge(
            @RequestBody @Valid CreateChallengeRequest request,
            Authentication authentication) {
        
        // 방법 1: Authentication 객체에서 사용자 정보 추출
        String username = authentication.getName();
        
        // 방법 2: JWT 토큰에서 사용자 정보 추출 (더 권장)
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long authorId = userPrincipal.getId();
        
        CreateChallengeResponse response = challengeService.createChallenge(request, authorId);
        return ResponseEntity.ok(response);
    }
}
```

### 2. JWT 토큰 기반 인증 (권장)

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String token = extractTokenFromRequest(request);
        
        if (token != null && jwtTokenProvider.validateToken(token)) {
            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            String username = jwtTokenProvider.getUsernameFromToken(token);
            
            UserPrincipal userPrincipal = new UserPrincipal(userId, username);
            Authentication auth = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities());
            
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### 3. Service Layer에서 사용자 검증

```java
@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;

    @Transactional
    public CreateChallengeResponse createChallenge(CreateChallengeRequest request, Long authorId) {
        // 1. 사용자 존재 여부 확인
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        // 2. 챌린지 생성
        Challenge challenge = Challenge.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .author(author)  // 인증된 사용자만 설정 가능
            .tags(request.getTags())
            .rewardAmount(request.getRewardAmount())
            .rewardType(request.getRewardType())
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .build();
            
        Challenge savedChallenge = challengeRepository.save(challenge);
        
        return CreateChallengeResponse.builder()
            .success(true)
            .id(savedChallenge.getId())
            .message("챌린지가 성공적으로 생성되었습니다.")
            .build();
    }
}
```

### 4. 프론트엔드 요청 형태

```typescript
// 클라이언트에서 보내는 요청 (authorId 없음)
const challengeData = {
    title: "독서 마라톤 챌린지",
    description: "한 달 동안 매주 책 한 권씩 총 4권 읽기",
    tags: ["독서", "자기계발", "습관"],
    rewardAmount: 30000,
    rewardType: "CASH",
    startDate: "2025-08-25",
    endDate: "2025-09-25"
    // authorId는 서버에서 JWT 토큰으로부터 추출
};
```

## 보안상 이점

1. **클라이언트 조작 방지**: 사용자가 다른 사람의 ID로 챌린지를 생성할 수 없음
2. **토큰 기반 인증**: JWT 토큰의 무결성 검증으로 신뢰할 수 있는 사용자 정보
3. **서버사이드 검증**: 모든 권한 검사가 서버에서 수행됨
4. **감사 추적**: 실제 인증된 사용자 기반으로 로그 기록

## 결론

**가장 안전하고 교과서적인 방법은 서버에서 JWT 토큰을 통해 사용자 정보를 추출하는 것입니다.**

클라이언트에서는 authorId를 전송하지 않고, 서버에서 인증된 사용자 정보를 바탕으로 챌린지를 생성하는 것이 보안상 가장 안전합니다.
