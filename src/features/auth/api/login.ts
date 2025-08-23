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
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    // axios 인터셉터가 에러 처리를 하므로 여기서는 단순하게 처리
    const response = await api.post<LoginResponse>("/api/auth/login", payload);
    return response.data;
}
