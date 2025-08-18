"use client";

import { useState, useCallback, useEffect } from "react";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useDeleteUserNoCache } from "@/features/users/hooks/useDeleteUserNoCache";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { getApiBaseURL } from "@/shared/lib/axios";
import type { User } from "@/entities/user/model/types";
import styles from "./users-remote-panel-css.module.css";

// CSS Counter를 사용하는 순수 컴포넌트
function UserListItemCSS({ user, onDelete }: { user: User; onDelete: (userId: string) => void }) {
    return (
        <li className={`${styles.counterItem} flex items-center gap-3 py-2 border-b border-gray-100`}>
            {/* CSS Counter가 자동으로 번호를 생성 */}
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

export function UsersRemotePanelCSS() {
    const [limit, setLimit] = useState(10000);
    const [lastDeleteTime, setLastDeleteTime] = useState<number | null>(null);
    const { data, isLoading, isError, error, refetch, isFetching } = useUsers(limit);
    const deleteUserMutation = useDeleteUserNoCache(limit);
    const [reqUrl, setReqUrl] = useState("");

    useEffect(() => {
        const base = getApiBaseURL();
        const url = `${base.replace(/\/$/, "")}/api/users/all?limit=${limit}`;
        setReqUrl(url);
    }, [limit]);

    const deleteAt = useCallback(async (userId: string) => {
        const startTime = performance.now();
        try {
            await deleteUserMutation.mutateAsync(userId);
            const endTime = performance.now();
            setLastDeleteTime(endTime - startTime);
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    }, [deleteUserMutation]);

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">회원 목록 (CSS Counter 최적화 + 캐시 비활성화)</CardTitle>
                    {lastDeleteTime !== null && (
                        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">삭제 소요 시간</div>
                            <div className="text-sm font-bold text-green-800 dark:text-green-200">
                                {lastDeleteTime.toFixed(2)}ms
                            </div>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground">limit</label>
                        <select
                            className="rounded border px-2 py-0 text-sm"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                        >
                            <option value={1000}>1000</option>
                            <option value={2000}>2000</option>
                            <option value={5000}>5000</option>
                            <option value={10000}>10000</option>
                            <option value={20000}>20000</option>
                            <option value={50000}>50000</option>
                            <option value={100000}>100000</option>
                        </select>
                        <Button size="sm" onClick={() => refetch()} disabled={isFetching}>새로고침</Button>
                        {isFetching && <span className="text-xs text-muted-foreground">불러오는 중…</span>}
                    </div>

                    {reqUrl && (
                        <div className="text-xs text-muted-foreground flex-1 min-w-0">
                            요청 URL: <a className="underline truncate" href={reqUrl} target="_blank" rel="noreferrer">{reqUrl}</a>
                        </div>
                    )}
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
                    <div className="h-[600px] overflow-auto rounded border p-2">
                        {/* CSS Counter로 자동 번호 매기기 */}
                        <ol className={styles.counterList}>
                            {(data ?? []).map((u) => (
                                <UserListItemCSS
                                    key={u.id}
                                    user={u}
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