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
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Award, Users, AlertCircle } from "lucide-react";
import { useApiForGetChallengeDetail } from "@/features/challenge/hooks/useApiForGetChallengeDetail";
import { useIssueReward } from "@/features/challenge/hooks/useIssueReward";
import { RewardParticipantSelector, type ParticipantOption } from "@/widgets/challenge/ui/RewardParticipantSelector";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { RewardSuccessDialog } from "./RewardSuccessDialog";

interface ChallengeRewardDialogProps {
    challengeId: number;
    challengeTitle: string;
    className?: string;
    disabled?: boolean;
}

export function ChallengeRewardDialog({ 
    challengeId, 
    challengeTitle, 
    className,
    disabled = false
}: ChallengeRewardDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState<ParticipantOption | null>(null);
    const [reason, setReason] = useState<string>("");
    const [rewardedCount, setRewardedCount] = useState<number>(0);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successData, setSuccessData] = useState<{ participantName: string; amount: number } | null>(null);
    
    const queryClient = useQueryClient();
    const { data, refetch } = useApiForGetChallengeDetail(challengeId);
    
    const challenge = data?.challenge;
    const participants = challenge?.participants || [];

    // ParticipantOption 형태로 변환
    const participantOptions: ParticipantOption[] = participants.map(p => ({
        id: p.id,
        email: p.email || '',
        username: p.name || ''
    }));

    // 포상받은 참여자 수 업데이트 함수
    const handleRewardedCountChange = (count: number) => {
        setRewardedCount(count);
    };

    const issueRewardMutation = useIssueReward({
        challengeId,
        onSuccess: async () => {
            // 성공 다이얼로그 데이터 설정
            if (selectedParticipant && challenge) {
                setSuccessData({
                    participantName: selectedParticipant.username,
                    amount: challenge.rewardAmount
                });
                setShowSuccessDialog(true);
            }
            
            // 포상 상태 강제 업데이트
            setTimeout(async () => {
                // 챌린지 상세 정보 강제 리페치
                await refetch();
                
                // 모든 관련 쿼리들 무효화 (더 광범위하게)
                queryClient.invalidateQueries({ queryKey: ['challenge'] });
                queryClient.invalidateQueries({ queryKey: ['challenges'] });
                queryClient.invalidateQueries({ queryKey: ['reward'] });
                queryClient.invalidateQueries({ queryKey: ['rewardHistory'] });
                
                // 특정 challengeId 관련 쿼리들
                queryClient.invalidateQueries({ queryKey: ['challenge', 'detail', challengeId] });
                queryClient.invalidateQueries({ queryKey: ['challenges', challengeId] });
                
                // 전체 페이지 강제 새로고침 (마지막 수단)
                setTimeout(() => {
                    window.location.reload();
                }, 500);
                
                setSelectedParticipant(null);
                setReason("");
            }, 1000);
            
            setIsOpen(false);
        }
    });

    const handleReward = async () => {
        if (!selectedParticipant) {
            toast.error("참여자를 선택해주세요.");
            return;
        }

        if (!reason.trim()) {
            toast.error("포상 이유를 입력해주세요.");
            return;
        }

        if (!challenge) {
            toast.error("챌린지 정보를 찾을 수 없습니다.");
            return;
        }

        issueRewardMutation.mutate({
            participantId: selectedParticipant.id,
            amount: challenge.rewardAmount,
            method: 'CASH', // 항상 CASH로 고정
            reason: reason.trim()
        });
    };

    return (
        <>
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                setSelectedParticipant(null);
                setReason("");
            }
        }}>
            <DialogTrigger asChild>
                <Button 
                    className={`${className ?? ""} mb-3`}
                    size="sm"
                    disabled={disabled || !challenge || participants.length === 0}
                >
                    <Award className="h-4 w-4 mr-1" />
                    포상 (완료: {rewardedCount}명 / 전체: {participants.length}명)
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
                            참여자 선택 (완료: {rewardedCount}명 / 전체: {participants.length}명)
                        </label>
                        
                        {participants.length === 0 ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-gray-50 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                참여자가 없습니다.
                            </div>
                        ) : (
                            <RewardParticipantSelector
                                challengeId={challengeId}
                                participants={participantOptions}
                                selectedParticipant={selectedParticipant}
                                onSelect={setSelectedParticipant}
                                onRewardedCountChange={handleRewardedCountChange}
                                placeholder="포상을 받을 참여자를 선택하세요"
                            />
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
                            setSelectedParticipant(null);
                            setReason("");
                        }}
                        disabled={issueRewardMutation.isPending}
                    >
                        취소
                    </Button>
                    <Button 
                        onClick={handleReward}
                        disabled={!selectedParticipant || !reason.trim() || issueRewardMutation.isPending || participants.length === 0}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                        {issueRewardMutation.isPending ? "처리 중..." : "포상 지급"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* 화려한 성공 다이얼로그 */}
        {successData && (
            <RewardSuccessDialog
                isOpen={showSuccessDialog}
                onClose={() => {
                    setShowSuccessDialog(false);
                    setSuccessData(null);
                }}
                participantName={successData.participantName}
                amount={successData.amount}
            />
        )}
        </>
    );
}
