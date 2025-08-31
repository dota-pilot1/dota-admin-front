"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Filter } from "lucide-react";

interface RewardPeriodFilterProps {
    onQuickFilter: (days: number) => void;
    isLoading?: boolean;
}

export function RewardPeriodFilter({ onQuickFilter, isLoading = false }: RewardPeriodFilterProps) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-sm py-4 px-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">기간별 필터</span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onQuickFilter(7)}
                        disabled={isLoading}
                        className="h-8 px-3 text-xs rounded-sm"
                    >
                        최근 7일
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onQuickFilter(30)}
                        disabled={isLoading}
                        className="h-8 px-3 text-xs rounded-sm"
                    >
                        최근 30일
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onQuickFilter(90)}
                        disabled={isLoading}
                        className="h-8 px-3 text-xs rounded-sm"
                    >
                        최근 3개월
                    </Button>
                </div>
            </div>
        </div>
    );
}