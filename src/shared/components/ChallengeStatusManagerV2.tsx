"use client";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MoreHorizontal, Play, CheckCircle2 } from "lucide-react";
import { useChallengeStatusChange } from '@/features/challenge/hooks/useChallengeStatusChange';

interface ChallengeStatusManagerV2Props {
    challengeId: number;
    status: string;
    // 표시 모드: 'badge-only' | 'compact' | 'full'
    mode?: 'badge-only' | 'compact' | 'full';
    // 컴팩트 모드에서 버튼 크기
    size?: 'sm' | 'lg' | 'default';
}

export function ChallengeStatusManagerV2({ 
    challengeId, 
    status, 
    mode = 'compact',
    size = 'sm'
}: ChallengeStatusManagerV2Props) {
    const { startChallenge, completeChallenge, cancelChallenge, reopenChallenge, isLoading: isStatusChanging } = useChallengeStatusChange();

    // 상태별 색상 및 라벨 설정
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'RECRUITING':
                return { 
                    badge: <Badge variant="default" className="bg-blue-500">모집중</Badge>,
                    color: "text-blue-600",
                    bgColor: "bg-blue-50 border-blue-200"
                };
            case 'IN_PROGRESS':
                return { 
                    badge: <Badge variant="default" className="bg-orange-500">진행중</Badge>,
                    color: "text-orange-600",
                    bgColor: "bg-orange-50 border-orange-200"
                };
            case 'COMPLETED':
                return { 
                    badge: <Badge variant="default" className="bg-green-500">완료</Badge>,
                    color: "text-green-600",
                    bgColor: "bg-green-50 border-green-200"
                };
            default:
                return { 
                    badge: <Badge variant="outline">{status}</Badge>,
                    color: "text-gray-600",
                    bgColor: "bg-gray-50 border-gray-200"
                };
        }
    };

    // 상태별 가능한 액션들
    const getAvailableActions = () => {
        const actions = [];
        
        if (status === 'RECRUITING') {
            actions.push({
                key: 'start',
                label: '시작',
                icon: <Play className="h-4 w-4" />,
                action: () => startChallenge(challengeId),
                variant: 'default' as const,
                className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            });
        } else if (status === 'IN_PROGRESS') {
            actions.push({
                key: 'complete',
                label: '완료',
                icon: <CheckCircle2 className="h-4 w-4" />,
                action: () => completeChallenge(challengeId),
                variant: 'default' as const,
                className: "text-green-600 hover:text-green-700 hover:bg-green-50"
            });
        }
        
        return actions;
    };

    const statusInfo = getStatusInfo(status);
    const availableActions = getAvailableActions();

    // 배지만 표시
    if (mode === 'badge-only') {
        return statusInfo.badge;
    }

    // 컴팩트 모드: 상태 배지 + 액션 드롭다운
    if (mode === 'compact') {
        return (
            <div className="flex items-center gap-2">
                {statusInfo.badge}
                {availableActions.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size={size}
                                className="h-6 w-6 p-0 hover:bg-gray-100"
                                disabled={isStatusChanging}
                            >
                                <MoreHorizontal className="h-3 w-3" />
                                <span className="sr-only">상태 변경</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                            {availableActions.map((action) => (
                                <DropdownMenuItem
                                    key={action.key}
                                    onClick={action.action}
                                    className={`flex items-center gap-2 cursor-pointer ${action.className}`}
                                    disabled={isStatusChanging}
                                >
                                    {action.icon}
                                    {action.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        );
    }

    // 풀 모드: 상태 배지 + 액션 버튼들 나열
    return (
        <div className="flex items-center gap-2">
            {statusInfo.badge}
            {availableActions.length > 0 && (
                <div className="flex gap-1">
                    {availableActions.map((action) => (
                        <Button
                            key={action.key}
                            variant={action.variant}
                            size={size}
                            onClick={action.action}
                            disabled={isStatusChanging}
                            className="flex items-center gap-1 px-2 text-xs"
                        >
                            {action.icon}
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
