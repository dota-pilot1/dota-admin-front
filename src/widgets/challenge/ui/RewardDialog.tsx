import React, { useState } from "react";
import { CommonDialog } from "@/shared/ui/CommonDialog";

interface RewardDialogProps {
  open: boolean;
  onClose: () => void;
  onReward: (amount: number, reason: string) => void;
  participantName?: string;
}

export function RewardDialog({ open, onClose, onReward, participantName }: RewardDialogProps) {
  const [amount, setAmount] = useState(1000);
  const [reason, setReason] = useState("");

  return (
    <CommonDialog
      open={open}
      title="포상 지급"
      onConfirm={() => {
        onReward(amount, reason);
        onClose();
      }}
      onCancel={onClose}
      confirmText="포상 지급"
      cancelText="취소"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">대상자</label>
          <div className="font-bold text-base">{participantName ?? "(이름 없음)"}</div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">금액</label>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">사유</label>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            placeholder="포상 사유를 입력하세요"
          />
        </div>
      </div>
    </CommonDialog>
  );
}
