"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { 
    User, 
    Award, 
    CheckCircle, 
    Clock, 
    DollarSign,
    MessageSquare,
    UserCheck
} from "lucide-react";
import type { RewardHistoryItem } from '@/features/reward/api/rewardHistory';

interface RewardDetailDialogProps {
    reward: RewardHistoryItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function RewardDetailDialog({ reward, isOpen, onClose }: RewardDetailDialogProps) {
    if (!reward) return null;

    const getMethodIcon = (method: 'POINT' | 'CASH') => {
        switch (method) {
            case 'CASH':
                return <DollarSign className="h-4 w-4 text-green-600" />;
            case 'POINT':
                return <Award className="h-4 w-4 text-blue-600" />;
            default:
                return <Award className="h-4 w-4" />;
        }
    };

    const getMethodBadge = (method: 'POINT' | 'CASH') => {
        switch (method) {
            case 'CASH':
                return <Badge variant="default" className="bg-green-500">💰 현금</Badge>;
            case 'POINT':
                return <Badge variant="default" className="bg-blue-500">🏆 포인트</Badge>;
            default:
                return <Badge variant="secondary">{method}</Badge>;
        }
    };

    const getStatusInfo = (processed: boolean, processedAt: string | null) => {
        if (processed && processedAt) {
            return {
                icon: <CheckCircle className="h-4 w-4 text-green-600" />,
                badge: <Badge variant="default" className="bg-green-500">✅ 지급완료</Badge>,
                time: new Date(processedAt).toLocaleString()
            };
        } else {
            return {
                icon: <Clock className="h-4 w-4 text-orange-600" />,
                badge: <Badge variant="outline" className="border-orange-500 text-orange-600">⏳ 지급대기</Badge>,
                time: null
            };
        }
    };

    const statusInfo = getStatusInfo(reward.processed, reward.processedAt ?? null);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        포상 상세 정보
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* 기본 정보 */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">포상 ID</span>
                            <span className="font-mono text-sm">#{reward.id}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">챌린지 ID</span>
                            <span className="font-mono text-sm">#{reward.challengeId}</span>
                        </div>
                    </div>

                    <Separator />

                    {/* 수혜자 정보 */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <User className="h-4 w-4" />
                            수혜자 정보
                        </h3>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">이름</span>
                                <span className="font-medium">{reward.participantName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">참여자 ID</span>
                                <span className="font-mono text-sm">#{reward.participantId}</span>
                            </div>
                        </div>
                    </div>

                    {/* 포상 정보 */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            {getMethodIcon(reward.method)}
                            포상 정보
                        </h3>
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium">포상 타입</span>
                                {getMethodBadge(reward.method)}
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium">금액</span>
                                <span className="text-xl font-bold text-orange-600">
                                    {reward.amount.toLocaleString()}
                                    {reward.method === 'CASH' ? '원' : 'P'}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    사유
                                </span>
                                <p className="text-sm bg-white/70 rounded p-2 border">
                                    {reward.reason}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 처리 상태 */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            {statusInfo.icon}
                            처리 상태
                        </h3>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">상태</span>
                                {statusInfo.badge}
                            </div>
                            {statusInfo.time && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">지급일시</span>
                                    <span className="text-sm font-medium">{statusInfo.time}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 생성 정보 */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            생성 정보
                        </h3>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">생성자</span>
                                <span className="font-medium">{reward.createdByName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">생성일시</span>
                                <span className="text-sm font-medium">
                                    {new Date(reward.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            닫기
                        </Button>
                        {!reward.processed && (
                            <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                지급 처리
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
