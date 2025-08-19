import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import RegisterForm from "@/features/auth/ui/RegisterForm";

export default function RegisterPage() {
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        새로운 시작을 함께해요
                    </h1>
                    <p className="text-slate-300">
                        몇 초만에 계정을 만들고 여정을 시작하세요
                    </p>
                </div>

                <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
                    <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <CardTitle className="text-2xl font-bold text-white">회원가입</CardTitle>
                            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                                무료
                            </Badge>
                        </div>
                        <CardDescription className="text-slate-300">
                            혁신적인 플랫폼의 멤버가 되어보세요
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RegisterForm />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/20" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-slate-400">또는</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-slate-300">
                                이미 계정이 있으신가요?{" "}
                                <Link
                                    href="/login"
                                    className="font-medium text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
                                >
                                    로그인하기
                                </Link>
                            </p>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <p className="text-xs text-slate-400 text-center">
                                가입하시면{" "}
                                <Link href="/terms" className="text-blue-400 hover:underline">이용약관</Link>
                                {" "}및{" "}
                                <Link href="/privacy" className="text-blue-400 hover:underline">개인정보처리방침</Link>
                                에 동의한 것으로 간주됩니다.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
