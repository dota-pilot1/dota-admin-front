import api from "@/shared/lib/axios";
import { type User } from "@/entities/user/model/types";

type AnyUser = Record<string, unknown>;

function normalizeUser(u: AnyUser): User {
    const id = String(u.id ?? u.userId ?? u.uid ?? cryptoRandomId());
    const name = String(u.username ?? u.name ?? u.nick ?? "알수없음");
    const email = String(u.email ?? u.mail ?? `${id}@example.com`);
    const role = (u.role === "ADMIN" || u.role === "admin" ? "admin" : "member") as User["role"];
    const joinedAtValue = u.joinedAt ?? u.createdAt ?? Date.now();
    const joinedAt = new Date(joinedAtValue as string | number | Date).toISOString();
    const posts = Number.isFinite(u.posts) ? Number(u.posts) : 0;
    return { id, name, email, role, joinedAt, posts };
}

function cryptoRandomId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return (crypto as { randomUUID(): string }).randomUUID();
    }
    return Math.random().toString(36).slice(2);
}

type GetUsersResponse = {
    isComplete: boolean;
    totalElements: number;
    returnedCount: number;
    users: AnyUser[];
};

export async function getUsers(limit = 1000): Promise<User[]> {
    try {
        const { data } = await api.get<GetUsersResponse>("/api/users/all", {
            params: { limit },
        });

        if (!data.users || !Array.isArray(data.users)) {
            return [];
        }

        return data.users.map(normalizeUser);
    } catch (error) {
        console.error("getUsers 에러:", error);
        throw error;
    }
}