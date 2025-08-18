import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/entities/user/api/delete-user";
import { toast } from "sonner";
import type { User } from "@/entities/user/model/types";

export function useDeleteUser(limit: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onMutate: async (userId: string) => {
            // Optimistic update - 즉시 UI에서 제거
            const queryKey = ["users", { limit }];
            await queryClient.cancelQueries({ queryKey });

            const previousUsers = queryClient.getQueryData(queryKey) as User[] | undefined;

            if (previousUsers) {
                const optimisticUsers = previousUsers.filter(user => user.id !== userId);
                queryClient.setQueryData(queryKey, optimisticUsers);
            }

            return { previousUsers };
        },
        onError: (error, userId, context) => {
            // 실패 시 이전 상태로 복원
            if (context?.previousUsers) {
                const queryKey = ["users", { limit }];
                queryClient.setQueryData(queryKey, context.previousUsers);
            }

            toast.error("삭제에 실패했습니다.");
        },
        onSuccess: () => {
            toast.success("사용자가 삭제되었습니다.");
        },
        onSettled: () => {
            // 서버 상태와 동기화
            const queryKey = ["users", { limit }];
            queryClient.invalidateQueries({ queryKey });
        }
    });
}
