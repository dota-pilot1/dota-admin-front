"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Award, Users, AlertCircle } from "lucide-react";
import { useApiForGetChallengeDetail } from "@/features/challenge/hooks/useApiForGetChallengeDetail";
import { useIssueReward } from "@/features/challenge/hooks/useIssueReward";
import { toast } from "sonner";

interface ChallengeRewardDialogProps {
    challengeId: number;
    challengeTitle: string;
    className?: string;
}

export function ChallengeRewardDialog({ 
    challengeId, 
    challengeTitle, 
    className 
}: ChallengeRewardDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedParticipantId, setSelectedParticipantId] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    
    const { data } = useApiForGetChallengeDetail(challengeId);
    
    const challenge = data?.challenge;
    const participants = challenge?.participants || [];

    const issueRewardMutation = useIssueReward({
        challengeId,
        onSuccess: () => {
            const participant = participants.find(p => p.id.toString() === selectedParticipantId);
            toast.success(`${participant?.name}님에게 포상이 지급되었습니다.`);
            setIsOpen(false);
            setSelectedParticipantId("");
            setReason("");
        }
    });

    const handleReward = async () => {
        if (!selectedParticipantId) {
            toast.error("참여자를 선택해주세요.");
            return;
        }

        if (!reason.trim()) {
            toast.error("포상 이유를 입력해주세요.");
            return;
        }

        const participant = participants.find(p => p.id.toString() === selectedParticipantId);
        if (!participant) {
            toast.error("선택된 참여자를 찾을 수 없습니다.");
            return;
        }

        if (!challenge) {
            toast.error("챌린지 정보를 찾을 수 없습니다.");
            return;
        }

        issueRewardMutation.mutate({
            participantId: parseInt(selectedParticipantId),
            amount: challenge.rewardAmount,
            method: challenge.rewardType === 'CASH' ? 'CASH' : 'ITEM',
            reason: reason.trim()
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                setSelectedParticipantId("");
                setReason("");
            }
        }}>
            <DialogTrigger asChild>
                <Button 
                    className={className}
                    size="sm"
                    disabled={!challenge || participants.length === 0}
                >
                    <Award className="h-4 w-4 mr-1" />
                    포상
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        챌린지 포상 지급
                    </DialogTitle>
                    <DialogDescription>
                        <span className="font-medium text-foreground">{challengeTitle}</span> 챌린지에서 포상을 받을 참여자를 선택해주세요.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* 챌린지 정보 */}
                    {challenge && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">포상 금액</span>
                                <span className="text-lg font-bold text-orange-600">
                                    {challenge.rewardAmount.toLocaleString()}
                                    {challenge.rewardType === 'CASH' ? '원' : '개'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* 참여자 선택 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            참여자 선택 ({participants.length}명)
                        </label>
                        
                        {participants.length === 0 ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-gray-50 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                참여자가 없습니다.
                            </div>
                        ) : (
                            <Select value={selectedParticipantId} onValueChange={setSelectedParticipantId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="포상을 받을 참여자를 선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    {participants.map((participant) => (
                                        <SelectItem key={participant.id} value={participant.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <span>{participant.name}</span>
                                                {participant.email && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {participant.email}
                                                    </Badge>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* 포상 이유 입력 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            포상 이유 <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="포상을 지급하는 이유를 입력하세요"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full"
                        />
                        {!reason.trim() && (
                            <p className="text-xs text-muted-foreground">
                                예: 챌린지 완료, 우수 성과, 특별 기여 등
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            setIsOpen(false);
                            setSelectedParticipantId("");
                            setReason("");
                        }}
                        disabled={issueRewardMutation.isPending}
                    >
                        취소
                    </Button>
                    <Button 
                        onClick={handleReward}
                        disabled={!selectedParticipantId || !reason.trim() || issueRewardMutation.isPending || participants.length === 0}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                        {issueRewardMutation.isPending ? "처리 중..." : "포상 지급"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
