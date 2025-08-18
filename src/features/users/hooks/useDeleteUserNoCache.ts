import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/entities/user/api/delete-user";
import { toast } from "sonner";

export function useDeleteUserNoCache(limit: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            // 캐시 무효화만 - 빠르고 간단하게
            queryClient.invalidateQueries({ queryKey: ["users", { limit }] });
            toast.success("삭제되었습니다");
        },
        onError: (error) => {
            toast.error("삭제 실패");
            console.error("Delete failed:", error);
        }
    });
}
