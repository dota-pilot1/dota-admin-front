"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsers } from "@/entities/user/api/get-users";
import { type User } from "@/entities/user/model/types";

export function useUsers(limit = 1000) {
  return useQuery<User[]>({
    queryKey: ["users", { limit }],
    queryFn: () => getUsers(limit),
    // 캐시 최적화 비활성화 (성능 테스트용)
    // placeholderData: keepPreviousData,
    // staleTime: 30_000,
    staleTime: 0, // 캐시 즉시 무효화
    refetchOnMount: true, // 매번 새로 요청
    retry: 1,
  });
}
