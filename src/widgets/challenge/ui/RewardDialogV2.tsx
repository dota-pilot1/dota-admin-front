import React, { useState } from "react";
import { CommonDialog } from "@/shared/ui/CommonDialog";
import { RewardParticipantSelector, type Participant } from "./RewardParticipantSelector";

interface RewardDialogV2Props {
  open: boolean;
  onClose: () => void;
  onReward: (participantId: number, amount: number, reason: string, method: string) => void;
  challengeId: number;
  challengeTitle?: string;
  participants: Participant[];
  defaultAmount?: number;
  defaultMethod?: string;
}

export function RewardDialogV2({ 
  open, 
  onClose, 
  onReward, 
  challengeId,
  challengeTitle, 
  participants,
  defaultAmount = 1000, 
  defaultMethod = "포인트" 
}: RewardDialogV2Props) {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [amount, setAmount] = useState(defaultAmount);
  const [reason, setReason] = useState("");
  const [method, setMethod] = useState(defaultMethod);

  const handleConfirm = () => {
    if (!selectedParticipant) {
      alert("포상 받을 사람을 선택해주세요.");
      return;
    }
    
    if (!reason.trim()) {
      alert("포상 사유를 입력해주세요.");
      return;
    }

    onReward(selectedParticipant.id, amount, reason, method);
    
    // 폼 초기화
    setSelectedParticipant(null);
    setReason("");
    setAmount(defaultAmount);
    setMethod(defaultMethod);
    
    onClose();
  };

  const handleCancel = () => {
    // 폼 초기화
    setSelectedParticipant(null);
    setReason("");
    setAmount(defaultAmount);
    setMethod(defaultMethod);
    
    onClose();
  };

  return (
    <CommonDialog
      open={open}
      title="🎁 챌린지 포상 지급"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      confirmText="포상 지급"
      cancelText="취소"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">챌린지명</label>
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="font-bold text-base text-gray-900">
              {challengeTitle ?? "(챌린지명 없음)"}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            포상 대상자 
            <span className="text-red-500 ml-1">*</span>
          </label>
          <RewardParticipantSelector
            challengeId={challengeId}
            participants={participants}
            selectedParticipant={selectedParticipant}
            onSelect={setSelectedParticipant}
            placeholder="포상 받을 사람을 선택하세요"
          />
          {selectedParticipant && (
            <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
              <div className="text-sm">
                <span className="font-medium">선택됨:</span> {selectedParticipant.username}
              </div>
              <div className="text-xs text-gray-600">{selectedParticipant.email}</div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">포상 방법</label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="포인트">🏆 포인트</option>
            <option value="현금">💰 현금</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">금액</label>
          <div className="relative">
            <input
              type="number"
              min={1}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="포상 금액을 입력하세요"
            />
            <div className="absolute right-3 top-2 text-gray-500 text-sm">
              {method === "현금" ? "원" : "P"}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            포상 사유 
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="포상 사유를 입력하세요 (예: 챌린지 우수 참여, 목표 달성 등)"
          />
        </div>

        {selectedParticipant && amount && reason && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">💡 지급 미리보기</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <div><strong>수혜자:</strong> {selectedParticipant.username}</div>
              <div><strong>금액:</strong> {amount.toLocaleString()}{method === "현금" ? "원" : "P"}</div>
              <div><strong>사유:</strong> {reason}</div>
            </div>
          </div>
        )}
      </div>
    </CommonDialog>
  );
}
