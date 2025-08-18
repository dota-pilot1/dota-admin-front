"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/entities/user/api/get-users";
import { type User } from "@/entities/user/model/types";

export function useUsers(limit = 5000) {
    return useQuery<User[]>({
        queryKey: ["users", { limit }],
        queryFn: () => getUsers(limit),
        // JSP 방식 시뮬레이션: 캐시 완전 비활성화
        staleTime: 0, // 캐시 즉시 무효화
        gcTime: 0, // 캐시 즉시 삭제
        refetchOnMount: true, // 매번 새로 요청
        refetchOnWindowFocus: false,
        retry: 1,
    });
}
