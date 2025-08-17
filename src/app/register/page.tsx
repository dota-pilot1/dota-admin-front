import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import RegisterForm from "@/features/auth/ui/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex min-h-dvh items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>회원가입</CardTitle>
                    <CardDescription>계정을 생성하려면 정보를 입력하세요</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                    <p className="mt-4 text-sm text-muted-foreground">
                        이미 계정이 있나요? <Link href="/login" className="underline">로그인</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
