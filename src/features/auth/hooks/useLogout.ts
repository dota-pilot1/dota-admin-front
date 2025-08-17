import { useMutation } from "@tanstack/react-query";
import api from "@/shared/lib/axios";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";

export function useLogout() {
  const logoutStore = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
  await api.post("/api/auth/logout");
    },
    onSuccess: () => {
      logoutStore.logout();
      router.replace("/login");
    },
  });
}
