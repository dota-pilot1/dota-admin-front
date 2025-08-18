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
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        const userInfo = localStorage.getItem('userInfo');
        
        if (token && userInfo) {
          setIsAuthed(true);
        } else {
          setIsAuthed(false);
          router.replace(redirectTo);
        }
      }
    };

    checkAuth();
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
