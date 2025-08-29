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
        <div className="grid grid-cols-1 gap-4">
            {items.map((ch) => (
                <div key={ch.id} className="relative group">
                    {/* 참여 버튼 - 오른쪽 위 고정 위치 */}
                    <div className="absolute top-3 right-3 z-10">
                        <ParticipateChallengeButton 
                            challengeId={ch.id}
                            className="w-24 h-8 text-xs"
                        />
                    </div>

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
                        <Card className={`${selectedId === ch.id ? "border-primary shadow-md" : "hover:border-foreground/30 hover:shadow-sm"} transition-all duration-200 border-2`}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg font-semibold leading-tight mb-1 truncate">
                                            {ch.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>작성자: {ch.username || ch.email || '알 수 없음'}</span>
                                            <span>•</span>
                                            <span>참여자 {ch.participantCount ?? (ch.participantIds?.length || 0)}명</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {ch.description}
                                </div>

                                {/* 보상 정보 */}
                                {ch.rewardAmount && (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            💰 {ch.rewardAmount.toLocaleString()}원
                                        </Badge>
                                        {ch.rewardType && (
                                            <Badge variant="outline" className="text-xs">
                                                {ch.rewardType}
                                            </Badge>
                                        )}
                                    </div>
                                )}

                                {/* 참여자 목록 (최대 3명 표시) */}
                                {ch.participants && ch.participants.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="text-xs text-muted-foreground font-medium">최근 참여자</div>
                                        <div className="flex flex-wrap gap-1">
                                            {ch.participants.slice(0, 3).map((participant: Participant) => (
                                                <Badge key={participant.id} variant="secondary" className="text-xs px-2 py-1">
                                                    {participant.name}
                                                </Badge>
                                            ))}
                                            {ch.participants.length > 3 && (
                                                <Badge variant="outline" className="text-xs px-2 py-1">
                                                    +{ch.participants.length - 3}명
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 상태 및 액션 버튼들 */}
                                <div className="flex items-center justify-end">
                                    <ChallengeStatusPanel 
                                        challengeId={ch.id}
                                        status={ch.status}
                                        mode="compact"
                                    />
                                </div>

                                {/* 챌린지 기간 */}
                                {(ch.startDate || ch.endDate) && (
                                    <div className="text-xs text-muted-foreground">
                                        {ch.startDate && ch.endDate ? 
                                            `${new Date(ch.startDate).toLocaleDateString()} ~ ${new Date(ch.endDate).toLocaleDateString()}` :
                                            ch.startDate ? `시작: ${new Date(ch.startDate).toLocaleDateString()}` :
                                            ch.endDate ? `마감: ${new Date(ch.endDate).toLocaleDateString()}` : null
                                        }
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    );
}
