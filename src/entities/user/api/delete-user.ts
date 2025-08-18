import api from "@/shared/lib/axios";

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/api/users/${userId}`);
}
