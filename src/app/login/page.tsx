"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import LoginForm from "@/features/auth/ui/LoginForm";
import RegisterForm from "@/features/auth/ui/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const from = search.get("from") || "/dashboard";
  const [tab, setTab] = useState("login");

  const handleLoginSuccess = () => {
    router.replace(from);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-sm overflow-hidden shadow-lg">
        {/* Kakao-like accent bar */}
        <div className="h-1.5 w-full bg-[#FEE500]" />
        <CardHeader className="text-center">
          <CardTitle className="text-xl">업무/기술 공유</CardTitle>
          <CardDescription>회사 계정으로 로그인 또는 회원가입</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="register">회원가입</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-4">
              <LoginForm onSuccess={handleLoginSuccess} />
              {/* Kakao-like CTA */}
              <p className="mt-4 text-center text-xs text-muted-foreground">
                계속 진행 시 약관에 동의하는 것으로 간주됩니다.
              </p>
            </TabsContent>
            <TabsContent value="register" className="pt-4">
              <RegisterForm
                // 회원가입 성공 시 로그인 탭으로 전환
                onSuccess={() => setTab("login")}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
