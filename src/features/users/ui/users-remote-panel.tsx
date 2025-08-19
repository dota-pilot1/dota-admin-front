"use client";

import { useState, useCallback } from "react";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useDeleteUserOptimistic } from "@/features/users/hooks/useDeleteUserOptimistic";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
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
    const [sortOpt, setSortOpt] = useState<"id-asc" | "id-desc" | "username-asc" | "username-desc">("id-asc");
    const [role, setRole] = useState<"all" | "admin" | "member">("all");

    const sortBy = sortOpt.startsWith("username") ? "username" : "id";
    const sortDir = sortOpt.endsWith("desc") ? "desc" : "asc";

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
    const items = data?.items ?? [];
    const q = search.trim().toLowerCase();
    const pageItems = q
        ? items.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
        : items;
    const viewItems = role === "all" ? pageItems : pageItems.filter((u) => u.role === role);
    const totalPages = data?.totalPages || Math.max(1, Math.ceil((data?.total ?? 0) / pageSize)) || 1;
    const currentPage = Math.min(page, totalPages);
    const approxTotal = typeof data?.total === "number" ? data.total : (data?.totalPages ? data.totalPages * pageSize : undefined);

    return (
        <div className="w-full">
            {/* 상단 컨트롤 바 */}
            <div className="bg-card rounded-lg border p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium min-w-0">검색</label>
                        <Input
                            placeholder="이름 또는 이메일 검색"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="h-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium min-w-0">정렬</label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            value={sortOpt}
                            onChange={(e) => { setSortOpt(e.target.value as "id-asc" | "id-desc" | "username-asc" | "username-desc"); setPage(1); }}
                        >
                            <option value="id-asc">ID 오름차순</option>
                            <option value="id-desc">ID 내림차순</option>
                            <option value="username-asc">이름 오름차순</option>
                            <option value="username-desc">이름 내림차순</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium min-w-0">페이지당</label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            value={pageSize}
                            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        >
                            <option value={50}>50개</option>
                            <option value={100}>100개</option>
                            <option value={200}>200개</option>
                            <option value={500}>500개</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                {/* 왼쪽: 회원 목록 */}
                <div className="space-y-4">
                    {/* 빠른 필터 */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">표시:</span>
                        <Button size="sm" variant={role === "all" ? "default" : "outline"} onClick={() => setRole("all")}>
                            전체 ({pageItems.length})
                        </Button>
                        <Button size="sm" variant={role === "admin" ? "default" : "outline"} onClick={() => setRole("admin")}>
                            관리자 ({pageItems.filter(u => u.role === "admin").length})
                        </Button>
                        <Button size="sm" variant={role === "member" ? "default" : "outline"} onClick={() => setRole("member")}>
                            일반회원 ({pageItems.filter(u => u.role === "member").length})
                        </Button>
                        {isFetching && <span className="text-xs text-muted-foreground ml-auto">불러오는 중…</span>}
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                            <div className="text-center">
                                <div className="text-sm">로딩 중...</div>
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="flex items-center justify-center h-64 text-center">
                            <div>
                                <div className="text-red-600 font-medium mb-2">목록을 불러오지 못했습니다</div>
                                {(() => {
                                    const e = error as Error & { response?: { status?: number; statusText?: string } };
                                    const msg = e?.message || e?.toString?.();
                                    const status = e?.response?.status;
                                    const statusText = e?.response?.statusText;
                                    return (
                                        <div className="text-xs text-muted-foreground">
                                            {status ? `HTTP ${status}${statusText ? ` ${statusText}` : ""}` : null}
                                            {msg ? ` • ${msg}` : null}
                                        </div>
                                    );
                                })()}
                                <Button size="sm" className="mt-3" onClick={() => refetch()}>다시 시도</Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* 회원 목록 */}
                            <div className="rounded-lg border bg-card">
                                <div className="p-4">
                                    <div className="space-y-2">
                                        {viewItems.map((u, i) => (
                                            <UserListItem
                                                key={u.id}
                                                user={u}
                                                index={(currentPage - 1) * pageSize + i}
                                                onDelete={deleteAt}
                                            />
                                        ))}
                                        {viewItems.length === 0 && (
                                            <div className="text-center py-8 text-muted-foreground">
                                                표시할 회원이 없습니다
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 하단 페이지네이션 */}
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    {currentPage}/{totalPages} 페이지 • {(currentPage - 1) * pageSize + 1}–{(currentPage - 1) * pageSize + viewItems.length} / {typeof approxTotal === "number" ? approxTotal.toLocaleString() : "—"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" disabled={!!search.trim() || currentPage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                                        이전
                                    </Button>
                                    <Button size="sm" variant="outline" disabled={!!search.trim() || currentPage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                                        다음
                                    </Button>
                                    <Button size="sm" onClick={() => refetch()} disabled={isFetching}>
                                        새로고침
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* 오른쪽: 요약 정보 */}
                <aside className="space-y-4">
                    <div className="rounded-lg border bg-card p-4">
                        <h3 className="font-semibold mb-3">요약 정보</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">총 회원</span>
                                <span className="font-medium">{typeof approxTotal === "number" ? approxTotal.toLocaleString() : "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">현재 표시</span>
                                <span className="font-medium">{viewItems.length}명</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">페이지</span>
                                <span className="font-medium">{currentPage} / {totalPages}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">정렬</span>
                                <span className="font-medium">{sortBy === "id" ? "ID" : "이름"} {sortDir === "asc" ? "↑" : "↓"}</span>
                            </div>
                            {search && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">검색</span>
                                    <span className="font-medium truncate max-w-[120px]" title={search}>{search}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

