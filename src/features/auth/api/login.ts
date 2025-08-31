import api from "@/shared/lib/axios";

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    message: string;
    token: string;
    id: number;
    username: string;
    email: string;
    role: string;
    authorities: string[];
    expiresIn: number; // 추가: 토큰 만료 시간 (초)
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    console.log("🔑 Login attempt:", { email: payload.email });
    
    try {
        // axios 인터셉터가 에러 처리를 하므로 여기서는 단순하게 처리
        const response = await api.post<LoginResponse>("/api/auth/login", payload);
        
        console.log("✅ Login success:", response.data);
        
        // 로그인 후 쿠키 확인
        console.log("🍪 Cookies after login:", document.cookie);
        
        return response.data;
    } catch (error: any) {
        console.error("❌ Login failed:", error.response?.data || error.message);
        throw error;
    }
}
