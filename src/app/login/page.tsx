"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import LoginForm from "@/features/auth/ui/LoginForm";
import RegisterForm from "@/features/auth/ui/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useState } from "react";

export default function LoginPage() {
  const [tab, setTab] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 animate-gradient-x"></div>
      
      {/* Floating orbs for visual interest */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            업무/기술 공유 플랫폼
          </h1>
          <p className="text-slate-300">
            혁신적인 협업과 지식 공유의 시작
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CardTitle className="text-xl font-bold text-white">
                {tab === "login" ? "다시 만나서 반가워요" : "새로운 시작을 함께해요"}
              </CardTitle>
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                Pro
              </Badge>
            </div>
            <CardDescription className="text-slate-300">
              {tab === "login" 
                ? "계정에 로그인하여 업무를 계속하세요" 
                : "몇 초만에 계정을 만들고 여정을 시작하세요"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-slate-300"
                >
                  로그인
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-slate-300"
                >
                  회원가입
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="pt-6 space-y-6">
                <LoginForm />
                
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-400 text-center">
                    로그인하시면 회사의{" "}
                    <span className="text-blue-400 hover:underline cursor-pointer">보안 정책</span>
                    에 따라 보호됩니다.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="register" className="pt-6">
                <RegisterForm
                  onSuccess={() => setTab("login")}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
