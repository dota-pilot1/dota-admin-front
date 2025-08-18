import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/entities/user/api/delete-user";
import { toast } from "sonner";

// 캐시 비활성화 버전 - 실제 서버 동작과 동일
export function useDeleteUserNoCache(limit: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            // Optimistic update 없이 서버에서 새로 데이터 받기
            const queryKey = ["users", { limit }];
            queryClient.invalidateQueries({ queryKey });
            toast.success("사용자가 삭제되었습니다.");
        },
        onError: (error) => {
            toast.error("삭제에 실패했습니다.");
            console.error("Delete failed:", error);
        }
    });
}
