"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ParticipateChallengeButton } from "@/features/challenge/ui/ParticipateChallengeButton";
import { ChallengeStatusPanel } from "@/shared/components/ChallengeStatusPanel";
import type { Challenge, Participant } from "@/features/challenge/api/getChallengeList";

export function ChallengeList({ items, onSelect, selectedId }: {
    items: Challenge[];
    selectedId?: number | null;
    onSelect: (id: number) => void;
}) {
    return (
        <div className="grid grid-cols-1 gap-3">
            {items.map((ch) => (
                <div key={ch.id} className="relative group">
                    <div
                        tabIndex={0}
                        onClick={() => onSelect(ch.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelect(ch.id);
                            }
                        }}
                        className="text-left w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
                        role="button"
                        aria-label={`${ch.title} 챌린지 선택`}
                    >
                        <Card className={`${selectedId === ch.id ? "border-primary shadow-md" : "hover:border-foreground/30 hover:shadow-sm"} transition-all duration-200 border-2 p-4`}>
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <div className="text-base font-semibold truncate">{ch.title}</div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <span>참여 {ch.participantCount ?? (ch.participantIds?.length || 0)}명</span>
                                        <span>•</span>
                                        <span className={`font-medium ${(ch.rewardedParticipantCount ?? 0) > 0 ? 'text-green-600' : 'text-gray-500'}`}>포상 {(ch.rewardedParticipantCount ?? 0)}명</span>
                                    </div>
                                </div>
                                <ChallengeStatusPanel 
                                    challengeId={ch.id}
                                    status={ch.status}
                                    mode="compact"
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    );
}
