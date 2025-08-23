import { User } from "@/entities/user/model/types";

/**
 * localStorage에서 사용자 정보를 가져오는 함수
 */
export function getStoredUserInfo(): User | null {
    if (typeof window === "undefined") return null;

    try {
        const userInfo = localStorage.getItem("userInfo");
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        console.error("Failed to parse user info from localStorage:", error);
        return null;
    }
}

/**
 * 현재 로그인한 사용자 정보를 가져오는 함수 (React Hook 없이)
 */
export function getCurrentUser(): User | null {
    return getStoredUserInfo();
}

/**
 * 사용자가 특정 권한을 가지고 있는지 확인하는 함수
 */
export function hasAuthority(authority: string): boolean {
    const userInfo = getStoredUserInfo();
    console.log("🔍 hasAuthority check:", { userInfo, authority });

    if (!userInfo || !userInfo.authorities || !Array.isArray(userInfo.authorities)) {
        console.log("❌ No userInfo or authorities");
        return false;
    }

    const result = userInfo.authorities.includes(authority);
    console.log("✅ Authority check result:", result);
    return result;
}

/**
 * 사용자가 여러 권한 중 하나라도 가지고 있는지 확인하는 함수
 */
export function hasAnyAuthority(authorities: string[]): boolean {
    const userInfo = getStoredUserInfo();
    if (!userInfo || !userInfo.authorities || !Array.isArray(userInfo.authorities)) {
        return false;
    }

    return authorities.some(authority => userInfo.authorities.includes(authority));
}

/**
 * 사용자가 모든 권한을 가지고 있는지 확인하는 함수
 */
export function hasAllAuthorities(authorities: string[]): boolean {
    const userInfo = getStoredUserInfo();
    if (!userInfo || !userInfo.authorities || !Array.isArray(userInfo.authorities)) {
        return false;
    }

    return authorities.every(authority => userInfo.authorities.includes(authority));
}

/**
 * 사용자가 특정 역할을 가지고 있는지 확인하는 함수
 */
export function hasRole(role: string): boolean {
    const userInfo = getStoredUserInfo();
    if (!userInfo || !userInfo.role) {
        return false;
    }

    return userInfo.role === role;
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
