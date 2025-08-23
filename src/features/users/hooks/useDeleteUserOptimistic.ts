import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/entities/user/api/delete-user";
import { toast } from "sonner";
import type { User } from "@/entities/user/model/types";
import type { UsersResult } from "@/entities/user/api/get-users";

// 캐시 활용 + Optimistic Update 버전 - 빠른 성능
export function useDeleteUserOptimistic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onMutate: async (deletedId: string) => {
            // 진행 중인 모든 users 관련 쿼리 취소
            await queryClient.cancelQueries({ queryKey: ["users"] });

            // 간단한 optimistic update: 현재 활성 페이지(들)의 items에서 제거
            const affected: Array<{ key: unknown[]; data?: UsersResult }> = [];
            const queries = queryClient.getQueryCache().findAll({ queryKey: ["users"] });
            for (const q of queries) {
                const key = q.queryKey as unknown[];
                const data = queryClient.getQueryData<UsersResult>(key);
                affected.push({ key, data });
                if (data && Array.isArray(data.items)) {
                    const next: UsersResult = {
                        ...data,
                        items: data.items.filter((u: User) => u.id !== Number(deletedId)),
                        total: typeof data.total === "number" ? Math.max(0, data.total - 1) : data.total,
                    };
                    queryClient.setQueryData(key, next);
                }
            }

            return { affected };
        },
        onError: (err, _deletedId, context) => {
            // 실패 시 이전 데이터로 복구
            if (context?.affected) {
                for (const { key, data } of context.affected) {
                    if (data) queryClient.setQueryData(key, data);
                }
            }
            toast.error("삭제에 실패했습니다.");
            console.error("Delete failed:", err);
        },
        onSuccess: () => {
            toast.success("삭제되었습니다");
        },
        onSettled: () => {
            // 성공/실패 관계없이 서버 데이터와 동기화
            queryClient.invalidateQueries({ queryKey: ["users"] });
        }
    });
}
