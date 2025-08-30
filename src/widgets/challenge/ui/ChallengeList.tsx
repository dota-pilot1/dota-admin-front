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
                            {/* 헤더 - 고정 높이 */}
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3 w-full">
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg font-semibold leading-tight mb-1 truncate">
                                            {ch.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>작성자: {ch.username || ch.email || '알 수 없음'}</span>
                                            <span>•</span>
                                            <span>
                                                참여자 {ch.participantCount ?? (ch.participantIds?.length || 0)}명
                                                {ch.rewardedParticipantCount !== undefined && ch.rewardedParticipantCount > 0 && (
                                                    <span className="text-green-600 font-medium ml-1">
                                                        (포상 {ch.rewardedParticipantCount}명)
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    {/* 상태 배지 - 우측 상단에 고정 */}
                                    <div className="flex-shrink-0 ml-auto">
                                        <ChallengeStatusPanel 
                                            challengeId={ch.id}
                                            status={ch.status}
                                            mode="compact"
                                        />
                                    </div>
                                </div>
                            </CardHeader>

                            {/* 컨텐츠 - 유동적 높이 */}
                            <CardContent className="space-y-3 p-6 pt-0">
                                {/* 설명 */}
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

                                {/* 참여자 목록과 포상자 수 */}
                                {ch.participants && ch.participants.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-muted-foreground font-medium">최근 참여자</div>
                                            {ch.rewardedParticipantCount !== undefined && ch.rewardedParticipantCount > 0 && (
                                                <div className="text-xs text-green-600 font-medium">
                                                    포상 {ch.rewardedParticipantCount}명
                                                </div>
                                            )}
                                        </div>
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

                                {/* 하단 영역 - 날짜와 버튼 */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    {/* 챌린지 기간 - 좌하단 */}
                                    <div className="text-xs text-muted-foreground flex-1">
                                        {ch.startDate && ch.endDate ? 
                                            `${new Date(ch.startDate).toLocaleDateString()} ~ ${new Date(ch.endDate).toLocaleDateString()}` :
                                            ch.startDate ? `시작: ${new Date(ch.startDate).toLocaleDateString()}` :
                                            ch.endDate ? `마감: ${new Date(ch.endDate).toLocaleDateString()}` : null
                                        }
                                    </div>
                                    
                                    {/* 참여 버튼 - 우하단 */}
                                    <div className="flex-shrink-0 ml-2">
                                        <ParticipateChallengeButton 
                                            challengeId={ch.id}
                                            authorId={ch.authorId}
                                            className="w-20 h-8 text-xs"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    );
}
