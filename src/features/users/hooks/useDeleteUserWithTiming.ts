import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/entities/user/api/delete-user";
import { toast } from "sonner";

// 시간 측정 포함 버전
export function useDeleteUserWithTiming(limit: number, onTimingUpdate: (time: number) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const startTime = performance.now();
            
            try {
                await deleteUser(id);
                return startTime;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: (startTime) => {
            const endTime = performance.now();
            // duration은 logging이나 디버깅 목적으로 활용 가능
            console.log(`Delete operation took: ${endTime - startTime}ms`);
            
            // 삭제 완료 후 전체 데이터 다시 로드
            const queryKey = ["users", { limit }];
            queryClient.invalidateQueries({ queryKey }).then(() => {
                const finalTime = performance.now();
                const totalDuration = finalTime - startTime;
                onTimingUpdate(totalDuration);
            });
            
            toast.success("사용자가 삭제되었습니다.");
        },
        onError: (error) => {
            toast.error("삭제에 실패했습니다.");
            console.error("Delete failed:", error);
        }
    });
}
