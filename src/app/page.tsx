"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const userInfo = localStorage.getItem('userInfo');
      // 로그인 상태면 챌린지 목록으로, 아니면 로그인
      if (token && userInfo) {
        router.replace('/challenge');
      } else {
        router.replace('/login');
      }
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}
