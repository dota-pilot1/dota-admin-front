"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ParticipateChallengeButton } from "@/features/challenge/ui/ParticipateChallengeButton";
import type { Challenge } from "@/features/challenge/api/getChallengeList";

export type Participant = {
    id: number;
    name: string;
    email?: string;
    achievedAt?: string;
};

export function ChallengeList({ items, onSelect, selectedId }: {
    items: Challenge[];
    selectedId?: number | null;
    onSelect: (id: number) => void;
}) {
    return (
        <div className="grid grid-cols-1 gap-3">
            {items.map((ch) => (
                <div key={ch.id} className="relative">
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelect(ch.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelect(ch.id);
                            }
                        }}
                        className="text-left w-full cursor-pointer focus:outline-none"
                    >
                        <Card className={selectedId === ch.id ? "border-primary" : "hover:border-foreground/30 transition-colors"}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center justify-between gap-3">
                                    <span className="truncate">{ch.title}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="text-sm text-muted-foreground line-clamp-2">{ch.description}</div>
                                <div className="text-[11px] text-muted-foreground">참여자 {ch.participantCount ?? (ch.participantIds?.length || 0)}명</div>
                                <div className="flex justify-end pt-2">
                                    <ParticipateChallengeButton 
                                        challengeId={ch.id}
                                        className="w-20"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    );
}
