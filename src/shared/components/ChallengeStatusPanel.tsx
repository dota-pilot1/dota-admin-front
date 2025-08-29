"use client";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/ui/card";
import { 
    MoreHorizontal, 
    Play, 
    Square, 
    RotateCcw, 
    CheckCircle2,
    Users,
    Calendar,
    Clock
} from "lucide-react";
import { useChallengeStatusChange } from '@/features/challenge/hooks/useChallengeStatusChange';
import { cn } from "@/lib/utils";

interface ChallengeStatusPanelProps {
    challengeId: number;
    status: string;
    // 표시 모드: 'compact' | 'detailed' | 'card'
    mode?: 'compact' | 'detailed' | 'card';
    // 추가 정보 (detailed/card 모드에서 사용)
    // title, startDate, endDate 제거 (사용하지 않음)
    participantCount?: number;
    className?: string;
}

export function ChallengeStatusPanel({ 
    challengeId, 
    status, 
    mode = 'compact',
    participantCount,
    className
}: ChallengeStatusPanelProps) {
    const { startChallenge, completeChallenge, cancelChallenge, reopenChallenge, isLoading: isStatusChanging } = useChallengeStatusChange();

    // 상태별 정보 설정
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'RECRUITING':
                return { 
                    label: '모집중',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    badgeVariant: 'default' as const,
                    badgeClassName: 'bg-blue-500 hover:bg-blue-600',
                    icon: <Users className="h-4 w-4" />,
                    description: '참여자를 모집하고 있습니다'
                };
            case 'IN_PROGRESS':
                return { 
                    label: '진행중',
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    badgeVariant: 'default' as const,
                    badgeClassName: 'bg-orange-500 hover:bg-orange-600',
                    icon: <Clock className="h-4 w-4" />,
                    description: '챌린지가 진행중입니다'
                };
            case 'COMPLETED':
                return { 
                    label: '완료',
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    badgeVariant: 'default' as const,
                    badgeClassName: 'bg-green-500 hover:bg-green-600',
                    icon: <CheckCircle2 className="h-4 w-4" />,
                    description: '챌린지가 완료되었습니다'
                };
            case 'CANCELLED':
                return { 
                    label: '취소됨',
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    badgeVariant: 'destructive' as const,
                    badgeClassName: 'bg-red-500 hover:bg-red-600',
                    icon: <Square className="h-4 w-4" />,
                    description: '챌린지가 취소되었습니다'
                };
            default:
                return { 
                    label: status,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    badgeVariant: 'outline' as const,
                    badgeClassName: 'bg-gray-500 hover:bg-gray-600',
                    icon: <Calendar className="h-4 w-4" />,
                    description: '알 수 없는 상태입니다'
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
                className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
                buttonClassName: "bg-blue-600 hover:bg-blue-700 text-white"
            });
            actions.push({
                key: 'cancel',
                label: '취소',
                icon: <Square className="h-4 w-4" />,
                action: () => cancelChallenge(challengeId),
                variant: 'destructive' as const,
                className: "text-red-600 hover:text-red-700 hover:bg-red-50",
                buttonClassName: "bg-red-600 hover:bg-red-700 text-white"
            });
        } else if (status === 'IN_PROGRESS') {
            actions.push({
                key: 'complete',
                label: '완료',
                icon: <CheckCircle2 className="h-4 w-4" />,
                action: () => completeChallenge(challengeId),
                variant: 'default' as const,
                className: "text-green-600 hover:text-green-700 hover:bg-green-50",
                buttonClassName: "bg-green-600 hover:bg-green-700 text-white"
            });
            actions.push({
                key: 'cancel',
                label: '취소',
                icon: <Square className="h-4 w-4" />,
                action: () => cancelChallenge(challengeId),
                variant: 'destructive' as const,
                className: "text-red-600 hover:text-red-700 hover:bg-red-50",
                buttonClassName: "bg-red-600 hover:bg-red-700 text-white"
            });
        } else if (status === 'CANCELLED') {
            actions.push({
                key: 'reopen',
                label: '다시 열기',
                icon: <RotateCcw className="h-4 w-4" />,
                action: () => reopenChallenge(challengeId),
                variant: 'outline' as const,
                className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
                buttonClassName: "border-blue-600 text-blue-600 hover:bg-blue-50"
            });
        }
        
        return actions;
    };

    const statusInfo = getStatusInfo(status);
    const availableActions = getAvailableActions();

    // 컴팩트 모드: 배지 + 드롭다운
    if (mode === 'compact') {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <Badge variant={statusInfo.badgeVariant} className={cn(statusInfo.badgeClassName, "flex items-center gap-1")}>
                    {statusInfo.icon}
                    <span>{statusInfo.label}</span>
                </Badge>
                {availableActions.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-gray-100 rounded-full"
                                disabled={isStatusChanging}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">상태 변경</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-b">
                                상태 변경
                            </div>
                            {availableActions.map((action, index) => (
                                <div key={action.key}>
                                    {index > 0 && action.variant === 'destructive' && <DropdownMenuSeparator />}
                                    <DropdownMenuItem
                                        onClick={action.action}
                                        className={`flex items-center gap-2 cursor-pointer ${action.className} py-2`}
                                        disabled={isStatusChanging}
                                    >
                                        {action.icon}
                                        <span className="font-medium">{action.label}</span>
                                    </DropdownMenuItem>
                                </div>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        );
    }

    // 상세 모드: 상태 정보 + 액션 버튼들
    if (mode === 'detailed') {
        return (
            <div className={cn("space-y-3", className)}>
                {/* 현재 상태 표시 */}
                <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    statusInfo.bgColor,
                    statusInfo.borderColor
                )}>
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-full bg-white/50", statusInfo.color)}>
                            {statusInfo.icon}
                        </div>
                        <div>
                            <div className={cn("font-medium", statusInfo.color)}>
                                {statusInfo.label}
                            </div>
                            <div className="text-sm text-gray-600">
                                {statusInfo.description}
                            </div>
                        </div>
                    </div>
                    {participantCount !== undefined && (
                        <div className="text-right">
                            <div className="text-sm font-medium">{participantCount}명</div>
                            <div className="text-xs text-gray-500">참여자</div>
                        </div>
                    )}
                </div>

                {/* 액션 버튼들 */}
                {availableActions.length > 0 && (
                    <div className="flex gap-2">
                        {availableActions.map((action) => (
                            <Button
                                key={action.key}
                                onClick={action.action}
                                disabled={isStatusChanging}
                                className={cn(
                                    "flex items-center gap-2 flex-1",
                                    action.buttonClassName
                                )}
                                size="sm"
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

    // 카드 모드: 독립적인 카드 형태
    if (mode === 'card') {
        return (
            <Card className={cn("w-full", className)}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">상태 관리</span>
                        <Badge variant={statusInfo.badgeVariant} className={statusInfo.badgeClassName}>
                            {statusInfo.icon}
                            <span className="ml-1">{statusInfo.label}</span>
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className={cn(
                        "p-3 rounded-lg border",
                        statusInfo.bgColor,
                        statusInfo.borderColor
                    )}>
                        <p className={cn("font-medium mb-1", statusInfo.color)}>
                            현재 상태: {statusInfo.label}
                        </p>
                        <p className="text-sm text-gray-600">
                            {statusInfo.description}
                        </p>
                    </div>

                    {availableActions.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">가능한 액션</h4>
                            <div className="flex gap-2">
                                {availableActions.map((action) => (
                                    <Button
                                        key={action.key}
                                        onClick={action.action}
                                        disabled={isStatusChanging}
                                        className={cn(
                                            "flex items-center gap-2 flex-1",
                                            action.buttonClassName
                                        )}
                                        size="sm"
                                    >
                                        {action.icon}
                                        {action.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    return null;
}
