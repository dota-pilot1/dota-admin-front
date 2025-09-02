"use client";

import React from "react";
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
import { ErrorDialog } from "./ErrorDialog";

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
    const { startChallenge, completeChallenge, reopenChallenge, isLoading: isStatusChanging } = useChallengeStatusChange();
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    // 상태별 정보 설정
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'RECRUITING':
                return {
                    label: 'RECRUITING',
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
                    label: 'IN_PROGRESS',
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
                    label: 'COMPLETED',
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    badgeVariant: 'default' as const,
                    badgeClassName: 'bg-green-500 hover:bg-green-600',
                    icon: <CheckCircle2 className="h-4 w-4" />,
                    description: '챌린지가 완료되었습니다'
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

    // 상태 변경 드롭다운 옵션
    const statusOptions = [
        {
            key: 'RECRUITING',
            label: 'RECRUITING',
            icon: <Users className="h-4 w-4" />,
            onClick: () => Promise.resolve(reopenChallenge(challengeId)).catch((error: unknown) => setErrorMessage((error as {response?: {data?: {message?: string}}})?.response?.data?.message || '상태 변경에 실패했습니다.')),
        },
        {
            key: 'IN_PROGRESS',
            label: 'IN_PROGRESS',
            icon: <Clock className="h-4 w-4" />,
            onClick: () => Promise.resolve(startChallenge(challengeId)).catch((error: unknown) => setErrorMessage((error as {response?: {data?: {message?: string}}})?.response?.data?.message || '상태 변경에 실패했습니다.')),
        },
        {
            key: 'COMPLETED',
            label: 'COMPLETED',
            icon: <CheckCircle2 className="h-4 w-4" />,
            onClick: () => Promise.resolve(completeChallenge(challengeId)).catch((error: unknown) => setErrorMessage((error as {response?: {data?: {message?: string}}})?.response?.data?.message || '상태 변경에 실패했습니다.')),
        },
    ];
    const statusInfo = getStatusInfo(status);

    // 컴팩트 모드: 배지 + 드롭다운
    if (mode === 'compact') {
        return (
            <>
                {errorMessage && (
                    <div
                        className="fixed top-8 left-1/2 z-[200] -translate-x-1/2 w-full max-w-lg px-4 flex justify-center animate-slideDown"
                        style={{ pointerEvents: 'auto' }}
                    >
                        <div className="w-full">
                            <ErrorDialog message={errorMessage} onClose={() => setErrorMessage(null)} />
                        </div>
                    </div>
                )}
                <div className={cn("flex items-center gap-2", className)}>
                    <Badge variant={statusInfo.badgeVariant} className={cn(statusInfo.badgeClassName, "flex items-center gap-1")}> 
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                    </Badge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-gray-100 rounded-full"
                                disabled={isStatusChanging}
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">상태 변경</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-b">
                                상태 변경
                            </div>
                            {statusOptions.map(opt => (
                                <DropdownMenuItem
                                    key={opt.key}
                                    onClick={opt.onClick}
                                    disabled={isStatusChanging || status === opt.key}
                                    className={cn(
                                        "flex items-center gap-2 py-2 cursor-pointer",
                                        status === opt.key ? "bg-gray-100 text-gray-400" : "hover:bg-blue-50"
                                    )}
                                >
                                    {opt.icon}
                                    <span className="font-medium">{opt.label}</span>
                                    {status === opt.key && (
                                        <span className="ml-auto text-xs text-blue-500">현재</span>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <style>{`
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-32px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slideDown {
                        animation: slideDown 0.4s cubic-bezier(.4,2,.3,1) forwards;
                    }
                `}</style>
            </>
        );
    }

    // 상세 모드: 상태 정보 + 액션 버튼들
    if (mode === 'detailed') {
        return (
            <div className={cn("space-y-3", className)}>
                {/* 현재 상태 표시 + 드롭다운 */}
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="outline"
                                size="sm"
                                className="ml-2"
                                disabled={isStatusChanging}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">상태 변경</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-b">
                                상태 변경
                            </div>
                            {statusOptions.map(opt => (
                                <DropdownMenuItem
                                    key={opt.key}
                                    onClick={opt.onClick}
                                    disabled={isStatusChanging || status === opt.key}
                                    className={cn(
                                        "flex items-center gap-2 py-2 cursor-pointer",
                                        status === opt.key ? "bg-gray-100 text-gray-400" : "hover:bg-blue-50"
                                    )}
                                >
                                    {opt.icon}
                                    <span className="font-medium">{opt.label}</span>
                                    {status === opt.key && (
                                        <span className="ml-auto text-xs text-blue-500">현재</span>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {participantCount !== undefined && (
                        <div className="text-right">
                            <div className="text-sm font-medium">{participantCount}명</div>
                            <div className="text-xs text-gray-500">참여자</div>
                        </div>
                    )}
                </div>
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="outline"
                                    size="sm"
                                    className="ml-2"
                                    disabled={isStatusChanging}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">상태 변경</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-b">
                                    상태 변경
                                </div>
                                {statusOptions.map(opt => (
                                    <DropdownMenuItem
                                        key={opt.key}
                                        onClick={opt.onClick}
                                        disabled={isStatusChanging || status === opt.key}
                                        className={cn(
                                            "flex items-center gap-2 py-2 cursor-pointer",
                                            status === opt.key ? "bg-gray-100 text-gray-400" : "hover:bg-blue-50"
                                        )}
                                    >
                                        {opt.icon}
                                        <span className="font-medium">{opt.label}</span>
                                        {status === opt.key && (
                                            <span className="ml-auto text-xs text-blue-500">현재</span>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                </CardContent>
            </Card>
        );
    }

    return null;
}
