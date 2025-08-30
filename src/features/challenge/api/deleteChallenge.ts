import api from '@/shared/lib/axios';

export async function apiForDeleteChallenge(challengeId: number): Promise<{ success: boolean; message?: string }> {
  const { data } = await api.delete(`/api/challenges/${challengeId}`);
  return data;
}
