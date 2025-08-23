import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginApi } from "../api/login";

export function useLogin() {
    const router = useRouter();

    return useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            // 토큰과 사용자 정보 모두 localStorage에 저장
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userInfo", JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email,
                role: data.role,
                authorities: data.authorities
            }));
            
            console.log("✅ Token and user info saved");

            toast.success(data.message || "로그인 성공!");

            // 약간의 지연 후 라우팅 (localStorage 동기화 대기)
            setTimeout(() => {
                console.log("🔄 Redirecting to dashboard...");
                router.push("/dashboard");
            }, 100);
        },
        onError: (error) => {
            // 에러 메시지는 폼에서 표시하므로 toast는 제거
            console.error("Login error:", error);
        }
    });
}
