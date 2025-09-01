'use client';

import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/shared/lib/auth-guard';

interface ConditionalAuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/', '/login', '/register', '/favorites']; // 인증이 필요없는 페이지들

export function ConditionalAuthGuard({ children }: ConditionalAuthGuardProps) {
  const pathname = usePathname();
  
  // 공개 페이지인 경우 AuthGuard 없이 렌더링
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }
  
  // 보호된 페이지인 경우 AuthGuard로 감싸기
  return <AuthGuard>{children}</AuthGuard>;
}
