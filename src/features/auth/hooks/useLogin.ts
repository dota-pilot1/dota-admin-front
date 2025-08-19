import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/login";
import { toast } from "sonner";

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

            toast.success("로그인 성공!");
            
            // 페이지 새로고침으로 상태 갱신
            window.location.href = "/dashboard";
        },
        onError: (error: unknown) => {
            console.error("Login error:", error);
            const message = error instanceof Error ? error.message : "로그인에 실패했습니다";
            toast.error(message);
        }
    });
}
