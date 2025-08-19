import api from "@/shared/lib/axios";

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    error?: string;
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
    } catch (error: unknown) {
        console.error("Register error:", error);

        // 서버 응답에서 에러 메시지 추출
        let errorMessage = "회원가입에 실패했습니다.";

        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
            if (axiosError.response?.data) {
                const errorData = axiosError.response.data;
                // 서버 응답 형식: { error: "Username already exists", success: false, message: "Username already exists" }
                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                }
            }
        } else if (error instanceof Error && error.message) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
}
