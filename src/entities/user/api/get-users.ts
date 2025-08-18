import api from "@/shared/lib/axios";
import { type User } from "@/entities/user/model/types";

type AnyUser = Record<string, any>;

function normalizeUser(u: AnyUser): User {
    const id = String(u.id ?? u.userId ?? u.uid ?? cryptoRandomId());
    const name = String(u.username ?? u.name ?? u.nick ?? "알수없음");
    const email = String(u.email ?? u.mail ?? `${id}@example.com`);
    const role = (u.role === "ADMIN" || u.role === "admin" ? "admin" : "member") as User["role"];
    const joinedAt = new Date(u.joinedAt ?? u.createdAt ?? Date.now()).toISOString();
    const posts = Number.isFinite(u.posts) ? Number(u.posts) : 0;
    return { id, name, email, role, joinedAt, posts };
}

function cryptoRandomId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return (crypto as any).randomUUID();
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
    console.log("getUsers - 호출됨, limit:", limit);

    try {
        // 다시 직접 백엔드 호출 (axios interceptor가 토큰 헤더 자동 추가)
        const { data } = await api.get<GetUsersResponse>("/api/users/all", {
            params: { limit },
        });

        console.log("getUsers - 원본 응답 데이터:", data);
        console.log("getUsers - 데이터 타입:", typeof data);
        console.log("getUsers - users 배열:", data.users);
        console.log("getUsers - users 배열인가?:", Array.isArray(data.users));

        if (!data.users || !Array.isArray(data.users)) {
            console.log("getUsers - users가 배열이 아님, 빈 배열 반환");
            return [];
        }

        const normalizedData = data.users.map(normalizeUser);
        console.log("getUsers - 정규화된 데이터:", normalizedData);

        return normalizedData;
    } catch (error) {
        console.error("getUsers - 에러 발생:", error);
        throw error;
    }
}