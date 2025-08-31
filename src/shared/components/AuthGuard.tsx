"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/entities/user/lib/auth-utils";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // 로그인/회원가입 페이지는 체크하지 않음
      if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) {
        setIsChecking(false);
        setIsAuthenticated(true);
        return;
      }

      const token = localStorage.getItem("authToken");
      const user = getCurrentUser();

      if (token && user) {
        console.log("✅ Auth check passed:", { user: user.email, token: token.substring(0, 20) + "..." });
        setIsAuthenticated(true);
        setIsChecking(false);
      } else {
        console.log("❌ Auth check failed:", {
          token: token ? "exists" : "missing",
          user: user ? "exists" : "missing",
          pathname,
          cookies: document.cookie,
          localStorage: {
            authToken: localStorage.getItem("authToken") ? "exists" : "missing",
            userInfo: localStorage.getItem("userInfo") ? "exists" : "missing"
          }
        });
        console.log("⏳ Will redirect to login in 3 seconds...");
        
        setIsAuthenticated(false);
        setIsChecking(false);
        
        // 디버깅을 위해 3초 지연 후 리다이렉트
        setTimeout(() => {
          console.log("🔄 Now redirecting to login page");
          router.replace("/login");
        }, 3000);
      }
    };

    // 초기 체크를 약간 지연 (로그인 후 리다이렉트 시 쿠키 설정 시간 확보)
    const initialDelay = 200;
    const timeoutId = setTimeout(() => {
      checkAuth();
    }, initialDelay);

    // localStorage 변경 감지 (다른 탭에서)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "userInfo") {
        checkAuth();
      }
    };

    // 로그인 성공 이벤트 감지 (같은 탭에서)
    const handleLoginSuccess = () => {
      console.log("📧 Login success event received, rechecking auth");
      clearTimeout(timeoutId); // 기존 타이머 취소
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("loginSuccess", handleLoginSuccess);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginSuccess", handleLoginSuccess);
    };
  }, [pathname, router]);

  // 인증 체크 중일 때 로딩 표시
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 아무것도 렌더링하지 않음
  if (!isAuthenticated) {
    return null;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}
