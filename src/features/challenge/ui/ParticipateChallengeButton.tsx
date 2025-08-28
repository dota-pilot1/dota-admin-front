"use client";

import { Button } from "@/shared/ui/button";
import { useParticipationStatus, useParticipateChallenge, useLeaveChallenge } from "@/features/challenge/hooks/useParticipateChallenge";
import { Loader2, UserPlus, UserMinus } from "lucide-react";

interface ParticipateChallengeButtonProps {
    challengeId: number;
    className?: string;
    disabled?: boolean;
}

export function ParticipateChallengeButton({ challengeId, className, disabled }: ParticipateChallengeButtonProps) {
    const { data: statusData, isLoading: statusLoading } = useParticipationStatus(challengeId);
    const participateMutation = useParticipateChallenge();
    const leaveMutation = useLeaveChallenge();

    const isParticipant = statusData?.isParticipant ?? false;
    const isLoading = statusLoading || participateMutation.isPending || leaveMutation.isPending;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
        
        if (isParticipant) {
            leaveMutation.mutate(challengeId);
        } else {
            participateMutation.mutate(challengeId);
        }
    };

    return (
        <Button
            onClick={handleClick}
            disabled={disabled || isLoading}
            variant={isParticipant ? "outline" : "default"}
            size="sm"
            className={className}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isParticipant ? (
                <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    탈퇴
                </>
            ) : (
                <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    참여
                </>
            )}
        </Button>
    );
}
