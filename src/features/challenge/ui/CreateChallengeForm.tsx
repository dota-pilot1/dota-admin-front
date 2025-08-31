"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Alert, AlertDescription } from "@/shared/ui/alert";
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
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import TagEditor from "@/shared/components/TagEditor";
import { useApiForCreateChallenge } from "@/features/challenge/hooks/useApiForCreateChallenge";
import { getToastErrorMessage } from "@/shared/lib/error-utils";
import { canCreateChallenge } from "@/entities/user/lib/auth-utils";
import EditorForTabsHeadless from "@/shared/components/editor-for-tabs-headless";
import { Textarea } from "@/shared/ui/textarea"; // 추가

export function CreateChallengeForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardType, setRewardType] = useState<"CASH" | "POINT" | "ITEM" | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]); // 폼 에러 상태 추가

  const { mutate, isPending } = useApiForCreateChallenge();

  // 폼 유효성 검사 함수
  const validateForm = (): string[] => {
    const errors: string[] = [];

    // 1. 제목 검사
    if (!title || title.trim() === '') {
      errors.push('제목은 필수입니다');
    }
    if (title && title.length > 255) {
      errors.push('제목은 255자를 초과할 수 없습니다');
    }

    // 2. 시작일 검사
    if (!startDate) {
      errors.push('시작일은 필수입니다');
    }
    if (startDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedStartDate = new Date(startDate);
      if (selectedStartDate < today) {
        errors.push('시작일은 오늘 이후여야 합니다');
      }
    }

    // 3. 종료일 검사
    if (!endDate) {
      errors.push('종료일은 필수입니다');
    }
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      errors.push('종료일은 시작일보다 늦어야 합니다');
    }

    // 4. 설명 검사 (선택적이지만 API에서는 필수)
    if (!description || description.trim() === '') {
      errors.push('설명은 필수입니다');
    }
    if (description && description.length > 1000) {
      errors.push('설명은 1000자를 초과할 수 없습니다');
    }

    // 5. 보상 금액 검사 (선택적)
    if (rewardAmount !== null && rewardAmount < 0) {
      errors.push('보상 금액은 0 이상이어야 합니다');
    }

    // 6. 보상 타입과 금액 일치성
    if (rewardAmount > 0 && !rewardType) {
      errors.push('보상 금액이 설정된 경우 보상 타입을 선택해주세요');
    }

    // 7. 태그 검사 (최소 1개)
    if (tags.length === 0) {
      errors.push('최소 1개의 태그를 입력해주세요');
    }

    return errors;
  };

  // 입력 시 해당 필드 에러 클리어
  const clearFieldError = (fieldName: string) => {
    if (formErrors.length > 0) {
      setFormErrors(prev => prev.filter(error => !error.includes(fieldName)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사 실행
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      // 폼에 에러 표시
      setFormErrors(validationErrors);
      return;
    }

    // 에러 초기화
    setFormErrors([]);

    const newChallenge = {
      title: title.trim(),
      description: description.trim(),
      tags: tags,
      rewardAmount: rewardAmount > 0 ? Number(rewardAmount) : 0,
      // backend expects only CASH or ITEM, map POINT -> ITEM
      rewardType: (rewardType === "POINT" ? "ITEM" : (rewardType || "CASH")) as "CASH" | "ITEM",
      startDate,
      endDate,
    };

    mutate(newChallenge, {
      onSuccess: () => {
        // 성공시 폼 초기화 및 다이얼로그 닫기
        setTitle("");
        setDescription("");
        setTags([]);
        setRewardAmount(0);
        setRewardType("");
        setStartDate("");
        setEndDate("");
        setFormErrors([]); // 에러 초기화
        setOpen(false);
        toast.success("챌린지가 성공적으로 생성되었습니다!");
      },
      onError: (error) => {
        // 토스트용 공통 에러 메시지 (유효성 검사 에러 자동 처리)
        const errorMessage = getToastErrorMessage(error);
        toast.error(errorMessage);
      }
    });
  };

  // 권한 체크
  const hasPermission = canCreateChallenge();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!hasPermission} title={!hasPermission ? "권한이 없습니다" : "새 챌린지 추가"}>
          챌린지 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 챌린지 생성</DialogTitle>
          <DialogDescription>
            새로운 챌린지를 만들고 공유하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* 폼 에러 표시 영역 */}
          {formErrors.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                <ul className="list-disc pl-4 space-y-1">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                제목 *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clearFieldError('제목');
                }}
                className="col-span-3"
                placeholder="챌린지 제목을 입력하세요 (최대 255자)"
                maxLength={255}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                설명 *
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  clearFieldError('설명');
                }}
                className="col-span-3 resize-y"
                placeholder="챌린지 설명을 입력하세요 (최대 1000자)"
                maxLength={1000}
                rows={5}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                태그 *
              </Label>
              <div className="col-span-3">
                <EditorForTabsHeadless tags={tags} setTags={setTags} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardAmount" className="text-right">
                보상(원)
              </Label>
              <Input
                id="rewardAmount"
                type="number"
                min="0"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(Number(e.target.value))}
                className="col-span-3"
                placeholder="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardType" className="text-right">
                보상 타입
              </Label>
              <Select value={rewardType} onValueChange={(value: "CASH" | "POINT" | "ITEM") => setRewardType(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="보상 타입을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">현금</SelectItem>
                  <SelectItem value="POINT">포인트</SelectItem>
                  <SelectItem value="ITEM">아이템</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                시작일 *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="col-span-3"
                min={new Date().toISOString().split('T')[0]} // 오늘 이후만 선택 가능
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                종료일 *
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="col-span-3"
                min={startDate || new Date().toISOString().split('T')[0]} // 시작일 이후만 선택 가능
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "생성 중..." : "저장하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
