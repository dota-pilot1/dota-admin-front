"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { TagifyInput } from '@/shared/ui/TagifyInput';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Edit3 } from 'lucide-react';
import { useUpdateChallenge, UpdateChallengeRequest } from '@/features/challenge/api/updateChallenge';
import { toast } from 'sonner';

interface Challenge {
  id: number;
  title: string;
  description: string;
  tags: string[];
  rewardAmount: number;
  rewardType: 'CASH' | 'ITEM';
  startDate: string;
  endDate: string;
  status: string;
}

interface ChallengeEditDialogProps {
  challenge: Challenge;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function ChallengeEditDialog({ challenge, children }: ChallengeEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateChallengeRequest>({
    title: challenge.title,
    description: challenge.description,
    tags: challenge.tags,
    rewardAmount: challenge.rewardAmount,
    rewardType: challenge.rewardType,
    startDate: challenge.startDate,
    endDate: challenge.endDate,
  });

  const updateMutation = useUpdateChallenge();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateMutation.mutateAsync({
        challengeId: challenge.id,
        data: formData,
      });
      
      toast.success('챌린지가 성공적으로 수정되었습니다.');
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '챌린지 수정에 실패했습니다.');
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant="outline" className="h-8 px-3 text-xs" disabled={!!challenge.status && challenge.status === 'COMPLETED'}>
            <Edit3 className="h-3 w-3 mr-1" />
            수정
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>챌린지 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              disabled={!!challenge.status && challenge.status === 'COMPLETED'}
            />
          </div>
          
          <div>
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              disabled={!!challenge.status && challenge.status === 'COMPLETED'}
            />
          </div>
          
          <div>
            <Label htmlFor="tags">태그</Label>
            <TagifyInput
              value={formData.tags}
              onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
              placeholder="예: react, typescript, frontend"
              disabled={!!challenge.status && challenge.status === 'COMPLETED'}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rewardType">보상 타입</Label>
              <Select
                value={formData.rewardType}
                onValueChange={(value: 'CASH' | 'ITEM') => 
                  setFormData(prev => ({ ...prev, rewardType: value }))
                }
                disabled={!!challenge.status && challenge.status === 'COMPLETED'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">현금</SelectItem>
                  <SelectItem value="ITEM">아이템</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="rewardAmount">보상 금액</Label>
              <Input
                id="rewardAmount"
                type="number"
                value={formData.rewardAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, rewardAmount: Number(e.target.value) }))}
                required
                disabled={!!challenge.status && challenge.status === 'COMPLETED'}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">시작일</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
                disabled={!!challenge.status && challenge.status === 'COMPLETED'}
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">종료일</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
                disabled={!!challenge.status && challenge.status === 'COMPLETED'}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit" disabled={updateMutation.isPending || (!!challenge.status && challenge.status === 'COMPLETED')}>
              {updateMutation.isPending ? '수정 중...' : '수정'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
