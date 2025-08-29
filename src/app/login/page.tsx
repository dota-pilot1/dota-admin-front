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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            업무/기술 공유 플랫폼
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            혁신적인 협업과 지식 공유의 시작
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                {tab === "login" ? "다시 만나서 반가워요" : "새로운 시작을 함께해요"}
              </CardTitle>
              <Badge variant="secondary" className="bg-slate-900 dark:bg-white text-white dark:text-black border-0">
                Pro
              </Badge>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              {tab === "login" 
                ? "계정에 로그인하여 업무를 계속하세요" 
                : "몇 초만에 계정을 만들고 여정을 시작하세요"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black text-slate-600 dark:text-slate-300"
                >
                  로그인
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black text-slate-600 dark:text-slate-300"
                >
                  회원가입
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="pt-6 space-y-6">
                <LoginForm />
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    로그인하시면 회사의{" "}
                    <span className="text-slate-700 dark:text-slate-300 hover:underline cursor-pointer">보안 정책</span>
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
