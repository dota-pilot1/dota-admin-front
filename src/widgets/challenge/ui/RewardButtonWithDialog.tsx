import React, { useState } from "react";
import { Button } from "@/shared/ui/button";
import { RewardDialog } from "./RewardDialog";

interface RewardButtonWithDialogProps {
  challengeTitle: string;
  participantName: string;
  defaultAmount?: number;
  defaultMethod?: string;
  onReward: (amount: number, reason: string, method: string) => void;
  buttonText?: string;
  className?: string;
}

export function RewardButtonWithDialog({
  challengeTitle,
  participantName,
  defaultAmount = 1000,
  defaultMethod = "포인트",
  onReward,
  buttonText = "포상",
  className,
}: RewardButtonWithDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" className={className} onClick={() => setOpen(true)}>
        {buttonText}
      </Button>
      <RewardDialog
        open={open}
        onClose={() => setOpen(false)}
        onReward={onReward}
        challengeTitle={challengeTitle}
        participantName={participantName}
        defaultAmount={defaultAmount}
        defaultMethod={defaultMethod}
      />
    </>
  );
}
