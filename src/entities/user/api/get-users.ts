import api from "@/shared/lib/axios";
import { type User } from "@/entities/user/model/types";

type AnyUser = Record<string, unknown>;

// 개발 환경에서 최초 몇 번만 원시 role 값들을 수집해 디버깅 (admin 카운트 0 이슈 분석)
const seenRawRoles: Set<string> = new Set();

function normalizeUser(u: AnyUser): User {
    // ID 우선순위: id -> userId -> uid -> 랜덤
    const id = String(u.id ?? u.userId ?? u.uid ?? cryptoRandomId());
    // 이름 우선순위: username -> name -> nick -> Fallback
    const name = String(u.username ?? u.name ?? u.nick ?? "알수없음");
    // 이메일 Fallback 보정
    const email = String(u.email ?? u.mail ?? `${id}@example.com`);

    // role 은 이제 문자열 혹은 객체 { id, name, description }
    let rawRole: string | undefined;
    if (typeof u.role === "string") {
        rawRole = u.role;
    } else if (u.role && typeof u.role === "object") {
        // name / code / id 등 중 하나에 ADMIN 이 들어있는지 탐색
        const rObj = u.role as Record<string, unknown>;
        if (typeof rObj.name === "string") rawRole = rObj.name;
        else if (typeof rObj.code === "string") rawRole = rObj.code;
        else if (typeof rObj.id === "string") rawRole = rObj.id;
    }
    const rawNorm = (rawRole ?? "USER").toString();
    if (process.env.NODE_ENV !== "production" && !seenRawRoles.has(rawNorm)) {
        seenRawRoles.add(rawNorm);
        // eslint-disable-next-line no-console
        console.debug("[getUsers] 발견한 원시 role:", Array.from(seenRawRoles));
    }
    const roleLower = rawNorm.toLowerCase();
    // ROLE_ADMIN, ADMIN_USER, SUPER_ADMIN 등 포함 패턴 허용
    const isAdmin = /(^|_|-|:)admin(?![a-z])/i.test(roleLower) || roleLower === "admin";
    const role: User["role"] = isAdmin ? "admin" : "member";

    // 날짜 필드 (서버가 joinedAt / createdAt 제공 안하면 현재시각)
    const joinedAtValue = u.joinedAt ?? u.createdAt ?? Date.now();
    const joinedAt = new Date(joinedAtValue as string | number | Date).toISOString();

    // 게시글 수(없으면 0)
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
    role?: string; // optional server-side role filter (e.g. ADMIN / USER)
    useAll?: boolean; // 강제로 /api/users/all 사용 (roleCounts 포함 전체 조회)
};

export type UsersResult = {
    items: User[];
    total: number;
    page: number;
    size: number;
    totalPages?: number;
    roleCounts?: { [k: string]: number };
};

// Fetch users with server-side pagination when available. Falls back to legacy /api/users/all.
export async function getUsers(params: UsersQuery = {}): Promise<UsersResult> {
    const page = Math.max(1, params.page ?? 1);
    const size = Math.max(1, params.size ?? 100);
    const q = params.q;
    const sort = params.sort;
    const role = params.role;
    const sortBy = params.sortBy;
    const sortDir = params.sortDir;
    const useAll = params.useAll === true; // 명시적 전체 조회

    try {
        // 1) 강제 전체 조회 모드 (roleCounts 활용)
        if (useAll) {
            const { data } = await api.get<{
                users?: unknown[];
                totalElements?: number;
                returnedCount?: number;
                isComplete?: boolean;
                roleCounts?: Record<string, number>;
            }>("/api/users/all", {
                params: {
                    limit: size,
                    q,
                    ...(role ? { role } : {}),
                    ...(sortBy ? { sortBy } : {}),
                    ...(sortDir ? { sortDir } : {}),
                    ...(sort && !sortBy ? { sort } : {}),
                },
            });
            const list: AnyUser[] = Array.isArray(data?.users) ? (data!.users as AnyUser[]) : [];
            const items = list.map(normalizeUser);
            const totalElements = Number(data?.totalElements ?? list.length) || list.length;
            return {
                items,
                total: totalElements,
                page: 1,
                size: list.length, // 실제 반환된 길이
                totalPages: 1,
                roleCounts: data?.roleCounts,
            };
        }

        // Preferred: paginated endpoint
        const { data } = await api.get<{
            content?: unknown[];
            users?: unknown[];
            totalElements?: number;
            totalPages?: number;
            number?: number;
            size?: number;
            currentPage?: number;
            roleCounts?: Record<string, number>; // 혹시 추가됐을 경우 수용
        }>("/api/users", {
            params: {
                page: page - 1, // 0-based page index
                size,
                q,
                ...(role ? { role } : {}),
                // Support both new (sortBy/sortDir) and legacy (sort) patterns
                ...(sortBy ? { sortBy } : {}),
                ...(sortDir ? { sortDir } : {}),
                ...(sort && !sortBy ? { sort } : {}),
            },
        });

        // Handle Spring Data style { content, totalElements, totalPages, number, size }
        if (data && Array.isArray(data.content)) {
            const items = data.content.map((item) => normalizeUser(item as AnyUser));
            return {
                items,
                total: Number(data.totalElements ?? items.length) || items.length,
                totalPages: Number(data.totalPages ?? Math.ceil(items.length / size)) || undefined,
                page,
                size,
                roleCounts: data.roleCounts,
            };
        }

        // Handle generic { users, currentPage, totalPages, size }
        if (data && Array.isArray(data.users)) {
            const items = data.users.map((item) => normalizeUser(item as AnyUser));
            // 새 스펙: { totalElements, users[], totalPages, currentPage(0-based), size }
            let total = Number(data.totalElements);
            const totalPagesRaw = Number(data.totalPages);
            const currentPageServer = Number(data.currentPage); // 0-based

            // totalElements 가 없고 totalPages 만 있는 경우 추정
            if (!Number.isFinite(total) && Number.isFinite(totalPagesRaw)) {
                if (Number.isFinite(currentPageServer)) {
                    const isLast = currentPageServer + 1 === totalPagesRaw;
                    total = isLast ? (totalPagesRaw - 1) * size + items.length : totalPagesRaw * size;
                } else {
                    total = totalPagesRaw * size; // 대략 추정
                }
            }
            const resultPage = Number.isFinite(currentPageServer) ? currentPageServer + 1 : page; // 1-based 반환
            return {
                items,
                total: Number.isFinite(total) ? (total as number) : items.length,
                totalPages: Number.isFinite(totalPagesRaw) ? (totalPagesRaw as number) : undefined,
                page: resultPage,
                size,
                roleCounts: data.roleCounts,
            };
        }

        // Fallback: legacy endpoint
        const legacy = await api.get<{
            users?: unknown[];
            totalElements?: number;
            returnedCount?: number;
            isComplete?: boolean;
            roleCounts?: Record<string, number>;
        }>("/api/users/all", { params: { limit: size, q, ...(role ? { role } : {}) } });
        const list: AnyUser[] = Array.isArray(legacy.data?.users) ? (legacy.data!.users as AnyUser[]) : [];
        const items = list.map(normalizeUser);
        const totalLegacy = Number(legacy.data?.totalElements ?? list.length) || list.length;
        return {
            items,
            total: totalLegacy,
            page: 1,
            size: list.length,
            totalPages: 1,
            roleCounts: legacy.data?.roleCounts,
        };
    } catch (error) {
        console.error("getUsers 에러:", error);
        throw error;
    }
}