"use client";

import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

interface ChallengeStats {
  recruiting: number;
  inProgress: number;
  completed: number;
  total: number;
}

interface ChallengeHeaderProps {
  stats?: ChallengeStats;
  onCreateClick?: () => void;
}

export function ChallengeHeader({ stats, onCreateClick }: ChallengeHeaderProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">챌린지 관리</h1>
        
        {stats && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-2 py-1">
              전체 {stats.total}
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200">
              모집 {stats.recruiting}
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-orange-50 text-orange-700 border-orange-200">
              진행 {stats.inProgress}
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200">
              완료 {stats.completed}
            </Badge>
          </div>
        )}
      </div>

      <Button onClick={onCreateClick} size="sm" className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        챌린지 추가
      </Button>
    </div>
  );
}
