import api from "@/shared/lib/axios";

interface MeResponse {
    id: number;
    username: string;
    email: string;
    role: string;
}

export async function getCurrentUserApi(): Promise<MeResponse> {
    const response = await api.get<MeResponse>("/api/auth/me");
    return response.data;
}
