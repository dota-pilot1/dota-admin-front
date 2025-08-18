"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers, type UsersQuery, type UsersResult } from "@/entities/user/api/get-users";

export function useUsers(params: UsersQuery) {
    return useQuery<UsersResult>({
        queryKey: ["users", params],
        queryFn: () => getUsers(params),
        staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
        refetchOnWindowFocus: false,
    });
}
