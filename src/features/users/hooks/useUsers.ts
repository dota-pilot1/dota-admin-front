"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/entities/user/api/get-users";
import { type User } from "@/entities/user/model/types";

export function useUsers(limit = 5000) {
    return useQuery<User[]>({
        queryKey: ["users", { limit }],
        queryFn: () => getUsers(limit),
        staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
        refetchOnWindowFocus: false,
    });
}
