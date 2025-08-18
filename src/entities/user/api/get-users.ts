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

export type UsersQuery = {
    page?: number; // 1-based
    size?: number;
    q?: string;
    // Preferred new API params
    sortBy?: string; // e.g. id | username | name
    sortDir?: "asc" | "desc";
    // Back-compat for Spring style
    sort?: string; // e.g. name,asc
};

export type UsersResult = {
    items: User[];
    total: number;
    page: number;
    size: number;
    totalPages?: number;
};

// Fetch users with server-side pagination when available. Falls back to legacy /api/users/all.
export async function getUsers(params: UsersQuery = {}): Promise<UsersResult> {
    const page = Math.max(1, params.page ?? 1);
    const size = Math.max(1, params.size ?? 100);
    const q = params.q;
    const sort = params.sort;
    const sortBy = params.sortBy;
    const sortDir = params.sortDir;

    try {
        // Preferred: paginated endpoint
        const { data } = await api.get<any>("/api/users", {
            params: {
                page: page - 1, // 0-based page index
                size,
                q,
                // Support both new (sortBy/sortDir) and legacy (sort) patterns
                ...(sortBy ? { sortBy } : {}),
                ...(sortDir ? { sortDir } : {}),
                ...(sort && !sortBy ? { sort } : {}),
            },
        });

        // Handle Spring Data style { content, totalElements, totalPages, number, size }
        if (data && Array.isArray(data.content)) {
            const items = data.content.map(normalizeUser);
            return {
                items,
                total: Number(data.totalElements ?? items.length) || items.length,
                totalPages: Number(data.totalPages ?? Math.ceil(items.length / size)) || undefined,
                page,
                size,
            };
        }

        // Handle generic { users, currentPage, totalPages, size }
        if (data && Array.isArray(data.users)) {
            const items = data.users.map(normalizeUser);
            // total이 명시되지 않았다면 totalPages와 size를 이용해 근사치 계산
            let total = Number(data.totalElements);
            let totalPages = Number(data.totalPages);
            if (!Number.isFinite(total) && Number.isFinite(totalPages)) {
                // 마지막 페이지 여부에 따라 추정값 계산
                const currentPage = Number(data.currentPage);
                if (Number.isFinite(currentPage) && Number.isFinite(totalPages)) {
                    const isLast = currentPage + 1 === totalPages;
                    total = isLast ? (totalPages - 1) * size + items.length : totalPages * size;
                } else {
                    total = items.length;
                }
            }
            return {
                items,
                total: Number.isFinite(total) ? (total as number) : items.length,
                totalPages: Number.isFinite(totalPages) ? (totalPages as number) : undefined,
                page,
                size,
            };
        }

        // Fallback: legacy endpoint
        const legacy = await api.get<any>("/api/users/all", { params: { limit: size } });
        const list: AnyUser[] = Array.isArray(legacy.data?.users) ? legacy.data.users : [];
        const items = list.map(normalizeUser);
        return { items, total: items.length, page, size };
    } catch (error) {
        console.error("getUsers 에러:", error);
        throw error;
    }
}