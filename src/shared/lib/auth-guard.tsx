'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null); // null = loading
  const router = useRouter();

  useEffect(() => {
    const checkAuth = (source: string = 'initial') => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        const userInfo = localStorage.getItem('userInfo');
        
        // 개발 환경에서만 로그 출력
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔍 AuthGuard checking (${source}):`, {
            token: token ? "EXISTS" : "NOT_FOUND",
            userInfo: userInfo ? "EXISTS" : "NOT_FOUND"
          });
        }

        if (token && userInfo) {
          if (process.env.NODE_ENV === 'development') {
            console.log("✅ User authenticated");
          }
          setIsAuthed(true);
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log("❌ User not authenticated, redirecting to login");
          }
          setIsAuthed(false);
          router.replace(redirectTo);
        }
      }
    };

    // 초기 체크만 수행
    checkAuth('initial');

    // localStorage 변경 감지 (다른 탭에서 로그인/로그아웃한 경우)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'userInfo') {
        if (process.env.NODE_ENV === 'development') {
          console.log("🔄 Storage changed, re-checking auth");
        }
        checkAuth('storage');
      }
    };

    // 커스텀 이벤트 감지 (로그인 성공 시)
    const handleLoginSuccess = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log("🎉 Login success event detected");
      }
      checkAuth('loginSuccess');
    };

    // 로그아웃 이벤트 감지
    const handleLogout = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log("👋 Logout event detected");
      }
      setIsAuthed(false);
      router.replace(redirectTo);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginSuccess', handleLoginSuccess);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      window.removeEventListener('logout', handleLogout);
    };
  }, [router, redirectTo]);

  // 로딩 중
  if (isAuthed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 인증되지 않은 경우 (리다이렉트 진행 중)
  if (!isAuthed) {
    return null;
  }

  // 인증된 경우 children 렌더링
  return <>{children}</>;
}
