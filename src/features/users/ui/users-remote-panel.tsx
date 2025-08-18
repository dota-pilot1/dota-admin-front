"use client";

import { useState, useCallback, useMemo } from "react";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useDeleteUserOptimistic } from "@/features/users/hooks/useDeleteUserOptimistic";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import type { User } from "@/entities/user/model/types";

// 순수 컴포넌트 - JavaScript로 인덱스 계산
function UserListItem({ user, index, onDelete }: { user: User; index: number; onDelete: (userId: string) => void }) {
    const indexDisplay = index + 1;

    return (
        <li className="flex items-center gap-3 py-2 border-b border-gray-100">
            <div className="w-12 text-right pr-2 text-xs text-muted-foreground font-mono flex-shrink-0">
                {indexDisplay}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1">
                    <span className="truncate font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
            </div>
            <div className="flex-shrink-0">
                <Button size="sm" variant="destructive" onClick={() => onDelete(user.id)}>
                    삭제
                </Button>
            </div>
        </li>
    );
}

export function UsersRemotePanel() {
    // 클라이언트 UX 상태 (서버 페이징/정렬 활용)
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(100);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<"id" | "username">("id");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const { data, isLoading, isError, error, refetch, isFetching } = useUsers({ page, size: pageSize, q: search || undefined, sortBy, sortDir });
    const deleteUserMutation = useDeleteUserOptimistic();

    const deleteAt = useCallback(async (userId: string) => {
        try {
            await deleteUserMutation.mutateAsync(userId);
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    }, [deleteUserMutation]);

    // 서버 페이징 결과 + 간단한 클라이언트 필터링(현재 페이지 한정)
    const pageItems = useMemo(() => {
        const items = data?.items ?? [];
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter((u) =>
            u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
    }, [data, search]);
    const totalPages = data?.totalPages || Math.max(1, Math.ceil((data?.total ?? 0) / pageSize)) || 1;
    const currentPage = Math.min(page, totalPages);

    return (
        <Card>
            <CardContent className="space-y-2">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground">검색</label>
                        <Input
                            placeholder="이름 또는 이메일 검색"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="h-8 w-56"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground">정렬</label>
                        <select
                            className="rounded border px-2 py-0 text-sm"
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value as any); setPage(1); }}
                        >
                            <option value="id">ID</option>
                            <option value="username">이름</option>
                        </select>
                        <select
                            className="rounded border px-2 py-0 text-sm"
                            value={sortDir}
                            onChange={(e) => { setSortDir(e.target.value as any); setPage(1); }}
                        >
                            <option value="asc">오름차순</option>
                            <option value="desc">내림차순</option>
                        </select>
                        <Button size="sm" onClick={() => refetch()} disabled={isFetching}>새로고침</Button>
                        {isFetching && <span className="text-xs text-muted-foreground">불러오는 중…</span>}
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground">페이지당</label>
                        <select
                            className="rounded border px-2 py-0 text-sm"
                            value={pageSize}
                            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        >
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={200}>200</option>
                            <option value={500}>500</option>
                        </select>
                    </div>
                </div>

                {/* count & pagination controls */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                        {search.trim()
                            ? `검색 결과 ${pageItems.length}건 (현재 페이지)`
                            : `${currentPage}/${totalPages} 페이지`}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" disabled={!!search.trim() || currentPage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>이전</Button>
                        <Button size="sm" variant="outline" disabled={!!search.trim() || currentPage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>다음</Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-sm text-muted-foreground">로딩 중…</div>
                ) : isError ? (
                    <div className="text-sm text-red-600">
                        목록을 불러오지 못했습니다.
                        {(() => {
                            const e = error as Error & { response?: { status?: number; statusText?: string } };
                            const msg = e?.message || e?.toString?.();
                            const status = e?.response?.status;
                            const statusText = e?.response?.statusText;
                            return (
                                <div className="mt-1 text-xs text-muted-foreground">
                                    {status ? `HTTP ${status}${statusText ? ` ${statusText}` : ""}` : null}
                                    {msg ? ` • ${msg}` : null}
                                </div>
                            );
                        })()}
                    </div>
                ) : (
                    <div className="h-[620px] overflow-auto rounded border p-2">
                        {/* JavaScript로 인덱스 계산하는 방식 */}
                        <div className="list-none m-0 p-0">
                            {pageItems.map((u, i) => (
                                <UserListItem
                                    key={u.id}
                                    user={u}
                                    index={(currentPage - 1) * pageSize + i}
                                    onDelete={deleteAt}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

