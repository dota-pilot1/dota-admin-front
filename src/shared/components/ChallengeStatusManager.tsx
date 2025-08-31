"use client";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useChallengeStatusChange } from '@/features/challenge/hooks/useChallengeStatusChange';

interface ChallengeStatusManagerProps {
    challengeId: number;
    status: string;
    // 표시 모드: 'badge-only' | 'buttons-only' | 'full'
    mode?: 'badge-only' | 'buttons-only' | 'full';
    // 버튼 크기
    buttonSize?: 'sm' | 'lg' | 'default';
    // 버튼 배치: 'horizontal' | 'vertical'
    layout?: 'horizontal' | 'vertical';
    // 컴팩트 모드 (작은 공간에서 사용)
    compact?: boolean;
}

export function ChallengeStatusManager({ 
    challengeId, 
    status, 
    mode = 'full',
    buttonSize = 'sm',
    layout = 'horizontal',
    compact = false
}: ChallengeStatusManagerProps) {
    const { startChallenge, completeChallenge, reopenChallenge, isLoading: isStatusChanging } = useChallengeStatusChange();

    // 상태별 색상 설정
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'RECRUITING':
                return <Badge variant="default" className="bg-blue-500">모집중</Badge>;
            case 'IN_PROGRESS':
                return <Badge variant="default" className="bg-orange-500">진행중</Badge>;
            case 'COMPLETED':
                return <Badge variant="default" className="bg-green-500">완료</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // 상태별 액션 버튼 렌더링 함수
    const renderStatusButtons = () => {
        const buttons = [];
        
        if (status === 'RECRUITING') {
            buttons.push(
                <Button 
                    key="start"
                    variant="default" 
                    size={buttonSize}
                    className={compact ? "px-2 text-xs" : "bg-blue-600 hover:bg-blue-700"}
                    onClick={() => startChallenge(challengeId)}
                    disabled={isStatusChanging}
                >
                    시작
                </Button>
            );
        } else if (status === 'IN_PROGRESS') {
            buttons.push(
                <Button 
                    key="complete"
                    variant="default" 
                    size={buttonSize}
                    className={compact ? "px-2 text-xs" : "bg-green-600 hover:bg-green-700"}
                    onClick={() => completeChallenge(challengeId)}
                    disabled={isStatusChanging}
                >
                    완료
                </Button>
            );
        }
        
        return buttons;
    };

    const statusButtons = renderStatusButtons();

    // 모드별 렌더링
    if (mode === 'badge-only') {
        return getStatusBadge(status);
    }

    if (mode === 'buttons-only') {
        if (statusButtons.length === 0) return null;
        
        return (
            <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-row'} gap-${compact ? '1' : '2'}`}>
                {statusButtons}
            </div>
        );
    }

    // full mode
    return (
        <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-row'} items-${layout === 'vertical' ? 'start' : 'center'} gap-${compact ? '2' : '3'}`}>
            {getStatusBadge(status)}
            {statusButtons.length > 0 && (
                <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-row'} gap-${compact ? '1' : '2'}`}>
                    {statusButtons}
                </div>
            )}
        </div>
    );
}
