"use client";


import { Button } from "@/shared/ui/button";
import { useParticipationStatus, useParticipateChallenge, useLeaveChallenge, useParticipationErrorState } from "@/features/challenge/hooks/useParticipateChallenge";
import { CommonDialog } from "@/shared/ui/CommonDialog";
import { Loader2, UserPlus, UserMinus, User } from "lucide-react";
import { getCurrentUser } from "@/entities/user/lib/auth-utils";

interface ParticipateChallengeButtonProps {
    challengeId: number;
    authorId?: number;
    className?: string;
    disabled?: boolean;
}

export function ParticipateChallengeButton({ challengeId, authorId, className, disabled }: ParticipateChallengeButtonProps) {
    const { data: statusData, isLoading: statusLoading } = useParticipationStatus(challengeId);
    const { errorOpen, errorMessage, showError, closeError } = useParticipationErrorState();
    const participateMutation = useParticipateChallenge({ onErrorDialog: showError });
    const leaveMutation = useLeaveChallenge({ onErrorDialog: showError });

    const isParticipant = statusData?.isParticipant ?? false;
    const isLoading = statusLoading || participateMutation.isPending || leaveMutation.isPending;

    // 작성자 여부 판별
    const currentUser = getCurrentUser();
    const isAuthor = !!authorId && currentUser?.id === authorId;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
        if (isParticipant) {
            leaveMutation.mutate(challengeId);
        } else {
            participateMutation.mutate(challengeId);
        }
    };

    return (
        <>
            <Button
                onClick={handleClick}
                disabled={disabled || isLoading || Boolean(isAuthor)}
                variant={isParticipant ? "outline" : "default"}
                size="sm"
                className={className}
            >
                {isAuthor ? (
                    <>
                        <User className="w-4 h-4 mr-2" />
                        작성자
                    </>
                ) : isLoading ? (
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
            <CommonDialog open={errorOpen} title="에러" onConfirm={closeError} onCancel={closeError}>
                <div className="text-red-600 font-bold text-base whitespace-pre-line">{errorMessage}</div>
            </CommonDialog>
        </>
    );
}
