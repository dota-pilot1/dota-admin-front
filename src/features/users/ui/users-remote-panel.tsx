"use client";

import { useState, useCallback, useEffect } from "react";
import { useUsers } from "@/features/users/hooks/useUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
// Intentionally not using CSS counter here; we render index via JS (i+1)
import { useQueryClient } from "@tanstack/react-query";
import { getApiBaseURL } from "@/shared/lib/axios";
import type { User } from "@/entities/user/model/types";

// React.memo 없는 순수 컴포넌트로 최적화 제거
function UserListItem({ user, index, onDelete }: { user: User; index: number; onDelete: (index: number) => void }) {
    // 의도적으로 무거운 계산 추가 (성능 테스트용)
    const heavyCalc = Math.sin(index) * Math.cos(index * 2) * Math.tan(index / 100);
    const indexDisplay = index + 1;

    console.log(`UserListItem 렌더링: ${user.name} (인덱스 ${indexDisplay})`);

    return (
        <li className="flex items-center gap-3 py-2 border-b border-gray-100">
            <div className="w-10 text-right pr-2 text-xs text-muted-foreground font-mono">
                {indexDisplay}
            </div>
            <div className="min-w-0 flex-1 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                    <span className="text-xs text-green-600">계산값: {heavyCalc.toFixed(4)}</span>
                </div>
            </div>
            <Button size="sm" variant="destructive" onClick={() => onDelete(index)}>
                삭제
            </Button>
        </li>
    );
}

export function UsersRemotePanel() {
    const [limit, setLimit] = useState(5000);
    const { data, isLoading, isError, error, refetch, isFetching } = useUsers(limit);
    const queryClient = useQueryClient();
    const [reqUrl, setReqUrl] = useState("");

    // 디버깅을 위한 로그 추가
    useEffect(() => {
        console.log("UsersRemotePanel - data:", data);
        console.log("UsersRemotePanel - isLoading:", isLoading);
        console.log("UsersRemotePanel - isError:", isError);
        console.log("UsersRemotePanel - error:", error);
    }, [data, isLoading, isError, error]);

    useEffect(() => {
        const base = getApiBaseURL();
        const url = `${base.replace(/\/$/, "")}/api/users/all?limit=${limit}`;
        setReqUrl(url);
    }, [limit]);

    const deleteAt = useCallback((index: number) => {
        console.time(`삭제 성능 측정`);
        console.log(`삭제 버튼 클릭: 인덱스 ${index}`);
        const key = ["users", { limit }];
        const current = (queryClient.getQueryData(key) as User[] | undefined) ?? [];
        if (index < 0 || index >= current.length) return;

        // React 자동 배칭 비활성화를 위해 flushSync 사용
        import('react-dom').then(({ flushSync }) => {
            flushSync(() => {
                const next = [...current];
                next.splice(index, 1);
                queryClient.setQueryData(key, next);
            });
            console.timeEnd(`삭제 성능 측정`);
            console.log(`삭제 후 남은 항목 수: ${current.length - 1}`);
        });
    }, [limit, queryClient]);

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle>원격 유저 목록</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">limit</label>
                    <select
                        className="rounded border px-2 py-1 text-sm"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                    >
                        <option value={100}>100</option>
                        <option value={500}>500</option>
                        <option value={1000}>1000</option>
                        <option value={2000}>2000</option>
                        <option value={3000}>3000</option>
                        <option value={5000}>5000</option>
                        <option value={10000}>10000</option>
                        <option value={20000}>20000</option>
                    </select>
                    <Button size="sm" onClick={() => refetch()} disabled={isFetching}>새로고침</Button>
                    {isFetching && <span className="text-xs text-muted-foreground">불러오는 중…</span>}
                </div>

                {reqUrl && (
                    <div className="text-xs text-muted-foreground">요청 URL: <a className="underline" href={reqUrl} target="_blank" rel="noreferrer">{reqUrl}</a></div>
                )}

                {isLoading ? (
                    <div className="text-sm text-muted-foreground">로딩 중…</div>
                ) : isError ? (
                    <div className="text-sm text-red-600">
                        목록을 불러오지 못했습니다.
                        {(() => {
                            const e = error as any;
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
                    <div className="h-96 overflow-auto rounded border p-2">
                        <ol className="list-none m-0 p-0">
                            {(data ?? []).map((u, i) => (
                                <UserListItem
                                    key={`${u.id}-${i}`} // 의도적으로 인덱스 포함한 키로 최적화 방해
                                    user={u}
                                    index={i}
                                    onDelete={deleteAt}
                                />
                            ))}
                        </ol>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

