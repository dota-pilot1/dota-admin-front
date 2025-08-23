"use client";

import React from "react";
import { generateUsers } from "@/entities/user/lib/dummy-users";
import { type User } from "@/entities/user/model/types";
import { ListWithCounter } from "@/shared/ui/list-with-counter";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type Mode = "css-counter" | "js-index";

export function LargeUserLab({ defaultCount = 2000 }: { defaultCount?: number }) {
  const [count, setCount] = React.useState(defaultCount);
  const [mode, setMode] = React.useState<Mode>("css-counter");
  const [users, setUsers] = React.useState<User[]>(() => generateUsers(defaultCount));
  const [lastOpMs, setLastOpMs] = React.useState<number | null>(null);

  const regenerate = React.useCallback(() => {
    const t0 = performance.now();
    const data = generateUsers(count);
    setUsers(data);
    setLastOpMs(performance.now() - t0);
  }, [count]);

  const onDeleteAt = React.useCallback(
    (idx: number) => {
      const t0 = performance.now();
      // Immutably remove to let React reconcile; keys are stable by id
      setUsers((prev) => {
        if (idx < 0 || idx >= prev.length) return prev;
        const copy = prev.slice(0, idx).concat(prev.slice(idx + 1));
        return copy;
      });
      setLastOpMs(performance.now() - t0);
    },
    []
  );

  const onDeleteFirst = () => onDeleteAt(0);
  const onDeleteMiddle = () => onDeleteAt(Math.floor(users.length / 2));
  const onDeleteLast = () => onDeleteAt(users.length - 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>대용량 유저 성능 랩</span>
          <span className="text-xs text-muted-foreground">모드: {mode} • 항목 {users.length.toLocaleString()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-muted-foreground">개수</label>
          <select
            className="rounded border px-2 py-1 text-sm"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={2000}>2000</option>
            <option value={5000}>5000</option>
          </select>
          <Button size="sm" variant="secondary" onClick={regenerate}>
            재생성
          </Button>

          <div className="ml-4 flex items-center gap-2">
            <label className="text-sm text-muted-foreground">번호 모드</label>
            <select
              className="rounded border px-2 py-1 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
            >
              <option value="css-counter">CSS counter</option>
              <option value="js-index">JS index</option>
            </select>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={onDeleteFirst}>첫번째 삭제</Button>
            <Button size="sm" onClick={onDeleteMiddle} variant="outline">가운데 삭제</Button>
            <Button size="sm" onClick={onDeleteLast} variant="destructive">마지막 삭제</Button>
          </div>
        </div>

        {lastOpMs !== null && (
          <div className="text-xs text-muted-foreground">마지막 작업: {lastOpMs.toFixed(2)} ms</div>
        )}

        <div className="h-96 overflow-auto rounded-md border p-2">
          {mode === "css-counter" ? (
            <ListWithCounter
              items={users}
              getKey={(u) => u.id} // Changed from u.userId to u.id
              renderRow={({ item }) => (
                <div className="flex items-center justify-between">
                  <span className="truncate">{item.username}</span>
                  <span className="text-xs text-muted-foreground">{item.email}</span>
                </div>
              )}
            />
          ) : (
            <ol className="list-none m-0 p-0">
              {users.map((u, i) => (
                <li key={u.id} className="flex items-center gap-3 py-2">
                  <div className="w-10 text-right pr-2 text-xs text-muted-foreground">{i + 1}</div>
                  <div className="min-w-0 flex-1 flex items-center justify-between">
                    <span className="truncate">{u.username}</span>
                    <span className="text-xs text-muted-foreground">{u.email}</span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </CardContent>
    </Card>
  );
}