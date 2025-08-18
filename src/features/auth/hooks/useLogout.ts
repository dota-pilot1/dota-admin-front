import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../api/logout";

export function useLogout() {
    return useMutation({
        mutationFn: logoutApi,
        // onSuccess는 필요 없음 (logoutApi에서 리다이렉트 처리)
    });
}
