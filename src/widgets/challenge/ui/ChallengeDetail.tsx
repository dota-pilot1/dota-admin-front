"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { Badge } from "@/shared/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import type { Challenge, Participant } from "@/features/challenge/api/getChallengeList";

export function ChallengeDetail({ data, onPay }: {
    data: Challenge | null;
    onPay: (amountPerPerson: number, recipients: Participant[]) => void;
}) {
    const [amount, setAmount] = useState("1000");
    const [open, setOpen] = useState(false);
    const parsed = Number(amount.replace(/[,\s]/g, ""));
    const valid = Number.isFinite(parsed) && parsed >= 100 && parsed <= 10000000;
    const recipients = data?.participants ?? [];
    const total = parsed * (recipients?.length ?? 0);

    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>상세 정보</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    왼쪽에서 챌린지를 선택하세요.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{data.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <p className="text-sm text-muted-foreground">{data.description}</p>
                {data.tags && data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {data.tags.map((t) => (
                            <Badge key={t} variant="secondary" className="px-1.5 py-0 text-[10px]">{t}</Badge>
                        ))}
                    </div>
                )}

                <div className="text-sm">
                    <div className="font-medium">작성자</div>
                    <div className="text-muted-foreground">{data.username || data.email || data.authorId}</div>
                </div>

                <div className="space-y-2">
                    <Label>지급 대상</Label>
                    <div className="rounded-md border p-2 text-sm">
                        {recipients.length === 0 ? (
                            <div className="text-muted-foreground">등록된 참여자가 없습니다.</div>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {recipients.map((p) => (
                                    <Badge key={p.id} variant="secondary" className="px-1.5 py-0 text-[10px]">{p.name}{p.email ? ` (${p.email})` : ""}</Badge>
                                ))}
                            </div>
                        )}
                        <div className="mt-2 text-xs text-muted-foreground">총 {recipients.length}명</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="reward-amount">포상 금액 (KRW)</Label>
                    <Input id="reward-amount" type="number" min={100} step={100} value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <p className="text-xs text-muted-foreground">최소 100원, 최대 10,000,000원</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setAmount("1000")}>리셋</Button>
                <Button
                    disabled={!valid || recipients.length === 0}
                    onClick={() => setOpen(true)}
                >
                    포상
                </Button>
            </CardFooter>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>포상 진행</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>지급 대상</Label>
                            <div className="rounded-md border p-2 text-sm">
                                {recipients.length === 0 ? (
                                    <div className="text-muted-foreground">등록된 참여자가 없습니다.</div>
                                ) : (
                                    <div className="flex flex-wrap gap-1">
                                        {recipients.map((p) => (
                                            <Badge key={p.id} variant="secondary" className="px-1.5 py-0 text-[10px]">{p.name}</Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-amount">포상 금액 (KRW)</Label>
                            <Input id="confirm-amount" type="number" min={100} step={100} value={amount} onChange={(e) => setAmount(e.target.value)} />
                            <p className="text-xs text-muted-foreground">1인당 {parsed.toLocaleString()}원 × {recipients.length}명 = 총 {Number.isFinite(total) ? total.toLocaleString() : 0}원</p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
                        <Button
                            disabled={!valid || recipients.length === 0}
                            onClick={() => { onPay(parsed, recipients); setOpen(false); }}
                        >
                            확인
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
