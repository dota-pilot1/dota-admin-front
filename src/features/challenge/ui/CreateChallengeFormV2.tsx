"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { TagInput } from "@/shared/ui/tag-input";
import { useApiForCreateChallenge } from "@/features/challenge/hooks/useApiForCreateChallenge";
import { getToastErrorMessage } from "@/shared/lib/error-utils";
import { createChallengeSchema, type CreateChallengeForm } from "@/features/challenge/lib/validation";

export function CreateChallengeFormV2() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useApiForCreateChallenge();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateChallengeForm>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      rewardAmount: 0,
      rewardType: undefined,
      startDate: "",
      endDate: "",
    },
  });

  // 태그와 보상 타입은 watch로 관리 (register로 처리 안 되는 컴포넌트들)
  const tags = watch("tags");
  const rewardType = watch("rewardType");

  const onSubmit = (data: CreateChallengeForm) => {
    const submitData = {
      ...data,
      rewardAmount: data.rewardAmount || 0,
      rewardType: data.rewardType || "CASH",
    };

    mutate(submitData, {
      onSuccess: () => {
        reset();
        setOpen(false);
        toast.success("챌린지가 성공적으로 생성되었습니다!");
      },
      onError: (error) => {
        const errorMessage = getToastErrorMessage(error);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>챌린지 추가 (v2)</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 챌린지 생성</DialogTitle>
          <DialogDescription>
            새로운 챌린지를 만들고 공유하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="챌린지 제목을 입력하세요 (최대 255자)"
              maxLength={255}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">설명 *</Label>
            <Input
              id="description"
              {...register("description")}
              placeholder="챌린지 설명을 입력하세요 (최대 1000자)"
              maxLength={1000}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* 태그 */}
          <div className="space-y-2">
            <Label htmlFor="tags">태그 *</Label>
            <TagInput
              tags={tags || []}
              setTags={(newTags) => setValue("tags", typeof newTags === 'function' ? newTags(tags || []) : newTags)}
              placeholder="태그를 입력하고 Enter를 누르세요"
              maxTags={10}
            />
            {errors.tags && (
              <p className="text-sm text-red-500">{errors.tags.message}</p>
            )}
          </div>

          {/* 보상 금액 */}
          <div className="space-y-2">
            <Label htmlFor="rewardAmount">보상 금액</Label>
            <Input
              id="rewardAmount"
              type="number"
              min="0"
              {...register("rewardAmount", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.rewardAmount && (
              <p className="text-sm text-red-500">{errors.rewardAmount.message}</p>
            )}
          </div>

          {/* 보상 타입 */}
          <div className="space-y-2">
            <Label htmlFor="rewardType">보상 타입</Label>
            <Select 
              value={rewardType || ""} 
              onValueChange={(value: "CASH" | "POINT" | "ITEM") => setValue("rewardType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="보상 타입을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">현금</SelectItem>
                <SelectItem value="POINT">포인트</SelectItem>
                <SelectItem value="ITEM">아이템</SelectItem>
              </SelectContent>
            </Select>
            {errors.rewardType && (
              <p className="text-sm text-red-500">{errors.rewardType.message}</p>
            )}
          </div>

          {/* 시작일 */}
          <div className="space-y-2">
            <Label htmlFor="startDate">시작일 *</Label>
            <Input
              id="startDate"
              type="date"
              {...register("startDate")}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          {/* 종료일 */}
          <div className="space-y-2">
            <Label htmlFor="endDate">종료일 *</Label>
            <Input
              id="endDate"
              type="date"
              {...register("endDate")}
              min={watch("startDate") || new Date().toISOString().split('T')[0]}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
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
