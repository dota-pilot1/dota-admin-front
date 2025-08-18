"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

export type Post = {
    id: string;
    title: string;
    author: string;
    createdAt: string;
    comments: number;
};

export function FreeboardList({ posts }: { posts: Post[] }) {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>자유 게시판</CardTitle>
                <Button size="sm" asChild>
                    <Link href="#">글쓰기</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="divide-y">
                    {posts.map((p) => (
                        <div key={p.id} className="flex items-center justify-between py-3">
                            <div>
                                <div className="font-medium hover:underline">
                                    <Link href={`#post-${p.id}`}>{p.title}</Link>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {p.author} • {new Date(p.createdAt).toLocaleString()} • 댓글 {p.comments}
                                </div>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                                <Link href={`#post-${p.id}`}>보기</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
