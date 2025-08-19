import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import RegisterForm from "@/features/auth/ui/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-black dark:bg-white rounded-xl shadow-lg">
                        <svg className="w-8 h-8 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        새로운 시작을 함께해요
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300">
                        몇 초만에 계정을 만들고 여정을 시작하세요
                    </p>
                </div>

                <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 shadow-xl">
                    <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">회원가입</CardTitle>
                            <Badge variant="secondary" className="bg-slate-900 dark:bg-white text-white dark:text-black border-0">
                                무료
                            </Badge>
                        </div>
                        <CardDescription className="text-slate-600 dark:text-slate-300">
                            혁신적인 플랫폼의 멤버가 되어보세요
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RegisterForm />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">또는</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                이미 계정이 있으신가요?{" "}
                                <Link
                                    href="/login"
                                    className="font-medium text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-300 underline underline-offset-4 transition-colors"
                                >
                                    로그인하기
                                </Link>
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                가입하시면{" "}
                                <Link href="/terms" className="text-slate-700 dark:text-slate-300 hover:underline">이용약관</Link>
                                {" "}및{" "}
                                <Link href="/privacy" className="text-slate-700 dark:text-slate-300 hover:underline">개인정보처리방침</Link>
                                에 동의한 것으로 간주됩니다.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
