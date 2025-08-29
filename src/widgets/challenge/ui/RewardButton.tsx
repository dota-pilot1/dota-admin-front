import React from "react";

interface RewardButtonProps {
  challengeId: number;
  participantId: number;
  onReward?: (challengeId: number, participantId: number) => void;
  className?: string;
}

export function RewardButton({ challengeId, participantId, onReward, className }: RewardButtonProps) {
  const handleClick = () => {
    if (window.confirm("포상 하시겠습니까?")) {
      if (onReward) onReward(challengeId, participantId);
    }
  };

  return (
    <button
      type="button"
      className={`px-4 py-2 rounded bg-yellow-400 text-white font-bold shadow hover:bg-yellow-500 transition ${className ?? ""}`}
      onClick={handleClick}
    >
      포상
    </button>
  );
}
