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

// Prefer explicit override
let baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

if (!baseURL) {
    if (isBrowser) {
        const protocol = window.location.protocol || "http:";
        if (isLoopback) {
            // Same machine - loopback is fine
            baseURL = `${protocol}//localhost:8080`;
        } else if (isPrivateIPv4 || isMdnsLocal) {
            // Accessing via LAN IP or .local hostname from another device
            // Use the same host the site is served from, but port 8080 for backend
            baseURL = `${protocol}//${hostname}:8080`;
        } else {
            // Probably production-like domain
            baseURL = "https://api.dota-task.shop";
        }
    } else {
        // On the server (SSR): prefer explicit env; in development, default to localhost to match client
        if (process.env.NEXT_PUBLIC_API_BASE_URL) {
            baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        } else if (process.env.NODE_ENV !== "production") {
            baseURL = "http://localhost:8080";
        } else {
            baseURL = "https://api.dota-task.shop";
        }
    }
}

export function getApiBaseURL() {
    return baseURL;
}

const api = axios.create({
    baseURL,
    withCredentials: false, // JWT 헤더 사용하므로 불필요
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

// Response interceptor: 간단한 에러 처리
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 개발 환경에서만 로깅
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', error.response?.data || error.message);
            
            // 백엔드 표준 에러 응답 형식 상세 로깅
            if (error.response?.data) {
                const { success, message, errorCode, details, timestamp } = error.response.data;
                if (errorCode) {
                    console.error('🔍 Detailed Error Info:', {
                        success,
                        errorCode,
                        message,
                        details,
                        timestamp,
                        status: error.response.status,
                        url: error.response.config?.url
                    });
                }
            }
        }

        // 에러를 그대로 throw하여 각 훅에서 처리하도록 함
        return Promise.reject(error);
    }
);

export default api;
