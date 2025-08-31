import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginApi } from "../api/login";

export function useLogin() {
    const router = useRouter();

    return useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            console.log("🔐 Login response data:", data);
            console.log("🍪 Cookies before saving:", document.cookie);
            
            // localStorage에 토큰과 사용자 정보 저장
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userInfo", JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email,
                role: data.role,
                authorities: data.authorities
            }));
            
            console.log("💾 Data saved to localStorage");
            console.log("🍪 Cookies after login:", document.cookie);
            console.log("📦 LocalStorage check:", {
                authToken: localStorage.getItem("authToken") ? "saved" : "missing",
                userInfo: localStorage.getItem("userInfo") ? "saved" : "missing"
            });
            
            // 로그인 성공 이벤트 발생 (AuthGuard가 감지할 수 있도록)
            window.dispatchEvent(new CustomEvent('loginSuccess'));
            
            // 리다이렉트 시간을 늘려서 쿠키 설정이 완료될 시간 확보
            setTimeout(() => {
                console.log("🚀 Redirecting to challenge page");
                console.log("🔍 Final state check before redirect:", {
                    cookies: document.cookie,
                    localStorage: {
                        authToken: localStorage.getItem("authToken") ? "exists" : "missing",
                        userInfo: localStorage.getItem("userInfo") ? "exists" : "missing"
                    }
                });
                router.push("/challenge");
            }, 500); // 100ms에서 500ms로 증가
        },
        onError: (error) => {
            // 에러 메시지는 폼에서 표시하므로 toast는 제거
            console.error("Login error:", error);
        }
    });
}