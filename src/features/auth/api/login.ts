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
    try {
        // 직접 백엔드 로그인 API 호출
        const response = await api.post<LoginResponse>("/api/auth/login", payload);
        return response.data;
    } catch (error: any) {
        console.error('Login error:', error);
        
        // 서버에서 온 구체적인 에러 메시지 추출
        let errorMessage = "로그인에 실패했습니다.";
        
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
        } else if (error.response?.status) {
            switch (error.response.status) {
                case 400:
                    errorMessage = "이메일과 비밀번호를 확인해주세요.";
                    break;
                case 401:
                    errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
                    break;
                case 403:
                    errorMessage = "계정이 비활성화되었습니다.";
                    break;
                case 404:
                    errorMessage = "존재하지 않는 계정입니다.";
                    break;
                case 429:
                    errorMessage = "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.";
                    break;
                case 500:
                    errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
                    break;
                default:
                    errorMessage = `로그인 실패 (오류 코드: ${error.response.status})`;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
}
