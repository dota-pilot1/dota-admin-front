"use client";
import { useState } from "react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";
import { register } from "@/features/auth/api/register";

interface RegisterFormProps {
    onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await register({ username, email, password });
            if (result.success) {
                toast.success("회원가입 성공! 로그인해 주세요.");
                onSuccess?.();
            } else {
                throw new Error(result.message || "회원가입 실패");
            }
        } catch (err: unknown) {
            console.error("Registration error:", err);
            const message = err instanceof Error ? err.message : "회원가입에 실패했습니다";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">닉네임</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "처리 중..." : "회원가입"}
            </Button>
        </form>
    );
}
