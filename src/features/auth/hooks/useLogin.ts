import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/login";

interface LoginPayload {
    email: string;
    password: string;
}

export function useLogin() {
    return useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            // 토큰과 사용자 정보를 localStorage에 저장
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userInfo", JSON.stringify({
                username: data.username,
                email: data.email,
                role: data.role,
                userId: data.userId
            }));
            
            // 페이지 새로고침으로 상태 갱신
            window.location.href = "/dashboard";
        },
    });
}
