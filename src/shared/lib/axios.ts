import axios from "axios";

const isBrowser = typeof window !== "undefined";
const hostname = isBrowser ? window.location.hostname : process.env.HOST || "";

// RFC1918 private ranges and common dev hosts
const isLoopback = hostname === "localhost" || hostname.startsWith("127.");
const isMdnsLocal = hostname.endsWith(".local");
const isPrivateIPv4 =
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

// 환경변수 우선, 없으면 자동 감지
let baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// 환경변수가 있으면 그것을 우선 사용
if (baseURL) {
    console.log("🔧 Using environment variable for API base URL:", baseURL);
} else {
    // 환경변수가 없을 때만 자동 감지
    if (isBrowser) {
        const protocol = window.location.protocol || "http:";
        
        // 프로덕션 도메인 강제 설정
        if (hostname === "dota-task.shop") {
            baseURL = "https://api.dota-task.shop";
            console.log("🔧 Force setting for production domain:", baseURL);
        } else if (isLoopback) {
            // Same machine - loopback is fine
            baseURL = `${protocol}//localhost:8080`;
        } else if (isPrivateIPv4 || isMdnsLocal) {
            // Accessing via LAN IP or .local hostname from another device
            // Use the same host the site is served from, but port 8080 for backend
            baseURL = `${protocol}//${hostname}:8080`;
        } else {
            // Other production-like domain
            baseURL = "https://api.dota-task.shop";
        }
    } else {
        // On the server (SSR)
        if (process.env.NODE_ENV !== "production") {
            baseURL = "http://localhost:8080";
        } else {
            baseURL = "https://api.dota-task.shop";
        }
    }
    console.log("🔧 Auto-detected API base URL:", baseURL);
}

export function getApiBaseURL() {
    return baseURL;
}

const api = axios.create({
    baseURL,
    withCredentials: true, // refresh_token 쿠키 포함하기 위해 true로 변경
});

// Request interceptor: localStorage에서 토큰 읽어서 헤더에 추가
api.interceptors.request.use((config) => {
    // 브라우저에서만 실행
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Response interceptor: 토큰 만료 시 자동 갱신
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const errorData = error.response?.data;
        const status = error.response?.status;
        
        // 401 에러이고 TOKEN_EXPIRED인 경우에만 refresh 시도
        if (status === 401 && 
            errorData?.errorCode === 'TOKEN_EXPIRED' && 
            !originalRequest._retry && 
            !originalRequest.url?.includes('/auth/refresh')) {
            
            if (process.env.NODE_ENV === 'development') {
                console.log("⏰ Token expired, attempting refresh");
            }
            
            originalRequest._retry = true;
            
            try {
                const { refreshToken } = await import("@/features/auth/api/refresh");
                const newToken = await refreshToken();
                
                if (process.env.NODE_ENV === 'development') {
                    console.log("✅ Token refresh successful, retrying request");
                }
                
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                if (process.env.NODE_ENV === 'development') {
                    console.log("❌ Token refresh failed");
                }
                return Promise.reject(refreshError);
            }
        }

        // 다른 모든 에러는 그대로 전달
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', {
                status,
                url: error.response?.config?.url,
                errorCode: errorData?.errorCode,
                message: errorData?.message || error.message
            });
        }

        return Promise.reject(error);
    }
);

export default api;
