/**
 * JWT 토큰 디코딩 및 권한 관리 유틸리티
 */

export interface JWTPayload {
    sub: string; // 사용자 ID
    username: string;
    email: string;
    role: string;
    authorities: string[];
    iat: number; // 발행 시간
    exp: number; // 만료 시간
}

/**
 * JWT 토큰을 디코딩하는 함수 (서명 검증 없이 페이로드만 파싱)
 */
export function decodeJWT(token: string): JWTPayload | null {
    try {
        // JWT는 헤더.페이로드.서명 형태
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        // Base64 URL 디코딩
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

        return JSON.parse(decoded) as JWTPayload;
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
}

/**
 * localStorage에서 토큰을 가져와서 디코딩하는 함수
 */
export function getTokenPayload(): JWTPayload | null {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("authToken");
    if (!token) return null;

    return decodeJWT(token);
}

/**
 * 토큰이 만료되었는지 확인하는 함수
 */
export function isTokenExpired(): boolean {
    const payload = getTokenPayload();
    if (!payload) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
}

/**
 * 토큰에서 사용자 정보를 가져오는 함수
 */
export function getUserFromToken() {
    const payload = getTokenPayload();
    if (!payload) return null;

    return {
        id: parseInt(payload.sub),
        username: payload.username,
        email: payload.email,
        role: payload.role,
        authorities: payload.authorities
    };
}

/**
 * 토큰에서 특정 권한이 있는지 확인하는 함수
 */
export function hasAuthority(authority: string): boolean {
    const payload = getTokenPayload();
    console.log("🔍 JWT hasAuthority check:", { payload, authority });

    if (!payload || !payload.authorities || !Array.isArray(payload.authorities)) {
        console.log("❌ No payload or authorities in JWT");
        return false;
    }

    const result = payload.authorities.includes(authority);
    console.log("✅ JWT Authority check result:", result);
    return result;
}

/**
 * 토큰에서 여러 권한 중 하나라도 있는지 확인하는 함수
 */
export function hasAnyAuthority(authorities: string[]): boolean {
    const payload = getTokenPayload();
    if (!payload || !payload.authorities || !Array.isArray(payload.authorities)) {
        return false;
    }

    return authorities.some(authority => payload.authorities.includes(authority));
}

/**
 * 토큰에서 모든 권한이 있는지 확인하는 함수
 */
export function hasAllAuthorities(authorities: string[]): boolean {
    const payload = getTokenPayload();
    if (!payload || !payload.authorities || !Array.isArray(payload.authorities)) {
        return false;
    }

    return authorities.every(authority => payload.authorities.includes(authority));
}

/**
 * 토큰에서 특정 역할이 있는지 확인하는 함수
 */
export function hasRole(role: string): boolean {
    const payload = getTokenPayload();
    if (!payload) return false;

    return payload.role === role;
}

/**
 * 관리자 권한이 있는지 확인하는 함수
 */
export function isAdmin(): boolean {
    return hasRole("ADMIN");
}

/**
 * 챌린지 생성 권한이 있는지 확인하는 함수
 */
export function canCreateChallenge(): boolean {
    return hasAuthority("CHALLENGE_CREATE");
}

/**
 * 챌린지 관리 권한이 있는지 확인하는 함수
 */
export function canManageChallenge(): boolean {
    return hasAnyAuthority(["CHALLENGE_UPDATE", "CHALLENGE_DELETE", "CHALLENGE_VIEW_ALL"]);
}

/**
 * 사용자 관리 권한이 있는지 확인하는 함수
 */
export function canManageUsers(): boolean {
    return hasAnyAuthority(["USER_CREATE", "USER_UPDATE", "USER_DELETE", "USER_VIEW_ALL"]);
}
