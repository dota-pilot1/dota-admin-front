import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";

export function useLogout() {
  const logoutStore = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await axios.post("/api/auth/logout");
    },
    onSuccess: () => {
      logoutStore.logout();
      router.replace("/login");
    },
  });
}
