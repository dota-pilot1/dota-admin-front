"use client";

import { ListWithCounter } from "@/shared/ui/list-with-counter";
import { type User } from "@/entities/user/model/types";

export function FreeboardCounterPanel({ users }: { users: User[] }) {
    return (
        <div className="mt-6">
            <h2 className="mb-2 text-sm font-medium">대용량 유저 목록 (CSS counter)</h2>
            <div className="rounded-md border p-2 h-80 overflow-auto">
                <ListWithCounter
                    items={users}
                    getKey={(u) => u.id}
                    renderRow={({ item }) => (
                        <div className="flex items-center justify-between">
                            <span className="truncate">{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.email}</span>
                        </div>
                    )}
                />
            </div>
        </div>
    );
}
