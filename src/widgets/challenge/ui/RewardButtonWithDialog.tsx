import React, { useState } from "react";
import { Button } from "@/shared/ui/button";
import { RewardDialog } from "./RewardDialog";
import { useCreateReward } from "@/features/reward/hooks/useCreateReward";

interface RewardButtonWithDialogProps {
  challengeId: number;
  challengeTitle: string;
  participantId: number;
  participantName: string;
  defaultAmount?: number;
  defaultMethod?: string;
  buttonText?: string;
  className?: string;
}

export function RewardButtonWithDialog({
  challengeId,
  challengeTitle,
  participantId,
  participantName,
  defaultAmount = 1000,
  defaultMethod = "포인트",
  buttonText = "포상",
  className,
}: RewardButtonWithDialogProps) {
  const [open, setOpen] = useState(false);
  const createRewardMutation = useCreateReward();

  const handleReward = async (amount: number, reason: string, method: string) => {
    await createRewardMutation.mutateAsync({
      challengeId,
      participantId,
      amount,
      method,
      reason,
    });
    setOpen(false);
  };

  return (
    <>
      <Button 
        type="button" 
        className={className} 
        onClick={() => setOpen(true)}
        disabled={createRewardMutation.isPending}
      >
        {createRewardMutation.isPending ? "처리중..." : buttonText}
      </Button>
      <RewardDialog
        open={open}
        onClose={() => setOpen(false)}
        onReward={handleReward}
        challengeTitle={challengeTitle}
        participantName={participantName}
        defaultAmount={defaultAmount}
        defaultMethod={defaultMethod}
      />
    </>
  );
}
