import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { getLoginErrorMessage } from "@/shared/lib/error-utils";
import TestAccountSelector from "./TestAccountSelector";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  const handleTestAccountSelect = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    login.mutate({ email: testEmail, password: testPassword });
  };

  // 에러 메시지 추출
  const errorMessage = login.error ? getLoginErrorMessage(login.error) : null;

  return (
    <div className="space-y-6">
      {/* 테스트 계정 선택 */}
      <TestAccountSelector onAccountSelect={handleTestAccountSelect} />
      
      <form onSubmit={handleSubmit} className="space-y-5">
      {/* 에러 메시지 표시 */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            이메일
          </div>
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-white transition-all duration-200"
          placeholder="work@company.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            비밀번호
          </div>
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-white transition-all duration-200"
          placeholder="보안이 중요합니다"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
        disabled={login.isPending}
      >
        {login.isPending ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            로그인 중...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
            </svg>
            로그인하기
          </div>
        )}
      </Button>
    </form>
    </div>
  );
}
