import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

interface LoginPayload {
    email: string;
    password: string;
}

export function useLogin() {
    const { checkAuth } = useAuthStore();

    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            const res = await axios.post("/api/auth/login", payload);
            return res.data;
        },
        onSuccess: () => {
            // 쿠키가 설정되었으므로 상태를 쿠키 기준으로 동기화
            checkAuth();
        },
    });
}
