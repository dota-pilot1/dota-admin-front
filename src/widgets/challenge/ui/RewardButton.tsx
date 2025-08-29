import React, { useState } from "react";
import { CommonDialog } from "@/shared/ui/CommonDialog";

interface RewardButtonProps {
  challengeId: number;
  participantId: number;
  onReward?: (challengeId: number, participantId: number) => void;
  className?: string;
}

export function RewardButton({ challengeId, participantId, onReward, className }: RewardButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    setOpen(false);
    if (onReward) onReward(challengeId, participantId);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`px-4 py-2 rounded bg-yellow-400 text-white font-bold shadow hover:bg-yellow-500 transition ${className ?? ""}`}
        onClick={handleClick}
      >
        포상
      </button>
      <CommonDialog
        open={open}
        title="포상 확인"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText="확인"
        cancelText="취소"
      >
        <div className="text-base font-semibold">포상 하시겠습니까?</div>
      </CommonDialog>
    </>
  );
}
