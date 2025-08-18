"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";

interface AuthWrapperProps {
    children: React.ReactNode;
}

const PUBLIC_PATHS = ["/login", "/"];

export function AuthWrapper({ children }: AuthWrapperProps) {
    const { isLoggedIn, isHydrated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // hydration이 완료된 후에만 리다이렉트 처리
        if (isHydrated && !PUBLIC_PATHS.includes(pathname) && !isLoggedIn) {
            router.replace("/login");
        }
    }, [isLoggedIn, isHydrated, pathname, router]);

    // hydration이 완료되지 않았으면 로딩 상태
    if (!isHydrated) {
        return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
    }

    // 공개 경로이거나 로그인되어 있으면 렌더링
    if (PUBLIC_PATHS.includes(pathname) || isLoggedIn) {
        return <>{children}</>;
    }

    // 로그인 확인 중
    return <div className="flex items-center justify-center min-h-screen">로그인 확인 중...</div>;
}
