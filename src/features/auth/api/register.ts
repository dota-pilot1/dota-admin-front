import api from "@/shared/lib/axios";

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        username: string;
        email: string;
    };
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
        const response = await api.post<RegisterResponse>("/api/auth/register", data);
        return response.data;
    } catch (error) {
        console.error("Register error:", error);
        throw new Error("회원가입에 실패했습니다.");
    }
}
