"use client";

import { Home } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-medium text-gray-900">Admin</h1>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/">Home</Link>
                    </Button>
                </div>
            </div>

            {/* 콘텐츠 */}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
