import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/entities/user/api/delete-user";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // 삭제 성공 시 유저 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
