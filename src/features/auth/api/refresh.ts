import api from "@/shared/lib/axios";

interface RefreshResponse {
    accessToken: string;
    expiresIn: number;
}

let refreshPromise: Promise<string> | null = null;

// 토큰 갱신 API 호출
async function refreshTokenApi(): Promise<string> {
    // 디버깅: 쿠키 확인
    console.log("🍪 Current cookies:", document.cookie);
    
    try {
        const response = await api.post<RefreshResponse>("/api/auth/refresh");
        console.log("✅ Refresh token success:", response.data);
        return response.data.accessToken;
    } catch (error: any) {
        console.error("❌ Refresh token failed:", error.response?.data || error.message);
        
        // NO_REFRESH_COOKIE 에러이고 페이지 로드 직후라면 잠시 대기 후 재시도
        if (error.response?.data?.error === "NO_REFRESH_COOKIE") {
            const now = Date.now();
            const pageLoadTime = window.performance.timing.loadEventEnd;
            const timeSincePageLoad = now - pageLoadTime;
            
            if (timeSincePageLoad < 2000) { // 페이지 로드 후 2초 이내라면
                console.log("⏳ Page just loaded and no refresh cookie, waiting and retrying...");
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // 한 번 더 시도
                try {
                    const retryResponse = await api.post<RefreshResponse>("/api/auth/refresh");
                    console.log("✅ Refresh token success on retry:", retryResponse.data);
                    return retryResponse.data.accessToken;
                } catch (retryError: any) {
                    console.error("❌ Refresh token failed on retry:", retryError.response?.data || retryError.message);
                    throw retryError;
                }
            }
        }
        
        throw error;
    }
}

// 동시 요청 중복 방지를 위한 토큰 갱신 함수
export async function refreshToken(): Promise<string> {
    if (refreshPromise) {
        console.log("🔄 Reusing existing refresh promise");
        return refreshPromise;
    }

    console.log("🚀 Starting new refresh token request");
    refreshPromise = refreshTokenApi()
        .then((newToken) => {
            // localStorage에 새 토큰 저장
            localStorage.setItem("authToken", newToken);
            console.log("💾 New token saved to localStorage");
            return newToken;
        })
        .catch((error) => {
            console.error("💥 Refresh failed, will redirect to login in 5 seconds");
            console.error("Error details:", error.response?.data || error.message);
            console.error("Current cookies:", document.cookie);
            console.error("LocalStorage token:", localStorage.getItem("authToken")?.substring(0, 20) + "...");
            
            // 갱신 실패 시 로그아웃 처리
            localStorage.removeItem("authToken");
            localStorage.removeItem("userInfo");
            
            // 디버깅을 위해 5초 지연 후 리다이렉트
            setTimeout(() => {
                console.error("🔄 Now redirecting to login page");
                window.location.href = "/login";
            }, 5000);
            
            throw error;
        })
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
}
