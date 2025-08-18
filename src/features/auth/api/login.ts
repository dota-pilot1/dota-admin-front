import api from "@/shared/lib/axios";

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    username: string;
    token: string;
    email: string;
    role: string;
    userId: number;
    message: string;
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    // 직접 백엔드 로그인 API 호출
    const response = await api.post<LoginResponse>("/api/auth/login", payload);
    return response.data;
}
