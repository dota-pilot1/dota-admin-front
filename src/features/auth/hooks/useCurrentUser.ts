import { useQuery } from "@tanstack/react-query";
import { getCurrentUserApi } from "../api/me";

export function useCurrentUser(enabled = true) {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: getCurrentUserApi,
        enabled: enabled && typeof window !== "undefined" && !!localStorage.getItem("authToken"),
        retry: false, // 401 시 재시도하지 않음
        staleTime: 1000 * 60 * 5, // 5분간 캐시
    });
}
