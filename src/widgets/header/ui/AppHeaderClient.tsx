"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/ui/button";

type Props = {
    isAuthed: boolean;
    username: string;
};

export function AppHeaderClient({ isAuthed, username }: Props) {
    const pathname = usePathname();
    if (pathname?.startsWith("/login")) return null;

    return (
        <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
            <div className="container mx-auto flex items-center justify-between py-3 px-4">
                <Link href="/" className="text-lg font-semibold">
                    Dota Admin
                </Link>
                <nav className="flex items-center gap-3">
                    {isAuthed ? (
                        <>
                            <span className="text-sm text-muted-foreground">{username}</span>
                            <form action="/api/auth/logout" method="post">
                                <Button type="submit" size="sm" variant="secondary">
                                    로그아웃
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Button asChild size="sm" variant="default">
                                <Link href="/login">로그인</Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                                <Link href="/register">회원가입</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
            <div className="h-1 w-full bg-yellow-400" />
        </header>
    );
}