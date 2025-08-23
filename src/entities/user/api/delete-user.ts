import api from "@/shared/lib/axios";

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/api/users/${id}`);
}
